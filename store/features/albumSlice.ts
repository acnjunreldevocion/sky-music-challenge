
import { Entry } from "@/lib/types/songs";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Album {
  items: Entry[]
}

const initialState: Album = {
  items: []
}

const albumSlice = createSlice({
  name: 'albums',
  initialState,
  reducers: {
    setAlbums: (state, action: PayloadAction<Entry[]>) => {
      state.items = action.payload
    },
  }
})

export const { setAlbums } = albumSlice.actions
export default albumSlice.reducer