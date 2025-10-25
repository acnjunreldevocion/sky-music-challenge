
'use client'

import { HouseIcon } from "lucide-react"
import Link from "next/link"
import { useAppSelector } from "@/hooks/redux"
import SearchBar from "./SearchBar"
import Favorites from "../favorites/Favorites"

const Header = () => {

  const entries = useAppSelector((items) => items.albums.items)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border" role="banner">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo / Title */}
        <Link href="/" aria-label="Current page">
          <h1 className="text-2xl font-semibold bg-linear-to-r from-[#fd7f00] to-[#000ef5] bg-clip-text text-transparent tracking-tight">
            Sky Music
          </h1>
        </Link>


        {/* Center Search (Hidden on mobile) */}
        <div className="hidden sm:flex flex-1 justify-center items-center gap-2 max-w-md">
          <Link href="/" className="hover:bg-gray-50 p-2" aria-label="Link to homepage">
            <HouseIcon size={24} className="text-muted-foreground" />
          </Link>
          <SearchBar albums={entries} />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <div className="sm:hidden">
            {/* Optional: search icon for mobile */}
            {/* <button
              aria-label="Search"
              className="p-2 rounded-xl hover:bg-accent transition"
            >
              <SearchIcon size={20} />
            </button> */}
            <SearchBar albums={entries} />
          </div>
          <Favorites />
        </div>
      </div>
    </header>

  )
}

export default Header