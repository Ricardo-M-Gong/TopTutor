import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token: unknown = body?.token;
  const password: unknown = body?.password;

  if (typeof token !== "string" || !token) {
    return NextResponse.json({ message: "重置链接无效或已过期" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ message: "密码长度不能少于 6 位" }, { status: 400 });
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!record) {
    return NextResponse.json({ message: "重置链接无效或已过期" }, { status: 400 });
  }

  if (record.expires < new Date()) {
    await prisma.passwordResetToken.delete({ where: { token } });
    return NextResponse.json({ message: "重置链接已过期，请重新申请" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: record.email } });

  if (!user) {
    return NextResponse.json({ message: "用户不存在" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ message: "密码已重置，请重新登录" });
}
