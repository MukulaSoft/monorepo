import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const canUseDOM = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export type UsePrefersReducedMotionReturn = boolean

export function usePrefersReducedMotion(): UsePrefersReducedMotionReturn {
  const getInitialValue = () => (canUseDOM() ? window.matchMedia(QUERY).matches : false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getInitialValue)

  useEffect(() => {
    if (!canUseDOM()) return

    const mediaQuery = window.matchMedia(QUERY)
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
