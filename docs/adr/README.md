# Décisions d'architecture (ADR)

Ce dossier consigne les décisions structurantes du projet sous forme d'**Architecture Decision Records** : pour chaque choix, le contexte, la décision retenue, ses conséquences et les alternatives écartées.

## Index

| N° | Décision | Statut |
|---|---|---|
| [0001](0001-architecture-applicative.md) | Architecture applicative : API REST Spring Boot et application React | Accepté |
| [0002](0002-versionnement-api.md) | Versionnement de l'API dans le chemin : /api/v1 | Accepté |
| [0003](0003-separation-des-routes.md) | Séparation des routes : visiteur, authentification, management | Accepté |
| [0004](0004-documentation-openapi-swagger.md) | Documentation de l'API avec OpenAPI et Swagger UI | Accepté |
| [0005](0005-authentification-jwt.md) | Authentification par jetons JWT avec rotation du jeton de renouvellement | Accepté |
| [0006](0006-postgresql-flyway.md) | PostgreSQL et migrations Flyway | Accepté |
| [0007](0007-donnees-de-demonstration.md) | Données de démonstration hors du chemin de production | Accepté |
| [0008](0008-contenu-bilingue-et-textes.md) | Contenu bilingue et textes modifiables depuis l'administration | Accepté |
| [0009](0009-reglages-du-site.md) | Réglages du site : coordonnées, en-tête et pied de page | Accepté |
| [0010](0010-tableau-de-bord-vue-materialisee.md) | Tableau de bord : vue matérialisée et analyses sur période | Accepté |
| [0011](0011-interface-admin-formulaires-tableaux.md) | Interface d'administration : formulaires, modales et tableaux avancés | Accepté |
| [0012](0012-graphiques-recharts.md) | Graphiques d'analyse avec Recharts | Accepté |
| [0013](0013-mediatheque.md) | Médiathèque : stockage local et contrôle des images | Accepté |
| [0014](0014-identite-visuelle.md) | Identité visuelle issue du logo | Accepté |

## Écrire un nouvel ADR

1. Copier [`TEMPLATE.md`](TEMPLATE.md) en `NNNN-titre-court.md` avec le numéro suivant.
2. Renseigner le contexte, la décision, les conséquences et les alternatives.
3. Ajouter la ligne à l'index ci-dessus.

## Règles

- Un ADR accepté ne se réécrit pas : une décision qui change donne un **nouvel ADR** qui remplace l'ancien (statut « Remplacé par NNNN »).
- Statuts possibles : proposé, accepté, remplacé, abandonné.
