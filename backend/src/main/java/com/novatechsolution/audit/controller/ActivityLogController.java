package com.novatechsolution.audit.controller;

import io.swagger.v3.oas.annotations.Operation;
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
    @Operation(tags = "Management · Journal d’activité", summary = "Consulter le journal d’activité", description = "Retourne, page par page, les actions d’écriture effectuées dans l’espace de gestion (utilisateur, méthode, route, statut). Paramètres page, size et sort. Rôle requis : SUPER_ADMIN uniquement.") @GetMapping("/api/v1/management/activity") @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ApiResponse<PageResponse<ActivityLog>> list(@ParameterObject @PageableDefault(size=20) Pageable pageable){return ApiResponse.of(PageResponse.from(service.list(pageable)));}
}
