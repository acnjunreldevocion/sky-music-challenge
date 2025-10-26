import { Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Button } from "../../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchCategory } from "@/lib/types/search";

export interface CategoryPopoverProps {
  activeCategory: SearchCategory;
  handleCategorySelect: (e: SearchCategory) => void
  categories: SearchCategory[]
}

const CategoryPopover = ({ activeCategory, handleCategorySelect, categories }: CategoryPopoverProps) => {
  const [showCategories, setShowCategories] = useState(false)

  return (
    <div className="relative hidden sm:flex" data-testid="category-popover">
      <Popover open={showCategories} onOpenChange={setShowCategories}>
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
            {categories.map((cat) => (
              <li key={cat} role="none">
                <button
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCategorySelect(cat);
                    setShowCategories(false)
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
  )
}

export default CategoryPopover