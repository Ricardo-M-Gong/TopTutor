import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { name, phone, address } = await req.json() as { name?: string; phone?: string; address?: string };

  if (name !== undefined && !name.trim()) {
    return NextResponse.json({ error: "姓名不能为空" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(phone !== undefined && { phone: phone.trim() || null }),
      ...(address !== undefined && { address: address.trim() || null }),
    },
  });

  return NextResponse.json({ ok: true });
}
