"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

interface ApplyButtonProps {
  tutorProfileId: string;
  requirementId: string;
}

export default function ApplyButton({ tutorProfileId, requirementId }: ApplyButtonProps) {
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
          type: "TUTOR_APPLY",
          tutorProfileId,
          requirementId,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "提交失败，请重试");
        toast(data.error ?? "提交失败，请重试", "error");
      } else {
        setDone(true);
        setOpen(false);
        toast("申请已发送，等待家长回复");
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
      <span className="inline-flex items-center px-4 py-2 rounded-xl bg-green-50 text-green-700 text-sm font-medium">
        已申请
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        申请接单
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">申请接单</h3>
            <p className="text-sm text-gray-500 mb-4">向家长发送自我推荐留言（选填）</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="介绍你的优势、教学经验，让家长更了解你..."
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
                  {loading ? "提交中..." : "确认申请"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
