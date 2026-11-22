# ADR 0003 — Séparation des routes : visiteur, authentification, management

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Les routes d'administration étaient préfixées `/admin`, un terme déjà utilisé par les pages de l'interface (`/admin/...`), ce qui prêtait à confusion entre API et écrans.

## Décision

Trois familles de routes : **visiteur** (`/api/v1/*`, publique, lecture et formulaires), **authentification** (`/api/v1/auth/*`) et **management** (`/api/v1/management/*`, réservée à l'équipe, jeton Bearer et rôles). Les écrans de l'interface restent sous `/admin/...`.

## Conséquences

- La règle d'accès se lit dans le chemin : tout ce qui est sous `/management` exige un jeton.
- Le journal d'activité n'enregistre que les écritures effectuées sous `/management`.
- Les anciennes routes `/api/v1/admin` n'existent plus.

## Alternatives écartées

Conserver `/admin` : conflit de vocabulaire avec le frontend.
