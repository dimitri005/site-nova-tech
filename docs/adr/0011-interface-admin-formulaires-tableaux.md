# ADR 0011 — Interface d'administration : formulaires, modales et tableaux avancés

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

L'espace de gestion doit rester homogène et sûr malgré un grand nombre d'écrans de données.

## Décision

Formulaires gérés par **Formik** et validés par **Yup**, ouverts dans des **modales** accessibles ; suppressions confirmées par une modale. Les listes utilisent un composant `DataGrid` commun : recherche multi-termes, filtres avancés par type de colonne, tri, colonnes affichables, vues enregistrées, export CSV et pagination. Les chargements affichent des **squelettes**, jamais un texte d'attente.

## Conséquences

- Le tri, le filtrage et la pagination se font **dans le navigateur** : adapté à quelques centaines de lignes. Au-delà (messages, abonnés, journal), prévoir une pagination serveur.
- Les composants vivent dans `frontend/src/components/admin`.

## Alternatives écartées

Tableaux et formulaires écrits écran par écran : duplication et incohérences.
