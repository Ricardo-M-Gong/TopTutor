import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const profiles = await prisma.tutorProfile.findMany({
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      subjects: { select: { subjectName: true } },
      tags: { select: { tag: true } },
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
  }));

  return NextResponse.json({ tutors });
}
