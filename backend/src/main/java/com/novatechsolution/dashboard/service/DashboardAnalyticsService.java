package com.novatechsolution.dashboard.service;

import com.novatechsolution.dashboard.dto.DashboardAnalytics;
import com.novatechsolution.dashboard.dto.DashboardAnalytics.DayPoint;
import com.novatechsolution.dashboard.dto.DashboardAnalytics.Fill;
import com.novatechsolution.dashboard.dto.DashboardAnalytics.Slice;
import com.novatechsolution.dashboard.dto.DashboardAnalytics.Totals;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardAnalyticsService {
    private final JdbcClient jdbc;

    @Transactional(readOnly = true)
    public DashboardAnalytics analytics(int requestedDays) {
        int days = Math.min(Math.max(requestedDays, 7), 365);
        LocalDate to = LocalDate.now();
        LocalDate from = to.minusDays(days - 1L);

        // Une seule passe sur la période courante et la précédente ; les totaux s'en déduisent.
        List<DayPoint> both = dailyCounts(from.minusDays(days), to);
        List<DayPoint> previous = both.subList(0, days);
        List<DayPoint> series = both.subList(days, both.size());

        return new DashboardAnalytics(days, from, to, totals(series), totals(previous), series,
                slices("SELECT status AS label, count(*) AS value FROM quote_requests WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY status ORDER BY value DESC", from, to),
                slices("SELECT status AS label, count(*) AS value FROM contact_messages WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY status ORDER BY value DESC", from, to),
                slices("SELECT service_type AS label, count(*) AS value FROM quote_requests WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY service_type ORDER BY value DESC, label LIMIT 6", from, to),
                slices("""
                        SELECT c.title_fr AS label, count(e.id) AS value
                        FROM enrollments e JOIN training_sessions s ON s.id = e.session_id JOIN training_courses c ON c.id = s.course_id
                        WHERE e.created_at >= :from AND e.created_at < CAST(:to AS date) + 1 AND e.status <> 'CANCELLED'
                        GROUP BY c.title_fr ORDER BY value DESC, label LIMIT 6""", from, to),
                jdbc.sql("""
                        SELECT c.title_fr || ' · ' || to_char(s.starts_at, 'DD/MM') AS label, s.reserved_places AS reserved, s.capacity AS capacity
                        FROM training_sessions s JOIN training_courses c ON c.id = s.course_id
                        WHERE s.status IN ('OPEN', 'FULL') ORDER BY s.starts_at LIMIT 8""")
                        .query((rs, row) -> new Fill(rs.getString("label"), rs.getLong("reserved"), rs.getLong("capacity"))).list());
    }

    private List<DayPoint> dailyCounts(LocalDate from, LocalDate to) {
        return jdbc.sql("""
                WITH days AS (SELECT d::date AS day FROM generate_series(CAST(:from AS date), CAST(:to AS date), interval '1 day') AS d),
                     msg AS (SELECT created_at::date AS day, count(*) AS n FROM contact_messages WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY 1),
                     quo AS (SELECT created_at::date AS day, count(*) AS n FROM quote_requests WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY 1),
                     enr AS (SELECT created_at::date AS day, count(*) AS n FROM enrollments WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY 1),
                     sub AS (SELECT created_at::date AS day, count(*) AS n FROM newsletter_subscribers WHERE created_at >= :from AND created_at < CAST(:to AS date) + 1 GROUP BY 1)
                SELECT days.day, coalesce(msg.n, 0) AS messages, coalesce(quo.n, 0) AS quotes, coalesce(enr.n, 0) AS enrollments, coalesce(sub.n, 0) AS subscribers
                FROM days LEFT JOIN msg USING (day) LEFT JOIN quo USING (day) LEFT JOIN enr USING (day) LEFT JOIN sub USING (day)
                ORDER BY days.day""")
                .param("from", from).param("to", to)
                .query((rs, row) -> new DayPoint(rs.getObject("day", LocalDate.class), rs.getLong("messages"), rs.getLong("quotes"),
                        rs.getLong("enrollments"), rs.getLong("subscribers"))).list();
    }

    private static Totals totals(List<DayPoint> points) {
        return new Totals(points.stream().mapToLong(DayPoint::messages).sum(), points.stream().mapToLong(DayPoint::quotes).sum(),
                points.stream().mapToLong(DayPoint::enrollments).sum(), points.stream().mapToLong(DayPoint::subscribers).sum());
    }

    private List<Slice> slices(String sql, LocalDate from, LocalDate to) {
        return jdbc.sql(sql).param("from", from).param("to", to)
                .query((rs, row) -> new Slice(rs.getString("label"), rs.getLong("value"))).list();
    }
}
