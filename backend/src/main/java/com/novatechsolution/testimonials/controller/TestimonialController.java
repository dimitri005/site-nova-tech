package com.novatechsolution.testimonials.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.testimonials.domain.Testimonial;
import com.novatechsolution.testimonials.dto.TestimonialRequest;
import com.novatechsolution.testimonials.service.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class TestimonialController {
    private final TestimonialService service;
    @Operation(tags = "Visiteur · Témoignages", summary = "Lister les témoignages publiés", description = "Retourne uniquement les témoignages publiés, triés par ordre d’affichage. Lecture seule, sans authentification.") @GetMapping("/api/v1/testimonials") public ApiResponse<List<Testimonial>> publicList() { return ApiResponse.of(service.publicList()); }
    @Operation(tags = "Management · Témoignages", summary = "Lister tous les témoignages", description = "Retourne l'ensemble des témoignages, publiés ou non, pour l'édition dans l'espace de gestion. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/testimonials") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<List<Testimonial>> adminList() { return ApiResponse.of(service.adminList()); }
    @Operation(tags = "Management · Témoignages", summary = "Créer un témoignage", description = "Crée un témoignage. Le corps est validé (Bean Validation) ; les erreurs sont renvoyées champ par champ. Retourne 201 et la ressource créée. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/testimonials") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<ApiResponse<Testimonial>> create(@Valid @RequestBody TestimonialRequest r) { return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(r))); }
    @Operation(tags = "Management · Témoignages", summary = "Modifier un témoignage", description = "Remplace les champs de un témoignage identifié par son UUID. Répond 404 si l'identifiant est inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/testimonials/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ApiResponse<Testimonial> update(@PathVariable UUID id,@Valid @RequestBody TestimonialRequest r) { return ApiResponse.of(service.update(id,r)); }
    @Operation(tags = "Management · Témoignages", summary = "Supprimer un témoignage", description = "Suppression définitive de un témoignage identifié par son UUID ; retourne 204 sans corps, 404 si inconnu. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/testimonials/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')") public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
