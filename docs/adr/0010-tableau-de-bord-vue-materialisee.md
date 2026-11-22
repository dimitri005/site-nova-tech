# ADR 0010 — Tableau de bord : vue matérialisée et analyses sur période

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Le tableau de bord ne doit pas recompter plusieurs tables à chaque affichage, et doit proposer des analyses sur 7, 30 ou 90 jours.

## Décision

Les compteurs « à traiter » sont lus dans la **vue matérialisée** `dashboard_summary`, rafraîchie toutes les 30 secondes par une tâche planifiée (`REFRESH … CONCURRENTLY`). Les analyses (série quotidienne, comparaison à la période précédente, répartitions) sont calculées à la demande en une passe groupée par table, appuyée sur des index de date.

## Conséquences

- Les compteurs peuvent avoir jusqu'à 30 secondes de retard.
- La tâche s'exécute sur chaque instance ; à revoir en cas de montée en charge.
- Si les tables restent petites, une requête directe avec cache court suffirait.

## Alternatives écartées

Comptage direct à chaque appel : plus simple mais plus coûteux à grande échelle.
