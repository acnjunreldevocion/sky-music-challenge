import { Entry } from "@/lib/types";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";

const SectionCard = ({ slug, entry }: { slug: string, entry: Entry }) => {
  if (['latest-songs', 'favorite-songs'].includes(slug)) {
    return <AlbumCard album={entry} />
  }
  return <ArtistCard album={entry} />
}

export default SectionCard