export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
      <div className="container mx-auto px-4 lg:px-6 py-10 space-y-12">
        {/* Artist Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-40 h-40 rounded-full bg-white/10 animate-pulse" />

          <div className="flex flex-col space-y-3 w-full max-w-md">
            <div className="h-6 w-64 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-48 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-32 bg-white/10 rounded animate-pulse" />
          </div>
        </div>

        {/* Albums Section */}
        <div className="space-y-6">
          <div className="h-6 w-40 bg-white/20 rounded animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(8)].map((_, idx) => (
              <div
                key={idx}
                className="w-full aspect-square bg-white/10 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
