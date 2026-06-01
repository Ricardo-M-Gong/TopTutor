import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { validateRegions } from "@/lib/regions";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json() as { regions?: unknown };
  const { regions } = body;

  if (regions !== undefined) {
    // Allow empty array to clear regions
    if (!Array.isArray(regions) || !regions.every((r) => typeof r === "string")) {
      return NextResponse.json({ error: "区域格式无效" }, { status: 400 });
    }
    if (regions.length > 0 && !validateRegions(regions)) {
      return NextResponse.json({ error: "包含无效的服务区域" }, { status: 400 });
    }

    if (session.user.role === "TUTOR") {
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      });
      if (!tutorProfile) {
        return NextResponse.json({ error: "请先完善教员资料" }, { status: 400 });
      }
      await prisma.$transaction([
        prisma.tutorRegion.deleteMany({ where: { tutorProfileId: tutorProfile.id } }),
        ...(regions.length > 0
          ? [prisma.tutorRegion.createMany({
              data: (regions as string[]).map((r) => ({
                tutorProfileId: tutorProfile.id,
                regionName: r.trim(),
              })),
            })]
          : []),
      ]);
    } else {
      await prisma.$transaction([
        prisma.userRegion.deleteMany({ where: { userId: session.user.id } }),
        ...(regions.length > 0
          ? [prisma.userRegion.createMany({
              data: (regions as string[]).map((r) => ({
                userId: session.user.id,
                regionName: r.trim(),
              })),
            })]
          : []),
      ]);
    }
  }

  return NextResponse.json({ ok: true });
}
