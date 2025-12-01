# @mukulasoft/ui

Shared React primitives and hooks for MukulaSoft frontends.

The library ships CSS utility tokens (import `@mukulasoft/ui/styles.css`) and headless-friendly React
components, now including badges, cards, and form fields.

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

### Badge component

```tsx
import { Badge } from '@mukulasoft/ui'

export function StatusPill() {
  return (
    <Badge tone="success" variant="solid">
      Live
    </Badge>
  )
}
```

### Card & TextField composition

```tsx
import { Card, CardContent, CardHeader, CardTitle, TextField } from '@mukulasoft/ui'

export function ProfileCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <TextField label="Display name" placeholder="Jane Doe" hint="Shown publicly" />
      </CardContent>
    </Card>
  )
}
```

### Hooks

```tsx
import { usePrefersReducedMotion, useToggle } from '@mukulasoft/ui'

export function MotionAwareToggle() {
  const reducedMotion = usePrefersReducedMotion()
  const { value, toggle } = useToggle()

  return (
    <button onClick={toggle}>
      Animations are {reducedMotion ? 'simplified' : value ? 'enabled' : 'disabled'}
    </button>
  )
}
```

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
- `pnpm lint --filter @mukulasoft/ui` – run the ESLint target
- `pnpm test --filter @mukulasoft/ui` – run the Vitest suite
- `pnpm storybook --filter @mukulasoft/ui` – develop components in Storybook
- `pnpm storybook:build --filter @mukulasoft/ui` – generate a static Storybook build
