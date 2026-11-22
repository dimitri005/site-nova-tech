package com.novatechsolution.services.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.services.domain.ServiceContent;
import com.novatechsolution.services.dto.ServiceContentRequest;
import com.novatechsolution.services.service.ServiceContentService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ServiceContentController {
    private final ServiceContentService service;

    @Operation(tags = "Visiteur · Services", summary = "Lister les services publiés", description = "Retourne uniquement les services publiés, triés par ordre d’affichage. Lecture seule, sans authentification.") @GetMapping("/api/v1/services")
    public ApiResponse<List<ServiceContent>> publicList() { return ApiResponse.of(service.publicList()); }

    @Operation(tags = "Visiteur · Services", summary = "Consulter un service publié", description = "Retourne le détail d'un service publié à partir de son identifiant lisible (slug). Répond 404 si le contenu n'existe pas ou n'est pas publié.") @GetMapping("/api/v1/services/{slug}")
    public ApiResponse<ServiceContent> publicFind(@PathVariable String slug) { return ApiResponse.of(service.publicFind(slug)); }

    @Operation(tags = "Management · Services", summary = "Lister tous les services", description = "Retourne l'ensemble des services, publiés ou non, pour l'édition dans l'espace de gestion. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/services")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<ServiceContent>> adminList() { return ApiResponse.of(service.adminList()); }

    @Operation(tags = "Management · Services", summary = "Créer un service", description = "Crée un service. Le corps est validé (Bean Validation) ; les erreurs sont renvoyées champ par champ. Retourne 201 et la ressource créée. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/services")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<ServiceContent>> create(@Valid @RequestBody ServiceContentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }

    @Operation(tags = "Management · Services", summary = "Modifier un service", description = "Remplace les champs de un service identifié par son UUID. Répond 404 si l'identifiant est inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/services/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<ServiceContent> update(@PathVariable UUID id, @Valid @RequestBody ServiceContentRequest request) {
        return ApiResponse.of(service.update(id, request));
    }

    @Operation(tags = "Management · Services", summary = "Supprimer un service", description = "Suppression définitive de un service identifié par son UUID ; retourne 204 sans corps, 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/services/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
