export default function AdminLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Title */}
      <div className="h-7 w-24 bg-gray-200 rounded-lg mb-8" />

      {/* Stat cards — 7 cards, same grid as page */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="h-7 w-7 bg-gray-100 rounded mb-3" />
            <div className="h-8 w-12 bg-gray-200 rounded mb-1.5" />
            <div className="h-3.5 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Recent users table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        {/* Table header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-3.5 w-12 bg-gray-100 rounded" />
        </div>

        {/* Column headings */}
        <div className="grid grid-cols-4 bg-gray-50 px-6 py-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 w-10 bg-gray-200 rounded" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 px-6 py-3.5 gap-4 border-t border-gray-50">
            <div className="h-3.5 w-20 bg-gray-200 rounded" />
            <div className="h-3.5 w-36 bg-gray-100 rounded" />
            <div className="h-5 w-12 bg-gray-100 rounded-full" />
            <div className="h-3.5 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
