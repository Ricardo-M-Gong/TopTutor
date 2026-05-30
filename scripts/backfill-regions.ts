/**
 * Backfill TutorRegion / RequirementRegion on the active database (Turso or local).
 * Run: npx tsx --env-file=.env scripts/backfill-regions.ts
 */
import "dotenv/config";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const REGION_POOL = [
  "西湖区",
  "滨江区",
  "余杭区",
  "上城区",
  "萧山区",
  "拱墅区",
  "临平区",
  "钱塘区",
] as const;

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? process.env.DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

function pickRegions(seed: string, count = 2): string[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash + seed.charCodeAt(i) * (i + 1)) % 9973;
  const picked: string[] = [];
  for (let i = 0; picked.length < count; i++) {
    const region = REGION_POOL[(hash + i * 3) % REGION_POOL.length];
    if (!picked.includes(region)) picked.push(region);
  }
  return picked;
}

async function main() {
  const tutors = await prisma.tutorProfile.findMany({
    select: { id: true, regions: { select: { id: true } } },
  });

  let tutorCount = 0;
  for (const tutor of tutors) {
    if (tutor.regions.length > 0) continue;
    const regions = pickRegions(tutor.id);
    await prisma.tutorRegion.createMany({
      data: regions.map((regionName) => ({ tutorProfileId: tutor.id, regionName })),
    });
    tutorCount++;
  }

  const requirements = await prisma.requirement.findMany({
    select: { id: true, regions: { select: { id: true } } },
  });

  let reqCount = 0;
  for (const req of requirements) {
    if (req.regions.length > 0) continue;
    const regions = pickRegions(req.id, 1);
    await prisma.requirementRegion.createMany({
      data: regions.map((regionName) => ({ requirementId: req.id, regionName })),
    });
    reqCount++;
  }

  console.log(`Backfilled regions for ${tutorCount} tutors and ${reqCount} requirements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
