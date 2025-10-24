
import { TopAlbums } from '@/lib/types'
import HeroArtist from '@/components/HeroArtist'
import HeroArtistAlbums from '@/components/ArtistAlbums'
import ArtistAbout from '@/components/ArtistAbout'
import { fetchJSON } from '@/lib/services'
import ConnectionError from '@/components/ConnectionError'

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const artistId = (await params).slug

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL in environment variables');
  }


  const albumsResult = await fetchJSON<TopAlbums>(apiUrl)

  const entry = albumsResult?.feed?.entry

  if (!entry) {
    return (
      <ConnectionError />
    );
  }

  const album = entry.find(({ id }) => id.attributes['im:id'] === artistId)
  const artist = album?.['im:artist'].label

  const albums = entry.filter((value) => {
    return value['im:artist'].label.toLowerCase() === artist?.toLowerCase()
  })

  return (
    <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
      <div className="container mx-auto px-4 lg:gap-2 lg:px-6">
        {/* HERO */}
        <HeroArtist album={album} />

        {/* CONTENT SECTIONS */}
        <HeroArtistAlbums albums={albums} />

        {/* ABOUT SECTION */}
        <ArtistAbout artist={album} />
      </div>
    </main>
  )
}
