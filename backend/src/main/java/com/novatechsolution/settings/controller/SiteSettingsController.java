package com.novatechsolution.settings.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.settings.dto.SiteSettingsRequest;
import com.novatechsolution.settings.dto.HomepageSettingsRequest;
import com.novatechsolution.settings.service.SiteSettingsService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequiredArgsConstructor
public class SiteSettingsController {
    private final SiteSettingsService service;
    @Operation(tags = "Visiteur · Réglages publics", summary = "Lire les réglages publics du site", description = "Retourne les paires clé/valeur exposables aux visiteurs : coordonnées, réseaux sociaux, pied de page, en-tête, SEO et contenu de la page d’accueil. Seuls les préfixes autorisés sont renvoyés ; aucune donnée sensible.") @GetMapping("/api/v1/settings/public") public ApiResponse<Map<String, String>> publicValues() { return ApiResponse.of(service.publicValues()); }
    @Operation(tags = "Management · Réglages du site", summary = "Lire tous les réglages", description = "Retourne l’intégralité des réglages enregistrés, y compris ceux non exposés publiquement. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/settings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Map<String, String>> adminValues() { return ApiResponse.of(service.adminValues()); }
    @Operation(tags = "Management · Page d’accueil", summary = "Lire le contenu de la page d’accueil", description = "Retourne les textes et visuels éditables de la page d’accueil (clés home.*). Rôle requis : SUPER_ADMIN uniquement.") @GetMapping("/api/v1/management/homepage") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ApiResponse<Map<String, String>> homepageValues() { return ApiResponse.of(service.homepageValues()); }
    @Operation(tags = "Management · Page d’accueil", summary = "Enregistrer le contenu de la page d’accueil", description = "Fusionne les valeurs fournies dans les clés home.* ; les URLs d’images doivent être en HTTP(S) ou sous /media/. Rôle requis : SUPER_ADMIN uniquement.") @PutMapping("/api/v1/management/homepage") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ApiResponse<Map<String, String>> saveHomepage(@Valid @RequestBody HomepageSettingsRequest request) { return ApiResponse.of(service.replaceHomepage(request)); }
    @Operation(tags = "Management · Réglages du site", summary = "Enregistrer les réglages", description = "Remplace les réglages non liés à la page d’accueil par les valeurs fournies ; le contenu de la page d’accueil (clés home.*) est conservé. Les clés sensibles (mot de passe, secret, jeton) sont refusées. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/settings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Map<String, String>> replace(@Valid @RequestBody SiteSettingsRequest request) { return ApiResponse.of(service.replace(request)); }
}
