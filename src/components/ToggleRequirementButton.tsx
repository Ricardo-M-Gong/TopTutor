"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  requirementId: string;
  isActive: boolean;
}

export default function ToggleRequirementButton({ requirementId, isActive }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    await fetch(`/api/requirements/${requirementId}`, { method: "PATCH" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 ${
        isActive
          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
          : "bg-green-50 text-green-700 hover:bg-green-100"
      }`}
    >
      {loading ? "..." : isActive ? "关闭需求" : "重新开放"}
    </button>
  );
}
