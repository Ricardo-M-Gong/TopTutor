import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/client";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone } = body as {
      name: string;
      email: string;
      password: string;
      role: string;
      phone?: string;
    };

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "请填写所有必填字段" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少需要6位" }, { status: 400 });
    }

    const validRoles: Role[] = ["TUTOR", "PARENT"];
    if (!validRoles.includes(role as Role)) {
      return NextResponse.json({ error: "无效的角色" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as Role,
        phone: phone?.trim() || null,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });
    await sendVerificationEmail(email, token);

    return NextResponse.json({ user, requiresVerification: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "服务器错误，请稍后重试" }, { status: 500 });
  }
}
