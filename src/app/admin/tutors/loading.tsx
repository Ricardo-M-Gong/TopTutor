export default function AdminTutorsLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-4 w-20 bg-gray-100 rounded" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Column headings — 7 cols */}
        <div className="grid grid-cols-7 bg-gray-50 px-6 py-3 gap-4">
          {["w-8", "w-16", "w-8", "w-8", "w-8", "w-8", "w-8"].map((w, i) => (
            <div key={i} className={`h-3 ${w} bg-gray-200 rounded`} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-7 px-6 py-3.5 gap-4 border-t border-gray-50 items-center">
            {/* 姓名 + email */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            {/* 学校 / 专业 */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-100 rounded" />
            </div>
            {/* 科目 pills */}
            <div className="flex gap-1">
              <div className="h-5 w-12 bg-gray-100 rounded" />
              <div className="h-5 w-10 bg-gray-100 rounded" />
            </div>
            {/* 时薪 */}
            <div className="h-3.5 w-14 bg-gray-100 rounded" />
            {/* 评分 */}
            <div className="h-3.5 w-12 bg-gray-100 rounded" />
            {/* 状态 pill */}
            <div className="h-5 w-14 bg-gray-100 rounded-full" />
            {/* 操作 */}
            <div className="h-3.5 w-12 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
