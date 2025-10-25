import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ArtistCard from '@/components/ArtistCard'
import { Entry } from '@/lib/types'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

describe('ArtistCard', () => {
  const mockArtist = {
    id: { attributes: { 'im:id': '123' } },
    'im:name': { label: 'Test Album' },
    'im:artist': { label: 'Test Artist' },
    'im:image': [
      {},
      {},
      { label: 'https://example.com/artist.jpg', attributes: { height: '170' } }
    ],
    category: { attributes: { term: 'Pop' } }
  } as unknown as Entry

  describe('Rendering', () => {
    it('renders artist information correctly', () => {
      render(<ArtistCard album={mockArtist} />)

      expect(screen.getByText('Test Artist')).toBeInTheDocument()
    })

    it('renders link with correct href', () => {
      render(<ArtistCard album={mockArtist} />)

      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/artist/123')
      expect(link).toHaveAttribute('aria-label', "View artist for Test Album")
    })

    it('handles missing data gracefully', () => {
      const incompleteArtist = {
        id: { attributes: { 'im:id': '123' } },
        'im:artist': { label: 'Test Artist' }
      } as unknown as Entry

      render(<ArtistCard album={incompleteArtist} />)
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
      expect(screen.getByTestId('artist-image')).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })
  })

  describe('Image optimization', () => {
    it('renders optimized artist image', () => {
      render(<ArtistCard album={mockArtist} />)

      const image = screen.getByTestId('artist-image')
      expect(image).toHaveAttribute('src', 'https://example.com/artist.jpg')
      expect(image).toHaveAttribute('alt', 'Artist photo of Test Artist')
      expect(image).toHaveAttribute('width', '170')
      expect(image).toHaveAttribute('height', '170')
      expect(image).toHaveAttribute('fetchpriority', 'high')
    })

    it('uses placeholder for missing images', () => {
      const artistNoImage = {
        ...mockArtist,
        'im:image': undefined
      } as unknown as Entry

      render(<ArtistCard album={artistNoImage} />)

      const image = screen.getByTestId('artist-image')
      expect(image).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })
  })

  describe('Accessibility', () => {
    it('has proper focus indicators', () => {
      render(<ArtistCard album={mockArtist} />)

      const link = screen.getByRole('link')
      expect(link).toHaveClass(
        'focus-visible:ring-2',
        'focus-visible:ring-[#fd7f00]',
        'focus-visible:ring-offset-2'
      )
    })

    it('provides proper aria labels', () => {
      render(<ArtistCard album={mockArtist} />)

      expect(screen.getByRole('link')).toHaveAccessibleName(/Artist/i)
      expect(screen.getByRole('img')).toHaveAccessibleName(/Artist photo of Test Artist/i)
    })

    it('has proper heading hierarchy', () => {
      render(<ArtistCard album={mockArtist} />)

      const heading = screen.getByRole('heading', { level: 2 })
      expect(heading).toHaveTextContent('Test Artist')
    })
  })

  // describe('Visual styling and interactions', () => {
  //   it('applies hover effects', () => {
  //     render(<ArtistCard album={mockArtist} />)

  //     const card = screen.getByTestId('artist-card')
  //     expect(card).toHaveClass('hover:scale-[1.02]', 'transition-transform')
  //   })

  //   it('applies proper image styling', () => {
  //     render(<ArtistCard album={mockArtist} />)

  //     const imageContainer = screen.getByTestId('image-container')
  //     expect(imageContainer).toHaveClass(
  //       'rounded-full',
  //       'overflow-hidden',
  //       'aspect-square'
  //     )
  //   })
  // })
})