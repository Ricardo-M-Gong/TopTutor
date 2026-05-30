import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mapRegions, isValidRegion } from "@/lib/regions";

export async function GET(req: NextRequest) {
  const regionsParam = req.nextUrl.searchParams.get("regions")?.trim() ?? "";
  const regionList = regionsParam
    ? regionsParam.split(",").map((r) => r.trim()).filter(isValidRegion)
    : [];
  const regionFilter =
    regionList.length > 0
      ? { regions: { some: { regionName: { in: regionList } } } }
      : undefined;

  const profiles = await prisma.tutorProfile.findMany({
    where: regionFilter,
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      subjects: { select: { subjectName: true } },
      tags: { select: { tag: true } },
      regions: { select: { regionName: true } },
    },
    orderBy: { rating: "desc" },
  });

  const tutors = profiles.map((p) => ({
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

  return NextResponse.json({ tutors });
}
