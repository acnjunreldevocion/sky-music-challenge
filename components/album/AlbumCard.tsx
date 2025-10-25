'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Entry } from '@/lib/types/songs'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { toggleFavorites } from '@/store/features/favoritesSlice'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

interface AlbumCardProps {
  album: Entry
}

const AlbumCard = ({ album }: AlbumCardProps) => {

  const dispatch = useAppDispatch()
  const favorites = useAppSelector(({ favorites }) => favorites.items)

  const image = album?.['im:image']?.[2]?.label ?? PLACEHOLDER_IMAGE
  const width = album?.['im:image']?.[2]?.attributes?.height ?? 170
  const title = album?.['im:name']?.label
  const artist = album?.['im:artist']?.label
  const price = album?.['im:price']?.label
  const id = album?.['id']?.attributes?.['im:id']

  const isFavorited = useMemo(() => (
    (favorites ?? []).some((favorite) => favorite.id.attributes['im:id'] === id)
  ), [favorites, id])

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // prevent triggering the <Link> navigation
    if (album)
      dispatch(toggleFavorites(album))
  }

  if (!album) return null

  return (
    <Link
      href={`/album/${id}`}
      aria-label={`View details for ${title}`}
      data-testid="album-card-link"
      className="group outline-none focus-visible:ring-2 focus-visible:ring-[#fd7f00] focus-visible:ring-offset-2 rounded-xl transition-all w-fit block"
    >
      <Card data-testid="card-album" className="group cursor-pointer shadow-none p-0 flex flex-col gap-4 border-none bg-transparent hover:shadow-lg hover:shadow-sky-900/30 transition-all w-fit min-h-[310px] max-h-[310px]">
        <div className="relative w-fit rounded overflow-hidden">
          {/* Album Image */}
          <Image
            src={image}
            alt={`Album cover for ${title}`}
            width={Number(width)}
            height={Number(width)}
            data-testid="album-image"
            priority
            fetchPriority="high"
            className="object-cover transition-all duration-300 ease-in-out group-hover:opacity-80 rounded"
          />

          {/* Favorite Star */}
          <button
            onClick={toggleFavorite}
            data-testid="favorite-button"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition cursor-pointer"
          >
            <Star
              className={`h-4 w-4 transition ${isFavorited ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
            />
          </button>
        </div>

        <div className="space-y-1 p-2 w-fit">
          <h2 className="text-xs font-semibold bg-clip-text text-white">
            {title}
          </h2>
          <p className="text-xs text-gray-200 line-clamp-1">{artist}</p>
          <p className="text-xs text-gray-300">{price}</p>
        </div>
      </Card>
    </Link>
  )
}

export default AlbumCard
