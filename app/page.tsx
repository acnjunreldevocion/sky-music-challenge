
import AlbumCard from "@/components/AlbumCard";
import ArtistCard from "@/components/ArtistCard";
import CardWrapper from "@/components/common/CardWrapper";
import ScrollContainer from "@/components/common/ScrollContainer";
import ConnectionError from "@/components/ConnectionError";
import FavoriteSection from "@/components/FavoriteSection";
import HeadingTitle from "@/components/HeadingTitle";
import { getLatestSongs, getUniqueArtist } from "@/lib/helper";
import { fetchJSON } from "@/lib/services";
import { TopAlbums } from "@/lib/types";


export default async function Home() {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  if (!apiUrl) {
    throw new Error("Missing NEXT_PUBLIC_API_URL in environment variables");
  }
  const albums = await fetchJSON<TopAlbums>(apiUrl)

  const entry = albums?.feed.entry

  if (!entry) {
    return (
      <ConnectionError />
    );
  }

  const sections = [
    {
      title: "Latest Songs",
      data: getLatestSongs(entry),
      Component: AlbumCard
    },
    {
      title: "Artists",
      data: getUniqueArtist(entry),
      Component: ArtistCard
    },
  ]

  return (
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
        <FavoriteSection title="Favorites Songs" />
      </div>
    </main>
  );
}
