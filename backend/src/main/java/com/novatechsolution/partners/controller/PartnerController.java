package com.novatechsolution.partners.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.partners.domain.Partner;
import com.novatechsolution.partners.dto.PartnerRequest;
import com.novatechsolution.partners.service.PartnerService;
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
public class PartnerController {
    private final PartnerService service;
    @Operation(tags = "Visiteur · Partenaires", summary = "Lister les partenaires publiés", description = "Retourne uniquement les partenaires publiés, triés par ordre d’affichage. Lecture seule, sans authentification.") @GetMapping("/api/v1/partners") public ApiResponse<List<Partner>> publicList(){return ApiResponse.of(service.publicList());}
    @Operation(tags = "Management · Partenaires", summary = "Lister tous les partenaires", description = "Retourne l'ensemble des partenaires, publiés ou non, pour l'édition dans l'espace de gestion. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/partners") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<Partner>> adminList(){return ApiResponse.of(service.adminList());}
    @Operation(tags = "Management · Partenaires", summary = "Créer un partenaire", description = "Crée un partenaire. Le corps est validé (Bean Validation) ; les erreurs sont renvoyées champ par champ. Retourne 201 et la ressource créée. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/partners") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<ApiResponse<Partner>> create(@Valid @RequestBody PartnerRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(r)));}
    @Operation(tags = "Management · Partenaires", summary = "Modifier un partenaire", description = "Remplace les champs de un partenaire identifié par son UUID. Répond 404 si l'identifiant est inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/partners/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<Partner> update(@PathVariable UUID id,@Valid @RequestBody PartnerRequest r){return ApiResponse.of(service.update(id,r));}
    @Operation(tags = "Management · Partenaires", summary = "Supprimer un partenaire", description = "Suppression définitive de un partenaire identifié par son UUID ; retourne 204 sans corps, 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/partners/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<Void> delete(@PathVariable UUID id){service.delete(id);return ResponseEntity.noContent().build();}
}
