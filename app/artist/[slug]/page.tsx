
import { Entry } from "@/lib/types"
import HeroArtist from "@/components/HeroArtist"
import HeroArtistAlbums from "@/components/ArtistAlbums"
import ArtistAbout from "@/components/ArtistAbout"

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const artistId = (await params).slug

  const result = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
  const entryResult = await result.json()
  const entry = entryResult.feed.entry as Entry[]

  const album = entry.find(({ id }) => id.attributes["im:id"] === artistId)
  const artist = album?.["im:artist"].label

  const albums = entry.filter((value) => {
    return value["im:artist"].label.toLowerCase() === artist?.toLowerCase()
  })

  return (
    <main className="min-h-screen bg-linear-to-b from-[#fd7f00] to-[#000ef5] text-white">
      {/* HERO */}
      <HeroArtist album={album} />

      {/* CONTENT SECTIONS */}
      <HeroArtistAlbums albums={albums} />

      {/* ABOUT SECTION */}
      <ArtistAbout artist={album} />
    </main>
  )
}
