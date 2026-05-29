"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  tutorProfileId: string;
  existingRating?: number;
  existingContent?: string;
}

export default function ReviewForm({ tutorProfileId, existingRating, existingContent }: Props) {
  const [rating, setRating] = useState(existingRating ?? 0);
  const [hovered, setHovered] = useState(0);
  const [content, setContent] = useState(existingContent ?? "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setError("请选择评分"); return; }
    setError(""); setMsg("");
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorProfileId, rating, content }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "提交失败"); return; }
    setMsg("评价已提交，感谢你的反馈！");
    router.refresh();
  }

  const display = hovered || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Star rating */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">评分</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(star)}
              className="text-2xl transition-transform hover:scale-110"
            >
              <span className={star <= display ? "text-amber-400" : "text-gray-200"}>★</span>
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-500 self-center">
              {["", "很差", "较差", "一般", "不错", "非常好"][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">评价内容</label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="分享你的上课体验..."
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>}
      {msg && <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">{msg}</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? "提交中..." : existingRating ? "更新评价" : "提交评价"}
      </button>
    </form>
  );
}
