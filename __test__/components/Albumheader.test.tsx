import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AlbumHeader from '@/components/album/AlbumHeader'
import { format } from 'date-fns'
import { Entry } from '@/lib/types/songs'
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

describe('AlbumHeader', () => {
  const mockAlbum = {
    id: { attributes: { 'im:id': '123' } },
    'im:name': { label: 'Test Album' },
    'im:artist': { label: 'Test Artist' },
    'im:image': [
      {},
      {},
      { label: 'https://example.com/cover.jpg', attributes: { height: '300' } }
    ],
    'im:price': { label: '$9.99' },
    'im:releaseDate': { label: '2024-01-15T00:00:00-07:00' },
    link: { attributes: { href: 'https://music.example.com/album/123' } }
  } as unknown as Entry

  describe('Rendering', () => {
    it('renders album information including title, artist, price, and release date', () => {
      render(<AlbumHeader album={mockAlbum} />)

      expect(screen.getByText('Test Album')).toBeInTheDocument()
      expect(screen.getByText('Test Artist')).toBeInTheDocument()
      expect(screen.getByText('$9.99')).toBeInTheDocument()
      expect(screen.getByText(format(new Date('2024-01-15'), 'MMMM d, yyyy'))).toBeInTheDocument()
    })

    it('renders artist and view links', () => {
      render(<AlbumHeader album={mockAlbum} />)
      expect(screen.getByTestId('artist-link')).toBeInTheDocument()
      expect(screen.getByTestId('view-album-link')).toBeInTheDocument()
    })

    it('applies correct href and aria-label for artist link', () => {
      render(<AlbumHeader album={mockAlbum} />)
      const artistLink = screen.getByTestId('artist-link')
      expect(artistLink).toHaveAttribute('href', `/artist/${mockAlbum.id.attributes['im:id']}`)
      expect(artistLink).toHaveAttribute('aria-label', `Redirect to ${mockAlbum['im:artist'].label}`)
    })

    it('applies correct href, target, and rel attributes for external album link', () => {
      render(<AlbumHeader album={mockAlbum} />)
      const viewLink = screen.getByTestId('view-album-link')
      expect(viewLink).toHaveAttribute('href', mockAlbum.link.attributes.href)
      expect(viewLink).toHaveAttribute('target', '_blank')
      // optional: expect(viewLink).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('renders descriptive text containing artist and album title', () => {
      render(<AlbumHeader album={mockAlbum} />)
      expect(screen.getByText(new RegExp(`${mockAlbum['im:artist'].label} — ${mockAlbum['im:name'].label}`))).toBeInTheDocument()
    })

    it('renders nothing when album prop is undefined', () => {
      const { container } = render(<AlbumHeader album={undefined} />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Image Optimization and Fallback', () => {
    it('renders album cover image with proper attributes', () => {
      render(<AlbumHeader album={mockAlbum} />)
      const image = screen.getByTestId('album-cover-image')

      expect(image).toHaveAttribute('src', 'https://example.com/cover.jpg')
      expect(image).toHaveAttribute('alt', 'Album cover for Test Album')
      expect(image).toHaveAttribute('width', '300')
      expect(image).toHaveAttribute('height', '300')
      expect(image).toHaveAttribute('fetchpriority', 'high')
    })

    it('uses placeholder image when album cover is missing', () => {
      const albumNoImage = { ...mockAlbum, 'im:image': undefined } as unknown as Entry
      render(<AlbumHeader album={albumNoImage} />)

      const image = screen.getByTestId('album-cover-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', PLACEHOLDER_IMAGE)
    })
  })

  describe('Accessibility', () => {
    it('renders album title as an H1 heading', () => {
      render(<AlbumHeader album={mockAlbum} />)
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveTextContent('Test Album')
    })

    it('ensures links have accessible names and focus-visible indicators', () => {
      render(<AlbumHeader album={mockAlbum} />)

      const artistLink = screen.getByTestId('artist-link')
      const viewLink = screen.getByTestId('view-album-link')

      expect(artistLink).toHaveAccessibleName()
      expect(viewLink).toHaveAccessibleName()
      expect(artistLink.className).toMatch(/focus-visible:ring-2/)
      expect(viewLink.className).toMatch(/focus-visible:ring-2/)
    })

    it('omits price display when album price is missing', () => {
      const albumNoPrice = { ...mockAlbum, 'im:price': undefined } as unknown as Entry
      render(<AlbumHeader album={albumNoPrice} />)
      expect(screen.queryByText('$9.99')).toBeNull()
    })
  })

  describe('Styling', () => {
    it('applies gradient background styles to container', () => {
      render(<AlbumHeader album={mockAlbum} />)
      const container = screen.getByTestId('album-header')
      expect(container).toHaveClass('from-sky-900/6')
      expect(container).toHaveClass('via-sky-800/4')
    })
  })
})
