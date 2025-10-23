import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Entry } from "./types"
import { isSameYear } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')     // replace spaces with dashes
}  
