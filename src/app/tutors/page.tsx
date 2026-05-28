import TutorCard from "@/components/TutorCard";
import { MOCK_SUBJECTS } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import type { Tutor } from "@/types";

async function getTutors(): Promise<Tutor[]> {
  const profiles = await prisma.tutorProfile.findMany({
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      subjects: { select: { subjectName: true } },
      tags: { select: { tag: true } },
    },
    orderBy: { rating: "desc" },
  });

  return profiles.map((p) => ({
    id: p.id,
    name: p.user.name,
    avatar: p.user.avatarUrl ?? "",
    university: p.university,
    major: p.major,
    grade: p.grade,
    hourlyRate: p.hourlyRate,
    rating: p.rating,
    reviewCount: p.reviewCount,
    bio: p.bio,
    available: p.available,
    subjects: p.subjects.map((s) => s.subjectName),
    tags: p.tags.map((t) => t.tag),
  }));
}

export default async function TutorsPage() {
  const tutors = await getTutors();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">找家教</h1>
        <p className="mt-2 text-gray-500">
          共找到{" "}
          <span className="font-semibold text-indigo-600">{tutors.length}</span>{" "}
          位家教
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Sidebar Filters ── */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6 sticky top-20">
            <h2 className="font-semibold text-gray-900">筛选条件</h2>

            {/* Subject filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">学科</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-medium">
                  全部
                </button>
                {MOCK_SUBJECTS.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                价格区间（元/时）
              </h3>
              <div className="space-y-2">
                {[
                  { label: "不限", value: "all" },
                  { label: "¥50 以下", value: "lt50" },
                  { label: "¥50 – ¥100", value: "50-100" },
                  { label: "¥100 – ¥150", value: "100-150" },
                  { label: "¥150 以上", value: "gt150" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="price"
                      defaultChecked={opt.value === "all"}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                最低评分
              </h3>
              <div className="space-y-2">
                {["不限", "4.5 分以上", "4.8 分以上", "5.0 分"].map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      name="rating"
                      defaultChecked={opt === "不限"}
                      className="accent-indigo-600"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="accent-indigo-600 w-4 h-4"
                />
                <span className="text-sm text-gray-700">仅显示可预约</span>
              </label>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
              应用筛选
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {["综合推荐", "评分最高", "价格最低", "评价最多"].map(
                (opt, i) => (
                  <button
                    key={opt}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      i === 0
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="搜索姓名或学科..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Tutor grid */}
          {tutors.length === 0 ? (
            <div className="text-center py-20 text-gray-400">暂无教员数据</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="flex justify-center mt-10 gap-2">
            {[1, 2, 3, "...", 8].map((page, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
