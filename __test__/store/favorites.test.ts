import { Entry } from '@/lib/types/songs'
import favoritesReducer, { toggleFavorites } from '@/store/features/favoritesSlice'

const sampleAlbum1 = {
  id: { attributes: { 'im:id': '1' } },
  'im:name': { label: 'Album One' },
} as unknown as Entry

const sampleAlbum2 = {
  id: { attributes: { 'im:id': '2' } },
  'im:name': { label: 'Album Two' },
} as unknown as Entry

describe('favoritesSlice reducer', () => {
  it('has an initial state with items array', () => {
    const initialState = favoritesReducer(undefined, { type: '@@INIT' } as { type: string })
    expect(initialState).toBeDefined()
    expect(Array.isArray(initialState.items)).toBe(true)
  })

  it('adds an item when toggled and not present', () => {
    const initialState = favoritesReducer(undefined, { type: '@@INIT' } as { type: string })
    const stateAfterAdd = favoritesReducer(initialState, toggleFavorites(sampleAlbum1))
    expect(stateAfterAdd.items.length).toBe(1)
    expect(stateAfterAdd.items[0].id.attributes['im:id']).toBe('1')
    // ensure immutability
    expect(stateAfterAdd).not.toBe(initialState)
  })

  it('removes an item when toggled and already present', () => {
    const initialState = favoritesReducer(undefined, { type: '@@INIT' } as { type: string })
    const stateAfterAdd = favoritesReducer(initialState, toggleFavorites(sampleAlbum1))
    expect(stateAfterAdd.items.length).toBe(1)

    const stateAfterRemove = favoritesReducer(stateAfterAdd, toggleFavorites(sampleAlbum1))
    expect(stateAfterRemove.items.length).toBe(0)
  })

  it('can hold multiple items and toggle individually', () => {
    const initialState = favoritesReducer(undefined, { type: '@@INIT' } as { type: string })
    const s1 = favoritesReducer(initialState, toggleFavorites(sampleAlbum1))
    const s2 = favoritesReducer(s1, toggleFavorites(sampleAlbum2))
    expect(s2.items.length).toBe(2)
    // remove only one
    const s3 = favoritesReducer(s2, toggleFavorites(sampleAlbum1))
    expect(s3.items.length).toBe(1)
    expect(s3.items[0].id.attributes['im:id']).toBe('2')
  })
})