import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/SettingsClient";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true, role: true },
  });

  if (!user) redirect("/login");

  return (
    <SettingsClient
      name={user.name}
      phone={user.phone ?? ""}
      email={user.email}
      role={user.role}
    />
  );
}
