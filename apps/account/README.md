# MukulaSoft Account

The centralized identity surface for MukulaSoft. This Vite + React Router app lets creators:

- Curate profile presence (display name, roles, genres, pronouns, bio) with live previews.
- Review trust posture across 2FA, passkeys, backup codes, and active devices.
- Tune notification cadences and per-channel delivery.
- Link Spotify or YouTube Music to feed the recommender service.
- Inspect generated recommendation briefs that respond to current connections.

## Project structure

- `src/context/account-context.tsx` – lightweight state manager exposing account data + mutations.
- `src/data/account.ts` – mocked account graph used until real APIs wire in.
- `src/features/*` – feature-specific UI slices (profile, security, notifications, connections, recommendations).
- `src/components/AccountLayout.tsx` – shell navigation, hero copy, and routed outlet.

## Getting started

From the monorepo root:

```bash
pnpm install          # once, installs all workspace deps
pnpm --filter account dev
```

Open http://localhost:5173 to explore the scaffold. The UI pulls shared tokens and components from `@mukulasoft/ui` and `@mukulasoft/design-tokens` so it stays aligned with the rest of the platform.

## Next steps

1. Replace `initialAccountState` with real API responses (GraphQL/REST) and connect mutations.
2. Swap the mock Spotify/YouTube actions for the real OAuth + token storage layer.
3. Layer analytics and error states (e.g., when a connection is rate limited).
4. Expand the recommendation feed into a paginated timeline that surfaces why/how items were ranked.
