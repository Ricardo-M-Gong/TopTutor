import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json();
  const { applicationId, tutorProfileId, rating, content } = body as {
    applicationId: string;
    tutorProfileId: string;
    rating: number;
    content?: string;
  };

  if (!applicationId || !tutorProfileId || !rating) {
    return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "评分必须为 1–5 分" }, { status: 400 });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { review: { select: { id: true } } },
  });

  if (!application) {
    return NextResponse.json({ error: "申请不存在" }, { status: 404 });
  }
  if (application.status !== "ACCEPTED") {
    return NextResponse.json({ error: "只能对已接受的申请评价" }, { status: 400 });
  }

  // 家长才能评价：PARENT_BOOK 中家长是 sender；TUTOR_APPLY 中家长是 receiver
  const isParentReviewer =
    (application.type === "PARENT_BOOK" && application.senderUserId === session.user.id) ||
    (application.type === "TUTOR_APPLY" && application.receiverUserId === session.user.id);

  if (!isParentReviewer) {
    return NextResponse.json({ error: "无权评价" }, { status: 403 });
  }
  if (application.review) {
    return NextResponse.json({ error: "已经评价过了" }, { status: 409 });
  }
  if (application.tutorProfileId !== tutorProfileId) {
    return NextResponse.json({ error: "教员信息不匹配" }, { status: 400 });
  }

  // 创建评价并更新教员平均评分（事务）
  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        applicationId,
        tutorProfileId,
        authorId: session.user!.id!,
        rating,
        content: content?.trim() ?? "",
      },
    });

    const all = await tx.review.findMany({
      where: { tutorProfileId },
      select: { rating: true },
    });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;

    await tx.tutorProfile.update({
      where: { id: tutorProfileId },
      data: {
        rating: Math.round(avg * 10) / 10,
        reviewCount: all.length,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
