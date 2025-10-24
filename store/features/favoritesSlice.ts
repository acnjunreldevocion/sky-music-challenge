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