import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email: unknown = body?.email;

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: "请输入有效的邮箱地址" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Remove any existing tokens for this email
    await prisma.passwordResetToken.deleteMany({ where: { email } });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expires },
    });

    console.log(
      `[重置密码链接] http://localhost:3000/reset-password?token=${token}`
    );
  }

  // Always return the same message to prevent user enumeration
  return NextResponse.json({
    message: "如果该邮箱已注册，重置链接已发送（请查看终端控制台）",
  });
}
