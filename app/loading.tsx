export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
      <div className="container mx-auto px-4 lg:px-6 py-10 space-y-12">
        {/* Repeat for each section (Latest Songs, Artists, etc.) */}
        {[...Array(2)].map((_, sectionIdx) => (
          <section key={sectionIdx} className="space-y-6">
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />

            {/* Scroll container */}
            <div className="flex space-x-4 overflow-x-auto">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="shrink-0 w-40 space-y-2"
                >
                  <div className="w-40 h-40 bg-white/10 rounded-lg animate-pulse" />
                  <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Favorites Skeleton */}
        <section className="space-y-6">
          <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="w-full aspect-square bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
