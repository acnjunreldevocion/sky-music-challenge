import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AlbumCard from '@/components/AlbumCard'
import { Entry } from '@/lib/types'
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
    mockSelector.mockReturnValue([]) // Default: no favorites
  })

  describe('Error Handling', () => {
    it('handles null album data gracefully', () => {
      const { container } = render(<AlbumCard album={null as unknown as Entry} />)
      expect(container.firstChild).toBeNull()
    })

    it('handles malformed image array gracefully', () => {
      const malformedAlbum = {
        ...mockAlbum,
        'im:image': [{ label: 'wrong-index' }]
      } as unknown as Entry

      render(<AlbumCard album={malformedAlbum} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })

    it('handles missing price data gracefully', () => {
      const albumNoPrice = {
        ...mockAlbum,
        'im:price': undefined
      } as unknown as Entry

      render(<AlbumCard album={albumNoPrice} />)
      expect(screen.queryByText(/\$/)).not.toBeInTheDocument()
    })
  })

  describe('Redux State Management', () => {
    it('correctly identifies favorite status on rerender', () => {
      const { rerender } = render(<AlbumCard album={mockAlbum} />)

      let starButton = screen.getByRole('button')
      expect(starButton).toHaveAccessibleName('Add to favorites')

      mockSelector.mockReturnValue([mockAlbum])
      rerender(<AlbumCard album={mockAlbum} />)

      starButton = screen.getByRole('button')
      expect(starButton).toHaveAccessibleName('Remove from favorites')
    })

    it('maintains favorite state after multiple toggles', () => {
      render(<AlbumCard album={mockAlbum} />)
      const starButton = screen.getByRole('button')

      // First toggle
      fireEvent.click(starButton)
      expect(mockDispatch).toHaveBeenCalledTimes(1)

      // Second toggle
      fireEvent.click(starButton)
      expect(mockDispatch).toHaveBeenCalledTimes(2)
    })
  })

  describe('UI Interactions', () => {
    it('applies hover styles to card container', () => {
      render(<AlbumCard album={mockAlbum} />)
      const card = screen.getByTestId('card-album')
      expect(card).toHaveClass('hover:shadow-lg', 'hover:shadow-sky-900/30')
    })

    it('applies image hover effects', () => {
      render(<AlbumCard album={mockAlbum} />)
      const image = screen.getByRole('img')
      expect(image).toHaveClass('group-hover:opacity-80')
    })

    it('applies proper transition effects', () => {
      render(<AlbumCard album={mockAlbum} />)
      const card = screen.getByTestId('card-album')
      expect(card).toHaveClass('transition-all')
    })
  })

  describe('Layout and Styling', () => {
    it('maintains proper card dimensions', () => {
      render(<AlbumCard album={mockAlbum} />)
      const card = screen.getByTestId('card-album')
      expect(card).toHaveClass('min-h-[310px]', 'max-h-[310px]')
    })

    it('applies proper text styles', () => {
      render(<AlbumCard album={mockAlbum} />)

      const title = screen.getByText(mockAlbum['im:name'].label)
      expect(title).toHaveClass('font-semibold', 'text-white')

      const artist = screen.getByText(mockAlbum['im:artist'].label)
      expect(artist).toHaveClass('text-gray-200', 'line-clamp-1')
    })

    it('applies proper image container styles', () => {
      render(<AlbumCard album={mockAlbum} />)
      const imageContainer = screen.getByTestId('album-image')
      expect(imageContainer).toHaveClass('rounded', 'object-cover')
    })
  })

  describe('Performance Optimizations', () => {
    it('uses proper image loading attributes', () => {
      render(<AlbumCard album={mockAlbum} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('fetchpriority', 'high')
    })

    it('has proper transition classes for performance', () => {
      render(<AlbumCard album={mockAlbum} />)
      const card = screen.getByTestId('album-card-link')
      expect(card.className).toMatch(/transition-(?:all|transform)/)
    })
  })

  describe('Event Propagation', () => {
    it('prevents event bubbling on favorite button click', () => {
      render(<AlbumCard album={mockAlbum} />)

      const starButton = screen.getByRole('button', {
        name: /add to favorites|remove from favorites/i
      })

      // Create a synthetic event with preventDefault and stopPropagation
      const mockPreventDefault = jest.fn()
      const mockStopPropagation = jest.fn()
      const mockEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
      })

      // Add both preventDefault and stopPropagation methods
      Object.defineProperty(mockEvent, 'preventDefault', {
        value: mockPreventDefault
      })
      Object.defineProperty(mockEvent, 'stopPropagation', {
        value: mockStopPropagation
      })

      // Fire event with our mock
      fireEvent(starButton, mockEvent)

      // Verify both methods were called
      expect(mockPreventDefault).toHaveBeenCalled()
      expect(mockStopPropagation).toHaveBeenCalled()

      // Verify Redux action was dispatched
      expect(mockDispatch).toHaveBeenCalledTimes(1)
      expect(mockToggleFavorites).toHaveBeenCalledWith(mockAlbum)
    })
  })

  describe('Image optimization and fallback', () => {
    it('renders placeholder image when src is empty', () => {
      const albumNoImage = { ...mockAlbum, 'im:image': [] } as Entry
      render(<AlbumCard album={albumNoImage} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })

    it('renders correct alt text for album image', () => {
      render(<AlbumCard album={mockAlbum} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt', `Album cover for ${mockAlbum['im:name'].label}`)
    })
  })

  describe('Link and navigate', () => {
    it('renders correct link to album page', () => {
      render(<AlbumCard album={mockAlbum} />)
      const link = screen.getByTestId('album-card-link')
      expect(link).toHaveAttribute('href', `/album/${mockAlbum.id.attributes['im:id']}`)
    })
  })
})