# ADR 0004 — Documentation de l'API avec OpenAPI et Swagger UI

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Les routes doivent être documentées pour l'équipe et vérifiables sans outil externe.

## Décision

La documentation est générée par **springdoc-openapi** à partir d'annotations (`@Operation`) placées sur chaque route. Chaque tag suit la forme « acteur · domaine » (par exemple « Visiteur · Services » ou « Management · Utilisateurs ») et sa description donne l'acteur puis la fonction technique. Toutes les routes sont affichées sur une seule page, sans groupes ; les définitions de tags sont centralisées dans `ApiTags`, et la configuration (sécurité Bearer, erreurs communes) dans `OpenApiConfig`.

## Conséquences

- Swagger UI : `/swagger-ui.html` ; spécification brute : `/v3/api-docs`.
- Toute nouvelle route doit porter un `@Operation` avec un tag déclaré dans `ApiTags`.

## Alternatives écartées

Documentation rédigée à la main : se désynchronise du code. Groupes séparés dans Swagger UI : écartés, l'équipe veut tout voir sur une page.
