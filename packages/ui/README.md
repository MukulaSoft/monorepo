# @mukulasoft/ui

Shared React primitives and hooks for MukulaSoft frontends.

## Installation

```bash
pnpm add @mukulasoft/ui
```

Peer dependencies:

- `react` (18 or 19)
- `react-dom` (18 or 19)

## Usage

### Button component

```tsx
import { Button } from '@mukulasoft/ui'

export function HeroCta() {
  return (
    <Button variant="primary" size="lg" onClick={() => console.log('clicked!')}>
      Get Started
    </Button>
  )
}
```

### useToggle hook

```tsx
import { useToggle } from '@mukulasoft/ui'

export function ToggleExample() {
  const { value, toggle, set } = useToggle()

  return (
    <div>
      <p>Notifications are {value ? 'enabled' : 'disabled'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={() => set(false)}>Disable</button>
    </div>
  )
}
```

## Development

- `pnpm dev --filter @mukulasoft/ui` – watch the TypeScript build
- `pnpm lint --filter @mukulasoft/ui` – run the dedicated ESLint target
- `pnpm test --filter @mukulasoft/ui` – run the Vitest suite
