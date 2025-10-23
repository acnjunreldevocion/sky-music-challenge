import { Entry } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
import { Play } from "lucide-react"

const TrackList = ({ relatedSongs }: { relatedSongs: Entry[] }) => {
  if (!relatedSongs || relatedSongs.length === 0) return null

  return (
    <div className="pt-6">
      <h2 className="text-xl font-semibold mb-4">Songs</h2>

      <div className="space-y-2">
        {relatedSongs.map((track, index) => {
          const id = track.id?.attributes?.["im:id"]
          const title =
            track["im:name"]?.label || // feed entry style
            track.title?.label || // alternate shape used elsewhere
            "Untitled"
          const artist = track["im:artist"]?.label || ""
          const image = track["im:image"]?.[2]?.label || ""

          if (!id) return null

          return (
            <Link
              href={`/album/${id}`}
              key={id}
              className="group block rounded-lg transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fd7f00]"
              aria-label={`Open album for ${title}`}
            >
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs text-slate-400 w-6 text-right">{index + 1}</span>

                  <div className="relative w-10 h-10 rounded-md overflow-hidden shrink-0 bg-white/5">
                    {image ? (
                      <Image
                        src={image}
                        alt={title}
                        width={40}
                        height={40}
                        className="object-cover"
                        priority={false}
                        fetchPriority="low"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/6 flex items-center justify-center text-xs text-slate-400">
                        —
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-white">{title}</p>
                    {artist && <p className="text-xs text-slate-400 truncate">{artist}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    // onClick={(e) => e.preventDefault()}
                    aria-label={`Play ${title}`}
                    className="inline-flex items-center justify-center p-2 rounded-full bg-white/5 hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fd7f00]"
                  >
                    <Play size={14} />
                  </button>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TrackList