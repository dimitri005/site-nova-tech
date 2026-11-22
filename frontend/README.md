# NOVA-TECH-SOLUTION — Site web

Application web (React + TypeScript + Vite) du site public et de l'espace d'administration.

## Démarrage

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de production
npm run lint
```

L'adresse de l'API se règle avec `VITE_API_BASE_URL` (par défaut `http://localhost:8081/api/v1`).

## Structure

- `src/pages` : pages publiques et espace admin
- `src/components/admin` : composants de l'espace admin (modales, formulaires, tableaux)
- `src/api` : client HTTP et hooks de données
- `src/styles` : feuilles de style
