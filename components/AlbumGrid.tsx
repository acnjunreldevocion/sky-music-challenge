// AlbumGrid.tsx

import { Entry } from "@/lib/types";
import AlbumCard from "./AlbumCard";
import { getLatestSongs } from "@/lib/utils";


const AlbumGrid = ({ albums }: { albums: Entry[] }) => {

  const latestSongs = getLatestSongs(albums)
  return (
    <div
      className="flex gap-6 overflow-x-scroll hide-scrollbar pb-10"
    >
      {latestSongs.map((album, idx) => (
        <AlbumCard key={idx} album={album} />
      ))}
    </div>
  )
}

export default AlbumGrid
