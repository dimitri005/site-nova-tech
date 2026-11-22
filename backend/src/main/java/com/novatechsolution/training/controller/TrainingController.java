package com.novatechsolution.training.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.training.domain.TrainingCourse;
import com.novatechsolution.training.domain.TrainingSession;
import com.novatechsolution.training.dto.TrainingCourseRequest;
import com.novatechsolution.training.dto.TrainingSessionRequest;
import com.novatechsolution.training.dto.TrainingSessionResponse;
import com.novatechsolution.training.service.TrainingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController @RequiredArgsConstructor
public class TrainingController {
    private final TrainingService service;
    @Operation(tags = "Visiteur · Formations", summary = "Lister les formations publiées", description = "Retourne les formations publiées, triées par intitulé français. Lecture seule, sans authentification.") @GetMapping("/api/v1/trainings") public ApiResponse<List<TrainingCourse>> publicCourses() { return ApiResponse.of(service.publicCourses()); }
    @Operation(tags = "Visiteur · Formations", summary = "Consulter une formation publiée", description = "Retourne le détail d’une formation (objectifs, public, prérequis, programme) à partir de son slug. 404 si elle n’existe pas ou n’est pas publiée.") @GetMapping("/api/v1/trainings/{slug}") public ApiResponse<TrainingCourse> publicCourse(@PathVariable String slug) { return ApiResponse.of(service.publicCourse(slug)); }
    @Operation(tags = "Visiteur · Formations", summary = "Lister les sessions d’une formation", description = "Retourne les sessions ouvertes ou complètes d’une formation publiée, triées par date de début, avec capacité et places réservées. 404 si la formation est inconnue.") @GetMapping("/api/v1/trainings/{slug}/sessions")
    public ApiResponse<List<TrainingSessionResponse>> publicSessions(@PathVariable String slug) {
        return ApiResponse.of(service.publicSessions(slug).stream().map(TrainingSessionResponse::from).toList());
    }
    @Operation(tags = "Management · Formations", summary = "Lister toutes les formations", description = "Retourne toutes les formations, publiées ou non. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/trainings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<TrainingCourse>> adminCourses() { return ApiResponse.of(service.adminCourses()); }
    @Operation(tags = "Management · Formations", summary = "Créer une formation", description = "Crée une formation (contenu bilingue, tarif indicatif, durée). Retourne 201. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/trainings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<TrainingCourse>> createCourse(@Valid @RequestBody TrainingCourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.createCourse(request)));
    }
    @Operation(tags = "Management · Formations", summary = "Modifier une formation", description = "Remplace les champs d’une formation identifiée par son UUID. 404 si inconnue. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/trainings/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<TrainingCourse> updateCourse(@PathVariable UUID id, @Valid @RequestBody TrainingCourseRequest request) {
        return ApiResponse.of(service.updateCourse(id, request));
    }
    @Operation(tags = "Management · Formations", summary = "Supprimer une formation", description = "Suppression définitive d’une formation ; 204 sans corps, 404 si inconnue. Rôle requis : SUPER_ADMIN uniquement.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/trainings/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) { service.deleteCourse(id); return ResponseEntity.noContent().build(); }
    @Operation(tags = "Management · Sessions de formation", summary = "Lister les sessions d’une formation", description = "Retourne toutes les sessions d’une formation, triées par date de début, avec places réservées et capacité. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/trainings/{courseId}/sessions") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<TrainingSessionResponse>> adminSessions(@PathVariable UUID courseId) {
        return ApiResponse.of(service.adminSessions(courseId).stream().map(TrainingSessionResponse::from).toList());
    }
    @Operation(tags = "Management · Sessions de formation", summary = "Planifier une session", description = "Crée une session rattachée à une formation (dates, lieu, capacité, statut). Retourne 201. Rôles requis : SUPER_ADMIN ou EDITOR.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Créé")) @PostMapping("/api/v1/management/training-sessions") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<TrainingSessionResponse>> createSession(@Valid @RequestBody TrainingSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(TrainingSessionResponse.from(service.createSession(request))));
    }
    @Operation(tags = "Management · Sessions de formation", summary = "Modifier une session", description = "Met à jour dates, lieu, capacité et statut d’une session ; la gestion des places utilise un verrou optimiste (champ version). 404 si inconnue. Rôles requis : SUPER_ADMIN ou EDITOR.") @PutMapping("/api/v1/management/training-sessions/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<TrainingSessionResponse> updateSession(@PathVariable UUID id, @Valid @RequestBody TrainingSessionRequest request) {
        return ApiResponse.of(TrainingSessionResponse.from(service.updateSession(id, request)));
    }
    @Operation(tags = "Management · Sessions de formation", summary = "Supprimer une session", description = "Suppression définitive d’une session ; 204 sans corps. Rôle requis : SUPER_ADMIN uniquement.", responses = @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "204", description = "Sans contenu")) @DeleteMapping("/api/v1/management/training-sessions/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID id) { service.deleteSession(id); return ResponseEntity.noContent().build(); }
}
