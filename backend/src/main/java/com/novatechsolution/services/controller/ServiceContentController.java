package com.novatechsolution.services.controller;

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

    @GetMapping("/api/v1/services")
    public ApiResponse<List<ServiceContent>> publicList() { return ApiResponse.of(service.publicList()); }

    @GetMapping("/api/v1/services/{slug}")
    public ApiResponse<ServiceContent> publicFind(@PathVariable String slug) { return ApiResponse.of(service.publicFind(slug)); }

    @GetMapping("/api/v1/admin/services")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<List<ServiceContent>> adminList() { return ApiResponse.of(service.adminList()); }

    @PostMapping("/api/v1/admin/services")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<ApiResponse<ServiceContent>> create(@Valid @RequestBody ServiceContentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }

    @PutMapping("/api/v1/admin/services/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<ServiceContent> update(@PathVariable UUID id, @Valid @RequestBody ServiceContentRequest request) {
        return ApiResponse.of(service.update(id, request));
    }

    @DeleteMapping("/api/v1/admin/services/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) { service.delete(id); return ResponseEntity.noContent().build(); }
}
