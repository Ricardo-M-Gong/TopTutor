import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GradeLevel } from "@/generated/prisma/client";
import { validateRegions } from "@/lib/regions";

const VALID_GRADES = Object.values(GradeLevel);

interface ReqBody {
  subjectName: string;
  gradeLevel: GradeLevel;
  regions: string[];
  budgetMin?: number;
  budgetMax?: number;
  scheduleNote?: string;
  description: string;
}

function validate(body: unknown): { data: ReqBody } | { error: string } {
  if (!body || typeof body !== "object") return { error: "请求体无效" };
  const b = body as Record<string, unknown>;

  if (!b.subjectName || typeof b.subjectName !== "string" || !b.subjectName.trim())
    return { error: "请填写辅导科目" };
  if (!b.gradeLevel || !VALID_GRADES.includes(b.gradeLevel as GradeLevel))
    return { error: "请选择有效的学员年级" };
  if (!validateRegions(b.regions))
    return { error: "请至少选择一个有效的服务区域" };

  const minRaw = b.budgetMin;
  const maxRaw = b.budgetMax;
  const hasMin = minRaw !== undefined && minRaw !== null && minRaw !== "";
  const hasMax = maxRaw !== undefined && maxRaw !== null && maxRaw !== "";

  if (hasMin && (!Number.isFinite(Number(minRaw)) || Number(minRaw) < 0))
    return { error: "最低预算必须为非负数" };
  if (hasMax && (!Number.isFinite(Number(maxRaw)) || Number(maxRaw) < 0))
    return { error: "最高预算必须为非负数" };
  if (hasMin && hasMax && Number(minRaw) > Number(maxRaw))
    return { error: "最低预算不能高于最高预算" };

  if (!b.description || typeof b.description !== "string" || !b.description.trim())
    return { error: "请填写具体要求描述" };

  return {
    data: {
      subjectName: (b.subjectName as string).trim(),
      gradeLevel: b.gradeLevel as GradeLevel,
      regions: (b.regions as string[]).map((r) => r.trim()),
      budgetMin: hasMin ? Number(minRaw) : undefined,
      budgetMax: hasMax ? Number(maxRaw) : undefined,
      scheduleNote:
        typeof b.scheduleNote === "string" && b.scheduleNote.trim()
          ? b.scheduleNote.trim()
          : undefined,
      description: (b.description as string).trim(),
    },
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "未登录" }, { status: 401 });
  if (session.user.role !== "PARENT" && session.user.role !== "STUDENT")
    return NextResponse.json({ error: "仅家长/学员可发布需求" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const result = validate(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  const { subjectName, gradeLevel, regions, budgetMin, budgetMax, scheduleNote, description } =
    result.data;

  const requirement = await prisma.requirement.create({
    data: {
      userId: session.user.id,
      subjectName,
      gradeLevel,
      budgetMin,
      budgetMax,
      scheduleNote,
      description,
      regions: { create: regions.map((regionName) => ({ regionName })) },
    },
  });

  return NextResponse.json({ message: "需求已发布", id: requirement.id }, { status: 201 });
}
