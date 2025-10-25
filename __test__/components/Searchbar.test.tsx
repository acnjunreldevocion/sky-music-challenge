import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/SearchBar';
import { Entry } from '@/lib/types';

// Mock the debounce hook so debounced value is immediate in tests
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: () => void) => value,
}));

describe('SearchBar (enhanced)', () => {
  const nowIso = new Date().toISOString();
  const albums = [
    {
      id: { attributes: { 'im:id': '1' } },
      'im:name': { label: 'Song One' },
      'im:artist': { label: 'Artist A' },
      'im:releaseDate': { label: nowIso }, // current year -> latest
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

  it('opens category dropdown and selects a category (updates Filter button label)', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    // Filter button initially shows 'all'
    const filterButton = screen.getByRole('button', { name: /select category/i });
    expect(filterButton).toBeInTheDocument();
    expect(filterButton).toHaveTextContent(/all/i);

    // Click filter button to open category menu
    await user.click(filterButton);

    // Menu items should render
    const artistsButton = await screen.findByRole('menuitem', { name: /artists/i });
    expect(artistsButton).toBeInTheDocument();

    // Click 'artists' menuitem
    await user.click(artistsButton);

    // After selecting, the Filter button label should update to 'artists'
    expect(filterButton).toHaveTextContent(/artists/i);
  });

  it('shows category chips with counts and switching via chip filters results (latest)', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.click(input);
    await user.type(input, 'song');

    // Wait for suggestions to appear
    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    // Expect category chips to be present with counts, e.g., latest (1)
    const latestChip = screen.getByRole('button', { name: /latest\s*\(1\)/i });
    expect(latestChip).toBeInTheDocument();

    // Click the 'latest' chip to switch category
    await user.click(latestChip);

    // 'Old Song' (not latest) should not be visible; 'Song One' should be visible
    await waitFor(() => {
      expect(screen.queryByText('Old Song')).not.toBeInTheDocument();
      expect(screen.getByText('Song One')).toBeInTheDocument();
    });
  });

  it('clears the input when clear button is clicked and hides popover', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.click(input);
    await user.type(input, 'song');

    // Clear button should appear (aria-label="Clear search")
    const clearBtn = await screen.findByRole('button', { name: /clear search/i });
    expect(clearBtn).toBeInTheDocument();

    // Popover should show suggestions
    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    // Click clear button
    await user.click(clearBtn);

    // Input cleared
    expect((input as HTMLInputElement).value).toBe('');

    // Popover hidden
    await waitFor(() => {
      expect(screen.queryByText('Song One')).not.toBeInTheDocument();
    });
  });

  it('selecting a suggestion list item triggers onSearch with label and category', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar albums={albums} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.click(input);
    await user.type(input, 'song');

    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    // Click the list item container (li). The inner anchor prevents default navigation.
    const listItem = screen.getByText('Song One').closest('li');
    expect(listItem).toBeTruthy();
    await user.click(listItem as HTMLElement);

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('Song One - Artist A', 'all');
    });
  });

  it('pressing Enter triggers onSearch with current search and active category', async () => {
    const user = userEvent.setup();
    const onSearch = jest.fn();
    render(<SearchBar albums={albums} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.click(input);
    await user.type(input, 'Artist A{Enter}');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledTimes(1);
      expect(onSearch).toHaveBeenCalledWith('Artist A', 'all');
    });
  });

  it('pressing Escape closes the popover and category menu', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    // open popover and category menu
    await user.click(input);
    await user.type(input, 'song');
    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    const filterToggle = screen.getByRole('button', { name: /select category/i });
    await user.click(filterToggle);
    // ensure menu opened
    const menuItem = await screen.findByRole('menuitem', { name: /artists/i });
    expect(menuItem).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

    // Both popover and menu should be closed
    await waitFor(() => {
      expect(screen.queryByText('Song One')).not.toBeInTheDocument();
      expect(screen.queryByRole('menuitem', { name: /artists/i })).not.toBeInTheDocument();
    });
  });

  it('clicking outside closes popover and category menu', async () => {
    const user = userEvent.setup();
    render(<SearchBar albums={albums} />);

    const input = screen.getByPlaceholderText(/Search albums, artists, latest/i);
    await user.click(input);
    await user.type(input, 'song');
    await waitFor(() => expect(screen.getByText('Song One')).toBeInTheDocument());

    // open category menu
    const filterToggle = screen.getByRole('button', { name: /select category/i });
    await user.click(filterToggle);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /artists/i })).toBeInTheDocument());

    // Click outside using pointer event (component listens to pointerdown)
    fireEvent.pointerDown(document.body);

    await waitFor(() => {
      expect(screen.queryByText('Song One')).not.toBeInTheDocument();
      expect(screen.queryByRole('menuitem', { name: /artists/i })).not.toBeInTheDocument();
    });
  });
});