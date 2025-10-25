'use client'

import { useAppSelector } from '@/hooks/redux'
import { SectionKey, TITLES } from '@/lib/constants'
import { AlbumCard } from '../album'

interface Props {
  slug: string
}

export default function ClientFavoritesSection({ slug }: Props) {
  const favorites = useAppSelector((state) => state.favorites.items)

  return (
    <main className="bg-linear-to-r from-[#fd7f00] to-[#000ef5]">
      <div className="container mx-auto px-4 lg:gap-2 lg:px-6 pt-10">
        <div className="p-6">
          <h1 className="font-bold text-3xl text-white pb-6">{TITLES[slug as unknown as SectionKey]}</h1>
          {favorites.length === 0 ? (
            <p className="text-white">No favorites yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 justify-items-center">
              {favorites.map((album, idx) => (
                <AlbumCard album={album} key={idx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
