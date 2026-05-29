"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

export default function AvailabilityToggle({ available }: { available: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [current, setCurrent] = useState(available);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const next = !current;
      const res = await fetch("/api/tutor/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: next }),
      });
      if (res.ok) {
        setCurrent(next);
        toast(next ? "已开启接单，学生可以预约你" : "已暂停接单");
        router.refresh();
      } else {
        toast("操作失败，请重试", "error");
      }
    } catch {
      toast("网络错误，请重试", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
        current
          ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
      }`}
    >
      <span className={`w-2.5 h-2.5 rounded-full transition-colors ${current ? "bg-green-500" : "bg-gray-400"}`} />
      {loading ? "切换中…" : current ? "接单中" : "已暂停接单"}
    </button>
  );
}
