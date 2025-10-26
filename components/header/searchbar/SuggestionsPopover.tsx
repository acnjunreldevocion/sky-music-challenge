
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { SearchCategory, Suggestion } from '@/lib/types/search';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export interface SuggestionsPopoverProps {
  hasResults: boolean;
  categories: SearchCategory[];
  suggestions: Record<SearchCategory, Suggestion[]>;
  activeCategory: string;
  setShowPopover: (e: boolean) => void;
  setActiveCategory: (e: SearchCategory) => void;
  activeList: Suggestion[];
  handleSelect: (e: Suggestion) => void;
  handleClear: () => void;
  listRef: React.RefObject<HTMLUListElement | null>;
  search: string;
  inputId: string;
  listboxId: string;
}

const SuggestionsPopover = ({ inputId, listboxId, hasResults, categories, suggestions, activeCategory, setShowPopover, setActiveCategory, activeList, handleSelect, handleClear, listRef, search }: SuggestionsPopoverProps) => {
  const router = useRouter()

  return (
    <div
      className="text-white absolute top-full left-0 right-0 mt-2 bg-neutral-900 rounded-xl border border-white/10 shadow-xl z-50 max-h-96 overflow-auto"
      role="dialog"
      aria-label="Search suggestions"
      data-testid="suggestions-popover"
    >
      {/* Category chips (visible when results exist) */}
      {hasResults && (
        <div className="hidden sm:flex sticky top-0 gap-1 p-2 bg-white/5 border-b border-white/10">
          {categories.map((cat) => {
            const count = suggestions[cat]?.length ?? 0;
            if (!count) return null;
            return (
              <Button
                key={cat}
                size="sm"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setActiveCategory(cat);
                  // Keep popover visible
                  setShowPopover(true);
                }}
                className={cn(
                  'px-3 py-1 rounded-full text-xs capitalize transition cursor-pointer',
                  cat === activeCategory ? 'bg-primary' : 'bg-white/5'
                )}
                aria-pressed={cat === activeCategory}
              >
                {cat} ({count})
              </Button>
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
                      role='Link'
                      href="/"
                      className="flex items-center gap-3 flex-1"
                      aria-label={`View album ${title} by ${artist}`}
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
  )
}

export default SuggestionsPopover