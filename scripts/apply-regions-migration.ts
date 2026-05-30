import "dotenv/config";
import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

function parseStatements(sql: string): string[] {
  return sql
    .split(";")
    .map((s) =>
      s
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim()
    )
    .filter((s) => s.length > 0);
}

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const sql = fs.readFileSync(
    path.join(process.cwd(), "prisma/migrations/20260529115920_add_regions/migration.sql"),
    "utf-8"
  );

  for (const stmt of parseStatements(sql)) {
    console.log("Executing:", stmt.slice(0, 80).replace(/\s+/g, " ") + "...");
    await client.execute(stmt);
  }

  const tables = await client.execute(
    `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%Region%'`
  );
  console.log("Region tables:", tables.rows);
  client.close();
}

main().catch(console.error);
