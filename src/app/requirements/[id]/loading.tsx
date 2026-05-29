export default function RequirementDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 animate-pulse">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <div className="h-4 w-28 bg-gray-200 rounded mb-6" />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {/* Tag pills */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <div className="h-7 w-16 bg-gray-200 rounded-full" />
            <div className="h-7 w-14 bg-gray-100 rounded-full" />
            <div className="h-7 w-20 bg-gray-100 rounded-full" />
            <div className="h-7 w-14 bg-gray-100 rounded-full" />
          </div>

          {/* Description block */}
          <div className="space-y-2 mb-6">
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-5/6 bg-gray-100 rounded" />
            <div className="h-3.5 w-4/6 bg-gray-100 rounded" />
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-4 mb-6">
            <div className="h-3.5 w-32 bg-gray-100 rounded" />
            <div className="h-3.5 w-24 bg-gray-100 rounded" />
            <div className="h-3.5 w-28 bg-gray-100 rounded" />
          </div>

          {/* Action button */}
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </main>
  );
}
