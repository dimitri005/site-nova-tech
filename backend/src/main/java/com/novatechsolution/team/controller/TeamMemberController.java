package com.novatechsolution.team.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.team.domain.TeamMember;
import com.novatechsolution.team.dto.TeamMemberRequest;
import com.novatechsolution.team.service.TeamMemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class TeamMemberController {
    private final TeamMemberService service;
    @Operation(tags = "Visiteur · Équipe", summary = "Lister les membres de l’équipe publiés", description = "Retourne uniquement les membres publiés, triés par ordre d’affichage, dans une projection publique qui n’expose pas les données internes. Lecture seule, sans authentification.") @GetMapping("/api/v1/team") public ApiResponse<List<PublicTeamMember>> publicList() {
        return ApiResponse.of(service.publicList().stream().map(PublicTeamMember::from).toList());
    }
    @Operation(tags = "Management · Équipe", summary = "Lister tous les membres de l’équipe", description = "Retourne l'ensemble des membres de l’équipe, publiés ou non, pour l'édition dans l'espace de gestion. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/team") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<TeamMember>> adminList() { return ApiResponse.of(service.adminList()); }
    @Operation(tags = "Management · Équipe", summary = "Créer un membre de l’équipe", description = "Crée un membre de l’équipe. Le corps est validé (Bean Validation) ; les erreurs sont renvoyées champ par champ. Retourne 201 et la ressource créée. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/team") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<TeamMember>> create(@Valid @RequestBody TeamMemberRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }
    @Operation(tags = "Management · Équipe", summary = "Modifier un membre de l’équipe", description = "Remplace les champs de un membre de l’équipe identifié par son UUID. Répond 404 si l'identifiant est inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/team/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<TeamMember> update(@PathVariable UUID id, @Valid @RequestBody TeamMemberRequest request) {
        return ApiResponse.of(service.update(id, request));
    }
    @Operation(tags = "Management · Équipe", summary = "Supprimer un membre de l’équipe", description = "Suppression définitive de un membre de l’équipe identifié par son UUID ; retourne 204 sans corps, 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/team/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
