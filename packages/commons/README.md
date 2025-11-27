# @mukulasoft/commons

Shared design primitives, HTTP utilities, and API contracts used across MukulaStack applications. Initial contents include:

- **Design tokens**: `commonsTheme` and helpers for generating CSS variables.
- **HTTP client**: `createApiClient` for consistent fetch handling across web apps.
- **Contracts**: Reusable Zod schemas (starting with `/me` endpoints) so frontends and the API share types.

This package will expand as we migrate duplicated logic out of individual apps.
