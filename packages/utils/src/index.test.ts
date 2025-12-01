import { describe, expect, it, vi } from 'vitest'
import { clamp, invariant, isEmpty, isNil, sleep } from './index'

describe('isNil', () => {
  it('detects nullish values', () => {
    expect(isNil(null)).toBe(true)
    expect(isNil(undefined)).toBe(true)
  })

  it('returns false for defined values', () => {
    expect(isNil(0)).toBe(false)
    expect(isNil('')).toBe(false)
  })
})

describe('isEmpty', () => {
  it('handles strings, arrays, and objects', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty(['item'])).toBe(false)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('handles maps and sets', () => {
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Map([['key', 'value']]))).toBe(false)
    expect(isEmpty(new Set())).toBe(true)
    expect(isEmpty(new Set([1]))).toBe(false)
  })
})

describe('clamp', () => {
  it('restricts values to bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })

  it('throws when min exceeds max', () => {
    expect(() => clamp(1, 10, 1)).toThrow(/min/)
  })
})

describe('sleep', () => {
  it('resolves after the given duration', async () => {
    vi.useFakeTimers()

    const promise = sleep(200)

    await vi.advanceTimersByTimeAsync(200)
    await expect(promise).resolves.toBeUndefined()

    vi.useRealTimers()
  })

  it('rejects when aborted', async () => {
    vi.useFakeTimers()

    const controller = new AbortController()
    const promise = sleep(1000, controller.signal)
    controller.abort()

    await expect(promise).rejects.toThrow(/aborted/i)

    vi.useRealTimers()
  })
})

describe('invariant', () => {
  it('does nothing when condition is truthy', () => {
    expect(() => invariant(true, 'message')).not.toThrow()
  })

  it('throws when condition is falsy', () => {
    expect(() => invariant(false, 'Required')).toThrow('Required')
  })
})
