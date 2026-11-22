package com.novatechsolution.dashboard.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Rafraîchit la vue matérialisée du tableau de bord sans bloquer les lectures. */
@Slf4j @Component @RequiredArgsConstructor
public class DashboardRefresher {
    private final JdbcTemplate jdbc;

    @Scheduled(initialDelay = 0, fixedDelayString = "${novatech.dashboard.refresh-interval:PT30S}")
    public void refresh() {
        try {
            jdbc.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY dashboard_summary");
        } catch (RuntimeException ex) {
            log.warn("Rafraîchissement du tableau de bord impossible : {}", ex.getMessage());
        }
    }
}
