-- Les analyses du tableau de bord filtrent par période sur la date de création.
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests (created_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments (created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_created_at ON newsletter_subscribers (created_at);
