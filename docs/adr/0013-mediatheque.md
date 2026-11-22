# ADR 0013 — Médiathèque : stockage local et contrôle des images

- **Statut :** accepté
- **Date :** 2026-11-23

## Contexte

Les images téléversées par l'équipe doivent être sûres et légères.

## Décision

Seuls les formats JPEG et PNG sont acceptés (10 Mo maximum). Le contenu réel du fichier est vérifié, l'image est redimensionnée et compressée, puis stockée sur le disque du serveur (`novatech.media.storage-path`) et servie sous `/media/`. Chaque entrée porte un texte alternatif bilingue.

## Conséquences

- Le dossier de stockage doit être persistant et sauvegardé.
- Plusieurs instances exigent un stockage partagé ou un stockage objet.

## Alternatives écartées

Stockage objet (S3) : prévu si le déploiement évolue.
