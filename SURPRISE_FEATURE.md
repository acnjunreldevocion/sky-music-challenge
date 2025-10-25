
# Surprise Feature — Favorites (+ Built-in Advanced Search Behavior)

This project includes a "Favorites" feature and a built-in (non‑Fuse) search implementation used by the SearchBar.

Summary
- Favorites: Users can mark/unmark albums as favorites. Favorites are stored in the client Redux store and persisted to localStorage so they survive reloads and offline visits. Export / import is supported via JSON.
- Search: The app uses a built-in, debounced, category-aware search (no Fuse.js). The search filters and ranks results using lightweight, deterministic logic (matching album title and artist, with a "latest" category that checks release year). This keeps bundle size small and behavior predictable.

Why this helps
- Favorites: Practical, offline-friendly, and simple to extend to server-sync later.
- Built-in Search: Avoids adding an extra dependency (Fuse.js) while remaining fast for a 100-item feed; easy to test and reason about.

Contents
- Implementation notes
- Integration guide
- Code examples (favorites slice, persistence helper, built-in search helper)
- Tests (unit-test examples)

---

## Implementation notes

Favorites
- Implemented as a Redux slice (`favoritesSlice`) with actions:
  - `toggleFavorites(entry: Entry)`
  - `clearFavorites()`
- Persisted to `localStorage` using a small persistence helper that hydrates the store on client mount and subscribes to changes to persist them.

Search (built-in)
- The search is client-side, debounced, and category-aware.
- Categories:
  - `all` — match title OR artist
  - `albums` — match title only
  - `artists` — match artist only
  - `latest` — only albums released in the current year and matching title or artist
- Filtering is implemented with:
  - Normalizing album fields (lowercasing title/artist, caching release year) to avoid repeated parsing of dates
  - A simple includes-based match for deterministic ordering
  - Result limits (e.g., top 5 per category)
- The SearchBar component handles:
  - Debouncing (via a `useDebounce` hook)
  - Category selection and UI
  - Keyboard accessibility and selection

Rationale for not using Fuse.js
- The dataset is small (100 albums), so lightweight string matching is performant and reduces bundle size and dependency surface.
- Built-in logic is easier to unit-test and to reason about for reproducible results.

---

## Integration guide

1. Add the favorites slice to your Redux store reducer:

```ts
// store.ts (reducer configuration)
import { configureStore } from "@reduxjs/toolkit"
import favoritesSlice from "./features/favoritesSlice"
import albumSlice from "./features/albumSlice"

export const store = configureStore({
  reducer: {
    favorites: favoritesSlice,
    albums: albumSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

```

2. Hydrate and persist favorites on client mount:

- Call `ReduxHydrator(store)` from a client-side Providers component (a wrapper mounted in `app/layout.tsx`) after the store is available.

```ts
// ReduxHydrator.tsx (client)
'use client';

import { useAppDispatch } from "@/hooks/redux";
import { Entry } from "@/lib/types";
import { setAlbums } from "@/store/features/albumSlice";
import { useEffect } from "react";

export default function ReduxHydrator({ entries }: { entries: Entry[] }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Hydrate the Redux store with server-fetched entries on first mount
    if (entries && entries.length > 0) {
      dispatch(setAlbums(entries));
    }
    // We intentionally do not clear entries on unmount
  }, [dispatch, entries]);

  return null; // no UI
}
```

3. Favorite toggle UI

- Add a small heart button on AlbumCard and album details which dispatches `toggleFavorite`.
- Use `useAppSelector` to read `state.favorites.items` to render a Favorites section.

4. Export / Import

- Export: stringify favorites and trigger a download (JSON).
- Import: validate JSON shape, then dispatch `setFavorites` (optionally show preview / confirm to avoid accidental overwrite).

---

## Code examples

Favorites slice (recommended)
```ts
// src/store/slices/favoritesSlice.ts
import { loadFavorites, saveFavorites } from "@/lib/helper";
import { Entry } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoritesState {
  items: Entry[]
}

const initialState: FavoritesState = {
  items: []
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    loadFavoritesFromStorage: (state) => {
      state.items = loadFavorites() as unknown as Entry[]
    },
    toggleFavorites: (state, action: PayloadAction<Entry>) => {

      if (!state.items) state.items = []

      const exist = state.items.find((item) => item.id.attributes["im:id"] === action.payload.id.attributes["im:id"])

      if (exist) {
        state.items = state.items.filter((item) => item.id.attributes["im:id"] !== action.payload.id.attributes["im:id"])
      } else {
        state.items.push(action.payload)
      }

      saveFavorites(state.items)
    },
    clearFavorites: (state) => {
      state.items = []
      saveFavorites([])
    }
  }
})

export const { toggleFavorites, clearFavorites, loadFavoritesFromStorage } = favoritesSlice.actions
export default favoritesSlice.reducer
```

Built-in search helper (the simple, dependency-free approach used in the app)
```ts
// src/lib/searchHelper.ts

import type { Entry } from '@/lib/types';

export type SearchCategory = 'all' | 'albums' | 'artists' | 'latest';
export type Suggestion = {
  id: string;
  label: string;
  category: SearchCategory;
  data: Entry;
};

export type NormalizeAlbums = {
  entry: Entry;
  name: string;
  artist: string;
  year: number | string;
  label: string;
  id: string;
  image: string;
}

export function buildSuggestionsManual(
  albums: NormalizeAlbums[],
  rawQuery: string,
  category: SearchCategory,
  limit = 5
): Suggestion[] {
  const query = (rawQuery || '').trim().toLowerCase();
  if (!query) return [];

  const currentYear = new Date().getFullYear();

  const candidates = albums
    .filter((candidate) => {
      const name = (candidate.name ?? '').toLowerCase();
      const artist = (candidate.artist ?? '').toLowerCase();
      const year = new Date(candidate.year ?? '').getFullYear();

      switch (category) {
        case 'all':
          return name.includes(query) || artist.includes(query);
        case 'albums':
          return name.includes(query);
        case 'artists':
          return artist.includes(query);
        case 'latest':
          return year === currentYear && (name.includes(query) || artist.includes(query));
        default:
          return false;
      }
    })
    .slice(0, limit)
    .map((album) => ({
      id: album.id,
      label: album.label,
      category,
      data: album.entry,
    }));

  return candidates;
}
```

---

## Tests

Favorites slice tests (unit tests) should cover:
- toggleFavorites (adds and prevents duplicates)
- setFavorites / clearFavorites

Search helper tests should cover:
- buildSuggestionsManual returns expected items for:
  - name matches
  - artist matches
  - latest category filtering
  - empty query returns empty array

Example test skeletons (Jest):
```ts
// favoritesSlice.test.ts - already included earlier in project
// searchHelper.test.ts - example
import { buildSuggestionsManual } from '@/lib/searchHelper';
import type { Entry } from '@/lib/types';

test('buildSuggestionsManual finds by name', () => {
  const albums: Entry[] = [
    { id: { attributes: { 'im:id': '1' } }, 'im:name': { label: 'Hello' }, 'im:artist': { label: 'A' }, 'im:releaseDate': { label: new Date().toISOString() } } as any
  ];
  const res = buildSuggestionsManual(albums, 'hello', 'all');
  expect(res.length).toBeGreaterThan(0);
});
```

---

## UX notes

- Favoriting is immediate and optimistic.
- Import flow should include a confirm step to avoid accidental overwrite.
- Built-in search provides predictable, explainable matches; it works well for a 100-item dataset and keeps bundle size small.

---

## Extensibility

- If you later want fuzzy matching or ranking improvements, you can swap `buildSuggestionsManual` for a Fuse.js-based implementation; the SearchBar API stays the same (albums, query, category → suggestions).
- Server-sync favorites: add authentication and a simple API (GET/POST favorites) to persist favorites across devices.
- Shareable favorites: upload exported favorites to a small paste/share service and generate a short link.

---

## Conclusion

This file documents the "Surprise Feature" as implemented: Favorites persisted in Redux + localStorage, and a built-in, dependency-free search used across the app. The implementation is simple, testable, and easy to extend later if you decide to add a fuzzy-search library or server-side sync.
