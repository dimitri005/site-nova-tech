package com.novatechsolution.identity.controller;

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

@RestController @RequestMapping("/api/v1/admin/users") @RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class AdminUserController {
    private final AdminUserService service;
    @GetMapping public ApiResponse<List<AdminUserResponse>> list() { return ApiResponse.of(service.list()); }
    @PostMapping public ResponseEntity<ApiResponse<AdminUserResponse>> create(@Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(service.create(request)));
    }
    @PutMapping("/{id}") public ApiResponse<AdminUserResponse> update(@PathVariable UUID id, @Valid @RequestBody AdminUserRequest request) {
        return ApiResponse.of(service.update(id, request));
    }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id); return ResponseEntity.noContent().build();
    }
}
