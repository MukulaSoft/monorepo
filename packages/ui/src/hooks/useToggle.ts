import { useCallback, useState } from 'react'

export type UseToggleReturn = {
  value: boolean
  toggle: () => void
  set: (value: boolean) => void
}

export function useToggle(initial = false): UseToggleReturn {
  const [value, setValue] = useState(initial)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  const setExplicit = useCallback((next: boolean) => {
    setValue(next)
  }, [])

  return { value, toggle, set: setExplicit }
}
