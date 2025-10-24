
import ClientFavoritesSection from '@/components/ClientFavoriteSection'
import ConnectionError from '@/components/ConnectionError'
import SectionCard from '@/components/SectionCard'
import { SectionKey, TITLES } from '@/lib/constants'
import { getLatestSongs, getUniqueArtist } from '@/lib/helper'
import { fetchJSON } from '@/lib/services'
import { TopAlbums } from '@/lib/types'

export default async function Section({ params }: { params: Promise<{ slug: string }> }) {

  const slug = (await params).slug as unknown as SectionKey

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL in environment variables');
  }

  console.log(slug, 'slug')

  // ✅ Only fetch API for non-favorites pages
  if (slug === 'favorites-songs') {
    return <ClientFavoritesSection slug={slug} />
  }

  const albums = await fetchJSON<TopAlbums>(apiUrl)

  const entry = albums?.feed?.entry

  if (!entry) {
    return (
      <ConnectionError />
    );
  }


  let newEntry = getLatestSongs(entry)
  if (TITLES.artists.includes(slug)) {
    newEntry = getUniqueArtist(entry)
  }
  if (TITLES['favorites-songs'].includes(slug)) {
    newEntry = getLatestSongs(entry)
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
      <div className="container mx-auto px-4 lg:gap-2 lg:px-6 pt-10">
        <div className="p-6">
          <h1 className="font-bold text-3xl text-white pb-6">{TITLES[slug]}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 justify-items-center">
            {newEntry.map((album, idx) => (
              <SectionCard key={idx} slug={slug} entry={album} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
