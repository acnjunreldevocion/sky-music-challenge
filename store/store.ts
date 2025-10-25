import { configureStore } from "@reduxjs/toolkit"
import favoritesReducer from "./features/favoritesSlice"
import albumReducer from "./features/albumSlice"

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    albums: albumReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
