package com.novatechsolution.sitecontent.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.sitecontent.domain.StaticPage;
import com.novatechsolution.sitecontent.dto.StaticPageRequest;
import com.novatechsolution.sitecontent.service.StaticPageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequiredArgsConstructor
public class StaticPageController {
    private final StaticPageService service;
    @Operation(tags = "Visiteur · Pages du site", summary = "Lister les pages publiées", description = "Retourne les pages statiques publiées (à propos, mentions légales, confidentialité…), triées par slug.") @GetMapping("/api/v1/site-content/pages") public ApiResponse<List<StaticPage>> publicList() { return ApiResponse.of(service.publicList()); }
    @Operation(tags = "Visiteur · Pages du site", summary = "Consulter une page publiée", description = "Retourne le contenu bilingue (HTML assaini) d’une page à partir de son slug. 404 si absente ou non publiée.") @GetMapping("/api/v1/site-content/pages/{slug}") public ApiResponse<StaticPage> publicFind(@PathVariable String slug) { return ApiResponse.of(service.publicFind(slug)); }
    @Operation(tags = "Management · Pages statiques", summary = "Lister toutes les pages", description = "Retourne toutes les pages statiques, publiées ou non. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/site-content/pages") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<StaticPage>> adminList() { return ApiResponse.of(service.adminList()); }
    @Operation(tags = "Management · Pages statiques", summary = "Créer ou remplacer une page", description = "Opération d’upsert identifiée par le slug : crée la page ou remplace son contenu. Retourne la page enregistrée. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/site-content/pages") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<StaticPage>> save(@Valid @RequestBody StaticPageRequest request) {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.of(service.save(request)));
    }
    @Operation(tags = "Management · Pages statiques", summary = "Supprimer une page", description = "Suppression définitive d’une page identifiée par son slug ; 204 sans corps. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/site-content/pages/{slug}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable String slug) { service.delete(slug); return ResponseEntity.noContent().build(); }
}
