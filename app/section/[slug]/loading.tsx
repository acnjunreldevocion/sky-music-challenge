export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
      <div className="container mx-auto px-4 lg:px-6 py-10">
        <div className="space-y-8">
          {/* Section Title */}
          <div className="h-8 w-64 bg-white/20 rounded animate-pulse" />

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 justify-items-center">
            {[...Array(16)].map((_, idx) => (
              <div key={idx} className="w-full max-w-[150px] space-y-3">
                <div className="aspect-square bg-white/10 rounded-lg animate-pulse" />
                <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
