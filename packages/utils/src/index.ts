export type Nil = null | undefined

export function isNil(value: unknown): value is Nil {
  return value === null || value === undefined
}

export function isEmpty(value: unknown): boolean {
  if (isNil(value)) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (typeof value === 'object') return Object.keys(value as Record<string, unknown>).length === 0
  return false
}

export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('clamp: `min` cannot be greater than `max`.')
  }
  return Math.min(Math.max(value, min), max)
}

export async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms < 0) {
    throw new Error('sleep: duration must be a positive number.')
  }

  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)

    if (signal) {
      signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer)
          reject(signal.reason ?? new DOMException('sleep aborted', 'AbortError'))
        },
        { once: true },
      )
    }
  })
}

export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
