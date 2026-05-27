import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["ACCEPTED", "REJECTED"] as const;
type UpdateableStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const { status } = (body ?? {}) as { status?: string };

  if (!status || !VALID_STATUSES.includes(status as UpdateableStatus)) {
    return NextResponse.json(
      { error: "状态值无效，必须为 ACCEPTED 或 REJECTED" },
      { status: 400 }
    );
  }

  const application = await prisma.application.findUnique({ where: { id } });
  if (!application) {
    return NextResponse.json({ error: "申请不存在" }, { status: 404 });
  }

  // Only the receiver can accept/reject
  if (application.receiverUserId !== session.user.id) {
    return NextResponse.json({ error: "无权操作此申请" }, { status: 403 });
  }

  if (application.status !== "PENDING") {
    return NextResponse.json({ error: "该申请已处理，无法再次操作" }, { status: 409 });
  }

  const updated = await prisma.application.update({
    where: { id },
    data: { status: status as UpdateableStatus },
  });

  return NextResponse.json({ message: "状态已更新", status: updated.status });
}
