

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { format } from "date-fns"
import { Entry } from "@/lib/types"
import Link from "next/link"


interface AlbumCardProps {
  album: Entry
}

const AlbumCard = ({ album }: AlbumCardProps) => {
  const image = album["im:image"]?.[2]?.label
  const width = album["im:image"]?.[2]?.attributes?.height
  const title = album["im:name"]?.label
  const artist = album["im:artist"]?.label
  const price = album["im:price"]?.label
  const id = album['id'].attributes['im:id']
  // const release = format(new Date(album["im:releaseDate"]?.label), "MMMM d, yyyy")
  // const genre = album.category?.attributes?.label
  // const link = album.link?.attributes?.href

  return (
    <Link
      href={`/album/${id}`}
      aria-label={`View details for ${title}`}
      className="group outline-none focus-visible:ring-2 focus-visible:ring-[#fd7f00] focus-visible:ring-offset-2 rounded-xl transition w-fit block"
    >
      <Card className="group cursor-pointer shadow-none p-0 flex flex-col gap-4 border-none bg-transparent hover:shadow-lg hover:shadow-sky-900/30 transition-all w-fit min-h-[310px] max-h-[310px]">
        <div className="relative w-fit rounded">
          <Image
            src={image}
            alt={`Album cover for ${title}`}
            width={Number(width)}
            height={Number(width)}
            priority
            fetchPriority="high"
            className="object-cover transition-all duration-300 ease-in-out group-hover:opacity-80 rounded"
          />
        </div>

        <div className="space-y-1 p-2 w-fit">
          <h2 className="text-xs font-semibold bg-linear-to-r bg-clip-text text-white">
            {title}
          </h2>
          <p className="text-xs text-gray-200 line-clamp-1">{artist}</p>
          <p className="text-xs text-gray-300">
            {price}
          </p>
        </div>
      </Card>
    </Link>
  )
}

export default AlbumCard
