package com.novatechsolution.dashboard.controller;

import io.swagger.v3.oas.annotations.Operation;
import com.novatechsolution.dashboard.dto.DashboardAnalytics;
import com.novatechsolution.dashboard.dto.DashboardSummary;
import com.novatechsolution.dashboard.service.DashboardAnalyticsService;
import com.novatechsolution.dashboard.service.DashboardService;
import com.novatechsolution.shared.web.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController @RequiredArgsConstructor
public class DashboardController {
    private final DashboardService service;
    private final DashboardAnalyticsService analytics;
    @Operation(tags = "Management · Tableau de bord", summary = "Lire les indicateurs à traiter", description = "Retourne les compteurs instantanés (messages non lus, devis en attente, pré-inscriptions récentes, contenus publiés) lus dans une vue matérialisée rafraîchie toutes les 30 s. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/dashboard") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<DashboardSummary> summary() { return ApiResponse.of(service.summary()); }
    @Operation(tags = "Management · Tableau de bord", summary = "Lire les analyses d’activité", description = "Retourne sur une période de 7 à 365 jours (paramètre days, 30 par défaut) la série quotidienne, les totaux comparés à la période précédente, les répartitions par statut et par service, et le remplissage des sessions. Rôles requis : SUPER_ADMIN ou EDITOR.") @GetMapping("/api/v1/management/dashboard/analytics") @PreAuthorize("hasAnyRole('SUPER_ADMIN','EDITOR')")
    public ApiResponse<DashboardAnalytics> analytics(@RequestParam(defaultValue = "30") int days) { return ApiResponse.of(analytics.analytics(days)); }
}
