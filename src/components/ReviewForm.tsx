"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

interface Props {
  applicationId: string;
  tutorProfileId: string;
  tutorName: string;
}

export default function ReviewForm({ applicationId, tutorProfileId, tutorName }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, tutorProfileId, rating, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "提交失败", "error");
      } else {
        setDone(true);
        toast("评价已提交，感谢你的反馈！");
        router.refresh();
      }
    } catch {
      toast("网络错误，请重试", "error");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-3 px-3 py-2 rounded-xl bg-green-50 border border-green-100 text-xs text-green-700">
        ✓ 评价已提交
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
      <p className="text-xs font-medium text-gray-700 mb-2">为 {tutorName} 的教学留下评价</p>
      {/* Star selector */}
      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
            className="text-2xl leading-none focus:outline-none"
          >
            <span className={(hover || rating) >= star ? "text-amber-400" : "text-gray-200"}>★</span>
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-xs text-gray-500">
            {["", "很差", "较差", "一般", "不错", "很棒"][rating]}
          </span>
        )}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        placeholder="描述上课体验（选填）..."
        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "提交中..." : "提交评价"}
        </button>
      </div>
    </form>
  );
}
