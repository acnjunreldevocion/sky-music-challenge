import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Entry } from '@/lib/types/songs';
import SearchBar from '@/components/header/SearchBar';

// Mock the debounce hook so debounced value is immediate in tests
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: () => void) => value,
}));

describe('SearchBar Component', () => {
  const nowIso = new Date().toISOString();
  const albums = [
    {
      id: { attributes: { 'im:id': '1' } },
      'im:name': { label: 'Song One' },
      'im:artist': { label: 'Artist A' },
      'im:releaseDate': { label: nowIso },
      'im:image': [{}, { label: 'https://example.com/img1.jpg' }],
    },
    {
      id: { attributes: { 'im:id': '2' } },
      'im:name': { label: 'Old Song' },
      'im:artist': { label: 'Artist B' },
      'im:releaseDate': { label: '2000-01-01T00:00:00Z' },
      'im:image': [{}, { label: 'https://example.com/img2.jpg' }],
    },
  ] as unknown as Entry[];

  it('should open category dropdown and apply selected category to Filter button', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const filterButton = screen.getByRole('button', { name: /select category/i });
    expect(filterButton).toHaveTextContent(/all/i);

    await user.click(filterButton);
    const artistsButton = await screen.findByRole('menuitem', { name: /artists/i });
    await user.click(artistsButton);

    expect(filterButton).toHaveTextContent(/artists/i);
  });

  it('should display category chips with counts and apply filtering when switching categories', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.type(input, 'song');

    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    const latestChip = screen.getByRole('button', { name: /latest\s*\(1\)/i });
    await user.click(latestChip);

    await waitFor(() => {
      expect(screen.queryByText('Old Song')).not.toBeInTheDocument();
      expect(screen.getByText('Song One')).toBeInTheDocument();
    });
  });

  it('should clear the input and hide popover when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.type(input, 'song');

    const clearBtn = await screen.findByRole('button', { name: /clear search/i });
    await user.click(clearBtn);

    expect((input as HTMLInputElement).value).toBe('');
    await waitFor(() => expect(screen.queryByText('Song One')).not.toBeInTheDocument());
  });

  it('should trigger onSearch callback when a suggestion item is selected', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar albums={albums} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.type(input, 'song');

    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    const listItem = screen.getByText('Song One').closest('li');
    await user.click(listItem as HTMLElement);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Song One - Artist A', 'all');
    });
  });

  it('should trigger onSearch when Enter key is pressed with current input and category', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar albums={albums} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.type(input, 'Artist A{Enter}');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Artist A', 'all');
    });
  });

  it('should close popover and category menu when Escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.type(input, 'song');
    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    const filterToggle = screen.getByRole('button', { name: /select category/i });
    await user.click(filterToggle);
    await screen.findByRole('menuitem', { name: /artists/i });

    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByText('Song One')).not.toBeInTheDocument();
      expect(screen.queryByRole('menuitem', { name: /artists/i })).not.toBeInTheDocument();
    });
  });

  it('should close popover and category menu when clicking outside', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.type(input, 'song');
    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    const filterToggle = screen.getByRole('button', { name: /select category/i });
    await user.click(filterToggle);
    await screen.findByRole('menuitem', { name: /artists/i });

    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Song One')).not.toBeInTheDocument();
      expect(screen.queryByRole('menuitem', { name: /artists/i })).not.toBeInTheDocument();
    });
  });
});
