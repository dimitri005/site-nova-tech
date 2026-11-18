# Frontend / backend integration plan

## Scope

Connect the React application to the versioned Spring API at `/api/v1`: public site data and forms, administrative authentication, content CRUD, requests, media, settings, dashboard, newsletter, users and audit log. Remove local demo persistence from all connected flows.

## Integration shape

- A single typed fetch client owns the API base URL, JSON envelope handling, auth headers, refresh-token rotation, file uploads, CSV downloads and normalized errors.
- Public pages read published bilingual records and submit validated form DTOs to the public routes.
- The admin area requires a backend session and uses the backend role claims; each manager maps to its actual controller paths and DTO field names.
- A small `useApi` hook owns loading, error and cancellation state for page reads.
- Tests cover API client behavior and core rendered form flows; builds and available live API checks verify the full integration.

## Security checks

- Never store credentials in source or expose secrets to Vite; use session scoped token storage and Bearer auth.
- Keep server authorization authoritative; hide super-admin-only user management in the UI and preserve backend authorization failures.
- Keep server validation, encode ordinary text as text, and render only backend-sanitized article/page HTML.
- Submit consent and honeypot values on public forms; do not store requests in local storage.
