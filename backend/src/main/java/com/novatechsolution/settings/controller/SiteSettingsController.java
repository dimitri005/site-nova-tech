package com.novatechsolution.settings.controller;

import com.novatechsolution.settings.dto.SiteSettingsRequest;
import com.novatechsolution.settings.service.SiteSettingsService;
import com.novatechsolution.shared.web.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequiredArgsConstructor
public class SiteSettingsController {
    private final SiteSettingsService service;
    @GetMapping("/api/v1/settings/public") public ApiResponse<Map<String, String>> publicValues() { return ApiResponse.of(service.publicValues()); }
    @GetMapping("/api/v1/admin/settings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Map<String, String>> adminValues() { return ApiResponse.of(service.adminValues()); }
    @PutMapping("/api/v1/admin/settings") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<Map<String, String>> replace(@Valid @RequestBody SiteSettingsRequest request) { return ApiResponse.of(service.replace(request)); }
}
