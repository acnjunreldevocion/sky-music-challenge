import Image from 'next/image'
import { Entry } from '@/lib/types/songs'
import Link from 'next/link'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'
import { Card } from '../ui/card'

interface ArtistAvatarProps {
  album: Entry
}

const ArtistCard = ({ album }: ArtistAvatarProps) => {

  const image = album['im:image']?.[2]?.label ?? PLACEHOLDER_IMAGE
  const width = album['im:image']?.[2]?.attributes?.height ?? 170
  const title = album['im:name']?.label
  const artist = album['im:artist']?.label
  const id = album['id'].attributes['im:id']

  return (
    <Link
      href={`/artist/${id}`}
      aria-label={`View artist for ${title}`}
      className="group outline-none focus-visible:ring-2 focus-visible:ring-[#fd7f00] focus-visible:ring-offset-2 rounded-xl transition w-fit block"
    >
      <Card className="border-0 shadow-none cursor-pointer group flex flex-col items-center bg-transparent hover:opacity-80 transition-all duration-300 ease-in-out w-fit">
        {/* Circular avatar */}
        <div className="relative w-fit rounded-full overflow-hidden shadow-lg">
          <Image
            src={image}
            alt={`Artist photo of ${artist}`}
            width={Number(width)}
            height={Number(width)}
            fetchPriority="high"
            className="object-cover"
            data-testid="artist-image"
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