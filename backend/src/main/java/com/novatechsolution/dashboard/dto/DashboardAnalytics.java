package com.novatechsolution.dashboard.dto;

import java.time.LocalDate;
import java.util.List;

/** Indicateurs d'activité sur une période, avec comparaison à la période précédente. */
public record DashboardAnalytics(int days, LocalDate from, LocalDate to, Totals totals, Totals previousTotals,
                                 List<DayPoint> series, List<Slice> quoteStatus, List<Slice> messageStatus,
                                 List<Slice> quotesByService, List<Slice> enrollmentsByCourse, List<Fill> sessionFill) {
    public record Totals(long messages, long quotes, long enrollments, long subscribers) {}
    public record DayPoint(LocalDate date, long messages, long quotes, long enrollments, long subscribers) {}
    public record Slice(String label, long value) {}
    public record Fill(String label, long reserved, long capacity) {}
}
