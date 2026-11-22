# ADR 0005 — Authentification par jetons JWT avec rotation du jeton de renouvellement

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

L'espace de gestion doit être protégé sans session serveur, avec une révocation possible.

## Décision

Connexion par e-mail et mot de passe (haché en BCrypt) ; l'API émet un **jeton d'accès JWT** de courte durée (30 minutes) et un **jeton de renouvellement** de 8 heures, stocké haché en base. Chaque renouvellement fait tourner le jeton ; le changement de mot de passe ou la désactivation d'un compte révoque ses sessions ouvertes. Deux rôles : `SUPER_ADMIN` (comptes, page d'accueil, journal, suppressions sensibles) et `EDITOR` (contenus et demandes).

## Conséquences

- Les routes `/management` vérifient le rôle avec `@PreAuthorize`.
- La limitation de débit des formulaires publics et de la connexion est appliquée **par instance** ; elle devra être déportée (proxy ou cache partagé) en cas de plusieurs instances.
- Le premier compte est créé par variables d'environnement, jamais par la base de données en production (voir ADR 0007).

## Alternatives écartées

Sessions serveur : état à répliquer. Jeton de renouvellement sans rotation : fenêtre d'abus plus large.
