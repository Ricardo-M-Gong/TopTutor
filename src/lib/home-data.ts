import { prisma } from "@/lib/prisma";
import { buildSubjectCategoriesWithCounts } from "@/lib/subjects";
import type { Subject, Testimonial } from "@/types";

export async function getHomeSubjects(): Promise<Subject[]> {
  const rows = await prisma.tutorSubject.findMany({
    select: { subjectName: true, tutorProfileId: true },
  });
  return buildSubjectCategoriesWithCounts(rows);
}

export async function getHomeTestimonials(limit = 3): Promise<Testimonial[]> {
  const reviews = await prisma.review.findMany({
    where: { content: { not: "" } },
    take: limit,
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    include: {
      author: { select: { name: true, avatarUrl: true } },
      application: {
        select: {
          requirement: { select: { subjectName: true } },
        },
      },
      tutorProfile: {
        select: {
          subjects: { select: { subjectName: true }, take: 1 },
        },
      },
    },
  });

  return reviews.map((review) => ({
    id: review.id,
    studentName: review.author.name,
    avatar:
      review.author.avatarUrl ??
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(review.author.name)}`,
    content: review.content,
    rating: review.rating,
    subject:
      review.application.requirement?.subjectName ??
      review.tutorProfile.subjects[0]?.subjectName ??
      "家教辅导",
  }));
}
