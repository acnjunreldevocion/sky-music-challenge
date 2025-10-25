'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SearchIcon, X, Filter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import type { Entry } from '@/lib/types/songs';
import { buildSuggestionsManual, NormalizeAlbums } from '@/lib';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { useRouter } from 'next/navigation';

type SearchCategory = 'all' | 'albums' | 'artists' | 'latest';
type Suggestion = {
  id: string;
  label: string;
  category: SearchCategory;
  data: Entry;
};

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

  const router = useRouter()

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
        <div className="relative hidden sm:flex">
          <Popover
            onOpenChange={(open) => {
              // setShowCategoryMenu(open);
              if (open) setShowPopover(true);
            }}
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="px-3 bg-white/5 border-white/10 hover:bg-white/10 flex items-center cursor-pointer"
                aria-label="Select category"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span className="capitalize">{activeCategory}</span>
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end" side="bottom" className="w-40 p-0 bg-neutral-900 border border-white/10 rounded shadow-lg z-50">
              <ul role="menu" className="p-2 space-y-1 text-white">
                {CATEGORIES.map((cat) => (
                  <li key={cat} role="none">
                    <button
                      role="menuitem"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategorySelect(cat);
                        // setShowCategoryMenu(false)
                        // setTimeout(() => setShowCategoryMenu(false), 50);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-1.5 rounded hover:bg-white/5 transition cursor-pointer',
                        cat === activeCategory ? 'bg-white/5 font-medium' : ''
                      )}
                    >
                      <span className="capitalize">{cat}</span>
                    </button>

                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Suggestions popover */}
      {showPopover && search && (
        <div
          className="text-white absolute top-full left-0 right-0 mt-2 bg-neutral-900 rounded-xl border border-white/10 shadow-xl z-50 max-h-96 overflow-auto"
          role="dialog"
          aria-label="Search suggestions"
        >
          {/* Category chips (visible when results exist) */}
          {hasResults && (
            <div className="hidden sm:flex sticky top-0 gap-1 p-2 bg-white/5 border-b border-white/10">
              {CATEGORIES.map((cat) => {
                const count = suggestions[cat]?.length ?? 0;
                if (!count) return null;
                return (
                  <button
                    key={cat}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setActiveCategory(cat);
                      // Keep popover visible
                      setShowPopover(true);
                    }}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs capitalize transition',
                      cat === activeCategory ? 'bg-white/20 font-medium' : 'bg-white/5'
                    )}
                    aria-pressed={cat === activeCategory}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="p-2 text-white">
            {hasResults && activeList.length ? (
              <ul
                id={listboxId}
                role="listbox"
                aria-labelledby={inputId}
                ref={listRef}
                className="space-y-1"
              >
                {activeList.map((item) => {
                  const album = item.data;
                  const id = album?.id?.attributes?.['im:id'] ?? item.id;
                  const title = album?.['im:name']?.label ?? 'Unknown';
                  const artist = album?.['im:artist']?.label ?? 'Unknown';
                  const image = album?.['im:image']?.[1]?.label ?? album?.['im:image']?.[0]?.label;

                  return (
                    <li
                      key={item.id}
                      tabIndex={0}
                      onClick={() => handleSelect(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(item);
                        }
                      }}
                      className="cursor-pointer rounded hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-3 p-2">
                        <Link
                          role='button'
                          href="/"
                          className="flex items-center gap-3 flex-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            handleClear()
                            router.push(`/album/${(id)}`)
                          }}
                        >
                          {image ? (
                            <Image src={image} alt={title} width={40} height={40} className="rounded-md" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-700" />
                          )}
                          <div className="flex flex-col text-xs">
                            <span className="font-medium line-clamp-1">{title}</span>
                            <span className="text-gray-400 line-clamp-1">{artist}</span>
                          </div>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="px-3 py-2 text-sm text-gray-400">No results found for &quot;{search}&quot;</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}