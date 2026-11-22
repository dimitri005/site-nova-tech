# NOVA-TECH-SOLUTION

Site vitrine bilingue pour NOVA-TECH-SOLUTION, entreprise de solutions numériques et de formation. Le projet comprend une interface publique React et une base de backend Spring Boot.

## Fonctionnalités frontend

- Accueil responsive aux couleurs et au logo NOVA-TECH-SOLUTION.
- Navigation en français et en anglais.
- Pages de présentation, services, réalisations, formations, équipe, actualités, contact, devis et informations légales.
- Filtres et recherche dans les réalisations, pages de détail et formulaires de contact, devis et préinscription.
- Espace de démonstration à `/admin` pour gérer les contenus, demandes, médias et paramètres.
- Animations avec Motion et GSAP, avec prise en compte des préférences de réduction des mouvements.
- React Router, TypeScript, Vite et i18next.

Les formulaires et les modifications de l’espace de démonstration sont stockés dans le navigateur. Ils ne sont pas encore reliés à une API, à un service d’e-mail ou à une authentification serveur.

## Démarrer le frontend

```bash
cd frontend
npm ci
npm run dev
```

Vérifier la compilation de production :

```bash
npm run build
```

## Backend

Le dossier `backend` contient l'API REST Spring Boot/PostgreSQL pour les contenus, formations, pré-inscriptions, demandes, médias et administration. La configuration utilise les variables `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` et `JWT_SECRET_BASE64`. Les instructions détaillées sont dans [backend/README.md](backend/README.md).

Exemple PowerShell avant de lancer le backend :

```powershell
$env:DB_URL = "jdbc:postgresql://localhost:5432/NOVA"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "votre-mot-de-passe-local"
cd backend
./mvnw.cmd spring-boot:run
```

La base PostgreSQL doit exister et être accessible. Les formulaires et l'administration du frontend restent en mode démonstration et ne sont pas encore reliés à l'API.

## Routes principales

- `/fr` et `/en` : accueil
- `/:lang/a-propos`, `/:lang/services`, `/:lang/realisations`, `/:lang/formations`, `/:lang/equipe`
- `/:lang/contact`, `/:lang/devis`, `/:lang/actualites`, `/:lang/mentions-legales`, `/:lang/confidentialite`
- `/admin/login` et `/admin` : interface d’administration

Les segments anglais équivalents sont également disponibles depuis la navigation bilingue.
