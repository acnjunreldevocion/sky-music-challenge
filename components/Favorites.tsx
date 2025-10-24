"use client"

import { StarIcon, X } from "lucide-react"
import { Button } from "./ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { toggleFavorites } from "@/store/features/favoritesSlice"
import Image from "next/image"
import Link from "next/link"
import { Entry } from "@/lib/types"

const Favorites = () => {
  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => state.favorites.items)

  const removeFavorite = (e: React.MouseEvent, album: Entry) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleFavorites(album))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="cursor-pointer flex items-center gap-"
        >
          Favorites
          <StarIcon size={14} className="text-yellow-200" />
          {(favorites ?? []).length > 0 && (
            <span className="ml-1 text-xs text-gray-300">
              ({favorites.length})
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 bg-neutral-900 text-white border border-gray-700 rounded-xl shadow-lg p-3"
      >
        <h4 className="text-sm font-semibold mb-2">Your Favorites</h4>

        {(favorites ?? []).length === 0 ? (
          <p className="text-xs text-gray-400">No favorites yet.</p>
        ) : (
          <>
            <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {(favorites ?? []).map((album) => {
                const id = album.id?.attributes?.["im:id"]
                const title = album["im:name"]?.label
                const artist = album["im:artist"]?.label
                const image = album["im:image"]?.[1]?.label

                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 p-1.5 rounded hover:bg-white/5 transition"
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

                    {/* Remove button */}
                    <button
                      onClick={(e) => removeFavorite(e, album)}
                      aria-label="Remove from favorites"
                      className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 transition"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* View All button */}
            <div className="pt-3 border-t border-gray-700 mt-3 flex justify-end">
              <Link href="/section/favorites-songs">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-xs bg-white/10 hover:bg-white/20 text-gray-200"
                >
                  View all
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

export default Favorites
