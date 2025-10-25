'use client';

import { useAppDispatch } from "@/hooks/redux";
import { Entry } from "@/lib/types/songs";
import { setAlbums } from "@/store/features/albumSlice";
import { loadFavoritesFromStorage } from "@/store/features/favoritesSlice";
import { useEffect } from "react";

export default function ReduxHydrator({ entries }: { entries: Entry[] }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate the Redux store with server-fetched entries on first mount
    if (entries && entries.length > 0) {
      dispatch(setAlbums(entries));
      dispatch(loadFavoritesFromStorage())
    }

    // We intentionally do not clear entries on unmount
  }, [dispatch, entries]);

  return null; // no UI
}