# @mukulasoft/utils

Lightweight utility helpers shared across MukulaSoft projects.

## Installation

```bash
pnpm add @mukulasoft/utils
```

## API

```ts
import { clamp, invariant, isEmpty, isNil, sleep } from '@mukulasoft/utils'

clamp(42, 0, 10) // => 10
isNil(undefined) // => true
isEmpty({}) // => true

await sleep(500)
await sleep(1000, abortController.signal) // can be cancelled

invariant(user, 'User must be defined')
```

## Development

- `pnpm dev --filter @mukulasoft/utils` – incremental TypeScript build
- `pnpm lint --filter @mukulasoft/utils` – lint the source files
- `pnpm test --filter @mukulasoft/utils` – run the Vitest suite
