-- Complète les données de démonstration pour que chaque rubrique contienne au moins 7 éléments.
-- Idempotent : ne remplace jamais une ligne existante.

-- Services (5 -> 7)
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'support', now(), 'Troubleshooting, preventive maintenance and support to keep your equipment reliable every day.', 'Dépannage, maintenance préventive et assistance pour que vos équipements restent fiables au quotidien.', 6, NULL, TRUE, 'maintenance-support', 'IT maintenance and support', 'Maintenance et support informatique', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'design', now(), 'Logo, brand guidelines and communication materials that give your brand a clear and consistent image.', 'Logo, charte graphique et supports de communication qui donnent une image claire et cohérente à votre marque.', 7, NULL, TRUE, 'identite-visuelle', 'Visual identity and graphic design', 'Identité visuelle et design graphique', now())
ON CONFLICT (slug) DO NOTHING;

-- Projets (4 -> 7)
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'web', 'Hôtel partenaire', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', now(), 'An online booking site that is simple for customers and easy for the team to manage.', 'Un site de réservation en ligne simple pour les clients et facile à gérer pour l’équipe.', FALSE, CURRENT_DATE - 145, NULL, TRUE, 'plateforme-reservation', 'Booking platform', 'Plateforme de réservation', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'React' FROM projects WHERE slug = 'plateforme-reservation'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'React');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'API REST' FROM projects WHERE slug = 'plateforme-reservation'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'API REST');
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'mobile', 'Commerce local', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80', now(), 'A mobile app to follow orders and deliveries in real time.', 'Une application mobile pour suivre les commandes et les livraisons en temps réel.', TRUE, CURRENT_DATE - 170, NULL, TRUE, 'application-mobile-livraison', 'Delivery app', 'Application de livraison', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Mobile' FROM projects WHERE slug = 'application-mobile-livraison'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Mobile');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Géolocalisation' FROM projects WHERE slug = 'application-mobile-livraison'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Géolocalisation');
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'design', 'Start-up locale', 'https://images.unsplash.com/photo-1561070791-2526d30994b8?auto=format&fit=crop&w=1200&q=80', now(), 'A logo, brand guidelines and printed materials created for a young company.', 'Création d’un logo, d’une charte graphique et de supports imprimés pour une jeune entreprise.', FALSE, CURRENT_DATE - 195, NULL, TRUE, 'identite-de-marque', 'Brand identity', 'Identité de marque', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Design' FROM projects WHERE slug = 'identite-de-marque'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Design');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Branding' FROM projects WHERE slug = 'identite-de-marque'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Branding');

-- Formations (3 -> 7) et une session chacune
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Entrepreneurs and community managers.', 'Entrepreneurs et community managers.', now(), 'XAF', 'Manage your business communication on social media.', 'Gérez la communication de votre activité sur les réseaux sociaux.', 32, NULL, NULL, NULL, NULL, 'Basic computer skills.', 'Utilisation de base d’un ordinateur.', 'Content strategy
Visual creation
Measuring results', 'Stratégie de contenu
Création de visuels
Mesure des résultats', TRUE, 'marketing-digital-reseaux-sociaux', 'Digital marketing and social media', 'Marketing digital et réseaux sociaux', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 15, now() + interval '88 days', 3, now() + interval '60 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'marketing-digital-reseaux-sociaux'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Accountants, managers and assistants.', 'Comptables, gestionnaires et assistants.', now(), 'XAF', 'Master formulas, pivot tables and dashboards.', 'Maîtrisez les formules, tableaux croisés dynamiques et tableaux de bord.', 24, NULL, NULL, NULL, NULL, 'Basic computer skills.', 'Utilisation de base d’un ordinateur.', 'Advanced formulas
Pivot tables
Dashboards', 'Formules avancées
Tableaux croisés dynamiques
Tableaux de bord', TRUE, 'excel-avance', 'Advanced Excel', 'Excel avancé', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 15, now() + interval '91 days', 4, now() + interval '70 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'excel-avance'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'General public and small businesses.', 'Tout public et petites entreprises.', now(), 'XAF', 'Protect your data and accounts with simple good practices.', 'Protégez vos données et vos comptes avec de bonnes pratiques simples.', 16, NULL, NULL, NULL, NULL, 'Basic computer skills.', 'Utilisation de base d’un ordinateur.', 'Passwords and authentication
Phishing
Backups', 'Mots de passe et authentification
Hameçonnage
Sauvegardes', TRUE, 'initiation-cybersecurite', 'Introduction to cybersecurity', 'Initiation à la cybersécurité', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 15, now() + interval '94 days', 5, now() + interval '80 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'initiation-cybersecurite'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Beginner developers.', 'Développeurs débutants.', now(), 'XAF', 'Build your first mobile app, from idea to release.', 'Concevez votre première application mobile, de l’idée à la publication.', 64, NULL, NULL, NULL, NULL, 'Basic computer skills.', 'Utilisation de base d’un ordinateur.', 'Mobile interface
Data and APIs
Publishing', 'Interface mobile
Données et API
Publication', TRUE, 'developpement-mobile', 'Mobile app development', 'Développement d’applications mobiles', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 15, now() + interval '146 days', 6, now() + interval '90 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'developpement-mobile'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);

-- Équipe (3 -> 7)
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'Leads the company vision and partner relationships.', 'Pilote la vision de l’entreprise et la relation avec les partenaires.', 'STAFF', now(), 4, NULL, NULL, 'Direction générale', NULL, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80', 'Management and strategy', 'Direction et stratégie', TRUE, 'direction-generale', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'Designs and maintains our clients’ websites and applications.', 'Conçoit et maintient les sites et applications de nos clients.', 'STAFF', now(), 5, NULL, NULL, 'Pôle développement', NULL, 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Software engineering', 'Ingénierie logicielle', TRUE, 'pole-developpement', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'Answers requests and supports clients after delivery.', 'Répond aux demandes et accompagne les clients après la livraison.', 'STAFF', now(), 6, NULL, NULL, 'Pôle support', NULL, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80', 'Customer support', 'Support client', TRUE, 'pole-support', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'Grows the online visibility of NOVA-TECH and its clients.', 'Développe la visibilité de NOVA-TECH et de ses clients en ligne.', 'STAFF', now(), 7, NULL, NULL, 'Pôle marketing', NULL, 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80', 'Digital marketing', 'Marketing digital', TRUE, 'pole-marketing', now())
ON CONFLICT (slug) DO NOTHING;

-- Témoignages (1 -> 7)
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Aïcha M.', 'Manager', 'Gérante', now(), 2, 'Boutique Élégance', TRUE, 'Our website is clear and our orders grew from the first month.', 'Notre site est clair et nos commandes ont augmenté dès le premier mois.', 5
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE author_name = 'Aïcha M.');
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Jean-Paul K.', 'Director', 'Directeur', now(), 3, 'Cabinet Kamga', TRUE, 'A listening team, deadlines met and a professional result.', 'Une équipe à l’écoute, des délais respectés et un résultat professionnel.', 5
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE author_name = 'Jean-Paul K.');
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Sandrine T.', 'Communication manager', 'Responsable communication', now(), 4, 'Association Horizon', TRUE, 'The graphic design training made us independent with our visuals.', 'La formation en création graphique nous a rendus autonomes sur nos visuels.', 5
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE author_name = 'Sandrine T.');
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Patrick N.', 'Entrepreneur', 'Entrepreneur', now(), 5, 'Nkono Services', TRUE, 'They turned our need into a simple tool the whole team uses.', 'Ils ont su traduire notre besoin en un outil simple que toute l’équipe utilise.', 4
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE author_name = 'Patrick N.');
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Mireille D.', 'Student', 'Étudiante', now(), 6, 'Formation Bureautique', TRUE, 'Practical classes and a patient trainer: I gained confidence.', 'Des cours pratiques et un formateur patient : j’ai gagné en confiance.', 5
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE author_name = 'Mireille D.');
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Hervé B.', 'Project manager', 'Chef de projet', now(), 7, 'Groupe Bassa', TRUE, 'Serious support from defining the need to going live.', 'Un accompagnement sérieux, de la définition du besoin jusqu’à la mise en ligne.', 4
WHERE NOT EXISTS (SELECT 1 FROM testimonials WHERE author_name = 'Hervé B.');

-- Partenaires (0 -> 7)
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 1, 'https://placehold.co/240x120?text=Orange+Cameroun', 'Orange Cameroun', TRUE, 'https://www.orange.cm'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Orange Cameroun');
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 2, 'https://placehold.co/240x120?text=MTN+Cameroun', 'MTN Cameroun', TRUE, 'https://www.mtn.cm'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'MTN Cameroun');
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 3, 'https://placehold.co/240x120?text=Campost', 'Campost', TRUE, 'https://www.campost.cm'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Campost');
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 4, 'https://placehold.co/240x120?text=Université+de+Douala', 'Université de Douala', TRUE, 'https://www.univ-douala.com'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Université de Douala');
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 5, 'https://placehold.co/240x120?text=Chambre+de+Commerce+du+Cameroun', 'Chambre de Commerce du Cameroun', TRUE, 'https://www.camerco.org'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Chambre de Commerce du Cameroun');
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 6, 'https://placehold.co/240x120?text=Afriland+First+Bank', 'Afriland First Bank', TRUE, 'https://www.afrilandfirstbank.com'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Afriland First Bank');
INSERT INTO partners (id, created_at, display_order, logo_url, name, published, website_url)
SELECT gen_random_uuid(), now(), 7, 'https://placehold.co/240x120?text=Express+Union', 'Express Union', TRUE, 'https://www.expressunion.net'
WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Express Union');

-- Articles (0 -> 7)
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'A website reassures your customers, presents your services and works for you around the clock.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Un site web rassure vos clients, présente vos services et travaille pour vous 24 h/24.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Entreprise', 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1200&q=80', now(), 'A website reassures your customers, presents your services and works for you around the clock.', 'Un site web rassure vos clients, présente vos services et travaille pour vous 24 h/24.', now() - interval '6 days', 'A website reassures your customers, presents your services and works for you around the clock.', 'Un site web rassure vos clients, présente vos services et travaille pour vous 24 h/24.', 'Why your business needs a website', 'Pourquoi votre entreprise a besoin d’un site web', 'pourquoi-un-site-web-pour-votre-entreprise', 'PUBLISHED', 'Why your business needs a website', 'Pourquoi votre entreprise a besoin d’un site web', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Level, goals, duration: the questions to ask before enrolling.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Niveau, objectifs, durée : les questions à se poser avant de s’inscrire.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Formation', 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', now(), 'Level, goals, duration: the questions to ask before enrolling.', 'Niveau, objectifs, durée : les questions à se poser avant de s’inscrire.', now() - interval '12 days', 'Level, goals, duration: the questions to ask before enrolling.', 'Niveau, objectifs, durée : les questions à se poser avant de s’inscrire.', 'How to choose an IT course', 'Comment choisir sa formation informatique', 'choisir-sa-formation-informatique', 'PUBLISHED', 'How to choose an IT course', 'Comment choisir sa formation informatique', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Unique passwords, two-factor authentication and caution with suspicious messages.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Mots de passe uniques, double authentification et prudence face aux messages suspects.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Sécurité', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80', now(), 'Unique passwords, two-factor authentication and caution with suspicious messages.', 'Mots de passe uniques, double authentification et prudence face aux messages suspects.', now() - interval '18 days', 'Unique passwords, two-factor authentication and caution with suspicious messages.', 'Mots de passe uniques, double authentification et prudence face aux messages suspects.', 'Five habits to secure your online accounts', 'Cinq gestes pour sécuriser vos comptes en ligne', 'securiser-ses-comptes-en-ligne', 'PUBLISHED', 'Five habits to secure your online accounts', 'Cinq gestes pour sécuriser vos comptes en ligne', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Which networks to choose, what to post and how to measure results.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Quels réseaux choisir, quoi publier et comment mesurer vos résultats.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Marketing', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80', now(), 'Which networks to choose, what to post and how to measure results.', 'Quels réseaux choisir, quoi publier et comment mesurer vos résultats.', now() - interval '24 days', 'Which networks to choose, what to post and how to measure results.', 'Quels réseaux choisir, quoi publier et comment mesurer vos résultats.', 'Social media for small businesses', 'Les réseaux sociaux au service des PME', 'reseaux-sociaux-pme', 'PUBLISHED', 'Social media for small businesses', 'Les réseaux sociaux au service des PME', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'The criteria to decide based on your audience, budget and goals.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Les critères pour décider selon votre public, votre budget et vos objectifs.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Développement', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80', now(), 'The criteria to decide based on your audience, budget and goals.', 'Les critères pour décider selon votre public, votre budget et vos objectifs.', now() - interval '30 days', 'The criteria to decide based on your audience, budget and goals.', 'Les critères pour décider selon votre public, votre budget et vos objectifs.', 'Mobile app or website: which to choose?', 'Application mobile ou site web : que choisir ?', 'application-mobile-ou-site-web', 'PUBLISHED', 'Mobile app or website: which to choose?', 'Application mobile ou site web : que choisir ?', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'The five things to specify so your digital project starts on solid ground.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Les cinq éléments à préciser pour que votre projet numérique démarre sur de bonnes bases.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Conseil', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80', now(), 'The five things to specify so your digital project starts on solid ground.', 'Les cinq éléments à préciser pour que votre projet numérique démarre sur de bonnes bases.', now() - interval '36 days', 'The five things to specify so your digital project starts on solid ground.', 'Les cinq éléments à préciser pour que votre projet numérique démarre sur de bonnes bases.', 'Writing a simple project brief', 'Rédiger un cahier des charges simple', 'cahier-des-charges-simple', 'PUBLISHED', 'Writing a simple project brief', 'Rédiger un cahier des charges simple', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO articles (id, body_en, body_fr, category, cover_image_url, created_at, excerpt_en, excerpt_fr, published_at, seo_description_en, seo_description_fr, seo_title_en, seo_title_fr, slug, status, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Shortcuts, templates and formulas to work faster every day.

At NOVA-TECH, we help businesses and individuals turn this advice into concrete results. Contact us to discuss it.', 'Raccourcis, modèles et formules pour travailler plus vite au quotidien.

Chez NOVA-TECH, nous accompagnons les entreprises et les particuliers pour transformer ces conseils en résultats concrets. Contactez-nous pour en discuter.', 'Productivité', 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80', now(), 'Shortcuts, templates and formulas to work faster every day.', 'Raccourcis, modèles et formules pour travailler plus vite au quotidien.', now() - interval '42 days', 'Shortcuts, templates and formulas to work faster every day.', 'Raccourcis, modèles et formules pour travailler plus vite au quotidien.', 'Office software: five time-saving tips', 'Bureautique : cinq astuces pour gagner du temps', 'bureautique-gagner-du-temps', 'PUBLISHED', 'Office software: five time-saving tips', 'Bureautique : cinq astuces pour gagner du temps', now())
ON CONFLICT (slug) DO NOTHING;

-- Pages statiques (0 -> 7)
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('a-propos', 'NOVA-TECH-SOLUTION builds digital solutions and trains tomorrow’s talent in Cameroon.', 'NOVA-TECH-SOLUTION conçoit des solutions numériques et forme les talents de demain au Cameroun.', TRUE, 'About us', 'À propos', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('mentions-legales', 'Publisher: NOVA-TECH-SOLUTION, Cameroon. Contact: through the website form.', 'Éditeur : NOVA-TECH-SOLUTION, Cameroun. Contact : via le formulaire du site.', TRUE, 'Legal notice', 'Mentions légales', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('confidentialite', 'We only collect the data needed to answer your requests and never resell it.', 'Nous collectons uniquement les données nécessaires pour répondre à vos demandes et ne les revendons jamais.', TRUE, 'Privacy policy', 'Politique de confidentialité', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('conditions-utilisation', 'Using the site implies acceptance of these terms.', 'L’utilisation du site implique l’acceptation des présentes conditions.', TRUE, 'Terms of use', 'Conditions d’utilisation', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('cookies', 'The site only uses technical cookies required for it to work.', 'Le site utilise uniquement des cookies techniques nécessaires à son fonctionnement.', TRUE, 'Cookie policy', 'Politique des cookies', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('faq', 'Find answers to the most common questions about our services and training.', 'Retrouvez les réponses aux questions les plus courantes sur nos services et nos formations.', TRUE, 'Frequently asked questions', 'Questions fréquentes', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO static_pages (slug, body_en, body_fr, published, title_en, title_fr, updated_at)
VALUES ('plan-du-site', 'Home, services, projects, training, team, news and contact.', 'Accueil, services, réalisations, formations, équipe, actualités et contact.', TRUE, 'Site map', 'Plan du site', now())
ON CONFLICT (slug) DO NOTHING;

-- Messages de contact (0 -> 7)
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '1 days', 'alain.fotso@example.com', 'Alain Fotso', 'fr', 'Bonjour, pouvez-vous me présenter vos services ?', '+237670000000', 'NEW', 'Demande d’information', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'alain.fotso@example.com' AND subject = 'Demande d’information');
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '2 days', 'brigitte.mbarga@example.com', 'Brigitte Mbarga', 'fr', 'Nous souhaitons discuter d’un partenariat avec votre équipe.', '+237671111111', 'NEW', 'Partenariat', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'brigitte.mbarga@example.com' AND subject = 'Partenariat');
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '3 days', 'cedric.ndi@example.com', 'Cédric Ndi', 'fr', 'Quelles sont les prochaines dates de formation Excel ?', '+237672222222', 'READ', 'Formation Excel', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'cedric.ndi@example.com' AND subject = 'Formation Excel');
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '4 days', 'diane.essomba@example.com', 'Diane Essomba', 'fr', 'Je souhaite un site pour mon activité de couture.', '+237673333333', 'IN_PROGRESS', 'Site vitrine', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'diane.essomba@example.com' AND subject = 'Site vitrine');
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '5 days', 'emmanuel.tchoua@example.com', 'Emmanuel Tchoua', 'fr', 'Mon site est lent depuis hier, pouvez-vous regarder ?', '+237674444444', 'RESOLVED', 'Support', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'emmanuel.tchoua@example.com' AND subject = 'Support');
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '6 days', 'florence.abena@example.com', 'Florence Abena', 'fr', 'Auriez-vous une offre de stage en développement web ?', '+237675555555', 'NEW', 'Stage', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'florence.abena@example.com' AND subject = 'Stage');
INSERT INTO contact_messages (id, consent, created_at, email, full_name, language, message, phone, status, subject, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '7 days', 'georges.biya@example.com', 'Georges Biya', 'fr', 'Je cherche à faire développer une application de gestion de stock.', '+237676666666', 'READ', 'Devis application', now()
WHERE NOT EXISTS (SELECT 1 FROM contact_messages WHERE email = 'georges.biya@example.com' AND subject = 'Devis application');

-- Demandes de devis (0 -> 7)
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), '500 000 – 1 000 000 XAF', TRUE, now() - interval '2 days', '1 mois', 'helene.kouam@example.com', 'Hélène Kouam', NULL, 'fr', '+237660000000', 'Site vitrine avec galerie pour un salon de coiffure.', 'Site web', 'NEW', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'helene.kouam@example.com' AND service_type = 'Site web');
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), '1 000 000 – 3 000 000 XAF', TRUE, now() - interval '3 days', '3 mois', 'ibrahim.sali@example.com', 'Ibrahim Sali', NULL, 'fr', '+237661234567', 'Application de suivi de livraisons pour 10 livreurs.', 'Application mobile', 'IN_PROGRESS', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'ibrahim.sali@example.com' AND service_type = 'Application mobile');
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), '200 000 – 500 000 XAF', TRUE, now() - interval '4 days', '2 semaines', 'julienne.ateba@example.com', 'Julienne Ateba', NULL, 'fr', '+237662469134', 'Campagne de lancement sur les réseaux sociaux.', 'Marketing digital', 'NEW', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'julienne.ateba@example.com' AND service_type = 'Marketing digital');
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), '100 000 – 300 000 XAF', TRUE, now() - interval '5 days', '3 semaines', 'kevin.manga@example.com', 'Kevin Manga', NULL, 'fr', '+237663703701', 'Logo et charte graphique pour une nouvelle marque de jus.', 'Design graphique', 'ACCEPTED', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'kevin.manga@example.com' AND service_type = 'Design graphique');
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), '500 000 – 1 000 000 XAF', TRUE, now() - interval '6 days', '6 semaines', 'laurette.fouda@example.com', 'Laurette Fouda', NULL, 'fr', '+237664938268', 'Boutique en ligne de produits artisanaux.', 'Site web', 'READ', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'laurette.fouda@example.com' AND service_type = 'Site web');
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), 'À définir', TRUE, now() - interval '7 days', 'Flexible', 'martin.owona@example.com', 'Martin Owona', NULL, 'fr', '+237666172835', 'Audit des outils numériques d’une PME de 15 personnes.', 'Accompagnement', 'NEW', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'martin.owona@example.com' AND service_type = 'Accompagnement');
INSERT INTO quote_requests (id, budget_range, consent, created_at, desired_deadline, email, full_name, internal_notes, language, phone, project_description, service_type, status, updated_at)
SELECT gen_random_uuid(), '300 000 – 600 000 XAF', TRUE, now() - interval '8 days', '1 mois', 'nadege.tamo@example.com', 'Nadège Tamo', NULL, 'fr', '+237667407402', 'Formation bureautique pour une équipe administrative.', 'Formation sur mesure', 'REJECTED', now()
WHERE NOT EXISTS (SELECT 1 FROM quote_requests WHERE email = 'nadege.tamo@example.com' AND service_type = 'Formation sur mesure');

-- Pré-inscriptions (0 -> 7)
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '0 days', 'odile.mvondo@example.com', 'Odile Mvondo', '+237650000000', 'fr', ts.id, 'PENDING', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'programmation-web'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'odile.mvondo@example.com');
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '1 days', 'pascal.etoundi@example.com', 'Pascal Etoundi', '+237652222222', 'fr', ts.id, 'CONFIRMED', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'bureautique'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'pascal.etoundi@example.com');
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '2 days', 'quentin.nga@example.com', 'Quentin Nga', '+237654444444', 'fr', ts.id, 'PENDING', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'design-photoshop'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'quentin.nga@example.com');
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '3 days', 'rosine.lele@example.com', 'Rosine Lele', '+237656666666', 'fr', ts.id, 'CONFIRMED', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'marketing-digital-reseaux-sociaux'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'rosine.lele@example.com');
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '4 days', 'samuel.zang@example.com', 'Samuel Zang', '+237658888888', 'fr', ts.id, 'CANCELLED', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'excel-avance'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'samuel.zang@example.com');
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '5 days', 'tatiana.ebogo@example.com', 'Tatiana Ebogo', '+237661111110', 'fr', ts.id, 'PENDING', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'initiation-cybersecurite'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'tatiana.ebogo@example.com');
INSERT INTO enrollments (id, consent, created_at, email, full_name, phone, preferred_language, session_id, status, updated_at)
SELECT gen_random_uuid(), TRUE, now() - interval '6 days', 'urbain.meka@example.com', 'Urbain Meka', '+237663333332', 'fr', ts.id, 'CONFIRMED', now()
FROM training_sessions ts JOIN training_courses c ON c.id = ts.course_id WHERE c.slug = 'developpement-mobile'
  AND NOT EXISTS (SELECT 1 FROM enrollments WHERE email = 'urbain.meka@example.com');

-- Abonnés à la newsletter (0 -> 7)
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '0 days', 'abonne1@example.com', '867a601dedb5b9b8d8ba5325b38bd640092dc2b00a9da8cbb58ccf7b36c000ca', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne1@example.com');
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '3 days', 'abonne2@example.com', 'ac7688ee12fa1ecb859c65f4f6e2b5e26bf2b29522af9dc193b04a7031d86782', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne2@example.com');
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '6 days', 'abonne3@example.com', 'c1eaa800b975f00194df45405b81d6116888684ce21a710e2e286a95be378f9f', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne3@example.com');
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '9 days', 'abonne4@example.com', '9b2f03677f2d7ea48d885899d2c6f9eabc492c03fcf52bc7eca43f9addde20d9', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne4@example.com');
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '12 days', 'abonne5@example.com', '65c7b762f9ed658cf5e5d5575a065257df08c4d2a219f0d9597a18d793323fe6', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne5@example.com');
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '15 days', 'abonne6@example.com', '6b5be4fe5d586d5428bc83c13052b372434aea46f2a5af20d53d630d835036e6', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne6@example.com');
INSERT INTO newsletter_subscribers (id, active, consent, created_at, email, unsubscribe_token_hash, unsubscribed_at)
SELECT gen_random_uuid(), TRUE, TRUE, now() - interval '18 days', 'abonne7@example.com', '92ffef0cb591d9add7a73294cf01f70fc5d2251810669c4e5c41751b99fe2726', NULL
WHERE NOT EXISTS (SELECT 1 FROM newsletter_subscribers WHERE email = 'abonne7@example.com');

-- Journal d’activité (0 -> 7)
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '5 minutes', 'POST', '/api/v1/auth/login', 200
WHERE (SELECT count(*) FROM activity_logs) < 7;
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '45 minutes', 'PUT', '/api/v1/admin/projects/demo', 200
WHERE (SELECT count(*) FROM activity_logs) < 7;
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '85 minutes', 'POST', '/api/v1/admin/articles', 201
WHERE (SELECT count(*) FROM activity_logs) < 7;
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '125 minutes', 'PATCH', '/api/v1/admin/contact-messages/demo/status', 200
WHERE (SELECT count(*) FROM activity_logs) < 7;
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '165 minutes', 'POST', '/api/v1/admin/media', 201
WHERE (SELECT count(*) FROM activity_logs) < 7;
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '205 minutes', 'DELETE', '/api/v1/admin/partners/demo', 204
WHERE (SELECT count(*) FROM activity_logs) < 7;
INSERT INTO activity_logs (id, actor_email, created_at, method, path, response_status)
SELECT gen_random_uuid(), 'admin@novatech.local', now() - interval '245 minutes', 'PUT', '/api/v1/admin/homepage', 200
WHERE (SELECT count(*) FROM activity_logs) < 7;
