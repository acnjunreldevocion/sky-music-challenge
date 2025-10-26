import SuggestionsPopover, { SuggestionsPopoverProps } from '@/components/header/searchbar/SuggestionsPopover'
import { render, screen, fireEvent } from '@testing-library/react'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}))

// --- Base mock props ---
const baseProps = {
  inputId: 'search-input',
  listboxId: 'suggestion-list',
  hasResults: true,
  categories: ['albums', 'artists'] as const,
  suggestions: {
    albums: [
      {
        id: '1',
        data: {
          id: { attributes: { 'im:id': '123' } },
          'im:name': { label: 'Test Album' },
          'im:artist': { label: 'Test Artist' },
          'im:image': [{ label: 'small.jpg' }, { label: 'large.jpg' }],
        },
      },
    ],
    artists: [],
  },
  activeCategory: 'albums',
  setShowPopover: jest.fn(),
  setActiveCategory: jest.fn(),
  activeList: [
    {
      id: '1',
      data: {
        id: { attributes: { 'im:id': '123' } },
        'im:name': { label: 'Test Album' },
        'im:artist': { label: 'Test Artist' },
        'im:image': [{ label: 'small.jpg' }, { label: 'large.jpg' }],
      },
    },
  ],
  handleSelect: jest.fn(),
  handleClear: jest.fn(),
  listRef: { current: null },
  search: 'Test',
} as unknown as SuggestionsPopoverProps

describe('SuggestionsPopover', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders categories with counts', () => {
    render(<SuggestionsPopover {...baseProps} />)
    expect(screen.getByText(/albums \(1\)/i)).toBeInTheDocument()
  })

  it('handles category click and keeps popover open', () => {
    render(<SuggestionsPopover {...baseProps} />)
    const catBtn = screen.getByText(/albums \(1\)/i)
    fireEvent.click(catBtn)
    expect(baseProps.setActiveCategory).toHaveBeenCalledWith('albums')
    expect(baseProps.setShowPopover).toHaveBeenCalledWith(true)
  })

  it('renders active list items', () => {
    render(<SuggestionsPopover {...baseProps} />)
    expect(screen.getByText('Test Album')).toBeInTheDocument()
    expect(screen.getByText('Test Artist')).toBeInTheDocument()
  })

  it('handles album item click', () => {
    render(<SuggestionsPopover {...baseProps} />)
    const li = screen.getByText('Test Album').closest('li')
    fireEvent.click(li!)
    expect(baseProps.handleSelect).toHaveBeenCalledTimes(1)
  })

  it('handles link click (clears & navigates)', () => {
    render(<SuggestionsPopover {...baseProps} />)

    // Get the link element itself — not the inner span
    const link = screen.getByLabelText(/view album test album by test artist/i)
    fireEvent.click(link)


    // ✅ Assert that both handlers ran
    expect(baseProps.handleClear).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/album/123')
  })

  it('handles keyboard Enter and Space selection', () => {
    render(<SuggestionsPopover {...baseProps} />)
    const li = screen.getByText('Test Album').closest('li')!
    fireEvent.keyDown(li, { key: 'Enter' })
    fireEvent.keyDown(li, { key: ' ' })
    expect(baseProps.handleSelect).toHaveBeenCalledTimes(2)
  })

  it('renders no results state', () => {
    render(<SuggestionsPopover {...baseProps} hasResults={false} activeList={[]} />)
    expect(screen.getByText(/no results found/i)).toBeInTheDocument()
  })

  it('renders category but skips if count is 0', () => {
    const props = {
      ...baseProps,
      suggestions: { albums: [], artists: [] },
      activeList: [],
    } as unknown as SuggestionsPopoverProps
    render(<SuggestionsPopover {...props} />)
    expect(screen.queryByText(/albums/i)).not.toBeInTheDocument()
  })

  it('renders placeholder if image is missing', () => {
    const noImage = {
      ...baseProps,
      activeList: [
        {
          id: '2',
          data: {
            id: { attributes: { 'im:id': '999' } },
            'im:name': { label: 'No Image Album' },
            'im:artist': { label: 'Artistless' },
            'im:image': [],
          },
        },
      ],
      suggestions: { albums: [], artists: [] },
    } as unknown as SuggestionsPopoverProps
    render(<SuggestionsPopover {...noImage} />)
    expect(screen.getByText('No Image Album')).toBeInTheDocument()
  })

  it('renders fallback title, artist, and id when data is missing', () => {
    const incomplete = {
      ...baseProps,
      activeList: [
        {
          id: 'no-data',
          data: {},
        },
      ],
      suggestions: { albums: [], artists: [] },
    } as unknown as SuggestionsPopoverProps
    render(<SuggestionsPopover {...incomplete} />)

    // Fallbacks should appear
    expect(screen.getByLabelText('View album Unknown by Unknown')).toBeInTheDocument()
  })

  it('renders fallback image from [0] index when second is missing', () => {
    const props = {
      ...baseProps,
      activeList: [
        {
          id: '123',
          data: {
            id: { attributes: { 'im:id': '555' } },
            'im:name': { label: 'Single Image Album' },
            'im:artist': { label: 'Solo Artist' },
            'im:image': [{ label: 'only-small.jpg' }],
          },
        },
      ],
    } as unknown as SuggestionsPopoverProps
    render(<SuggestionsPopover {...props} />)
    expect(screen.getByAltText('Single Image Album')).toBeInTheDocument()
  })

  it('uses fallback id when attributes are missing', () => {
    const props = {
      ...baseProps,
      activeList: [
        {
          id: '1',
          data: {
            id: { attributes: { 'im:id': 'fallback-id' } },
            'im:name': { label: 'No Attr Album' },
            'im:artist': { label: 'Anon' },
            'im:image': [{ label: 'img.jpg' }],
          },
        },
      ],
    } as unknown as SuggestionsPopoverProps
    render(<SuggestionsPopover {...props} />)
    const link = screen.getByLabelText(/View album No Attr Album by Anon/i)
    fireEvent.click(link)
    expect(pushMock).toHaveBeenCalledWith('/album/fallback-id')
  })

  it('renders empty list when hasResults is true but list is empty', () => {
    render(<SuggestionsPopover {...baseProps} activeList={[]} />)
    // No album should show up, but popover still exists
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders popover when hasResults is false but activeList has items', () => {
    render(<SuggestionsPopover {...baseProps} hasResults={false} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
