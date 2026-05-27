import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "请求体无效" }, { status: 400 });
  }

  const { type, tutorProfileId, requirementId, message } = body as Record<string, unknown>;

  if (!type || !["TUTOR_APPLY", "PARENT_BOOK"].includes(type as string)) {
    return NextResponse.json({ error: "申请类型无效" }, { status: 400 });
  }
  if (!tutorProfileId || typeof tutorProfileId !== "string") {
    return NextResponse.json({ error: "缺少教员资料 ID" }, { status: 400 });
  }

  const role = session.user.role;

  // ── TUTOR_APPLY: 教员申请接单 ──────────────────────────────────────────
  if (type === "TUTOR_APPLY") {
    if (role !== "TUTOR") {
      return NextResponse.json({ error: "仅教员可申请接单" }, { status: 403 });
    }
    if (!requirementId || typeof requirementId !== "string") {
      return NextResponse.json({ error: "缺少需求 ID" }, { status: 400 });
    }

    const profile = await prisma.tutorProfile.findUnique({ where: { id: tutorProfileId } });
    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: "教员资料不存在或无权操作" }, { status: 403 });
    }

    const requirement = await prisma.requirement.findUnique({ where: { id: requirementId } });
    if (!requirement || !requirement.isActive) {
      return NextResponse.json({ error: "需求不存在或已关闭" }, { status: 404 });
    }

    const existing = await prisma.application.findFirst({
      where: { type: "TUTOR_APPLY", senderUserId: session.user.id, requirementId, status: "PENDING" },
    });
    if (existing) {
      return NextResponse.json({ error: "你已申请过该需求，请等待家长回复" }, { status: 409 });
    }

    const application = await prisma.application.create({
      data: {
        type: "TUTOR_APPLY",
        senderUserId: session.user.id,
        receiverUserId: requirement.userId,
        tutorProfileId,
        requirementId,
        message: typeof message === "string" ? message.trim() || null : null,
      },
    });
    return NextResponse.json({ message: "申请已提交", id: application.id }, { status: 201 });
  }

  // ── PARENT_BOOK: 家长预约教员 ──────────────────────────────────────────
  if (role !== "PARENT" && role !== "STUDENT") {
    return NextResponse.json({ error: "仅家长/学员可预约教员" }, { status: 403 });
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { id: tutorProfileId },
    include: { user: { select: { id: true } } },
  });
  if (!profile) {
    return NextResponse.json({ error: "教员资料不存在" }, { status: 404 });
  }
  if (profile.userId === session.user.id) {
    return NextResponse.json({ error: "不能预约自己" }, { status: 400 });
  }

  const existing = await prisma.application.findFirst({
    where: { type: "PARENT_BOOK", senderUserId: session.user.id, tutorProfileId, status: "PENDING" },
  });
  if (existing) {
    return NextResponse.json({ error: "你已向该教员发起预约，请等待回复" }, { status: 409 });
  }

  const application = await prisma.application.create({
    data: {
      type: "PARENT_BOOK",
      senderUserId: session.user.id,
      receiverUserId: profile.userId,
      tutorProfileId,
      message: typeof message === "string" ? message.trim() || null : null,
    },
  });
  return NextResponse.json({ message: "预约已发送", id: application.id }, { status: 201 });
}
