package com.novatechsolution.projects.controller;

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
    @GetMapping("/api/v1/projects") public ApiResponse<List<Project>> publicList() { return ApiResponse.of(service.publicList()); }
    @GetMapping("/api/v1/projects/{slug}") public ApiResponse<Project> publicFind(@PathVariable String slug) { return ApiResponse.of(service.publicFind(slug)); }
    @GetMapping("/api/v1/admin/projects") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<Project>> adminList() { return ApiResponse.of(service.adminList()); }
    @PostMapping("/api/v1/admin/projects") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<Project>> create(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }
    @PutMapping("/api/v1/admin/projects/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Project> update(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request) { return ApiResponse.of(service.update(id, request)); }
    @DeleteMapping("/api/v1/admin/projects/{id}") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
