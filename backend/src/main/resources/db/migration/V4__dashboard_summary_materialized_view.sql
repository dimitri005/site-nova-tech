-- Indicateurs du tableau de bord admin, pré-calculés (une seule ligne).
-- Rafraîchie périodiquement par DashboardRefresher (REFRESH ... CONCURRENTLY).
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT
    1 AS id,
    (SELECT count(*) FROM contact_messages WHERE status = 'NEW')                          AS unread_messages,
    (SELECT count(*) FROM quote_requests WHERE status IN ('NEW', 'IN_PROGRESS'))          AS pending_quotes,
    (SELECT count(*) FROM enrollments WHERE created_at > now() - interval '7 days')       AS recent_enrollments,
    (SELECT count(*) FROM projects WHERE published)                                       AS published_projects,
    (SELECT count(*) FROM articles WHERE status = 'PUBLISHED')                            AS published_articles,
    now()                                                                                 AS refreshed_at
WITH DATA;

-- Obligatoire pour REFRESH MATERIALIZED VIEW CONCURRENTLY.
CREATE UNIQUE INDEX dashboard_summary_id_idx ON dashboard_summary (id);
