// ...existing code...
import {
  getUniqueArtist,
  getLatestSongs,
  slugify,
  loadFavorites,
  saveFavorites,
  checkFavoriteFromStorage,
} from '@/lib/helper'
import { Entry } from '@/lib/types'

describe('lib/helper', () => {
  beforeEach(() => {
    // clear localStorage for tests
    localStorage.clear()
    jest.clearAllMocks()
  })

  it('getUniqueArtist returns unique artists preserving first occurrence', () => {
    const albums = [
      { 'im:artist': { label: 'A' }, id: { attributes: { 'im:id': '1' } } },
      { 'im:artist': { label: 'B' }, id: { attributes: { 'im:id': '2' } } },
      { 'im:artist': { label: 'A' }, id: { attributes: { 'im:id': '3' } } },
    ] as unknown as Entry[]
    const res = getUniqueArtist(albums)
    expect(res).toHaveLength(2)
    expect(res[0]['im:artist'].label).toBe('A')
    expect(res[1]['im:artist'].label).toBe('B')
  })

  it('getLatestSongs returns items from current year only', () => {
    const now = new Date()
    const thisYear = now.getFullYear()
    const lastYear = thisYear - 1

    const albums = [
      { "im:releaseDate": { label: `${thisYear}-03-10T00:00:00-07:00` }, id: { attributes: { 'im:id': '1' } } },
      { "im:releaseDate": { label: `${lastYear}-05-01T00:00:00-07:00` }, id: { attributes: { 'im:id': '2' } } },
      { /* no releaseDate */ id: { attributes: { 'im:id': '3' } } },
    ] as unknown as Entry[]

    const latest = getLatestSongs(albums)
    expect(latest).toHaveLength(1)
    expect(latest[0].id.attributes['im:id']).toBe('1')
  })

  it('slugify produces safe kebab-case strings', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
    expect(slugify('Special @$%^ Chars')).toBe('special-chars')
  })

  it('saveFavorites and loadFavorites persist to localStorage', () => {
    const items = [{ id: { attributes: { 'im:id': '10' } }, 'im:name': { label: 'X' } }] as unknown as Entry[]
    expect(loadFavorites()).toBeNull()
    saveFavorites(items)
    const loaded = loadFavorites()
    expect(loaded).not.toBeNull()
    expect(Array.isArray(loaded)).toBe(true)
    expect(loaded?.[0]?.id.attributes['im:id']).toBe('10')
  })

  it('checkFavoriteFromStorage correctly detects favorites', () => {
    const favs = [{ id: { attributes: { 'im:id': '55' } } }] as unknown as Entry[]
    expect(checkFavoriteFromStorage(favs, '55')).toBe(true)
    expect(checkFavoriteFromStorage(favs, '99')).toBe(false)
    expect(checkFavoriteFromStorage(null as unknown as Entry[], '55')).toBe(false)
    expect(checkFavoriteFromStorage(favs, '')).toBe(false)
  })

  it('slugify edge cases', () => {
    expect(slugify('')).toBe('')
    expect(slugify('  ')).toBe('')
    expect(slugify('A B C')).toBe('a-b-c')
  })

  // --- Additional tests added below ---

  it('getUniqueArtist returns empty array for empty input', () => {
    const res = getUniqueArtist([] as unknown as Entry[])
    expect(Array.isArray(res)).toBe(true)
    expect(res).toHaveLength(0)
  })

  it('getLatestSongs returns multiple items for current year', () => {
    const thisYear = new Date().getFullYear()
    const albums = [
      { "im:releaseDate": { label: `${thisYear}-01-01T00:00:00-07:00` }, id: { attributes: { 'im:id': 'a' } } },
      { "im:releaseDate": { label: `${thisYear}-06-01T00:00:00-07:00` }, id: { attributes: { 'im:id': 'b' } } },
    ] as unknown as Entry[]

    const latest = getLatestSongs(albums)
    const ids = latest.map((i) => i.id.attributes['im:id'])
    expect(ids).toContain('a')
    expect(ids).toContain('b')
    expect(latest).toHaveLength(2)
  })

  it('getLatestSongs ignores malformed dates and does not throw', () => {
    const thisYear = new Date().getFullYear()
    const albums = [
      { "im:releaseDate": { label: 'not-a-date' }, id: { attributes: { 'im:id': 'x' } } },
      { "im:releaseDate": { label: `${thisYear}-02-02T00:00:00-07:00` }, id: { attributes: { 'im:id': 'y' } } },
    ] as unknown as Entry[]

    const latest = getLatestSongs(albums)
    expect(latest).toHaveLength(1)
    expect(latest[0].id.attributes['im:id']).toBe('y')
  })

  it('slugify handles numbers and unicode, normalizes and lowers', () => {
    expect(slugify('123 ABC Café')).toBe('123-abc-caf')
    expect(slugify('--Trim--Hyphens--')).toBe('trim-hyphens')
  })

  it('saveFavorites overwrites previous saved favorites', () => {
    const first = [{ id: { attributes: { 'im:id': '1' } } }] as unknown as Entry[]
    const second = [{ id: { attributes: { 'im:id': '2' } } }] as unknown as Entry[]

    saveFavorites(first)
    expect(loadFavorites()?.[0]?.id?.attributes?.['im:id']).toBe('1')

    saveFavorites(second)
    expect(loadFavorites()?.[0]?.id?.attributes?.['im:id']).toBe('2')
  })

  it('loadFavorites returns null for invalid JSON in storage', () => {
    // write invalid JSON to the favorites key
    localStorage.setItem('favorites', 'not-a-json')
    const loaded = loadFavorites()
    expect(loaded).toBeNull()
  })

  it('checkFavoriteFromStorage returns false for non-string ids and missing structure', () => {
    const favs = [{ id: { attributes: { 'im:id': '77' } } }] as unknown as Entry[]
    expect(checkFavoriteFromStorage(favs, 77 as unknown as string)).toBe(false)
    expect(checkFavoriteFromStorage(undefined as unknown as Entry[], '77')).toBe(false)
    // malformed favorite item
    const malformed = [{}] as unknown as Entry[]
    expect(checkFavoriteFromStorage(malformed, '77')).toBe(false)
  })
})