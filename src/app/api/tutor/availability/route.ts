import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TUTOR") {
    return NextResponse.json({ error: "无权操作" }, { status: 403 });
  }

  const { available } = await req.json() as { available: boolean };
  if (typeof available !== "boolean") {
    return NextResponse.json({ error: "参数错误" }, { status: 400 });
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!profile) {
    return NextResponse.json({ error: "请先完善教员资料" }, { status: 404 });
  }

  await prisma.tutorProfile.update({
    where: { id: profile.id },
    data: { available },
  });

  return NextResponse.json({ ok: true, available });
}
