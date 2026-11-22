-- Crée ou met à jour le super administrateur initial (mot de passe haché en BCrypt).
INSERT INTO admin_users (id, email, password_hash, display_name, enabled, created_at)
VALUES (gen_random_uuid(), 'admin@novatech.local', '$2y$10$bsIhG7hqCMl5fkwQVG1FjeNMdrqT5DkTLf6fyIoWv/m8B/9cWoL2q', 'Administrateur NovaTech', TRUE, now())
ON CONFLICT (email) DO UPDATE
    SET password_hash = EXCLUDED.password_hash,
        display_name  = EXCLUDED.display_name,
        enabled       = TRUE;

INSERT INTO admin_user_roles (admin_user_id, role)
SELECT id, 'SUPER_ADMIN' FROM admin_users WHERE email = 'admin@novatech.local'
ON CONFLICT DO NOTHING;

-- Invalide les sessions ouvertes de ce compte après changement de mot de passe.
DELETE FROM admin_refresh_sessions
WHERE admin_user_id = (SELECT id FROM admin_users WHERE email = 'admin@novatech.local');
