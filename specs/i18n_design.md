# Feature: Backend-managed French and English translations

## Requirements

When a visitor opens the site in French or English, the frontend shall load the selected translation catalog from the backend and render the existing i18next keys in that language. When the backend is unavailable, the frontend shall retain its bundled fallback catalog.

## Architecture

- Backend: store `fr` and `en` JSON catalogs under `backend/src/main/resources/i18n`; expose them through a read-only `GET /api/v1/i18n/{locale}` endpoint using the existing `ApiResponse` envelope.
- Frontend: keep current i18next catalogs as offline fallback, fetch both supported locale catalogs from the configured API base URL, replace the corresponding resource bundles, and keep URL/local-storage language selection intact.
- Security: allow only `fr` and `en`, serve catalogs read-only without authentication, and expose no user or database data.

## Implementation Plan

- [x] Define endpoint, locale allowlist, and fallback behavior.
- [x] Add locale catalogs and backend controller/service.
- [x] Permit the public translation GET route.
- [x] Load and apply backend bundles in the React i18next client.
- [x] Compile the frontend with `npm run build`.
- [ ] Compile the backend (blocked: Maven Central is unreachable in this environment, so Spring Boot parent `4.1.1` is not cached locally).
