"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

interface BookButtonProps {
  tutorProfileId: string;
  tutorName: string;
}

export default function BookButton({ tutorProfileId, tutorName }: BookButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PARENT_BOOK",
          tutorProfileId,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "预约失败，请重试");
        toast(data.error ?? "预约失败，请重试", "error");
      } else {
        setDone(true);
        setOpen(false);
        toast(`已成功向 ${tutorName} 发送预约请求`);
        router.refresh();
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
        预约已发送
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
      >
        立即预约
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">预约 {tutorName}</h3>
            <p className="text-sm text-gray-500 mb-4">填写预约留言，告诉教员你的需求（选填）</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="描述你的学习需求、期望上课时间等..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => { setOpen(false); setError(""); }}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
                >
                  {loading ? "发送中..." : "确认预约"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
