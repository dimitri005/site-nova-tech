# Feature: Temporarily disable email delivery

## Requirements

- While SMTP is not configured, the application shall accept and store contact, quote, and enrollment submissions without attempting email delivery; newsletter signup is temporarily disabled while existing subscriber data and unsubscribe links remain available.
- The application shall not expose mail-based password recovery or reply actions while email delivery is disabled.
- Email addresses remain valid contact and account data; no SMTP host, credentials, sender, or recipient configuration remains in the stack.

## Architecture

- Backend: remove Spring Mail and notification sender; remove delivery calls from business services; remove the email-based password recovery endpoints and token flow.
- Frontend: remove the email reply and recovery actions; keep stored contact details and existing subscription records visible; pause new newsletter signups.
- Deployment: remove mail variables from Compose and the root environment template.
- Security: do not expose reset tokens or account existence; administrator password changes remain authenticated and role-protected.

## Implementation Plan

- [x] Define disabled-delivery scope and preserve email fields as data.
- [x] Remove SMTP configuration, dependency, sender service, and send calls.
- [x] Disable/reset mail-dependent UI and API actions.
- [x] Remove mail configuration from deployment and documentation.
- [x] Build frontend; backend compilation attempted but Maven Central access is blocked in this environment.
