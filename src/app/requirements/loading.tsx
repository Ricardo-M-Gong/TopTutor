export default function RequirementsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="h-8 w-28 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-44 bg-gray-100 rounded" />
        </div>

        {/* Search + filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-gray-100 rounded-xl" />
          <div className="h-10 w-32 bg-gray-100 rounded-xl" />
        </div>

        {/* Subject pills */}
        <div className="flex gap-2 mb-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-14 bg-gray-100 rounded-full" />
          ))}
        </div>

        {/* Requirement cards */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  {/* Tag pills */}
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-gray-200 rounded-full" />
                    <div className="h-6 w-14 bg-gray-100 rounded-full" />
                    <div className="h-6 w-20 bg-gray-100 rounded-full" />
                  </div>
                  {/* Description lines */}
                  <div className="space-y-1.5">
                    <div className="h-3 w-full bg-gray-100 rounded" />
                    <div className="h-3 w-3/4 bg-gray-100 rounded" />
                  </div>
                  {/* Meta */}
                  <div className="flex gap-4">
                    <div className="h-3 w-28 bg-gray-100 rounded" />
                    <div className="h-3 w-20 bg-gray-100 rounded" />
                  </div>
                </div>
                {/* Action button */}
                <div className="h-9 w-20 bg-gray-200 rounded-xl shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
