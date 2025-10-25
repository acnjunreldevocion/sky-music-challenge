
import AlbumCard from '@/components/album/AlbumCard'
import ArtistCard from '@/components/artists/ArtistCard'
import ConnectionError from '@/components/common/ConnectionError'
import ClientFavoritesSection from '@/components/favorites/ClientFavoriteSection'
import { getLatestSongs, getTrendingSongs, getUniqueArtist } from '@/lib'
import { SectionKey, TITLES } from '@/lib/constants'
import { fetchJSON } from '@/lib/services'
import { TopAlbums } from '@/lib/types/songs'
import ReduxHydrator from '@/provider/ReduxHydrator'

export default async function Section({ params }: { params: Promise<{ slug: string }> }) {

  const slug = (await params).slug as unknown as SectionKey

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL in environment variables');
  }

  // ✅ Only fetch API for non-favorites pages
  if (slug === 'favorites-songs') {
    return <ClientFavoritesSection slug={slug} />
  }

  const albums = await fetchJSON<TopAlbums>(apiUrl)

  const entries = albums?.feed?.entry

  if (!entries) {
    return (
      <ConnectionError />
    );
  }

  const sections = [
    {
      title: "Trending Songs",
      path: 'trending-songs',
      data: getTrendingSongs(entries),
      Component: AlbumCard
    },
    {
      title: "Artists",
      path: 'artists',
      data: getUniqueArtist(entries),
      Component: ArtistCard
    },
    {
      title: "Latest Songs",
      path: 'latest-songs',
      data: getLatestSongs(entries),
      Component: AlbumCard
    },
  ]

  const section = sections.find((section) => section.path.includes(slug))

  if (!section) return null

  const Component = section?.Component
  const newEntry = section?.data

  return (
    <>
      <ReduxHydrator entries={entries} />
      <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
        <div className="container mx-auto px-4 lg:gap-2 lg:px-6 pt-10">
          <div className="p-6">
            <h1 className="font-bold text-3xl text-white pb-6">{TITLES[slug]}</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4 justify-items-center">
              {(newEntry ?? []).map((album, idx) => (
                Component && <Component album={album} key={idx} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>

  )
}
