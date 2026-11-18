package com.novatechsolution.dashboard.controller;

import com.novatechsolution.dashboard.dto.DashboardSummary;
import com.novatechsolution.dashboard.service.DashboardService;
import com.novatechsolution.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequiredArgsConstructor
public class DashboardController {
    private final DashboardService service;
    @GetMapping("/api/v1/admin/dashboard") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<DashboardSummary> summary() { return ApiResponse.of(service.summary()); }
}
