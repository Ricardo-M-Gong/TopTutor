import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import RequirementsClient from "@/components/RequirementsClient";

export default async function RequirementsPage() {
  const session = await auth();
  const isTutor = session?.user?.role === "TUTOR";

  let myProfileId: string | null = null;
  if (isTutor && session?.user?.id) {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    myProfileId = profile?.id ?? null;
  }

  const requirements = await prisma.requirement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const appliedRequirementIds: string[] = [];
  if (isTutor && session?.user?.id) {
    const existing = await prisma.application.findMany({
      where: {
        senderUserId: session.user.id,
        type: "TUTOR_APPLY",
        status: "PENDING",
      },
      select: { requirementId: true },
    });
    existing.forEach((a) => {
      if (a.requirementId) appliedRequirementIds.push(a.requirementId);
    });
  }

  const serialized = requirements.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <RequirementsClient
      requirements={serialized}
      isTutor={isTutor}
      myProfileId={myProfileId}
      appliedRequirementIds={appliedRequirementIds}
      isLoggedIn={!!session}
    />
  );
}
