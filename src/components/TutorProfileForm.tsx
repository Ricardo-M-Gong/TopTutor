"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";
import RegionMultiSelect from "@/components/RegionMultiSelect";
import { REGION_OPTIONS } from "@/lib/regions";

const SUBJECT_OPTIONS = [
  "数学", "英语", "物理", "化学", "生物", "语文", "历史", "地理",
  "政治", "编程", "高等数学", "线性代数", "概率论", "大学物理",
  "经济学", "会计", "日语", "法语", "德语",
];

const GRADE_OPTIONS = [
  "大一", "大二", "大三", "大四", "研一", "研二", "研三", "博士", "已毕业",
];

interface InitialData {
  university: string;
  major: string;
  grade: string;
  subjects: string[];
  regions: string[];
  hourlyRate: number;
  bio: string;
}

export default function TutorProfileForm({ initialData }: { initialData: InitialData | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [university, setUniversity] = useState(initialData?.university ?? "");
  const [major, setMajor] = useState(initialData?.major ?? "");
  const [grade, setGrade] = useState(initialData?.grade ?? "");
  const [subjects, setSubjects] = useState<string[]>(initialData?.subjects ?? []);
  const [regions, setRegions] = useState<string[]>(initialData?.regions ?? []);
  const [hourlyRate, setHourlyRate] = useState(
    initialData?.hourlyRate ? String(initialData.hourlyRate) : ""
  );
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function toggleSubject(s: string) {
    setSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!university.trim()) return setError("请填写毕业/就读高校");
    if (!major.trim()) return setError("请填写专业");
    if (!grade) return setError("请选择年级");
    if (subjects.length === 0) return setError("请至少选择一个擅长科目");
    if (regions.length === 0) return setError("请至少选择一个服务区域");
    const rate = Number(hourlyRate);
    if (!hourlyRate || !Number.isFinite(rate) || rate <= 0) return setError("期望时薪必须为正数");
    if (!bio.trim()) return setError("请填写自我介绍");

    setLoading(true);
    try {
      const res = await fetch("/api/tutor/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university, major, grade, subjects, regions, hourlyRate: rate, bio }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "保存失败，请重试");
      } else {
        toast(data.message ?? "资料保存成功");
        router.refresh();
      }
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* University */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          毕业/就读高校 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          placeholder="如：北京大学、清华大学"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Major + Grade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            专业 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            placeholder="如：计算机科学与技术"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年级 <span className="text-red-500">*</span>
          </label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
          >
            <option value="">请选择年级</option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          擅长科目 <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400 font-normal">可多选</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECT_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSubject(s)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                subjects.includes(s)
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {subjects.length > 0 && (
          <p className="mt-2 text-xs text-indigo-600">已选：{subjects.join("、")}</p>
        )}
      </div>

      {/* Regions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          服务区域 <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400 font-normal">可多选</span>
        </label>
        <RegionMultiSelect value={regions} onChange={setRegions} options={REGION_OPTIONS} />
        {regions.length > 0 && (
          <p className="mt-2 text-xs text-indigo-600">已选：{regions.join("、")}</p>
        )}
      </div>

      {/* Hourly rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          期望时薪（元/小时）<span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
          <input
            type="number"
            min="1"
            step="0.5"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            placeholder="如：80"
            className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          自我介绍 <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400 font-normal">教学经历、获奖情况等</span>
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          placeholder="介绍你的教学经历、获奖情况、教学风格等，让学生更了解你..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "保存中..." : "保存资料"}
      </button>
    </form>
  );
}
