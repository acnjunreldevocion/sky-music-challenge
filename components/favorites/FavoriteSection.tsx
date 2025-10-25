'use client';

import ScrollContainer from "./common/ScrollContainer"
import HeadingTitle from "./HeadingTitle"
import AlbumCard from "./album/AlbumCard"
import { useEffect } from "react";
import CardWrapper from "./common/CardWrapper";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { loadFavoritesFromStorage } from "@/store/features/favoritesSlice";

const FavoriteSection = ({ title }: { title: string }) => {

  const dispatch = useAppDispatch()
  const favorites = useAppSelector((state) => state.favorites.items)

  useEffect(() => {
    dispatch(loadFavoritesFromStorage())
  }, [dispatch])

  if ((favorites ?? []).length <= 0) return null

  return (
    <section className="space-y-6">
      <HeadingTitle title={title} />
      <ScrollContainer>
        {
          (favorites ?? []).map((favorite, idx) => (
            <CardWrapper key={idx} idx={idx}>
              <AlbumCard album={favorite} />
            </CardWrapper>

          ))
        }
      </ScrollContainer>
    </section>
  )
}

export default FavoriteSection