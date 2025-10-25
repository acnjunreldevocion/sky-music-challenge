import { useDebounce } from '@/hooks/useDebounce'
import { renderHook, act } from '@testing-library/react'

jest.useFakeTimers()

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('test', 500))
    expect(result.current).toBe('test')
  })

  it('should debounce value changes', () => {
    let value = 'first'
    const { result, rerender } = renderHook(() => useDebounce(value, 500))

    // Update the value
    value = 'second'
    rerender()

    // Before timer, debouncedValue should still be initial
    expect(result.current).toBe('first')

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current).toBe('second')
  })

  it('should use default delay if not provided', () => {
    let value = 'init'
    const { result, rerender } = renderHook(() => useDebounce(value))

    value = 'updated'
    rerender()

    act(() => {
      jest.advanceTimersByTime(500) // default delay is 500ms
    })

    expect(result.current).toBe('updated')
  })

  it('should cancel previous timers on unmount', () => {
    const { unmount } = renderHook(() => useDebounce('hello', 500))
    unmount()

    // If timer is cleared correctly, nothing should throw or update after unmount
    act(() => {
      jest.advanceTimersByTime(500)
    })
  })
})
