import { render, screen, fireEvent } from '@testing-library/react'
import TrackList from '@/components/artists/TrackList'
import { useAppDispatch, useAppSelector } from '@/hooks/redux'
import { toggleFavorites } from '@/store/features/favoritesSlice'
import { Entry } from '@/lib/types/songs'

jest.mock('@/hooks/redux', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}))
jest.mock('@/store/features/favoritesSlice', () => ({
  toggleFavorites: jest.fn(),
}))

describe('TrackList', () => {
  const mockDispatch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
      ; (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch)
      ; (useAppSelector as jest.Mock).mockReturnValue([]) // empty favorites by default
  })

  it('renders null when relatedSongs is undefined', () => {
    const { container } = render(<TrackList relatedSongs={undefined as unknown as Entry[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders null when relatedSongs is empty', () => {
    const { container } = render(<TrackList relatedSongs={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('skips tracks without id', () => {
    const songs = [
      {
        id: { attributes: { 'im:id': '' } },
        'im:name': { label: 'No ID Song' },
      },
    ] as unknown as Entry[]
    const { container } = render(<TrackList relatedSongs={songs} />)
    // Should not render any links
    expect(container.querySelectorAll('a')).toHaveLength(0)
  })

  it('renders tracks correctly', () => {
    const songs = [
      {
        id: { attributes: { 'im:id': '123' } },
        'im:name': { label: 'Test Song' },
        'im:artist': { label: 'Test Artist' },
        'im:image': [{}, {}, { label: '/test.jpg' }],
      },
    ] as unknown as Entry[]

    render(<TrackList relatedSongs={songs} />)

    expect(screen.getByText('Songs')).toBeInTheDocument()
    expect(screen.getByText('Test Song')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
    expect(
      screen.getByRole('link')
    ).toHaveAttribute('href', '/album/123')
  })

  it('dispatches toggleFavorites when star is clicked', () => {
    const songs = [
      {
        id: { attributes: { 'im:id': '456' } },
        'im:name': { label: 'Favorite Song' },
        'im:artist': { label: 'Artist' },
        'im:image': [{}, {}, { label: '/fav.jpg' }],
      },
    ] as unknown as Entry[]

    render(<TrackList relatedSongs={songs} />)

    const button = screen.getByRole('button', { name: /add favorite/i })
    fireEvent.click(button)

    expect(mockDispatch).toHaveBeenCalledWith(toggleFavorites(songs[0]))
  })

  it('shows filled star when song is in favorites', () => {
    const song = {
      id: { attributes: { 'im:id': '789' } },
      'im:name': { label: 'Favorited Song' },
      'im:artist': { label: 'Artist' },
      'im:image': [{}, {}, { label: '/fav.jpg' }],
    } as unknown as Entry

      ; (useAppSelector as jest.Mock).mockReturnValue([song])

    render(<TrackList relatedSongs={[song]} />)

    const star = screen.getByRole('button', {
      name: /remove favorited song from favorites/i,
    })
    expect(star.className).toMatch(/bg-yellow-400/)
  })
})
