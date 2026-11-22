# ADR 0002 — Versionnement de l'API dans le chemin : /api/v1

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

L'API est consommée par le frontend et pourrait l'être par d'autres clients ; les changements incompatibles doivent rester possibles sans casser l'existant.

## Décision

La version est portée par le chemin : toutes les routes commencent par `/api/v1`. Les réponses avec contenu utilisent une enveloppe `{ data, message }` ; les erreurs ont une forme unique `{ timestamp, status, message, fields }`, où `fields` détaille la validation champ par champ.

## Conséquences

- Une future `v2` pourra cohabiter avec la `v1`.
- Les clients traitent succès et erreurs de façon uniforme.

## Alternatives écartées

Version dans un en-tête : moins visible et plus difficile à tester dans un navigateur.
