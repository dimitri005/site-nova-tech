package com.novatechsolution.dashboard.dto;

public record DashboardSummary(long unreadMessages, long pendingQuotes, long recentEnrollments,
                               long publishedProjects, long publishedArticles) {
}
