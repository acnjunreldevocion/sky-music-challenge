'use client';

import { SearchIcon, X } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react"

const SearchBar = () => {

  const [search, setSearch] = useState<string>("")

  return (
    <div className="relative w-full">
      <form>
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <label htmlFor="album-search" className="sr-only">
          Search albums
        </label>
        <Input id="album-search" type="input" name="search" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 pr-3 py-2 text-sm rounded-xl" autoComplete="off" spellCheck={false} autoCorrect="off" />
        {search && <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => setSearch("")}
          name="search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </Button>}
      </form>
    </div>

  )
}

export default SearchBar