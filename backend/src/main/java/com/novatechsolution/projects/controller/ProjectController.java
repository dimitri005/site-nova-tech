package com.novatechsolution.projects.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.projects.domain.Project;
import com.novatechsolution.projects.dto.ProjectRequest;
import com.novatechsolution.projects.service.ProjectService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class ProjectController {
    private final ProjectService service;
    @Operation(tags = "Visiteur · Réalisations", summary = "Lister les réalisations publiées", description = "Retourne uniquement les réalisations publiés, triés de la plus récente à la plus ancienne (date du projet). Lecture seule, sans authentification.") @GetMapping("/api/v1/projects") public ApiResponse<List<Project>> publicList() { return ApiResponse.of(service.publicList()); }
    @Operation(tags = "Visiteur · Réalisations", summary = "Consulter une réalisation publiée", description = "Retourne le détail d'une réalisation publiée à partir de son identifiant lisible (slug). Répond 404 si le contenu n'existe pas ou n'est pas publié.") @GetMapping("/api/v1/projects/{slug}") public ApiResponse<Project> publicFind(@PathVariable String slug) { return ApiResponse.of(service.publicFind(slug)); }
    @Operation(tags = "Management · Réalisations", summary = "Lister tous les réalisations", description = "Retourne l'ensemble des réalisations, publiés ou non, pour l'édition dans l'espace de gestion. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/projects") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<Project>> adminList() { return ApiResponse.of(service.adminList()); }
    @Operation(tags = "Management · Réalisations", summary = "Créer une réalisation", description = "Crée une réalisation. Le corps est validé (Bean Validation) ; les erreurs sont renvoyées champ par champ. Retourne 201 et la ressource créée. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/projects") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<Project>> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }
    @Operation(tags = "Management · Réalisations", summary = "Modifier une réalisation", description = "Remplace les champs de une réalisation identifiée par son UUID. Répond 404 si l'identifiant est inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/projects/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Project> update(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request) { return ApiResponse.of(service.update(id, request)); }
    @Operation(tags = "Management · Réalisations", summary = "Supprimer une réalisation", description = "Suppression définitive de une réalisation identifiée par son UUID ; retourne 204 sans corps, 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/projects/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
