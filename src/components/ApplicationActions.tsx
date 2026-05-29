"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

interface ApplicationActionsProps {
  applicationId: string;
}

export default function ApplicationActions({ applicationId }: ApplicationActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<"ACCEPTED" | "REJECTED" | null>(null);
  const [done, setDone] = useState<"ACCEPTED" | "REJECTED" | null>(null);
  const [error, setError] = useState("");

  async function handleAction(status: "ACCEPTED" | "REJECTED") {
    setError("");
    setLoading(status);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "操作失败");
        toast(data.error ?? "操作失败", "error");
      } else {
        setDone(status);
        toast(status === "ACCEPTED" ? "已接受申请" : "已拒绝申请");
        router.refresh();
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(null);
    }
  }

  if (done === "ACCEPTED") {
    return <span className="text-sm font-medium text-green-600">已接受</span>;
  }
  if (done === "REJECTED") {
    return <span className="text-sm font-medium text-gray-400">已拒绝</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span className="text-xs text-red-500">{error}</span>}
      <button
        onClick={() => handleAction("ACCEPTED")}
        disabled={!!loading}
        className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-60"
      >
        {loading === "ACCEPTED" ? "处理中..." : "接受"}
      </button>
      <button
        onClick={() => handleAction("REJECTED")}
        disabled={!!loading}
        className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-60"
      >
        {loading === "REJECTED" ? "处理中..." : "拒绝"}
      </button>
    </div>
  );
}
