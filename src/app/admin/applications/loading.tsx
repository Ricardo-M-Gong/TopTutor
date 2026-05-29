export default function AdminApplicationsLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-40 bg-gray-200 rounded-lg" />
        <div className="h-4 w-20 bg-gray-100 rounded" />
      </div>

      {/* Summary cards (3) */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-xl p-4 text-center space-y-2">
            <div className="h-8 w-8 bg-gray-200 rounded mx-auto" />
            <div className="h-3.5 w-12 bg-gray-200 rounded mx-auto" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Column headings — 6 cols */}
        <div className="grid grid-cols-6 bg-gray-50 px-6 py-3 gap-4">
          {["w-8", "w-10", "w-10", "w-16", "w-8", "w-8"].map((w, i) => (
            <div key={i} className={`h-3 ${w} bg-gray-200 rounded`} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="grid grid-cols-6 px-6 py-3.5 gap-4 border-t border-gray-50 items-center">
            {/* 类型 */}
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
            {/* 发起方 */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            {/* 接收方 */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-16 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
            {/* 相关信息 */}
            <div className="space-y-1.5">
              <div className="h-3 w-28 bg-gray-100 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
            {/* 状态 pill */}
            <div className="h-5 w-14 bg-gray-100 rounded-full" />
            {/* 时间 */}
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
