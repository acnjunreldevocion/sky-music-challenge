import { Entry } from '@/lib/types/songs'

const ArtistAbout = ({ artist }: { artist?: Entry }) => {
  if (!artist) return null
  return (
    <section className="container m-auto md:px-12 mt-12 border-t border-white/10 pt-8">
      <h2 className="text-xl font-semibold mb-2">About {artist['im:name'].label}</h2>
      <p className="text-sm text-slate-300 leading-relaxed">{artist.rights.label}</p>
    </section>
  )
}

export default ArtistAbout