# @mukulasoft/utils

Shared MukulaSoft utilities that combine the previous `@mukulasoft/types` model exports with small helpers that were duplicated across apps. The package is intentionally tiny (no build step) so that TypeScript can consume the `.ts` sources directly.

## Contents

- `types.ts` – stable domain types (`User`, `Project`, `About`, recommender payloads, catalog metadata, etc.).
- `connections.ts` – connection catalog data plus helpers (normalize lists, derive OAuth-only providers, build handles, etc.).
- `catalog.ts` – provider metadata for recommendation UIs (labels, icons, ordering helpers).
- `strings.ts` – generic helpers (`slugify`, `truncate`, `titleCase`).
- `guards.ts` – runtime assertions (`invariant`, `assertUnreachable`).

## Usage

```ts
import {
    type User,
    connectionProviders,
    normalizeConnections,
    slugify,
    catalogProviderLabels,
} from '@mukulasoft/utils'
```

## Migration Notes

1. `@mukulasoft/types` now point to this package.
2. Shared helpers that previously lived in feature hooks (`useConnections`, `connections` API router, song recommender provider meta) import from `@mukulasoft/utils` to avoid drift.
3. The package is private and referenced via `workspace:*` just like the previous types-only package.
