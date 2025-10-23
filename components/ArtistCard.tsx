import Image from "next/image"
import { Entry } from "@/lib/types"
import { Card, CardContent } from "./ui/card"
import { format } from "date-fns"
import Link from "next/link"

interface ArtistAvatarProps {
  album: Entry
}

const ArtistCard = ({ album }: ArtistAvatarProps) => {

  const image = album["im:image"]?.[2]?.label
  const width = album["im:image"]?.[2]?.attributes?.height
  const title = album["im:name"]?.label
  const artist = album["im:artist"]?.label
  const id = album['id'].attributes['im:id']
  // const price = album["im:price"]?.label
  // const release = format(new Date(album["im:releaseDate"]?.label), "MMMM d, yyyy")
  // const genre = album.category?.attributes?.label
  // const link = album.link?.attributes?.href

  return (
    <Link
      href={`/artist/${id}`}
      aria-label={`View details for ${title}`}
      className="group outline-none focus-visible:ring-2 focus-visible:ring-[#fd7f00] focus-visible:ring-offset-2 rounded-xl transition w-fit block"
    >
      <Card className="border-0 shadow-none cursor-pointer group flex flex-col items-center bg-transparent hover:opacity-80 transition-all duration-300 ease-in-out w-fit">
        {/* Circular avatar */}
        <div className="relative w-fit rounded-full overflow-hidden shadow-lg">
          <Image
            src={image}
            alt={`Album cover for ${title}`}
            width={Number(width)}
            height={Number(width)}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold bg-linear-to-r bg-clip-text text-white">
            {artist}
          </h2>
        </div>
      </Card>
    </Link>
  )
}

export default ArtistCard