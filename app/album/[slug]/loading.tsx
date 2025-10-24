export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
      <div className="container mx-auto px-4 lg:px-6 py-10 space-y-10">
        {/* Album Header Skeleton */}
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Album Image */}
          <div className="w-48 h-48 bg-white/10 rounded-lg animate-pulse" />

          {/* Album Info */}
          <div className="flex flex-col space-y-3 w-full max-w-md">
            <div className="h-6 w-64 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />

            <div className="pt-4">
              <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Track List Section */}
        <div className="space-y-4">
          <div className="h-6 w-40 bg-white/20 rounded animate-pulse" />

          <div className="space-y-2">
            {[...Array(10)].map((_, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-white/5 rounded-lg p-3 animate-pulse"
              >
                <div className="flex gap-3 items-center">
                  <div className="h-4 w-4 bg-white/20 rounded" />
                  <div className="h-4 w-48 bg-white/20 rounded" />
                </div>
                <div className="h-4 w-12 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
