# Feature: Reliable public content and fast API revisit

## Requirements

- When a development database is initialized, the homepage image settings shall contain valid image URLs.
- When a visitor returns to a page during the same browser session, the frontend shall render the most recent successful GET response immediately while refreshing stale content in the background.
- When an API mutation succeeds or the active admin session changes, cached GET data shall be cleared so edits and account-specific data do not leak across states.
- Demo messages, testimonials, and other fabricated records shall remain confined to development seed data.

## Architecture

- Frontend: keep successful GET responses in a bounded-time in-memory cache shared by API hooks. Render cached data immediately; show a loading state only when no cache entry exists.
- Backend: repair malformed Unsplash URLs in the development seed and add a forward-only dev seed repair for databases that already ran earlier seed versions.
- Security: clear cached data after mutations and authentication changes. Keep protected message endpoints behind the existing `SUPER_ADMIN`/`EDITOR` authorization. Do not copy demonstration leads into production migrations.

## Implementation plan

- [x] Verify current API loading, authorization, and database seed behavior.
- [x] Repair malformed development homepage image URLs for fresh and existing local databases.
- [x] Add short-lived GET caching with stale-while-revalidate behavior and invalidation.
- [x] Build the frontend and backend packages.
