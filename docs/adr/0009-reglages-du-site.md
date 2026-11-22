# ADR 0009 — Réglages du site : coordonnées, en-tête et pied de page

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Les coordonnées, les réseaux sociaux, la barre supérieure et le pied de page doivent être modifiables par l'équipe.

## Décision

Un magasin clé/valeur (`site_settings`) porte ces réglages. Seuls les préfixes autorisés (`site.`, `contact.`, `social.`, `footer.`, `header.`, `topbar.`, `seo.`, `home.`) sont exposés par `GET /api/v1/settings/public`. L'enregistrement remplace les réglages hors accueil et conserve le contenu `home.*`. Les clés sensibles (mot de passe, secret, jeton) sont refusées. Les liens d'accès à l'administration sont **masqués par défaut** pour les visiteurs.

## Conséquences

- Une nouvelle option publique exige un préfixe autorisé côté serveur.
- Les liens supplémentaires du pied de page sont stockés en JSON dans `footer.links`.

## Alternatives écartées

Fichier de configuration : modification impossible sans déploiement.
