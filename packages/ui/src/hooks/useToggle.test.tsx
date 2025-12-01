import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('returns default false when no initial value is provided', () => {
    const { result } = renderHook(() => useToggle())

    expect(result.current.value).toBe(false)
  })

  it('honors the provided initial value', () => {
    const { result } = renderHook(() => useToggle(true))

    expect(result.current.value).toBe(true)
  })

  it('toggles the value when toggle is called', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current.toggle()
    })

    expect(result.current.value).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.value).toBe(false)
  })

  it('sets the value explicitly', () => {
    const { result } = renderHook(() => useToggle())

    act(() => {
      result.current.set(true)
    })

    expect(result.current.value).toBe(true)
  })
})
