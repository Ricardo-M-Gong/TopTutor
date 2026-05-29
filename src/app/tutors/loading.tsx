export default function TutorsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-32 bg-gray-200 rounded-lg mb-2" />
        <div className="h-4 w-48 bg-gray-100 rounded" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-8 bg-gray-100 rounded" />
            </div>
            {/* Subject pills */}
            <div>
              <div className="h-3 w-12 bg-gray-200 rounded mb-3" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-7 w-14 bg-gray-100 rounded-full" />
                ))}
              </div>
            </div>
            {/* Grade radios */}
            <div>
              <div className="h-3 w-16 bg-gray-200 rounded mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded-full" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
            {/* Price radios */}
            <div>
              <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 rounded-full" />
                    <div className="h-3 w-24 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-10 w-full bg-gray-200 rounded-xl" />
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center gap-2 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-20 bg-gray-100 rounded-lg" />
            ))}
          </div>

          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                {/* Avatar + name */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                  </div>
                </div>
                {/* Subject pills */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-100 rounded-full" />
                  <div className="h-6 w-14 bg-gray-100 rounded-full" />
                  <div className="h-6 w-12 bg-gray-100 rounded-full" />
                </div>
                {/* Bio lines */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-4/5 bg-gray-100 rounded" />
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-8 w-20 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
