# ADR 0012 — Graphiques d'analyse avec Recharts

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Le tableau de bord présente des courbes, anneaux, barres et jauges lisibles et accessibles.

## Décision

Les graphiques utilisent **Recharts**, chargé à la demande (découpage de code) pour ne pas alourdir les autres écrans. La palette catégorielle est validée pour la distinction par les daltoniens ; chaque graphique a une légende, une infobulle et une **vue tableau** équivalente.

## Conséquences

- Le bloc d'analyses est un fichier JavaScript séparé, téléchargé à l'ouverture du tableau de bord.
- Les couleurs de série sont définies dans `chartTheme.ts`.

## Alternatives écartées

Graphiques dessinés à la main en SVG : coût de maintenance élevé.
