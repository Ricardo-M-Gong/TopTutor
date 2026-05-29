"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = ["TUTOR", "PARENT", "STUDENT", "ADMIN"] as const;
const ROLE_LABEL: Record<string, string> = {
  TUTOR: "教员", PARENT: "家长", STUDENT: "学员", ADMIN: "管理员",
};

export default function AdminUserActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function changeRole(role: string) {
    if (role === currentRole) return;
    setLoading(true);
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <select
      value={currentRole}
      onChange={(e) => changeRole(e.target.value)}
      disabled={loading}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50"
    >
      {ROLES.map((r) => (
        <option key={r} value={r}>{ROLE_LABEL[r]}</option>
      ))}
    </select>
  );
}
