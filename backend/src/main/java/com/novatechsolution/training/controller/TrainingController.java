package com.novatechsolution.training.controller;

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
    @GetMapping("/api/v1/trainings") public ApiResponse<List<TrainingCourse>> publicCourses() { return ApiResponse.of(service.publicCourses()); }
    @GetMapping("/api/v1/trainings/{slug}") public ApiResponse<TrainingCourse> publicCourse(@PathVariable String slug) { return ApiResponse.of(service.publicCourse(slug)); }
    @GetMapping("/api/v1/trainings/{slug}/sessions")
    public ApiResponse<List<TrainingSessionResponse>> publicSessions(@PathVariable String slug) {
        return ApiResponse.of(service.publicSessions(slug).stream().map(TrainingSessionResponse::from).toList());
    }
    @GetMapping("/api/v1/admin/trainings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<TrainingCourse>> adminCourses() { return ApiResponse.of(service.adminCourses()); }
    @PostMapping("/api/v1/admin/trainings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<TrainingCourse>> createCourse(@Valid @RequestBody TrainingCourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.createCourse(request)));
    }
    @PutMapping("/api/v1/admin/trainings/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<TrainingCourse> updateCourse(@PathVariable UUID id, @Valid @RequestBody TrainingCourseRequest request) {
        return ApiResponse.of(service.updateCourse(id, request));
    }
    @DeleteMapping("/api/v1/admin/trainings/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteCourse(@PathVariable UUID id) { service.deleteCourse(id); return ResponseEntity.noContent().build(); }
    @GetMapping("/api/v1/admin/trainings/{courseId}/sessions") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<TrainingSessionResponse>> adminSessions(@PathVariable UUID courseId) {
        return ApiResponse.of(service.adminSessions(courseId).stream().map(TrainingSessionResponse::from).toList());
    }
    @PostMapping("/api/v1/admin/training-sessions") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<TrainingSessionResponse>> createSession(@Valid @RequestBody TrainingSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(TrainingSessionResponse.from(service.createSession(request))));
    }
    @PutMapping("/api/v1/admin/training-sessions/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<TrainingSessionResponse> updateSession(@PathVariable UUID id, @Valid @RequestBody TrainingSessionRequest request) {
        return ApiResponse.of(TrainingSessionResponse.from(service.updateSession(id, request)));
    }
    @DeleteMapping("/api/v1/admin/training-sessions/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteSession(@PathVariable UUID id) { service.deleteSession(id); return ResponseEntity.noContent().build(); }
}
