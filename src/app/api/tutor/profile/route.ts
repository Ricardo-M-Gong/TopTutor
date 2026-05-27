import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface ProfileBody {
  university: string;
  major: string;
  grade: string;
  subjects: string[];
  hourlyRate: number;
  bio: string;
}

function validate(body: unknown): { data: ProfileBody } | { error: string } {
  if (!body || typeof body !== "object") return { error: "请求体无效" };
  const b = body as Record<string, unknown>;

  if (!b.university || typeof b.university !== "string" || !b.university.trim())
    return { error: "请填写毕业/就读高校" };
  if (!b.major || typeof b.major !== "string" || !b.major.trim())
    return { error: "请填写专业" };
  if (!b.grade || typeof b.grade !== "string" || !b.grade.trim())
    return { error: "请填写年级" };
  if (!Array.isArray(b.subjects) || b.subjects.length === 0)
    return { error: "请至少选择一个擅长科目" };
  if (b.subjects.some((s) => typeof s !== "string" || !s.trim()))
    return { error: "科目名称无效" };
  const rate = Number(b.hourlyRate);
  if (!Number.isFinite(rate) || rate <= 0)
    return { error: "期望时薪必须为正数" };
  if (!b.bio || typeof b.bio !== "string" || !b.bio.trim())
    return { error: "请填写自我介绍" };

  return {
    data: {
      university: (b.university as string).trim(),
      major: (b.major as string).trim(),
      grade: (b.grade as string).trim(),
      subjects: (b.subjects as string[]).map((s) => s.trim()),
      hourlyRate: rate,
      bio: (b.bio as string).trim(),
    },
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: { subjects: true, tags: true },
  });
  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  if (session.user.role !== "TUTOR") return NextResponse.json({ error: "仅教员可操作" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const result = validate(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const { university, major, grade, subjects, hourlyRate, bio } = result.data;

  const existing = await prisma.tutorProfile.findUnique({ where: { userId: session.user.id } });

  if (existing) {
    await prisma.tutorProfile.update({
      where: { userId: session.user.id },
      data: { university, major, grade, hourlyRate, bio },
    });
    await prisma.tutorSubject.deleteMany({ where: { tutorProfileId: existing.id } });
    await prisma.tutorSubject.createMany({
      data: subjects.map((s) => ({ tutorProfileId: existing.id, subjectName: s })),
    });
    return NextResponse.json({ message: "资料已更新" });
  }

  const profile = await prisma.tutorProfile.create({
    data: { userId: session.user.id, university, major, grade, hourlyRate, bio },
  });
  await prisma.tutorSubject.createMany({
    data: subjects.map((s) => ({ tutorProfileId: profile.id, subjectName: s })),
  });
  return NextResponse.json({ message: "资料已创建" }, { status: 201 });
}
