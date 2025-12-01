import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const getMediaQuery = () =>
  typeof globalThis !== 'undefined' && typeof globalThis.matchMedia === 'function'
    ? globalThis.matchMedia(QUERY)
    : undefined

export type UsePrefersReducedMotionReturn = boolean

export function usePrefersReducedMotion(): UsePrefersReducedMotionReturn {
  const getInitialValue = () => {
    const mediaQuery = getMediaQuery()
    return mediaQuery ? mediaQuery.matches : false
  }
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialValue)

  useEffect(() => {
    const mediaQuery = getMediaQuery()
    if (!mediaQuery) return

    const listener = () => setPrefersReducedMotion(mediaQuery.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', listener)
    } else {
      mediaQuery.addListener(listener)
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', listener)
      } else {
        mediaQuery.removeListener(listener)
      }
    }
  }, [])

  return prefersReducedMotion
}
