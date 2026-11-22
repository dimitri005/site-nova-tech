-- Historique d'activité de démonstration sur 90 jours, pour alimenter les courbes du tableau de bord.
-- Idempotent : chaque ligne est identifiée par une adresse e-mail dédiée.
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - ((g * 37 % 90) || ' days')::interval - ((g % 9) || ' hours')::interval,
       'demo.message' || g || '@example.com', 'Contact démo ' || g, CASE WHEN g % 5 = 0 THEN 'en' ELSE 'fr' END,
       'Bonjour, je souhaite obtenir plus d’informations sur vos services (demande ' || g || ').', NULL,
       (ARRAY['NEW','READ','READ','IN_PROGRESS','RESOLVED','RESOLVED'])[1 + g % 6],
       (ARRAY['Demande d’information','Partenariat','Support','Formation','Site web'])[1 + g % 5], now()
FROM generate_series(1, 70) g
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'demo.message' || g || '@example.com');

INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), (ARRAY['100 000 – 300 000 XAF','300 000 – 600 000 XAF','500 000 – 1 000 000 XAF','1 000 000 – 3 000 000 XAF'])[1 + g % 4], TRUE,
       now() - ((g * 53 % 90) || ' days')::interval - ((g % 7) || ' hours')::interval, (ARRAY['2 semaines','1 mois','3 mois'])[1 + g % 3],
       'demo.devis' || g || '@example.com', 'Client démo ' || g, NULL, 'fr', NULL, 'Projet numérique démo n° ' || g || '.',
       (ARRAY['Site web','Application mobile','Marketing digital','Design graphique','Accompagnement','Formation sur mesure'])[1 + g % 6],
       (ARRAY['NEW','READ','IN_PROGRESS','IN_PROGRESS','ACCEPTED','ACCEPTED','REJECTED'])[1 + g % 7], now()
FROM generate_series(1, 48) g
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'demo.devis' || g || '@example.com');

INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - ((g * 41 % 90) || ' days')::interval - ((g % 5) || ' hours')::interval,
       'demo.inscrit' || g || '@example.com', 'Apprenant démo ' || g, '+2376' || lpad((50000000 + g * 7919)::text, 8, '0'), 'fr', s.id,
       (ARRAY['PENDING','CONFIRMED','CONFIRMED','CONFIRMED','CANCELLED'])[1 + g % 5], now()
FROM generate_series(1, 56) g
JOIN LATERAL (SELECT id FROM training_sessions ORDER BY starts_at, id OFFSET (g % GREATEST((SELECT count(*) FROM training_sessions), 1))::int LIMIT 1) s ON TRUE
WHERE NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'demo.inscrit' || g || '@example.com');

INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), g % 11 <> 0, TRUE, now() - ((g * 29 % 90) || ' days')::interval,
       'demo.abonne' || g || '@example.com', encode(sha256(('demo-history-' || g)::bytea), 'hex'), NULL
FROM generate_series(1, 40) g
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'demo.abonne' || g || '@example.com');
