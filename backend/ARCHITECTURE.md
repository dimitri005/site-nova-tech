# Architecture du backend NovaTech Solution

## Organisation

Le backend est un monolithe modulaire Spring Boot avec PostgreSQL et une API REST versionnée sous `/api/v1`. Chaque domaine possède ses entités, DTO, repositories, services et contrôleurs. Les appels entre domaines passent par leurs services applicatifs; le tableau de bord ne lit que des projections agrégées.

Le dossier `student` contient du code hérité de DUDEN utilisé uniquement comme référence de style. Il reste inchangé et est exclu de la compilation Maven; il ne fait pas partie du site NovaTech.

## Modules

| Module | Responsabilités |
|---|---|
| `identity` | Comptes administrateur, r?les `SUPER_ADMIN`/`EDITOR`, BCrypt, JWT et renouvellement de session |
| `services` | Les cinq pôles d'activité, contenus français/anglais, ordre et publication |
| `projects` | Réalisations, client, catégorie, technologies, galerie, liens et mise en avant |
| `training` | Catalogue bilingue, programme, tarif indicatif et sessions en présentiel avec capacité |
| `enrollment` | Pré-inscriptions sans paiement, consentement, suivi, réservation transactionnelle et export CSV |
| `team` | Fondateurs et personnel, biographies, photos et réseaux |
| `inquiries` | Messages de contact, demandes de devis, statuts et notes internes |
| `media` | Bibliothèque locale JPEG/PNG, vérification du contenu réel, redimensionnement et compression |
| `sitecontent` / `settings` | Pages légales et statiques, coordonnées, réseaux sociaux, pied de page et SEO |
| `dashboard` | Compteurs de messages, devis, pré-inscriptions, projets et articles publiés |
| `testimonials` / `partners` | Témoignages et logos publiés |
| `blog` / `newsletter` / `audit` | Articles bilingues avec HTML nettoyé, abonnements/export et journal des actions admin |

Les répertoires `event` et `mapper` restent disponibles lorsque le domaine en a besoin; aucune classe vide n'est requise.

## Routes clés

- Lecture publique : `GET /services`, `/projects`, `/trainings`, `/trainings/{slug}/sessions`, `/team`, `/testimonials`, `/partners`, `/articles` et `/site-content/pages`.
- Formulaires : `POST /contact-messages`, `/quote-requests` et `/enrollments`.
- Authentification : `POST /auth/login`, `/auth/refresh` et `/auth/logout`.
- Gestion : CRUD sous `/api/v1/management/**`; les comptes sont réservés à `SUPER_ADMIN`, les contenus à `SUPER_ADMIN` ou `EDITOR`.
- Documentation : Swagger UI sous `/swagger-ui.html`, OpenAPI sous `/v3/api-docs`.

Les pages publiques ne retournent que les contenus publiés. Les textes éditoriaux disposent de champs FR et EN distincts. Les formations restent en présentiel; aucun paiement n'est implémenté.

## Sécurité et données

- JWT signés en HS256, durée de vie courte et refresh tokens opaques rotatifs, stockés sous forme hachée.
- BCrypt pour les mots de passe; le premier super administrateur est créé uniquement si `ADMIN_INITIAL_EMAIL` et `ADMIN_INITIAL_PASSWORD` sont fournis.
- Validation serveur, champ anti-spam et limitation de débit en mémoire sur les formulaires et la connexion.
- Origines CORS explicites, erreurs JSON, contrôle d'accès par rôle et HTML riche filtré côté serveur.
- Les inscriptions réservent les places sous verrou transactionnel; les sessions complètes refusent les nouvelles demandes.
- Les médias n'acceptent que JPEG/PNG réels, limitent taille/dimensions, génèrent leurs noms et sont compressés.
- `ddl-auto=update` est réservé au profil local; la production utilise `validate` et doit être déployée avec des migrations versionnées.

La limite de débit est locale à une instance. Les déploiements multi-instance devront la stocker dans un service partagé. Les fichiers média sont sur disque local par défaut; le déploiement doit monter un volume persistant ou remplacer ce stockage par un fournisseur objet.
