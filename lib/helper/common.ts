
import { isSameYear } from "date-fns"
import { Entry } from "../types/songs"

export function getUniqueArtist(albums: Entry[]) {
  const seen = new Set<string>()
  const artists = (albums ?? []).filter((album) => {
    const artist = album['im:artist']?.label
    if (artist && !seen.has(album['im:artist'].label)) {
      seen.add(album["im:artist"].label)
      return album
    }
  })
  return artists
}

export function getTrendingSongs(albums: Entry[]) {
  const trendingSongs = (albums ?? []).filter((album) => {
    const count = album["im:itemCount"].label ?? 0
    return Number(count) > 20
  })
  return trendingSongs
}

export function getLatestSongs(albums: Entry[]) {
  const now = new Date()
  const latestSongs = (albums ?? []).filter((album) => {
    const releaseDate = album["im:releaseDate"]?.label
    return releaseDate && isSameYear(releaseDate, now)
  })
  return latestSongs
}

export function slugify(str: string) {
  return str.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove special chars except letters, numbers, underscores, spaces, dashes
    .replace(/\s+/g, '-')       // replace spaces with single dash
    .replace(/-+/g, '-')        // collapse multiple dashes into one
    .replace(/^-+|-+$/g, '')    // remove leading and trailing dashes
}

export function loadFavorites(): Entry[] | null {
  if (typeof window === "undefined") return null
  try {
    const stored = localStorage.getItem("favorites")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveFavorites(items: Entry[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('favorites', JSON.stringify(items))
  }
}

export function checkFavoriteFromStorage(favorites: Entry[], id: string) {
  if (!id || (favorites ?? []).length <= 0) return false
  return !!favorites.find((favorite) => favorite?.id?.attributes["im:id"] === id)
}