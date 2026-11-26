# NOVA-TECH-SOLUTION — Site web

Application web (React + TypeScript + Vite) du site public et de l'espace d'administration.

## Démarrage

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production
npm run lint
```

L'adresse de l'API se règle avec `VITE_API_BASE_URL` (par défaut `http://localhost:8080/api/v1`, le port Spring Boot local). Docker Compose configure son port exposé `8081` séparément.

## Structure

- `src/pages` : pages publiques et espace admin
- `src/components/admin` : composants de l'espace admin (modales, formulaires, tableaux)
- `src/api` : client HTTP et hooks de données
- `src/styles` : feuilles de style
