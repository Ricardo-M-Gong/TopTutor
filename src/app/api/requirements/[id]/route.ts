import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const requirement = await prisma.requirement.findUnique({ where: { id } });
  if (!requirement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (requirement.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.requirement.update({
    where: { id },
    data: { isActive: !requirement.isActive },
  });

  return NextResponse.json({ isActive: updated.isActive });
}
