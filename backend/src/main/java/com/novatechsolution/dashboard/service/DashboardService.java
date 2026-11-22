package com.novatechsolution.dashboard.service;

import com.novatechsolution.dashboard.dto.DashboardSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Lit les indicateurs pré-calculés dans la vue matérialisée {@code dashboard_summary}. */
@Service @RequiredArgsConstructor
public class DashboardService {
    private final JdbcClient jdbc;

    @Transactional(readOnly = true)
    public DashboardSummary summary() {
        return jdbc.sql("""
                SELECT unread_messages, pending_quotes, recent_enrollments, published_projects, published_articles
                FROM dashboard_summary WHERE id = 1""")
                .query((rs, row) -> new DashboardSummary(rs.getLong("unread_messages"), rs.getLong("pending_quotes"),
                        rs.getLong("recent_enrollments"), rs.getLong("published_projects"), rs.getLong("published_articles")))
                .optional().orElse(new DashboardSummary(0, 0, 0, 0, 0));
    }
}
