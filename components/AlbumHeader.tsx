import Image from 'next/image'
import { Button } from './ui/button'
import { ExternalLink, Plus } from 'lucide-react'
import { Entry } from '@/lib/types'
import { format } from 'date-fns'
import Link from 'next/link'

interface AlbumHeaderProps {
  album?: Entry
}

const AlbumHeader = ({ album }: AlbumHeaderProps) => {
  if (!album) return null
  const image = album["im:image"]?.[2]?.label
  const link = album.link.attributes.href
  const title = album["im:name"]?.label
  const artist = album["im:artist"]?.label
  const price = album["im:price"]?.label
  const id = album['id'].attributes['im:id']
  const releaseDate = format(new Date(album["im:releaseDate"]?.label), "MMMM d, yyyy")

  return (
    <div className="w-full bg-linear-to-r from-sky-900/6 via-sky-800/4 to-transparent rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md ring-1 ring-white/6">
      <div className="relative shrink-0 space-y-2">
        {/* <div className="absolute -left-6 -top-6 w-32 h-32 md:w-36 md:h-36 rounded-full bg-linear-to-tr from-[#fd7f00]/20 to-sky-700/8 blur-2xl pointer-events-none" /> */}
        <div className="relative w-44 h-44 md:w-52 md:h-52 overflow-hidden rounded-2xl ring-1 ring-white/8 shadow-xl">
          <Image
            src={image || ''}
            alt={`Album cover for ${title}`}
            width={300}
            height={300}
            className="object-cover"
            priority
            fetchPriority="high"
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
            <Link href={`/artist/${id}`} aria-label={`Redirect to ${artist}`} className='hover:underline'>
              <p className="text-sm text-sky-200 mt-1">{artist}</p>
            </Link>

            <p className="text-xs text-slate-300 mt-1">{releaseDate}</p>
          </div>

          <div className="flex items-center gap-3">

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
        </div>

        <p className="mt-4 text-sm text-slate-300 max-w-xl">
          {artist} — {title}. Explore tracks, artwork and release details. Use Play to preview or View for the full album page.
        </p>
      </div>
    </div>
  )
}

export default AlbumHeader