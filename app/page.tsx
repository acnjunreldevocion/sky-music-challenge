
import { fetchJSON } from "@/lib/services";
import { TopAlbums } from "@/lib/types/songs";
import ReduxHydrator from "@/provider/ReduxHydrator";
import ArtistCard from "@/components/artists/ArtistCard";
import { getLatestSongs, getTrendingSongs, getUniqueArtist } from "@/lib";
import ConnectionError from "@/components/common/ConnectionError";
import { AlbumCard } from "@/components/album";
import { CardWrapper, HeadingTitle, ScrollContainer } from "@/components/common";


export default async function Home() {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
  }
  const albums = await fetchJSON<TopAlbums>(apiUrl)

  const entries = albums?.feed.entry

  if (!entries) {
    return (
      <ConnectionError />
    );
  }

  const sections = [
    {
      title: "Trending Songs",
      data: getTrendingSongs(entries),
      Component: AlbumCard
    },
    {
      title: "Artists",
      data: getUniqueArtist(entries),
      Component: ArtistCard
    },
    {
      title: "Latest Songs",
      data: getLatestSongs(entries),
      Component: AlbumCard
    },
  ]

  return (
    <>
      <ReduxHydrator entries={entries} />
      <main className="min-h-screen bg-linear-to-br from-[#fd7f00] via-[#1b1b1b] to-[#000ef5] text-white">
        <div className="container mx-auto px-4 lg:px-6 py-10 space-y-12">
          {sections.map(({ title, data, Component }) => (
            <section key={title} className="space-y-6">
              <HeadingTitle title={title} />
              <ScrollContainer>
                {data.map((album, idx) => (
                  <CardWrapper key={album.id?.attributes?.['im:id'] || idx} idx={idx}>
                    <Component album={album} />
                  </CardWrapper>
                ))}
              </ScrollContainer>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
