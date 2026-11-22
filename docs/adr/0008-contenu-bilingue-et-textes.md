# ADR 0008 — Contenu bilingue et textes modifiables depuis l'administration

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Tout texte visible par un visiteur doit exister en français et en anglais et pouvoir être modifié sans déploiement.

## Décision

Les textes de l'interface vivent dans des **catalogues JSON** (`messages_fr.json`, `messages_en.json`) servis par `GET /api/v1/i18n/{locale}`. Les modifications faites dans l'administration sont stockées dans `translation_overrides` et fusionnées au catalogue ; la valeur d'origine reste récupérable. Le catalogue fusionné est mis en cache et relu au plus toutes les 60 secondes. Les contenus éditoriaux (services, articles…) ont des colonnes `Fr` / `En`.

## Conséquences

- Aucune clé non présente dans les catalogues ne peut être modifiée depuis l'administration.
- Le frontend garde des valeurs par défaut intégrées pour l'indisponibilité du backend.
- Les adresses des pages (`/fr/a-propos`) ne sont volontairement pas modifiables.

## Alternatives écartées

Texte en dur dans le code : modification impossible sans déploiement.
