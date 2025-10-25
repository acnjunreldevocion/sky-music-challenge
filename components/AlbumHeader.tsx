
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { Entry } from '@/lib/types'
import { format } from 'date-fns'
import Link from 'next/link'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

interface AlbumHeaderProps {
  album?: Entry
}

const AlbumHeader = ({ album }: AlbumHeaderProps) => {
  if (!album) return null
  const image = album["im:image"]?.[2]?.label
  const link = album?.link?.attributes?.href
  const title = album["im:name"]?.label
  const artist = album["im:artist"]?.label
  const price = album["im:price"]?.label
  const id = album['id'].attributes['im:id']
  const releaseDate = format(new Date(album["im:releaseDate"]?.label), "MMMM d, yyyy")

  return (
    <div className="w-full bg-linear-to-r from-sky-900/6 via-sky-800/4 to-transparent rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md ring-1 ring-white/6" data-testid="album-header">
      <div className="relative shrink-0 space-y-2">
        <div className="relative w-44 h-44 md:w-52 md:h-52 overflow-hidden rounded-2xl ring-1 ring-white/8 shadow-xl">
          <Image
            src={image || PLACEHOLDER_IMAGE}
            alt={`Album cover for ${title}`}
            width={300}
            height={300}
            className="object-cover"
            priority
            fetchPriority="high"
            data-testid="album-cover-image"
          />
        </div>
        {price && (
          <span className="bg-[#0b1220]/60 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-white/6">
            {price}
          </span>
        )}
      </div>

      <div className="flex-1 w-full">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">{title}</h1>
            <Link
              data-testid="artist-link"
              href={`/artist/${id}`}
              aria-label={`Redirect to ${artist}`}
              className='hover:underline focus-visible:ring-2 focus-visible:ring-[#fd7f00] focus-visible:ring-offset-2'
            >
              <p className="text-sm text-sky-200 mt-1">{artist}</p>
            </Link>

            <p className="text-xs text-slate-300 mt-1">{releaseDate}</p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={link}
              target="_blank"
              data-testid="view-album-link"
              className="inline-flex items-center gap-2 text-sm text-white bg-transparent border border-white/10 px-3 py-2 rounded-full hover:bg-white/5 transition focus-visible:ring-2 focus-visible:ring-[#fd7f00] focus-visible:ring-offset-2"
              aria-label={`View album ${title}`}
            >
              <ExternalLink size={14} />
              View
            </Link>
          </div>
        </div>

        <p className="mt-4 text-sm text-slate-300 max-w-xl">
          {artist} — {title}. Explore tracks, artwork and release details. Use Play to preview or View for the full album page.
        </p>
      </div>
    </div>
  )
}

export default AlbumHeader