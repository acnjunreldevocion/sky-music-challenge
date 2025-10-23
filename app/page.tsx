
import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import HeadingTitle from "@/components/HeadingTitle";
import { Entry } from "@/lib/types";
import { getLatestSongs, getUniqueArtist } from "@/lib/utils";

export default async function Home() {

  const result = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
  const albums = await result.json()

  const entry = albums.feed.entry as Entry[]

  const latestSongs = getLatestSongs(entry)
  const artist = getUniqueArtist(entry)
  const favoritesSongs = getLatestSongs(entry)

  return (
    <main className="bg-linear-to-r from-[#fd7f00] to-[#000ef5]">
      <div className="container space-y-4 m-auto px-4 lg:gap-2 lg:px-6 pt-10">
        <div className="space-y-4">
          <HeadingTitle title={"Latest Songs"} />
          <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden hide-scrollbar pb-2 snap-x snap-mandatory pl-4"
          >
            {latestSongs.map((album, idx) => (
              <div key={idx} className="min-w-[170px] max-w-[170px]">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <HeadingTitle title={"Artist"} />
          <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden hide-scrollbar pb-2 snap-x snap-mandatory pl-4"
          >
            {artist.map((album, idx) => (
              <div key={idx} className="min-w-[170px] max-w-[170px]">
                <ArtistCard key={idx} album={album} />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <HeadingTitle title={"Favorites songs"} />
          <div
            className="flex gap-4 overflow-x-auto overflow-y-hidden hide-scrollbar pb-2 snap-x snap-mandatory pl-4"
          >
            {favoritesSongs.map((album, idx) => (
              <div key={idx} className="min-w-[170px] max-w-[170px]">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
