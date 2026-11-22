# ADR 0007 — Données de démonstration hors du chemin de production

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Des jeux de données fictifs (contenus, demandes, compte administrateur de test) étaient versionnés dans les migrations exécutées partout, y compris en production.

## Décision

Les migrations de **schéma** restent dans `db/migration`. Les données de démonstration sont déplacées dans `db/seed`, chargé **uniquement** par les profils `dev` et `local` (`spring.flyway.locations`). Le profil `prod` n'exécute que le schéma. Le premier administrateur est créé par `ADMIN_INITIAL_EMAIL` et `ADMIN_INITIAL_PASSWORD` au démarrage.

## Conséquences

- Une base de production vide ne reçoit ni faux contenus, ni compte de test.
- Les numéros de version sont partagés entre les deux dossiers ; les versions de démonstration restent donc réservées.
- Le conteneur Docker utilise le profil `prod` et `ddl-auto=validate`.

## Alternatives écartées

Profil de test uniquement via script manuel : non reproductible.
