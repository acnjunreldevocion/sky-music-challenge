'use client';

import { SearchIcon, X, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Entry } from '@/lib/types';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image'

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
}

const categories: SearchCategory[] = ['all', 'albums', 'artists', 'latest'];

const SearchBar = ({ albums = [], onSearch }: SearchBarProps) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [showPopover, setShowPopover] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(search, 300);

  // Filter suggestions with useMemo
  const suggestions = useMemo(() => {
    if (!debouncedSearch.trim()) return {} as Record<SearchCategory, Suggestion[]>;

    const searchLower = debouncedSearch.toLowerCase();
    return categories.reduce((acc, category) => {
      const filtered = albums
        .filter(album => {
          const name = album['im:name']?.label?.toLowerCase() || '';
          const artist = album['im:artist']?.label?.toLowerCase() || '';
          const releaseYear = new Date(album['im:releaseDate']?.label).getFullYear();

          switch (category) {
            case 'all':
              return name.includes(searchLower) ||
                artist.includes(searchLower) ||
                releaseYear === new Date().getFullYear();
            case 'albums':
              return name.includes(searchLower);
            case 'artists':
              return artist.includes(searchLower);
            case 'latest':
              return releaseYear === new Date().getFullYear() &&
                (name.includes(searchLower) || artist.includes(searchLower));
            default:
              return false;
          }
        })
        .slice(0, 5)
        .map(album => ({
          id: album.id.attributes['im:id'],
          label: `${album['im:name']?.label} - ${album['im:artist']?.label}`,
          category,
          data: album
        }));

      if (filtered.length > 0) acc[category] = filtered;
      return acc;
    }, {} as Record<SearchCategory, Suggestion[]>);
  }, [albums, debouncedSearch]);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = Object.keys(suggestions).length > 0;

  // Handle selecting a suggestion
  const handleSelect = (suggestion: Suggestion) => {
    setSearch(suggestion.label);
    setActiveCategory(suggestion.category);
    setShowPopover(false);
    if (onSearch) onSearch(suggestion.label, suggestion.category);
  };

  // Handle Enter key to trigger onSearch
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      setShowPopover(false);
      if (onSearch) onSearch(search, activeCategory);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowPopover(true);
            }}
            onFocus={() => setShowPopover(true)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-10 py-2 rounded-xl text-sm bg-white/5 border-white/10 focus:border-white/20"
            placeholder="Search albums, artists, latest..."
            autoComplete="off"
          />
          {search && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="px-3 bg-white/5 border-white/10 hover:bg-white/10"
          onClick={() => setShowPopover(true)}
        >
          <Filter className="h-4 w-4 mr-2" />
          {activeCategory}
        </Button>
      </div>

      {showPopover && search && (
        <div className="text-white absolute top-full left-0 right-0 mt-2 bg-neutral-900 rounded-xl border border-white/10 shadow-xl z-50 max-h-96 overflow-auto">
          {/* Categories only display if there are results */}
          {hasResults && (
            <div className="sticky top-0 flex gap-1 p-2 bg-white/5 border-b border-white/10">
              {categories.map(cat => {
                if (!suggestions[cat]?.length) return null;
                return (
                  <Button
                    key={cat}
                    size="sm"
                    variant={cat === activeCategory ? 'default' : 'ghost'}
                    className={cn('px-3 capitalize')}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} ({suggestions[cat].length})
                  </Button>
                );
              })}
            </div>
          )}

          <div className="p-2 text-white">
            {hasResults && suggestions[activeCategory]?.length ? (
              <ul className="space-y-1">
                {suggestions[activeCategory].map(item => {
                  const album = item.data
                  const id = album.id?.attributes?.["im:id"]
                  const title = album["im:name"]?.label
                  const artist = album["im:artist"]?.label
                  const image = album["im:image"]?.[1]?.label
                  return <li
                    key={item.id}
                    onClick={() => handleSelect(item)}
                  >
                    <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      <div
                        key={id}
                        className="flex items-center justify-between gap-3 p-1.5 rounded hover:bg-white/5 transition cursor-pointer"
                      >
                        <Link
                          href={`/album/${id}`}
                          className="flex items-center gap-3 flex-1"
                        >
                          <Image
                            src={image}
                            alt={title}
                            width={40}
                            height={40}
                            className="rounded-md"
                          />
                          <div className="flex flex-col text-xs">
                            <span className="font-medium line-clamp-1">{title}</span>
                            <span className="text-gray-400 line-clamp-1">{artist}</span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </li>
                })}
              </ul>
            ) : (
              <p className="px-3 py-2 text-sm text-gray-400">
                No results found for &quot;{search}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
