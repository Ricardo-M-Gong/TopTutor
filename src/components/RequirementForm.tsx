"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RegionMultiSelect from "@/components/RegionMultiSelect";
import { REGION_OPTIONS } from "@/lib/regions";

const SUBJECT_OPTIONS = [
  "数学", "英语", "物理", "化学", "生物", "语文", "历史", "地理",
  "政治", "编程", "高等数学", "线性代数", "概率论", "大学物理",
  "经济学", "会计", "日语", "法语", "德语",
];

const GRADE_OPTIONS = [
  { value: "PRIMARY", label: "小学" },
  { value: "MIDDLE", label: "初中" },
  { value: "HIGH", label: "高中" },
  { value: "UNDERGRADUATE", label: "大学本科" },
  { value: "GRADUATE", label: "研究生" },
  { value: "OTHER", label: "其他" },
];

export default function RequirementForm() {
  const router = useRouter();
  const [subjectName, setSubjectName] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [scheduleNote, setScheduleNote] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveSubject = subjectName === "__custom__" ? customSubject : subjectName;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!effectiveSubject.trim()) return setError("请选择或填写辅导科目");
    if (!gradeLevel) return setError("请选择学员年级");
    if (regions.length === 0) return setError("请至少选择一个服务区域");
    if (budgetMin && (!Number.isFinite(Number(budgetMin)) || Number(budgetMin) < 0))
      return setError("最低预算必须为非负数");
    if (budgetMax && (!Number.isFinite(Number(budgetMax)) || Number(budgetMax) < 0))
      return setError("最高预算必须为非负数");
    if (budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax))
      return setError("最低预算不能高于最高预算");
    if (!description.trim()) return setError("请填写具体要求描述");

    const combinedNote = scheduleNote.trim() || undefined;

    setLoading(true);
    try {
      const res = await fetch("/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectName: effectiveSubject.trim(),
          gradeLevel,
          regions,
          budgetMin: budgetMin ? Number(budgetMin) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          scheduleNote: combinedNote,
          description: description.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "发布失败，请重试");
      } else {
        router.push("/dashboard/parent");
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
      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          辅导科目 <span className="text-red-500">*</span>
        </label>
        <select
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        >
          <option value="">请选择科目</option>
          {SUBJECT_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
          <option value="__custom__">其他（手动填写）</option>
        </select>
        {subjectName === "__custom__" && (
          <input
            type="text"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
            placeholder="请输入科目名称"
            className="mt-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        )}
      </div>

      {/* Grade level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          学员年级 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GRADE_OPTIONS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setGradeLevel(g.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                gradeLevel === g.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          时薪预算（元/小时）
          <span className="ml-2 text-xs text-gray-400 font-normal">选填</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
            <input
              type="number"
              min="0"
              step="1"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              placeholder="最低"
              className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <span className="text-gray-400 text-sm shrink-0">至</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
            <input
              type="number"
              min="0"
              step="1"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              placeholder="最高"
              className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          上课频率
          <span className="ml-2 text-xs text-gray-400 font-normal">选填，如：每周2次，每次2小时</span>
        </label>
        <input
          type="text"
          value={scheduleNote}
          onChange={(e) => setScheduleNote(e.target.value)}
          placeholder="如：每周2次，每次2小时"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Regions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          服务区域 <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400 font-normal">可多选，选择希望老师上门或就近服务的区域</span>
        </label>
        <RegionMultiSelect value={regions} onChange={setRegions} options={REGION_OPTIONS} />
        {regions.length > 0 && (
          <p className="mt-2 text-xs text-indigo-600">已选：{regions.join("、")}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          具体要求描述 <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="描述学员的学习情况、薄弱点、对家教的具体要求等..."
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
        {loading ? "发布中..." : "发布需求"}
      </button>
    </form>
  );
}
