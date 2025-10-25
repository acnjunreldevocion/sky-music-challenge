// mock react-redux before importing the hooks module

import { useAppDispatch, useAppSelector } from '@/hooks/redux'

const mockDispatch = jest.fn()
const mockState = { user: { name: 'tester' }, settings: { theme: 'dark' } }

type MockStateType = typeof mockState

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: (e: MockStateType) => void) => selector(mockState),
}))


describe('hooks/redux exports', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('useAppDispatch returns the dispatch from react-redux and dispatches actions', () => {
    const dispatch = useAppDispatch()
    expect(dispatch).toBe(mockDispatch)

    const action = { type: 'TEST_ACTION', payload: 1 }
    dispatch(action)
    expect(mockDispatch).toHaveBeenCalledWith(action)
  })

  it('useAppSelector forwards selector to react-redux useSelector and returns selected slice', () => {
    const getUserName = (state: MockStateType) => state.user.name
    const name = useAppSelector(getUserName as never)
    expect(name).toBe('tester')

    const getTheme = (state: MockStateType) => state.settings.theme
    const theme = useAppSelector(getTheme as never)
    expect(theme).toBe('dark')
  })
})