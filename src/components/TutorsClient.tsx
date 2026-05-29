"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import TutorCard from "@/components/TutorCard";
import Link from "next/link";
import type { Tutor, Subject } from "@/types";

const GRADE_OPTIONS = [
  { label: "不限", value: "" },
  { label: "小学", value: "PRIMARY" },
  { label: "初中", value: "MIDDLE" },
  { label: "高中", value: "HIGH" },
  { label: "大学本科", value: "UNDERGRADUATE" },
  { label: "研究生", value: "GRADUATE" },
  { label: "其他", value: "OTHER" },
];

const PRICE_OPTIONS = [
  { label: "不限", value: "all" },
  { label: "¥50 以下", value: "lt50" },
  { label: "¥50 – ¥100", value: "50-100" },
  { label: "¥100 – ¥150", value: "100-150" },
  { label: "¥150 以上", value: "gt150" },
];

const RATING_OPTIONS = [
  { label: "不限", value: "0" },
  { label: "4.5 分以上", value: "4.5" },
  { label: "4.8 分以上", value: "4.8" },
  { label: "5.0 分", value: "5" },
];

const SORT_OPTIONS = [
  { label: "综合推荐", value: "recommended" },
  { label: "评分最高", value: "rating" },
  { label: "价格最低", value: "price_asc" },
  { label: "评价最多", value: "reviews" },
];

interface Props {
  tutors: Tutor[];
  total: number;
  totalPages: number;
  currentPage: number;
  subjects: string[];
  mockSubjects: Subject[];
  initialQ: string;
  initialSubject: string;
  initialPrice: string;
  initialRating: string;
  initialAvailable: boolean;
  initialSort: string;
  initialGrade: string;
}

export default function TutorsClient({
  tutors,
  total,
  totalPages,
  currentPage,
  subjects,
  initialQ,
  initialSubject,
  initialPrice,
  initialRating,
  initialAvailable,
  initialSort,
  initialGrade,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  // Local filter state (apply on button click)
  const [q, setQ] = useState(initialQ);
  const [subject, setSubject] = useState(initialSubject);
  const [price, setPrice] = useState(initialPrice);
  const [rating, setRating] = useState(initialRating);
  const [available, setAvailable] = useState(initialAvailable);
  const [sort, setSort] = useState(initialSort);
  const [grade, setGrade] = useState(initialGrade);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined> = {}) => {
      const params = new URLSearchParams();
      const vals = { q, subject, price, rating, available: available ? "1" : "", sort, grade, page: "1", ...overrides };
      Object.entries(vals).forEach(([k, v]) => { if (v && v !== "all" && v !== "0" && v !== "") params.set(k, v); });
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [q, subject, price, rating, available, sort, grade, pathname]
  );

  function applyFilters() {
    setMobileFiltersOpen(false);
    router.push(buildUrl());
  }

  function resetFilters() {
    setQ(""); setSubject(""); setPrice("all"); setRating("0"); setAvailable(false); setSort("recommended"); setGrade("");
    router.push(pathname);
  }

  function handleSort(val: string) {
    setSort(val);
    router.push(buildUrl({ sort: val, page: "1" }));
  }

  function handlePage(p: number) {
    router.push(buildUrl({ page: String(p) }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSearchKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") applyFilters();
  }

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">筛选条件</h2>
        <button onClick={resetFilters} className="text-xs text-indigo-600 hover:underline">重置</button>
      </div>

      {/* Subject */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">学科</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubject("")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              subject === "" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
            }`}
          >
            全部
          </button>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSubject(s === subject ? "" : s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                subject === s ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grade */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">辅导年级</h3>
        <div className="space-y-2">
          {GRADE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="grade"
                checked={grade === opt.value}
                onChange={() => setGrade(opt.value)}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>        <h3 className="text-sm font-medium text-gray-700 mb-3">价格区间（元/时）</h3>
        <div className="space-y-2">
          {PRICE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="price"
                checked={price === opt.value}
                onChange={() => setPrice(opt.value)}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">最低评分</h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={rating === opt.value}
                onChange={() => setRating(opt.value)}
                className="accent-indigo-600"
              />
              <span className="text-sm text-gray-600 group-hover:text-gray-900">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Available */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="accent-indigo-600 w-4 h-4"
          />
          <span className="text-sm text-gray-700">仅显示可预约</span>
        </label>
      </div>

      <button
        onClick={applyFilters}
        className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        应用筛选
      </button>
    </div>
  );

  // Pagination helper
  function getPages(): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">找家教</h1>
          <p className="mt-1 text-gray-500">
            共找到 <span className="font-semibold text-indigo-600">{total}</span> 位家教
            {(initialQ || initialSubject) && (
              <span className="ml-2 text-sm">
                {initialQ && <>关键词「{initialQ}」</>}
                {initialSubject && <>学科「{initialSubject}」</>}
              </span>
            )}
          </p>
        </div>
        {/* Mobile filter toggle */}
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          筛选
        </button>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-gray-900">筛选</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-20">
            {FilterPanel}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort + Search bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sort === opt.value
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleSearchKey}
                placeholder="搜索姓名或学科..."
                className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 w-52"
              />
              <button onClick={applyFilters} className="absolute left-2.5 top-2.5">
                <svg className="w-4 h-4 text-gray-400 hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Grid */}
          {tutors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="font-medium text-gray-700 mb-2">没有找到符合条件的家教</p>
              <p className="text-sm text-gray-400 mb-4">试试调整筛选条件</p>
              <button onClick={resetFilters} className="text-indigo-600 text-sm hover:underline">清除筛选条件</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2 flex-wrap">
              <button
                onClick={() => handlePage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹
              </button>
              {getPages().map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePage(p as number)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === currentPage
                        ? "bg-indigo-600 text-white"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => handlePage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
