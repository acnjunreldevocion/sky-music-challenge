import { Entry } from "@/lib/types"
import ArtistCard from "./ArtistCard"
import { getUniqueArtist } from "@/lib/utils"

const ArtistGrid = ({ albums }: { albums: Entry[] }) => {

  const artist = getUniqueArtist(albums)

  return (
    <div
      className="flex gap-6 overflow-x-scroll overflow-y-hidden hide-scrollbar"
    >
      {artist.map((album, idx) => (
        <ArtistCard key={idx} album={album} />
      ))}
    </div>
  )
}

export default ArtistGrid