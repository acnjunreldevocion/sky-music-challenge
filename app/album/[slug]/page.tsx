

import AlbumHeader from '@/components/AlbumHeader'
import ConnectionError from '@/components/ConnectionError'
import TrackList from '@/components/TrackList'
import { fetchJSON } from '@/lib/services'
import { TopAlbums } from '@/lib/types'
import ReduxHydrator from '@/provider/ReduxHydrator'

export default async function AlbumPage({ params }: { params: Promise<{ slug: string }> }) {
  const albumId = (await params).slug

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL in environment variables');
  }

  const albums = await fetchJSON<TopAlbums>(apiUrl)

  const entries = albums?.feed?.entry

  if (!entries) {
    return (
      <ConnectionError />
    );
  }

  const album = entries.find(({ id }) => id.attributes['im:id'] === albumId)
  const title = album?.title.label
  const artist = album?.['im:artist'].label

  const relatedSongs = entries.filter((value) => {
    return value['im:artist'].label === artist && title !== value.title.label
  })

  return (
    <>
      <ReduxHydrator entries={entries} />
      <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
        <div className="container m-auto text-white p-6 md:p-10">
          {/* Album Header */}
          <AlbumHeader album={album} />

          {/* Track List */}
          <TrackList relatedSongs={relatedSongs} />
        </div>
      </main>
    </>

  )
}
