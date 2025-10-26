import { render, screen, fireEvent } from '@testing-library/react'
import { SuggestionsPopoverProps } from '@/components/header/searchbar/SuggestionsPopover'
import SearchBar from '@/components/header/searchbar'
import { CategoryPopoverProps } from '@/components/header/searchbar/CategoryPopover'
import { Suggestion } from '@/lib/types/search'

// Mock external deps
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (v: string) => v
}))

jest.mock('@/lib', () => ({
  buildSuggestionsManual: jest.fn(() => [
    { id: '1', label: 'Mock Album - Mock Artist', category: 'albums' }
  ])
}))

// Mock child components
jest.mock('@/components/header/searchbar/CategoryPopover', () => ({
  __esModule: true,
  default: ({ activeCategory, handleCategorySelect }: CategoryPopoverProps) => (
    <button
      aria-label="Select category"
      data-testid="category-button"
      onClick={() => handleCategorySelect('albums')}
    >
      {activeCategory}
    </button>
  ),
}))

jest.mock('@/components/header/searchbar/SuggestionsPopover', () => ({
  __esModule: true,
  default: ({
    handleSelect,
    handleClear,
  }: SuggestionsPopoverProps) => (
    <div>
      <button onClick={() => handleSelect({ label: 'Mock Album - Mock Artist', category: 'albums' } as unknown as Suggestion)}>
        Select suggestion
      </button>
      <button onClick={handleClear}>Clear</button>
    </div>
  ),
}))

describe('SearchBar', () => {
  const mockOnSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders input and placeholder correctly', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder="Search..." />)
    const input = screen.getByPlaceholderText('Search...')
    expect(input).toBeInTheDocument()
  })

  test('updates search value on input change', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'mock' } })
    expect(input).toHaveValue('mock')
  })

  test('handles Enter key and triggers search', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'mock album' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockOnSearch).toHaveBeenCalledWith('mock album', 'all')
  })

  test('handles Escape key and closes popover', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.keyDown(input, { key: 'Escape' })
    expect(input).toHaveAttribute('aria-expanded', 'false')
  })

  test('handles suggestion selection and triggers search', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByRole('combobox')

    fireEvent.change(input, { target: { value: 'mock' } })
    const suggestion = screen.getByText('Select suggestion')
    fireEvent.click(suggestion)

    expect(mockOnSearch).toHaveBeenCalledWith('Mock Album - Mock Artist', 'albums')
  })

  test('handles clear button click', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const input = screen.getByRole('combobox')

    // Enter text
    fireEvent.change(input, { target: { value: 'mock' } })

    // Click clear (mocked in SuggestionsPopover)
    const clearBtn = screen.getByText('Clear')
    fireEvent.click(clearBtn)

    expect(input).toHaveValue('')
  })

  test('changes category via CategoryPopover and triggers search', () => {
    render(<SearchBar onSearch={mockOnSearch} />)
    const categoryButton = screen.getByRole('button', { name: /select category/i })

    // Should trigger handleCategorySelect('albums')
    fireEvent.click(categoryButton)

    // Type a search term
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'mock album' } })

    // Press Enter to trigger onSearch with new category
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(mockOnSearch).toHaveBeenCalledWith('mock album', 'albums')
  })

})
