import { Entry } from '@/lib/types'
import { UsersIcon, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const HeroArtist = ({ album }: { album?: Entry }) => {
  if (!album) return null
  const image = album["im:image"]?.[2]?.label
  const title = album["im:name"]?.label
  const artist = album["im:artist"]?.label
  const price = album["im:price"]?.label
  const id = album['id'].attributes['im:id']
  const link = album.link.attributes.href

  return (
    <section className="container m-auto relative flex flex-col md:flex-row items-center md:items-end gap-6 p-6 md:p-10 bg-linear-to-r from-sky-900/10 via-sky-800/5 to-transparent rounded-b-xl">
      <div className="relative flex items-center justify-center">
        {/* <div className="absolute -left-6 -top-6 w-36 h-36 md:w-44 md:h-44 rounded-full bg-linear-to-tr from-[#fd7f00]/20 to-sky-700/10 blur-2xl pointer-events-none" /> */}
        <div className="relative w-40 h-40 md:w-52 md:h-52 overflow-hidden rounded-full ring-1 ring-white/10 shadow-lg">
          <Image
            src={String(image)}
            alt={title || 'album cover'}
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="(max-width: 768px) 160px, 208px"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-sm md:text-lg text-sky-400 font-medium uppercase tracking-wider">
          {artist}
        </h2>
        <h1 className="mt-1 text-2xl md:text-4xl font-extrabold leading-tight">
          {title}
        </h1>

        <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 bg-white/3 px-3 py-1 rounded-full">
            <UsersIcon className="opacity-90" size={16} />
            <span>Artist</span>
          </span>

          {price && (
            <span className="inline-flex items-center gap-2 bg-white/3 px-3 py-1 rounded-full">
              <strong className="text-xs text-white">{price}</strong>
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href={`/album/${id}`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm text-white bg-transparent border border-white/10 hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fd7f00]"
            aria-label={`View album ${title}`}
          >
            View Album
          </Link>

          <Link
            href={link}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm text-white bg-transparent border border-white/10 px-3 py-2 rounded-full hover:bg-white/5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#fd7f00]"
            aria-label={`View album ${title}`}
          >
            <ExternalLink size={14} />
            View
          </Link>
        </div>

        <p className="mt-4 text-xs text-slate-400 max-w-md">
          Discover more from {artist}. Tap Play to start listening or View Album for details and tracks.
        </p>
      </div>
    </section>
  )
}

export default HeroArtist