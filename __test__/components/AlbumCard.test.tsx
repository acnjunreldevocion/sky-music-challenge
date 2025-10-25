import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AlbumCard from '@/components/album/AlbumCard'
import { Entry } from '@/lib/types/songs'
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


describe('AlbumCard', () => {
  const mockAlbum = {
    id: { attributes: { 'im:id': '123' } },
    'im:name': { label: 'Test Album' },
    'im:artist': { label: 'Test Artist' },
    'im:price': { label: '$9.99' },
    'im:image': [
      {},
      {},
      { label: 'https://test-image.jpg', attributes: { height: '170' } }
    ]
  } as unknown as Entry

  beforeEach(() => {
    jest.clearAllMocks()
    mockSelector.mockReturnValue([])
  })

  describe('Error Handling', () => {
    it('renders nothing when album data is null', () => {
      const { container } = render(<AlbumCard album={null as unknown as Entry} />)
      expect(container.firstChild).toBeNull()
    })

    it('applies placeholder image when image array is malformed', () => {
      const malformedAlbum = { ...mockAlbum, 'im:image': [{ label: 'wrong-index' }] } as Entry
      render(<AlbumCard album={malformedAlbum} />)
      expect(screen.getByRole('img')).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })

    it('omits price display when price data is missing', () => {
      const albumNoPrice = { ...mockAlbum, 'im:price': undefined } as unknown as Entry
      render(<AlbumCard album={albumNoPrice} />)
      expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
    })
  })

  describe('Redux State Management', () => {
    it('applies correct favorite status after rerender', () => {
      const { rerender } = render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByRole('button')).toHaveAccessibleName('Add to favorites')

      mockSelector.mockReturnValue([mockAlbum])
      rerender(<AlbumCard album={mockAlbum} />)
      expect(screen.getByRole('button')).toHaveAccessibleName('Remove from favorites')
    })

    it('maintains favorite state after multiple toggles', () => {
      render(<AlbumCard album={mockAlbum} />)
      const starButton = screen.getByRole('button')

      fireEvent.click(starButton)
      fireEvent.click(starButton)
      expect(mockDispatch).toHaveBeenCalledTimes(2)
    })
  })

  describe('UI Interactions', () => {
    it('applies hover shadow styles to card container', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByTestId('card-album')).toHaveClass('hover:shadow-lg', 'hover:shadow-sky-900/30')
    })

    it('applies hover opacity effect to album image', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByRole('img')).toHaveClass('group-hover:opacity-80')
    })

    it('applies transition effects to card container', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByTestId('card-album')).toHaveClass('transition-all')
    })
  })

  describe('Layout and Styling', () => {
    it('maintains consistent card dimensions', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByTestId('card-album')).toHaveClass('min-h-[310px]', 'max-h-[310px]')
    })

    it('applies correct text styles to title and artist', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByText(mockAlbum['im:name'].label)).toHaveClass('font-semibold', 'text-white')
      expect(screen.getByText(mockAlbum['im:artist'].label)).toHaveClass('text-gray-200', 'line-clamp-1')
    })

    it('applies rounded corners and object-fit to image', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByTestId('album-image')).toHaveClass('rounded', 'object-cover')
    })
  })

  describe('Performance Optimizations', () => {
    it('applies correct image loading attributes', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByRole('img')).toHaveAttribute('fetchpriority', 'high')
    })

    it('applies transition classes for smooth rendering', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByTestId('album-card-link').className).toMatch(/transition-(?:all|transform)/)
    })
  })

  describe('Event Propagation', () => {
    it('prevents bubbling on favorite button click', () => {
      render(<AlbumCard album={mockAlbum} />)
      const starButton = screen.getByRole('button', { name: /add to favorites|remove from favorites/i })

      const mockPreventDefault = jest.fn()
      const mockStopPropagation = jest.fn()
      const mockEvent = new MouseEvent('click', { bubbles: true, cancelable: true })

      Object.defineProperty(mockEvent, 'preventDefault', { value: mockPreventDefault })
      Object.defineProperty(mockEvent, 'stopPropagation', { value: mockStopPropagation })

      fireEvent(starButton, mockEvent)

      expect(mockPreventDefault).toHaveBeenCalled()
      expect(mockStopPropagation).toHaveBeenCalled()
      expect(mockDispatch).toHaveBeenCalledTimes(1)
      expect(mockToggleFavorites).toHaveBeenCalledWith(mockAlbum)
    })
  })

  describe('Image Optimization and Fallback', () => {
    it('renders placeholder when image source is empty', () => {
      const albumNoImage = { ...mockAlbum, 'im:image': [] } as Entry
      render(<AlbumCard album={albumNoImage} />)
      expect(screen.getByRole('img')).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })

    it('renders descriptive alt text for album image', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByRole('img')).toHaveAttribute('alt', `Album cover for ${mockAlbum['im:name'].label}`)
    })
  })

  describe('Navigation', () => {
    it('applies correct link to album details page', () => {
      render(<AlbumCard album={mockAlbum} />)
      expect(screen.getByTestId('album-card-link')).toHaveAttribute('href', `/album/${mockAlbum.id.attributes['im:id']}`)
    })
  })
})
