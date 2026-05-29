export default function ParentDashboardLoading() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-36 bg-gray-200 rounded-lg mb-2" />
            <div className="h-4 w-48 bg-gray-100 rounded" />
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
        </div>

        {/* Stats (3 cards) */}
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-4 text-center space-y-2">
              <div className="h-8 w-10 bg-gray-200 rounded mx-auto" />
              <div className="h-3 w-20 bg-gray-200 rounded mx-auto" />
            </div>
          ))}
        </div>

        {/* My requirements card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">
          <div className="h-5 w-28 bg-gray-200 rounded" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-14 bg-gray-100 rounded-full" />
                <div className="h-5 w-14 bg-gray-100 rounded-full" />
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
              <div className="flex gap-3">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Tutor applications card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-40 bg-gray-100 rounded" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-5 w-14 bg-gray-100 rounded-full" />
              </div>
              <div className="h-3 w-48 bg-gray-100 rounded" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>

        {/* Sent bookings card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-4">
          <div className="h-5 w-24 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-36 bg-gray-100 rounded" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-5 w-14 bg-gray-100 rounded-full" />
              </div>
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
