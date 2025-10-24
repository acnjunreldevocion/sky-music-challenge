import { Entry } from '@/lib/types'
import AlbumCard from './AlbumCard'

const HeroArtistAlbums = ({ albums }: { albums: Entry[] }) => {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Albums</h2>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4">
        {albums.map((album, idx) => (
          <div key={idx} className='min-w-[170px] max-w-[170px]'>
            <AlbumCard key={idx} album={album} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroArtistAlbums