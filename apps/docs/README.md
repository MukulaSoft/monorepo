# MukulaSoft Docs

Marketing-friendly documentation site that showcases the shared packages published from this monorepo.

## Commands

- `pnpm dev --filter docs` – run the site locally
- `pnpm build --filter docs` – produce the static build
- `pnpm preview --filter docs` – serve the built assets locally

The site consumes `@mukulasoft/ui` and `@mukulasoft/utils` directly, so be sure to run `pnpm build --filter @mukulasoft/ui` if you expect to test bundled output.
