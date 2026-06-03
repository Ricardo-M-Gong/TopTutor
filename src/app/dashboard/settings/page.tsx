import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardSettingsClient from "./DashboardSettingsClient";

export default async function DashboardSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, tutorProfile] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        address: true,
        role: true,
        userRegions: { select: { regionName: true } },
      },
    }),
    session.user.role === "TUTOR"
      ? prisma.tutorProfile.findUnique({
          where: { userId: session.user.id },
          select: { regions: { select: { regionName: true } } },
        })
      : Promise.resolve(null),
  ]);

  if (!user) redirect("/login");

  const regions =
    user.role === "TUTOR"
      ? (tutorProfile?.regions.map((r) => r.regionName) ?? [])
      : user.userRegions.map((r) => r.regionName);

  return (
    <DashboardSettingsClient
      role={user.role}
      address={user.address ?? ""}
      regions={regions}
    />
  );
}
