/**
 * Applies pending Prisma migrations to the remote Turso database.
 * Run with: npx tsx scripts/migrate-turso.ts
 *
 * Handles the case where an old Review table (wrong schema) exists from a
 * previous ad-hoc migration script.
 */

import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN");
  process.exit(1);
}

const client = createClient({ url, authToken });

async function getAppliedMigrations(): Promise<Set<string>> {
  try {
    const result = await client.execute(
      `SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL`
    );
    return new Set(result.rows.map((r) => r.migration_name as string));
  } catch {
    // Table doesn't exist yet
    return new Set();
  }
}

async function markMigrationApplied(
  migrationName: string,
  sql: string
): Promise<void> {
  const checksum = crypto.createHash("sha256").update(sql).digest("hex");
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await client.execute({
    sql: `INSERT INTO "_prisma_migrations"
      (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
      VALUES (?, ?, ?, ?, NULL, NULL, ?, 1)`,
    args: [id, checksum, now, migrationName, now],
  });
}

async function tableExists(tableName: string): Promise<boolean> {
  const result = await client.execute({
    sql: `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    args: [tableName],
  });
  return result.rows.length > 0;
}

async function columnExists(
  tableName: string,
  columnName: string
): Promise<boolean> {
  try {
    const result = await client.execute(`PRAGMA table_info("${tableName}")`);
    return result.rows.some((r) => r.name === columnName);
  } catch {
    return false;
  }
}

async function main() {
  console.log("Connecting to Turso:", url);

  // ── Step 1: Ensure _prisma_migrations table exists ──────────────────────────
  await client.execute(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      id                  TEXT PRIMARY KEY NOT NULL,
      checksum            TEXT NOT NULL,
      finished_at         DATETIME,
      migration_name      TEXT NOT NULL,
      logs                TEXT,
      rolled_back_at      DATETIME,
      started_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      applied_steps_count INTEGER NOT NULL DEFAULT 0
    )
  `);

  const applied = await getAppliedMigrations();
  console.log("Already applied migrations:", [...applied]);

  const migrationsDir = path.join(process.cwd(), "prisma", "migrations");
  const migrationFolders = fs
    .readdirSync(migrationsDir)
    .filter((f) => fs.statSync(path.join(migrationsDir, f)).isDirectory())
    .sort();

  for (const folder of migrationFolders) {
    if (applied.has(folder)) {
      console.log(`  ✓ ${folder} (already applied)`);
      continue;
    }

    const sqlFile = path.join(migrationsDir, folder, "migration.sql");
    if (!fs.existsSync(sqlFile)) {
      console.log(`  ⚠ ${folder} (no migration.sql, skipping)`);
      continue;
    }

    const sql = fs.readFileSync(sqlFile, "utf-8");

    // ── Special handling for add_review migration ──────────────────────────────
    // The old ad-hoc script may have created a Review table with a different
    // schema (no applicationId column). Drop it so we can recreate correctly.
    if (folder.includes("add_review")) {
      const reviewExists = await tableExists("Review");
      if (reviewExists) {
        const hasApplicationId = await columnExists("Review", "applicationId");
        if (!hasApplicationId) {
          console.log(
            "  → Old Review table detected (missing applicationId). Dropping..."
          );
          await client.execute(`DROP TABLE IF EXISTS "Review"`);
        } else {
          console.log(
            "  → Review table already has correct schema, skipping CREATE."
          );
          await markMigrationApplied(folder, sql);
          console.log(`  ✓ ${folder} (marked as applied)`);
          continue;
        }
      }
    }

    console.log(`  → Applying ${folder}...`);

    // Split on semicolons to execute statements individually
    // (libsql doesn't support multi-statement execute)
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (const stmt of statements) {
      await client.execute(stmt);
    }

    await markMigrationApplied(folder, sql);
    console.log(`  ✓ ${folder} (applied)`);
  }

  // ── Step 2: Clean up Notification table if it exists (from old ad-hoc script)
  const notifExists = await tableExists("Notification");
  if (notifExists) {
    console.log(
      "\n  → Dropping old Notification table (not in current schema)..."
    );
    await client.execute(`DROP TABLE IF EXISTS "Notification"`);
    console.log("  ✓ Notification table dropped");
  }

  console.log("\nAll migrations applied successfully.");
  client.close();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
