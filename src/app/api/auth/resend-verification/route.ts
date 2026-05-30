import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Return same message regardless to prevent enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({ message: "验证邮件已重新发送，请查收" });
    }

    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    await sendVerificationEmail(email, token);

    return NextResponse.json({ message: "验证邮件已重新发送，请查收" });
  } catch {
    return NextResponse.json({ error: "服务器错误，请稍后重试" }, { status: 500 });
  }
}
