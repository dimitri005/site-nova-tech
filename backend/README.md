# Backend NovaTech Solution

API REST bilingue Spring Boot 4 / Java 21 / PostgreSQL pour le site vitrine et son administration. L'organisation des modules et les conventions d'API sont détaillées dans [ARCHITECTURE.md](ARCHITECTURE.md).

## Démarrage local

1. Créer une base PostgreSQL nommée `NOVA`.
2. Copier `.env.example` en `.env`, puis renseigner `DB_USERNAME` et `DB_PASSWORD`.
3. Définir `JWT_SECRET_BASE64` avec une clé aléatoire Base64 d'au moins 32 octets. PowerShell :

   ```powershell
   [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   ```

4. Définir `ADMIN_INITIAL_EMAIL` et `ADMIN_INITIAL_PASSWORD` pour créer le premier super administrateur. Le mot de passe doit faire au moins 12 caractères et inclure une minuscule, une majuscule et un chiffre. Le bootstrap ne remplace jamais un compte existant.
5. Adapter `CORS_ALLOWED_ORIGINS` à l'URL du frontend. Les notifications et la récupération du mot de passe par e-mail sont désactivées temporairement. Les formulaires continuent d'enregistrer les adresses et demandes dans la base.
6. Lancer depuis `backend` :

   ```powershell
   ./mvnw.cmd spring-boot:run
   ```

Le profil `dev` met à jour le schéma automatiquement. En production, activer `SPRING_PROFILES_ACTIVE=prod`, conserver `ddl-auto=validate` et appliquer des migrations versionnées. Ne jamais versionner le vrai fichier `.env`.

## Services et sécurité

- Swagger UI : `/swagger-ui.html`; spécification OpenAPI : `/v3/api-docs`.
- La sécurité JWT s'active avec `JWT_SECRET_BASE64`; sans ce secret, seules les routes publiques sont accessibles et les routes privées restent fermées.
- Les formulaires publics et la connexion sont limités à 10 requêtes par minute et par adresse IP. Cette limite est en mémoire pour une seule instance.
- Les médias JPEG/PNG sont stockés sous `MEDIA_STORAGE_PATH` (par défaut `backend/var/media`). En production, monter un volume persistant.
- Les formations sont en présentiel et n'ont pas de paiement en ligne.

Les contrôleurs et services métier du module `student` n'appartiennent pas à NovaTech. Le dossier est conservé intact comme référence de style et exclu de la compilation du projet.
