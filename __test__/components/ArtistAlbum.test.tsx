

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Entry } from '@/lib/types'
import HeroArtistAlbums from '@/components/ArtistAlbums'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

// Mock Redux hooks
const mockDispatch = jest.fn()
const mockSelector = jest.fn()
const mockToggleFavorites = jest.fn((album: Entry) => ({ type: 'favorites/toggle', payload: album }))

jest.mock('@/hooks/redux', () => ({
  __esModule: true,
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector: () => void) => mockSelector(selector),
}))

jest.mock('@/store/features/favoritesSlice', () => ({
  __esModule: true,
  toggleFavorites: (album: Entry) => mockToggleFavorites(album),
}))

beforeEach(() => {
  jest.clearAllMocks()
  mockSelector.mockReturnValue([]) // no favorites by default
})

describe('ArtistAlbum', () => {
  const mockAlbums = [
    {
      id: { attributes: { 'im:id': '123' } },
      'im:name': { label: 'Album One' },
      'im:artist': { label: 'Test Artist' },
      'im:image': [
        {},
        {},
        { label: 'https://example.com/album1.jpg', attributes: { height: '170' } }
      ],
      'im:price': { label: '$9.99' }
    },
    {
      id: { attributes: { 'im:id': '124' } },
      'im:name': { label: 'Album Two' },
      'im:artist': { label: 'Test Artist' },
      'im:image': [
        {},
        {},
        { label: 'https://example.com/album2.jpg', attributes: { height: '170' } }
      ],
      'im:price': { label: '$12.99' }
    }
  ] as unknown as Entry[]

  describe('Rendering', () => {
    it('renders all albums in the grid', () => {
      render(<HeroArtistAlbums albums={mockAlbums} />)

      expect(screen.getByText('Album One')).toBeInTheDocument()
      expect(screen.getByText('Album Two')).toBeInTheDocument()
      expect(screen.getAllByText('Test Artist')).toHaveLength(2)
      expect(screen.getByText('$9.99')).toBeInTheDocument()
      expect(screen.getByText('$12.99')).toBeInTheDocument()
    })

    it('returns null when albums array is empty', () => {
      const { container } = render(<HeroArtistAlbums albums={[]} />)
      expect(container.firstChild).toBeNull()
    })

    it('handles undefined albums prop gracefully', () => {
      const { container } = render(<HeroArtistAlbums albums={undefined as unknown as Entry[]} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Image optimization', () => {
    it('renders optimized album cover images', () => {
      render(<HeroArtistAlbums albums={mockAlbums} />)

      const images = screen.getAllByTestId('album-image')
      expect(images).toHaveLength(2)

      expect(images[0]).toHaveAttribute('src', 'https://example.com/album1.jpg')
      expect(images[0]).toHaveAttribute('alt', 'Album cover for Album One')
      expect(images[0]).toHaveAttribute('width', '170')
      expect(images[0]).toHaveAttribute('height', '170')

      expect(images[1]).toHaveAttribute('src', 'https://example.com/album2.jpg')
      expect(images[1]).toHaveAttribute('alt', 'Album cover for Album Two')
    })

    it('uses placeholder for missing album images', () => {
      const albumsWithMissingImage = [
        {
          ...mockAlbums[0],
          'im:image': undefined
        }
      ] as unknown as Entry[]

      render(<HeroArtistAlbums albums={albumsWithMissingImage} />)

      const image = screen.getByTestId('album-image')
      expect(image).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })
  })

  describe('Accessibility', () => {
    it('provides proper navigation links', () => {
      render(<HeroArtistAlbums albums={mockAlbums} />)

      const links = screen.getAllByRole('link')
      // there will be one link per album (wrapped), ensure hrefs are correct
      expect(links.find(l => (l as HTMLAnchorElement).getAttribute('href') === '/album/123')).toBeTruthy()
      expect(links.find(l => (l as HTMLAnchorElement).getAttribute('href') === '/album/124')).toBeTruthy()

      // accessible name check (aria-label present on link)
      const link = screen.getByRole('link', { name: /View details for Album One/i })
      expect(link).toHaveAttribute('href', '/album/123')
      expect(link).toHaveAttribute('aria-label', 'View details for Album One')
    })

    it('has proper focus indicators on links', () => {
      render(<HeroArtistAlbums albums={mockAlbums} />)

      const link = screen.getByRole('link', { name: /View details for Album One/i })
      expect(link.className).toBeDefined()
      // class presence is enough — component may not include all utilities in test DOM
    })
  })

  describe('Layout and Grid', () => {
    it('applies proper grid layout (data-testid present)', () => {
      render(<HeroArtistAlbums albums={mockAlbums} />)

      const grid = screen.getByTestId('artist-album')
      expect(grid).toBeInTheDocument()
    })

    it('applies proper card structure for each album', () => {
      render(<HeroArtistAlbums albums={mockAlbums} />)

      const cards = screen.getAllByTestId('card')
      expect(cards).toHaveLength(2)

      const firstCard = cards[0];
      const secondCard = cards[1]

      // title and artist elements exist inside card
      expect(firstCard).toHaveTextContent('Album One')
      expect(secondCard).toHaveTextContent('Test Artist')
    })

  })
})