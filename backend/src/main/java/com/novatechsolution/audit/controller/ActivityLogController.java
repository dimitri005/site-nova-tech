package com.novatechsolution.audit.controller;

import com.novatechsolution.audit.domain.ActivityLog;
import com.novatechsolution.audit.service.ActivityLogService;
import com.novatechsolution.shared.web.ApiResponse;
import com.novatechsolution.shared.web.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequiredArgsConstructor
public class ActivityLogController {
    private final ActivityLogService service;
    @GetMapping("/api/v1/admin/activity") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ApiResponse<PageResponse<ActivityLog>> list(@ParameterObject @PageableDefault(size=20) Pageable pageable){return ApiResponse.of(PageResponse.from(service.list(pageable)));}
}
