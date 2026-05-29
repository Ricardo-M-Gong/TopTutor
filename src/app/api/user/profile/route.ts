import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { name, phone } = await req.json() as { name?: string; phone?: string };

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: "姓名不能为空" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(phone !== undefined && { phone: phone.trim() || null }),
    },
  });

  return NextResponse.json({ ok: true });
}
