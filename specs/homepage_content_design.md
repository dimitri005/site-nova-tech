# Feature: Home page content management

## Requirements

- While an administrator with the SUPER_ADMIN role is signed in, when they edit and save home page copy or image URLs, the backend shall validate and persist those values and public visitors shall see the updated content in French and English.
- When the home page renders service, project, training, testimonial, and article previews, it shall load published records from the existing public APIs used by their dedicated pages.
- While a user is not an authenticated SUPER_ADMIN, requests to read or update the admin home page configuration shall be denied by the backend.

## Architecture

- Backend: reuse site settings storage with a dedicated `/api/v1/admin/homepage` GET/PUT namespace, merge only `home.*` keys, validate keys and value lengths, serve those keys through public settings, and require SUPER_ADMIN authorization.
- Frontend: add an admin “Accueil” editor with grouped French/English text and HTTPS or local media image URL fields; refactor the public landing page to read those settings and existing content APIs instead of localStorage and placeholder arrays.
- Security: values render as React text, never unsanitized HTML; image URLs must be HTTP(S) or local `/media/`; edits are audited by existing admin request auditing.

## Implementation Plan

- [x] Define the persisted content model and authorization boundary.
- [x] Add validated, authorized homepage settings API.
- [x] Add the super admin home page editor.
- [x] Connect landing page sections to saved settings and published content APIs.
- [ ] Build frontend and review the final diff.
