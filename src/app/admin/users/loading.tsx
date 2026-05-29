export default function AdminUsersLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-7 w-24 bg-gray-200 rounded-lg" />
        <div className="h-4 w-20 bg-gray-100 rounded" />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Column headings — 5 cols */}
        <div className="grid grid-cols-5 bg-gray-50 px-6 py-3 gap-4">
          {["w-8", "w-10", "w-8", "w-16", "w-8"].map((w, i) => (
            <div key={i} className={`h-3 ${w} bg-gray-200 rounded`} />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 px-6 py-3.5 gap-4 border-t border-gray-50 items-center">
            <div className="h-3.5 w-20 bg-gray-200 rounded" />
            <div className="h-3.5 w-40 bg-gray-100 rounded" />
            <div className="h-5 w-12 bg-gray-100 rounded-full" />
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
            <div className="h-7 w-20 bg-gray-100 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
