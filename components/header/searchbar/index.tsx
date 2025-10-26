'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchIcon, X, } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import type { Entry } from '@/lib/types/songs';
import { buildSuggestionsManual } from '@/lib';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { NormalizeAlbums, SearchCategory, Suggestion } from '@/lib/types/search';
import CategoryPopover from './CategoryPopover';
import SuggestionsPopover from './SuggestionsPopover';



interface SearchBarProps {
  albums?: Entry[];
  onSearch?: (term: string, category?: SearchCategory) => void;
  placeholder?: string;
  debounceMs?: number;
}

const CATEGORIES: SearchCategory[] = ['all', 'albums', 'artists', 'latest'];

function safeGetReleaseYear(album: Entry): number | null {
  const dateLabel = album?.['im:releaseDate']?.label;
  if (!dateLabel) return null;
  const year = new Date(dateLabel).getFullYear();
  return Number.isFinite(year) ? year : null;
}

function makeLabel(album: Entry) {
  const name = album?.['im:name']?.label ?? 'Unknown';
  const artist = album?.['im:artist']?.label ?? 'Unknown';
  return `${name} - ${artist}`;
}

export default function SearchBar({
  albums = [],
  onSearch,
  placeholder = 'Search albums, artists, latest...',
  debounceMs = 300,
}: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [showPopover, setShowPopover] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const debouncedSearch = useDebounce(search, debounceMs);

  // Normalize once for performance
  const normalizedAlbums = useMemo(() => {
    return albums.map((a, idx) => ({
      entry: a,
      name: (a['im:name']?.label ?? '').toLowerCase(),
      artist: (a['im:artist']?.label ?? '').toLowerCase(),
      year: safeGetReleaseYear(a),
      label: makeLabel(a),
      id: a?.id?.attributes?.['im:id'] ?? `album-${idx}`,
      image: a?.['im:image']?.[1]?.label ?? a?.['im:image']?.[0]?.label ?? undefined,
    }));
  }, [albums]);

  // Build suggestions grouped by category
  const suggestions = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return {} as Record<SearchCategory, Suggestion[]>;

    return CATEGORIES.reduce((acc, category) => {
      const filtered = buildSuggestionsManual(normalizedAlbums as unknown as NormalizeAlbums[], term, category);

      if (filtered.length) acc[category] = filtered;
      return acc;
    }, {} as Record<SearchCategory, Suggestion[]>);
  }, [debouncedSearch, normalizedAlbums]);

  const hasResults = Object.keys(suggestions).length > 0;
  const activeList = suggestions[activeCategory] ?? [];

  // Close popover/menu on outside click or Escape
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowPopover(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  // Trigger onSearch (safe wrapper)
  const triggerSearch = useCallback(
    (term: string, category?: SearchCategory) => {
      if (onSearch) onSearch(term, category);
    },
    [onSearch]
  );

  // Selecting a suggestion
  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      setSearch(suggestion.label);
      setActiveCategory(suggestion.category);
      setShowPopover(false);
      triggerSearch(suggestion.label, suggestion.category);
    },
    [triggerSearch]
  );

  const handleClear = useCallback(() => {
    setSearch('');
    setShowPopover(false);
    inputRef.current?.focus();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowPopover(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (search.trim()) {
          setShowPopover(false);
          triggerSearch(search, activeCategory);
        }
      } else if (e.key === 'ArrowDown') {
        // focus first suggestion if exists
        const first = listRef.current?.querySelector<HTMLLIElement>('li');
        first?.focus();
      } else if (e.key === 'Escape') {
        setShowPopover(false);
      }
    },
    [search, activeCategory, triggerSearch]
  );

  // Category menu click
  const handleCategorySelect = (cat: SearchCategory) => {
    setActiveCategory(cat);
    // If there's a current search, re-trigger search with new category so UI updates
    if (search.trim()) {
      triggerSearch(search, cat);
      // Keep the suggestions open to show filtered results
      setShowPopover(true);
    }
  };

  // Accessible ids (simple predictable ids; switch to useId if needed)
  const inputId = 'search-input';
  const listboxId = 'search-suggestions';

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id={inputId}
            ref={inputRef}
            type="text"
            value={search}
            onChange={handleInputChange}
            onFocus={() => setShowPopover(true)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-10 py-2 rounded-xl text-sm bg-white/5 border-white/10 focus:border-white/20"
            placeholder={placeholder}
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded={showPopover}
            aria-haspopup="listbox"
            role="combobox"
          />
          {search && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filter / category toggle (converted to shadcn-style Popover) */}
        <CategoryPopover activeCategory={activeCategory} categories={CATEGORIES} handleCategorySelect={handleCategorySelect} />
      </div>

      {/* Suggestions popover */}
      {showPopover && search && (
        <SuggestionsPopover
          handleClear={handleClear}
          hasResults={hasResults}
          activeCategory={activeCategory}
          handleSelect={handleSelect}
          listRef={listRef}
          search={search}
          activeList={activeList}
          setShowPopover={setShowPopover}
          categories={CATEGORIES}
          setActiveCategory={setActiveCategory}
          suggestions={suggestions}
          listboxId={listboxId}
          inputId={inputId}
        />
      )}
    </div>
  );
}