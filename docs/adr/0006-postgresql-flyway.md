# ADR 0006 — PostgreSQL et migrations Flyway

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Le schéma évoluait via Hibernate (`ddl-auto=update`), sans historique ni reproductibilité.

## Décision

Le schéma est géré par **Flyway** (`db/migration`). La migration `V1` reprend le schéma existant ; une base déjà peuplée est adoptée par `baseline-on-migrate`. Hibernate valide le schéma (`ddl-auto=validate`) et ne le modifie plus, sauf choix explicite en développement. Toute évolution passe par une nouvelle migration ; un fichier déjà appliqué n'est jamais modifié (son empreinte est contrôlée).

## Conséquences

- Les environnements sont reproductibles ; un déploiement sur base vide produit le même schéma.
- Les correctifs de données passent par une migration suivante, pas par la modification d'une migration existante.

## Alternatives écartées

Laisser Hibernate modifier le schéma : aucun historique, risque de divergence entre environnements.
