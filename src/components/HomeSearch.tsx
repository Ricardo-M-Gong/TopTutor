"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearch() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSearch() {
    const trimmed = q.trim();
    router.push(trimmed ? `/tutors?q=${encodeURIComponent(trimmed)}` : "/tutors");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={handleKey}
        placeholder="搜索学科，如：高等数学、英语口语..."
        className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      <button
        onClick={handleSearch}
        className="px-6 py-3.5 rounded-xl bg-yellow-400 text-gray-900 font-semibold text-sm hover:bg-yellow-300 transition-colors whitespace-nowrap text-center"
      >
        立即搜索
      </button>
    </div>
  );
}
