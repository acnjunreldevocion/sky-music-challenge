import { Entry } from '@/lib/types/songs'
import { AlbumCard } from '../album'

const HeroArtistAlbums = ({ albums }: { albums: Entry[] }) => {
  if ((albums ?? []).length <= 0) return null
  return (
    <section className="mt-12" data-testid="artist-album">
      <h2 className="text-2xl font-semibold mb-4">Albums</h2>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4" data-testid="album-cards">
        {albums.map((album, idx) => (
          <div key={idx} className='min-w-[170px] max-w-[170px]' data-testid={`card`}>
            <AlbumCard key={idx} album={album} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroArtistAlbums