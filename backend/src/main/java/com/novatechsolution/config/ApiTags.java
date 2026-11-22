package com.novatechsolution.config;

import java.util.LinkedHashMap;
import java.util.Map;

/** Catalogue des tags de l'API : chaque tag précise l'acteur concerné puis la fonction technique exposée. */
final class ApiTags {
    static final Map<String, String> TAGS = new LinkedHashMap<>();

    static {
        TAGS.put("Visiteur · Services",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** consultation en lecture seule du catalogue de services publiés.");
        TAGS.put("Visiteur · Réalisations",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** consultation en lecture seule du portfolio de projets publiés.");
        TAGS.put("Visiteur · Actualités",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** consultation en lecture seule des articles publiés.");
        TAGS.put("Visiteur · Équipe",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** lecture seule de la projection publique des membres de l’équipe.");
        TAGS.put("Visiteur · Témoignages",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** lecture seule des témoignages clients publiés.");
        TAGS.put("Visiteur · Partenaires",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** lecture seule des partenaires publiés.");
        TAGS.put("Visiteur · Formations",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** consultation du catalogue de formations et de leurs sessions ouvertes.");
        TAGS.put("Visiteur · Pages du site",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** lecture des pages statiques éditoriales publiées.");
        TAGS.put("Visiteur · Réglages publics",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** lecture des réglages exposés au site (coordonnées, pied de page, SEO, accueil).");
        TAGS.put("Visiteur · Textes du site",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** chargement du catalogue de traduction fr/en utilisé par l’interface.");
        TAGS.put("Visiteur · Contact et devis",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** dépôt de messages et de demandes de devis ; formulaires protégés par consentement, champ anti-robot et limitation de débit.");
        TAGS.put("Visiteur · Pré-inscriptions",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** dépôt d’une pré-inscription à une session avec réservation atomique d’une place.");
        TAGS.put("Visiteur · Newsletter",
                "**Acteur :** visiteur du site (anonyme, sans authentification).\n\n**Fonction technique :** désabonnement par jeton (API et lien e-mail).");
        TAGS.put("Authentification · Session",
                "**Acteur :** tout utilisateur de l’espace de gestion (administrateur ou éditeur).\n\n**Fonction technique :** authentification par identifiants, émission, renouvellement avec rotation et révocation des jetons JWT.");
        TAGS.put("Management · Tableau de bord",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** indicateurs instantanés (vue matérialisée) et analyses d’activité sur période.");
        TAGS.put("Management · Services",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** création, modification et suppression des services du site.");
        TAGS.put("Management · Réalisations",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** gestion du portfolio de projets.");
        TAGS.put("Management · Actualités",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** rédaction et publication des articles.");
        TAGS.put("Management · Équipe",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** gestion des membres de l’équipe affichés sur le site.");
        TAGS.put("Management · Témoignages",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** gestion des témoignages clients.");
        TAGS.put("Management · Partenaires",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** gestion des logos et liens partenaires.");
        TAGS.put("Management · Formations",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** gestion du catalogue de formations (suppression réservée au SUPER_ADMIN).");
        TAGS.put("Management · Sessions de formation",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** planification des sessions, capacités et statuts (suppression réservée au SUPER_ADMIN).");
        TAGS.put("Management · Pages statiques",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** édition des pages éditoriales (upsert par slug).");
        TAGS.put("Management · Page d’accueil",
                "**Acteur :** super administrateur connecté (rôle SUPER_ADMIN).\n\n**Fonction technique :** édition des textes et visuels de l’accueil (réservé au SUPER_ADMIN).");
        TAGS.put("Management · Réglages du site",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** coordonnées, réseaux sociaux, en-tête, pied de page et paramètres avancés.");
        TAGS.put("Management · Textes du site",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** personnalisation des textes fr/en du site, avec retour aux valeurs d’origine.");
        TAGS.put("Management · Messages de contact",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** suivi et traitement des messages reçus.");
        TAGS.put("Management · Demandes de devis",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** suivi des devis, statuts et notes internes.");
        TAGS.put("Management · Pré-inscriptions",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** suivi des inscriptions par session et export CSV.");
        TAGS.put("Management · Newsletter",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** consultation et export CSV des abonnés.");
        TAGS.put("Management · Médiathèque",
                "**Acteur :** administrateur ou éditeur connecté (jeton JWT Bearer, rôles SUPER_ADMIN / EDITOR).\n\n**Fonction technique :** téléversement sécurisé et gestion des images.");
        TAGS.put("Management · Utilisateurs",
                "**Acteur :** super administrateur connecté (rôle SUPER_ADMIN).\n\n**Fonction technique :** gestion des comptes d’administration (réservé au SUPER_ADMIN).");
        TAGS.put("Management · Journal d’activité",
                "**Acteur :** super administrateur connecté (rôle SUPER_ADMIN).\n\n**Fonction technique :** traçabilité des écritures effectuées dans l’espace de gestion (réservé au SUPER_ADMIN).");
    }

    private ApiTags() {
    }
}
