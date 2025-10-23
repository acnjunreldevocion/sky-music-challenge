
import SectionCard from "@/components/SectionCard"
import { SectionKey, TITLES } from "@/lib/constants"
import { Entry } from "@/lib/types"
import { getLatestSongs, getUniqueArtist } from "@/lib/utils"

export default async function Section({ params }: { params: Promise<{ slug: string }> }) {

  const slug = (await params).slug as unknown as SectionKey
  const result = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
  const albums = await result.json()
  const entry = albums.feed.entry as Entry[]

  let newEntry = getLatestSongs(entry)
  if (TITLES.artist.includes(slug)) {
    newEntry = getUniqueArtist(entry)
  }
  if (TITLES["favorites-songs"].includes(slug)) {
    newEntry = getLatestSongs(entry)
  }

  return (
    <main className="bg-linear-to-r from-[#fd7f00] to-[#000ef5]">
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
