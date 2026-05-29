import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { tutorProfileId, rating, content } = body;

  if (!tutorProfileId || !rating || !content?.trim()) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }
  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "评分须在 1–5 之间" }, { status: 400 });
  }

  // Cannot review yourself
  const profile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    select: { userId: true },
  });
  if (!profile) return NextResponse.json({ error: "教员不存在" }, { status: 404 });
  if (profile.userId === session.user.id) {
    return NextResponse.json({ error: "不能评价自己" }, { status: 400 });
  }

  // Upsert review
  const review = await prisma.review.upsert({
    where: { tutorProfileId_authorId: { tutorProfileId, authorId: session.user.id } },
    create: { tutorProfileId, authorId: session.user.id, rating, content: content.trim() },
    update: { rating, content: content.trim() },
  });

  // Recalculate tutor rating
  const agg = await prisma.review.aggregate({
    where: { tutorProfileId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.tutorProfile.update({
    where: { id: tutorProfileId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });

  return NextResponse.json(review);
}
