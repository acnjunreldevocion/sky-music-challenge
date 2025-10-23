

import AlbumHeader from "@/components/AlbumHeader"
import TrackList from "@/components/TrackList"
import { Entry } from "@/lib/types"

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {

  const albumId = (await params).slug

  const result = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
  const albums = await result.json()

  const entry = albums.feed.entry as Entry[]

  const album = entry.find(({ id }) => id.attributes["im:id"] === albumId)
  const title = album?.title.label
  const artist = album?.["im:artist"].label

  const relatedSongs = entry.filter((value) => {
    return value["im:artist"].label === artist && title !== value.title.label
  })

  return (
    <main className="min-h-screen bg-linear-to-r from-[#fd7f00] to-[#000ef5] ">
      <div className="container m-auto text-white p-6 md:p-10">
        {/* Album Header */}
        <AlbumHeader album={album} />

        {/* Track List */}
        <TrackList relatedSongs={relatedSongs} />
      </div>
    </main>
  )
}
