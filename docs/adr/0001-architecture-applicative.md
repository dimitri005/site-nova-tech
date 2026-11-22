# ADR 0001 — Architecture applicative : API REST Spring Boot et application React

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Le site vitrine bilingue et son espace de gestion doivent partager les mêmes contenus, avec une équipe réduite et un déploiement simple.

## Décision

Un backend **Spring Boot (Java 21)** expose une API REST versionnée ; un frontend **React + TypeScript + Vite** (application monopage) consomme cette API. Le backend est un monolithe modulaire : un paquet par domaine (`services`, `projects`, `training`, `inquiries`, `settings`, `identity`, …), chacun avec ses couches contrôleur, service, dépôt et objets de transfert.

## Conséquences

- Un seul artefact backend à déployer ; frontend servi séparément (nginx).
- Les modules restent découplés et pourront être extraits si le besoin apparaît.
- Le site public est rendu côté navigateur : le référencement repose sur le titre, la description et l'image d'aperçu mis à jour dynamiquement.

## Alternatives écartées

Rendu côté serveur (Next.js) : écarté pour limiter la complexité d'exploitation. Microservices : disproportionné pour le volume attendu.
