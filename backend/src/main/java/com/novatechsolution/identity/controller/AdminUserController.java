package com.novatechsolution.identity.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.identity.dto.AdminUserRequest;
import com.novatechsolution.identity.dto.AdminUserResponse;
import com.novatechsolution.identity.service.AdminUserService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/api/v1/management/users") @RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminUserController {
    private final AdminUserService service;
    @Operation(tags = "Management · Utilisateurs", summary = "Lister les comptes administrateurs", description = "Retourne les comptes (sans empreinte de mot de passe) avec leurs rôles et leur statut. Rôle requis : SUPER_ADMIN uniquement.") @GetMapping public ApiResponse<List<AdminUserResponse>> list() { return ApiResponse.of(service.list()); }
    @Operation(tags = "Management · Utilisateurs", summary = "Créer un compte administrateur", description = "Crée un compte avec rôles et mot de passe initial respectant la politique (12 caractères minimum, majuscule, minuscule, chiffre), haché en BCrypt. Retourne 201. Rôle requis : SUPER_ADMIN uniquement.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping public ResponseEntity<ApiResponse<AdminUserResponse>> create(@Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }
    @Operation(tags = "Management · Utilisateurs", summary = "Modifier un compte", description = "Met à jour nom, e-mail, rôles et statut ; un mot de passe fourni remplace l’ancien ; ce changement, comme la désactivation du compte, révoque les sessions ouvertes. Rôle requis : SUPER_ADMIN uniquement.") @PutMapping("/{id}") public ApiResponse<AdminUserResponse> update(@PathVariable UUID id, @Valid @RequestBody AdminUserRequest request) {
        return ApiResponse.of(service.update(id, request));
    }
    @Operation(tags = "Management · Utilisateurs", summary = "Supprimer un compte", description = "Suppression définitive du compte ; 204 sans corps. Rôle requis : SUPER_ADMIN uniquement.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
