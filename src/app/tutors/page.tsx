import { prisma } from "@/lib/prisma";
import { mapRegions, isValidRegion, REGION_OPTIONS } from "@/lib/regions";
import type { Tutor } from "@/types";
import TutorsClient from "@/components/TutorsClient";

const PAGE_SIZE = 9;

async function getTutors(regions: string[]): Promise<Tutor[]> {
  const regionFilter =
    regions.length > 0
      ? { regions: { some: { regionName: { in: regions } } } }
      : undefined;

  const profiles = await prisma.tutorProfile.findMany({
    where: regionFilter,
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      subjects: { select: { subjectName: true } },
      tags: { select: { tag: true } },
      regions: { select: { regionName: true } },
    },
  });
  return profiles.map((p) => ({
    id: p.id,
    name: p.user.name,
    avatar: p.user.avatarUrl ?? "",
    university: p.university,
    major: p.major,
    grade: p.grade,
    hourlyRate: p.hourlyRate,
    rating: p.rating,
    reviewCount: p.reviewCount,
    bio: p.bio,
    available: p.available,
    subjects: p.subjects.map((s) => s.subjectName),
    tags: p.tags.map((t) => t.tag),
    regions: mapRegions(p.regions),
  }));
}

export default async function TutorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const regionsParam = params.regions?.trim() ?? "";
  const regions = regionsParam
    ? regionsParam.split(",").map((r) => r.trim()).filter(isValidRegion)
    : [];

  const tutors = await getTutors(regions);

  const q = params.q?.trim().toLowerCase() ?? "";
  const subject = params.subject ?? "";
  const price = params.price ?? "all";
  const minRating = params.rating ? Number(params.rating) : 0;
  const availableOnly = params.available === "1";
  const sort = params.sort ?? "recommended";
  const page = Math.max(1, Number(params.page ?? 1));

  // Filter
  const filtered = tutors.filter((t) => {
    if (q && !t.name.toLowerCase().includes(q) && !t.subjects.some((s) => s.toLowerCase().includes(q)))
      return false;
    if (subject && !t.subjects.includes(subject)) return false;
    if (regions.length > 0 && !regions.some((r) => t.regions.includes(r))) return false;
    if (price === "lt50" && t.hourlyRate >= 50) return false;
    if (price === "50-100" && (t.hourlyRate < 50 || t.hourlyRate > 100)) return false;
    if (price === "100-150" && (t.hourlyRate < 100 || t.hourlyRate > 150)) return false;
    if (price === "gt150" && t.hourlyRate <= 150) return false;
    if (minRating > 0 && t.rating < minRating) return false;
    if (availableOnly && !t.available) return false;
    return true;
  });

  // Sort
  if (sort === "rating") filtered.sort((a, b) => b.rating - a.rating);
  else if (sort === "price_asc") filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
  else if (sort === "reviews") filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  else filtered.sort((a, b) => b.rating - a.rating);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const subjects = Array.from(new Set(tutors.flatMap((t) => t.subjects))).sort();

  return (
    <TutorsClient
      tutors={paginated}
      total={total}
      totalPages={totalPages}
      currentPage={currentPage}
      subjects={subjects}
      regionOptions={[...REGION_OPTIONS]}
      initialQ={q}
      initialSubject={subject}
      initialRegions={regions}
      initialPrice={price}
      initialRating={String(minRating)}
      initialAvailable={availableOnly}
      initialSort={sort}
      initialGrade=""
    />
  );
}
