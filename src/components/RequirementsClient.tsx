"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ApplyButton from "@/components/ApplyButton";

const GRADE_LABEL: Record<string, string> = {
  PRIMARY: "小学", MIDDLE: "初中", HIGH: "高中",
  UNDERGRADUATE: "大学本科", GRADUATE: "研究生", OTHER: "其他",
};

const GRADE_OPTIONS = [
  { value: "", label: "全部年级" },
  { value: "PRIMARY", label: "小学" },
  { value: "MIDDLE", label: "初中" },
  { value: "HIGH", label: "高中" },
  { value: "UNDERGRADUATE", label: "大学本科" },
  { value: "GRADUATE", label: "研究生" },
  { value: "OTHER", label: "其他" },
];

interface Requirement {
  id: string;
  subjectName: string;
  gradeLevel: string;
  budgetMin: number | null;
  budgetMax: number | null;
  scheduleNote: string | null;
  description: string;
  createdAt: string;
  user: { name: string };
}

interface Props {
  requirements: Requirement[];
  isTutor: boolean;
  myProfileId: string | null;
  appliedRequirementIds: string[];
  isLoggedIn: boolean;
}

export default function RequirementsClient({
  requirements,
  isTutor,
  myProfileId,
  appliedRequirementIds,
  isLoggedIn,
}: Props) {
  const [q, setQ] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  const appliedSet = useMemo(() => new Set(appliedRequirementIds), [appliedRequirementIds]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return requirements.filter((req) => {
      if (gradeFilter && req.gradeLevel !== gradeFilter) return false;
      if (query) {
        const haystack = `${req.subjectName} ${req.description}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [requirements, q, gradeFilter]);

  // Collect unique subjects for quick-filter pills
  const subjects = useMemo(
    () => Array.from(new Set(requirements.map((r) => r.subjectName))).sort(),
    [requirements]
  );

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">需求大厅</h1>
          <p className="mt-2 text-gray-500">
            共 <span className="font-semibold text-indigo-600">{requirements.length}</span> 条招募中的家教需求
            {isTutor && !myProfileId && (
              <span className="ml-3 text-amber-600 text-sm">
                提示：请先完善你的教员资料，才能申请接单
              </span>
            )}
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索科目或需求描述..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          {/* Grade filter */}
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-gray-700 min-w-[130px]"
          >
            {GRADE_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        {/* Subject quick-filter pills */}
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setQ("")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                q === "" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              全部
            </button>
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setQ(q === s ? "" : s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  q === s ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        {(q || gradeFilter) && (
          <p className="text-sm text-gray-500 mb-4">
            筛选结果：<span className="font-semibold text-indigo-600">{filtered.length}</span> 条
            <button
              onClick={() => { setQ(""); setGradeFilter(""); }}
              className="ml-3 text-xs text-indigo-600 hover:underline"
            >
              清除筛选
            </button>
          </p>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="font-medium text-gray-700 mb-2">没有找到符合条件的需求</p>
            <p className="text-sm text-gray-400 mb-4">试试调整筛选条件</p>
            <button
              onClick={() => { setQ(""); setGradeFilter(""); }}
              className="text-sm text-indigo-600 hover:underline"
            >
              清除筛选条件
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/requirements/${req.id}`} className="flex-1 min-w-0 hover:opacity-80 transition-opacity">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                        {req.subjectName}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        {GRADE_LABEL[req.gradeLevel] ?? req.gradeLevel}
                      </span>
                      {(req.budgetMin || req.budgetMax) && (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                          {req.budgetMin && req.budgetMax
                            ? `¥${req.budgetMin}–${req.budgetMax}/时`
                            : req.budgetMin
                            ? `¥${req.budgetMin}+/时`
                            : `最高 ¥${req.budgetMax}/时`}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-3 line-clamp-2">
                      {req.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      {req.scheduleNote && <span>上课安排：{req.scheduleNote}</span>}
                      <span>发布于 {new Date(req.createdAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </Link>

                  {/* Action */}
                  <div className="shrink-0">
                    {isTutor ? (
                      myProfileId ? (
                        appliedSet.has(req.id) ? (
                          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium">
                            已申请
                          </span>
                        ) : (
                          <ApplyButton
                            tutorProfileId={myProfileId}
                            requirementId={req.id}
                          />
                        )
                      ) : (
                        <span className="text-xs text-gray-400">完善资料后可申请</span>
                      )
                    ) : !isLoggedIn ? (
                      <a
                        href="/login"
                        className="inline-flex items-center px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors"
                      >
                        登录后申请
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
