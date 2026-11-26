-- Données de démonstration issues des contenus du frontend (siteContent.ts / homepageContent.ts).
-- Idempotent : ne remplace jamais une ligne existante.

-- Services
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'web', now(), 'We create business websites, online stores and custom platforms tailored to your work and your customers.', 'Nous créons des sites vitrines, des boutiques en ligne et des plateformes sur mesure, adaptés à votre activité et à vos clients.', 1, NULL, TRUE, 'sites-web', 'Website development', 'Développement de sites web', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'mobile', now(), 'From business software to mobile experiences, we build practical tools for your workflows.', 'De l’application métier à l’expérience mobile, nous concevons des outils simples à utiliser et adaptés à vos processus.', 2, NULL, TRUE, 'applications', 'Web and mobile applications', 'Applications web et mobiles', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'training', now(), 'Programming, office software and graphic design training delivered in person and matched to your level.', 'Programmation, bureautique et création graphique : des formations en présentiel adaptées à votre niveau.', 3, NULL, TRUE, 'formations', 'In-person training', 'Formations en présentiel', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'consulting', now(), 'We help you define needs, review tools and guide digital projects through delivery and adoption.', 'Nous vous aidons à cadrer vos besoins, auditer vos outils et suivre vos projets numériques jusqu’à leur adoption.', 4, NULL, TRUE, 'accompagnement', 'Digital consulting', 'Accompagnement numérique', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO site_services (id, category, created_at, description_en, description_fr, display_order, image_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'marketing', now(), 'Social media, online advertising, search visibility and content that support your growth.', 'Réseaux sociaux, publicité en ligne, référencement et création de contenu au service de votre visibilité.', 5, NULL, TRUE, 'marketing-digital', 'Digital marketing', 'Marketing digital', now())
ON CONFLICT (slug) DO NOTHING;

-- Projets
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'web', 'Client partenaire', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', now(), 'A clear digital presence tailored to a growing team.', 'Conception d’une présence digitale claire et adaptée aux besoins d’une équipe en croissance.', true, CURRENT_DATE - 30, NULL, TRUE, 'portail-entreprise', 'Business portal', 'Portail d’entreprise', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'React' FROM projects WHERE slug = 'portail-entreprise'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'React');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'UI/UX' FROM projects WHERE slug = 'portail-entreprise'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'UI/UX');
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'marketing', 'Marque locale', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', now(), 'A content and visibility campaign shaped around the brand’s goals.', 'Une campagne de contenu et de visibilité construite autour des objectifs de la marque.', true, CURRENT_DATE - 60, NULL, TRUE, 'campagne-numerique', 'Digital campaign', 'Campagne numérique', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Content' FROM projects WHERE slug = 'campagne-numerique'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Content');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Social media' FROM projects WHERE slug = 'campagne-numerique'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Social media');
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'mobile', 'PME partenaire', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80', now(), 'A digital tool that simplifies day-to-day operations.', 'Un outil numérique pour simplifier le suivi des opérations quotidiennes.', true, CURRENT_DATE - 90, NULL, TRUE, 'outil-de-gestion', 'Management tool', 'Outil de gestion', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Web app' FROM projects WHERE slug = 'outil-de-gestion'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Web app');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Workflow' FROM projects WHERE slug = 'outil-de-gestion'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Workflow');
INSERT INTO projects (id, category, client_name, cover_image_url, created_at, description_en, description_fr, featured, project_date, project_url, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'training', 'Communauté locale', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', now(), 'A hands-on workshop sharing the foundations of digital visual design.', 'Un atelier pratique pour transmettre les bases de la création visuelle numérique.', false, CURRENT_DATE - 120, NULL, TRUE, 'atelier-creatif', 'Creative workshop', 'Atelier créatif', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Training' FROM projects WHERE slug = 'atelier-creatif'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Training');
INSERT INTO project_technologies (project_id, technology) SELECT id, 'Design' FROM projects WHERE slug = 'atelier-creatif'
  AND NOT EXISTS (SELECT 1 FROM project_technologies pt WHERE pt.project_id = projects.id AND pt.technology = 'Design');

-- Formations et sessions
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Beginners and career changers.', 'Débutants et personnes en reconversion.', now(), 'XAF', 'Learn to build the foundations of a modern website.', 'Apprenez à construire les fondations d’un site web moderne.', NULL, NULL, NULL, NULL, NULL, 'Basic computer skills.', 'Utilisation de base d’un ordinateur.', 'HTML and page structure
CSS and responsive layouts
JavaScript and interactions', 'HTML et structure de page
CSS et mise en page responsive
JavaScript et interactions', TRUE, 'programmation-web', 'Web programming', 'Programmation web', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 20, now() + interval '72 days', 12, now() + interval '30 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'programmation-web'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Students, professionals and business owners.', 'Étudiants, professionnels et entrepreneurs.', now(), 'XAF', 'Build confidence with everyday office software.', 'Gagnez en autonomie avec les outils bureautiques du quotidien.', NULL, NULL, NULL, NULL, NULL, 'No specific prerequisites.', 'Aucun prérequis spécifique.', 'Word processing
Spreadsheets and calculations
Professional presentations', 'Traitement de texte
Tableurs et calculs
Présentations professionnelles', TRUE, 'bureautique', 'Office software', 'Outils bureautiques', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 20, now() + interval '86 days', 8, now() + interval '44 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'bureautique'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);
INSERT INTO training_courses (id, audience_en, audience_fr, created_at, currency, description_en, description_fr, duration_hours, image_url, indicative_price, objectives_en, objectives_fr, prerequisites_en, prerequisites_fr, program_en, program_fr, published, slug, title_en, title_fr, updated_at)
VALUES (gen_random_uuid(), 'Beginner creatives and communication teams.', 'Créatifs débutants et communicants.', now(), 'XAF', 'Learn the basics of image editing and visual design.', 'Maîtrisez les bases de la retouche et de la création visuelle.', NULL, NULL, NULL, NULL, NULL, 'Comfort using a computer.', 'Aisance avec un ordinateur.', 'Tools and workspace
Photo editing
Creating visuals for the web', 'Outils et espace de travail
Retouche photo
Création de visuels pour le web', TRUE, 'design-photoshop', 'Graphic design with Photoshop', 'Création graphique avec Photoshop', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO training_sessions (id, capacity, ends_at, reserved_places, starts_at, status, venue, version, course_id)
SELECT gen_random_uuid(), 20, now() + interval '100 days', 14, now() + interval '58 days', 'OPEN', 'Présentiel · Cameroun', 0, id FROM training_courses WHERE slug = 'design-photoshop'
  AND NOT EXISTS (SELECT 1 FROM training_sessions ts WHERE ts.course_id = training_courses.id);

-- Équipe
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'A team committed to building useful solutions and sharing digital skills.', 'Une équipe engagée dans la conception de solutions utiles et la transmission des compétences numériques.', 'STAFF', now(), 1, NULL, NULL, 'Équipe NOVA-TECH', NULL, 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80', 'Development & consulting', 'Développement & conseil', TRUE, 'equipe-nova-tech', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'Trainers focused on practical learning, listening and each learner’s progress.', 'Des formateurs qui privilégient la pratique, l’écoute et la progression de chaque apprenant.', 'STAFF', now(), 2, NULL, NULL, 'Pôle formation', NULL, 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80', 'Learner support', 'Accompagnement des apprenants', TRUE, 'pole-formation', now())
ON CONFLICT (slug) DO NOTHING;
INSERT INTO team_members (id, biography_en, biography_fr, category, created_at, display_order, email, facebook_url, full_name, linked_in_url, photo_url, position_en, position_fr, published, slug, updated_at)
VALUES (gen_random_uuid(), 'Creative people who make brands easier to find and interfaces easier to use.', 'Des profils créatifs qui rendent les marques plus visibles et les interfaces plus claires.', 'STAFF', now(), 3, NULL, NULL, 'Pôle création', NULL, 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80', 'Design & marketing', 'Design & marketing', TRUE, 'pole-creation', now())
ON CONFLICT (slug) DO NOTHING;

-- Témoignage
INSERT INTO testimonials (id, author_name, author_role_en, author_role_fr, created_at, display_order, organization_name, published, quote_en, quote_fr, rating)
SELECT gen_random_uuid(), 'Client NovaTech', 'Client testimonial', 'Temoignage client', now(), 1, NULL, TRUE, 'We use technology to create simpler and more useful solutions.', 'Nous mettons la technologie au service de solutions plus simples et plus utiles.', 5
WHERE NOT EXISTS (SELECT 1 FROM testimonials);

-- Contenu de la page d'accueil
INSERT INTO site_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;
INSERT INTO site_setting_values (settings_id, setting_key, setting_value) VALUES
  ('default', 'home.hero.image', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85'),
  ('default', 'home.about.image', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.about.imageSecondary', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.success.image', 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85'),
  ('default', 'home.why.image', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.why.imageSecondary', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.testimonial.image', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.contact.image', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.mission.image', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85'),
  ('default', 'home.nav.home.fr', 'Accueil'),
  ('default', 'home.nav.home.en', 'Home'),
  ('default', 'home.nav.about.fr', 'A propos'),
  ('default', 'home.nav.about.en', 'About'),
  ('default', 'home.nav.services.fr', 'Services'),
  ('default', 'home.nav.services.en', 'Services'),
  ('default', 'home.nav.projects.fr', 'Realisations'),
  ('default', 'home.nav.projects.en', 'Projects'),
  ('default', 'home.nav.training.fr', 'Formations'),
  ('default', 'home.nav.training.en', 'Training'),
  ('default', 'home.nav.team.fr', 'Equipe'),
  ('default', 'home.nav.team.en', 'Team'),
  ('default', 'home.nav.contact.fr', 'Contact'),
  ('default', 'home.nav.contact.en', 'Contact'),
  ('default', 'home.nav.quote.fr', 'Demander un devis'),
  ('default', 'home.nav.quote.en', 'Request a quote'),
  ('default', 'home.hero.eyebrow.fr', 'Solutions numeriques au Cameroun'),
  ('default', 'home.hero.eyebrow.en', 'Digital solutions for Cameroon'),
  ('default', 'home.hero.title.fr', 'Le numerique au service de votre reussite'),
  ('default', 'home.hero.title.en', 'Digital solutions that move you forward'),
  ('default', 'home.hero.cta.fr', 'Decouvrir nos services'),
  ('default', 'home.hero.cta.en', 'Explore our services'),
  ('default', 'home.about.eyebrow.fr', 'A propos de notre entreprise'),
  ('default', 'home.about.eyebrow.en', 'About our company'),
  ('default', 'home.about.title.fr', 'Nous mettons nos idees au service de vos projets'),
  ('default', 'home.about.title.en', 'We put our ideas to work for your projects'),
  ('default', 'home.about.lead.fr', 'Une approche professionnelle de la technologie au service de nos clients.'),
  ('default', 'home.about.lead.en', 'A professional approach to technology, built around our clients.'),
  ('default', 'home.about.body.fr', 'Nous concevons des solutions numeriques et transmettons les competences qui font grandir les projets.'),
  ('default', 'home.about.body.en', 'We build digital solutions and share the skills that help projects grow.'),
  ('default', 'home.about.point1.fr', 'Solutions fiables et evolutives'),
  ('default', 'home.about.point1.en', 'Reliable, scalable solutions'),
  ('default', 'home.about.point2.fr', 'Accompagnement de proximite'),
  ('default', 'home.about.point2.en', 'Support at every step'),
  ('default', 'home.about.satisfaction.fr', 'Clients satisfaits'),
  ('default', 'home.about.satisfaction.en', 'Satisfied clients'),
  ('default', 'home.about.satisfactionValue', '80'),
  ('default', 'home.about.cta.fr', 'Decouvrir nos services'),
  ('default', 'home.about.cta.en', 'Discover our services'),
  ('default', 'home.services.eyebrow.fr', 'Ce que nous proposons'),
  ('default', 'home.services.eyebrow.en', 'What we offer'),
  ('default', 'home.services.title.fr', 'Nos poles d''expertise'),
  ('default', 'home.services.title.en', 'Our areas of expertise'),
  ('default', 'home.projects.eyebrow.fr', 'Projets recemment acheves'),
  ('default', 'home.projects.eyebrow.en', 'Recently completed work'),
  ('default', 'home.projects.title.fr', 'Nos realisations'),
  ('default', 'home.projects.title.en', 'Our projects'),
  ('default', 'home.projects.intro.fr', 'Des solutions concretes, concues avec nos clients pour produire des resultats durables.'),
  ('default', 'home.projects.intro.en', 'Practical solutions created with our clients to deliver lasting results.'),
  ('default', 'home.training.eyebrow.fr', 'Apprendre en presentiel'),
  ('default', 'home.training.eyebrow.en', 'Learn in person'),
  ('default', 'home.training.title.fr', 'Apprenez avec nos formations en presentiel'),
  ('default', 'home.training.title.en', 'Learn with our in-person training'),
  ('default', 'home.training.intro.fr', 'Programmation, bureautique et creation graphique : developpez vos competences par la pratique.'),
  ('default', 'home.training.intro.en', 'Programming, office software and graphic design: build skills through practice.'),
  ('default', 'home.training.note.fr', 'Les prochaines dates et places sont a confirmer avec notre equipe.'),
  ('default', 'home.training.note.en', 'Upcoming dates and availability can be confirmed with our team.'),
  ('default', 'home.testimonial.title.fr', 'Ils nous font confiance'),
  ('default', 'home.testimonial.title.en', 'What our clients say'),
  ('default', 'home.success.eyebrow.fr', 'Bienvenue chez NovaTech'),
  ('default', 'home.success.eyebrow.en', 'Welcome to NovaTech'),
  ('default', 'home.success.title.fr', 'Votre reussite grace aux meilleures solutions numeriques'),
  ('default', 'home.success.title.en', 'Your success with the right digital solutions'),
  ('default', 'home.success.point1.fr', 'Des outils numeriques adaptes a vos objectifs.'),
  ('default', 'home.success.point1.en', 'Digital tools adapted to your goals.'),
  ('default', 'home.success.point2.fr', 'Une equipe a vos cotes a chaque etape.'),
  ('default', 'home.success.point2.en', 'A team beside you at every step.'),
  ('default', 'home.success.point3.fr', 'Des competences qui font grandir vos projets.'),
  ('default', 'home.success.point3.en', 'Skills that help your projects grow.'),
  ('default', 'home.why.eyebrow.fr', 'Pourquoi nous choisir'),
  ('default', 'home.why.eyebrow.en', 'Why choose us'),
  ('default', 'home.why.title.fr', 'La technologie au service de vos ambitions'),
  ('default', 'home.why.title.en', 'Technology in service of your ambitions'),
  ('default', 'home.why.body.fr', 'Nous accompagnons les organisations avec des services numeriques et des formations adaptes a leurs besoins.'),
  ('default', 'home.why.body.en', 'We support organizations with digital services and training tailored to their needs.'),
  ('default', 'home.why.quote.fr', 'Nous mettons notre expertise au service de solutions utiles, durables et accessibles.'),
  ('default', 'home.why.quote.en', 'We use our expertise to build solutions that are useful, lasting, and accessible.'),
  ('default', 'home.why.cta.fr', 'Parlons de votre projet'),
  ('default', 'home.why.cta.en', 'Discuss your project'),
  ('default', 'home.why.founderName.fr', 'Equipe NovaTech'),
  ('default', 'home.why.founderName.en', 'NovaTech Team'),
  ('default', 'home.why.founderRole.fr', 'Notre equipe'),
  ('default', 'home.why.founderRole.en', 'Our team'),
  ('default', 'home.contact.eyebrow.fr', 'Contactez-nous'),
  ('default', 'home.contact.eyebrow.en', 'Contact us'),
  ('default', 'home.contact.title.fr', 'Parlons de votre projet'),
  ('default', 'home.contact.title.en', 'Tell us about your project'),
  ('default', 'home.vision.eyebrow.fr', 'Notre vision'),
  ('default', 'home.vision.eyebrow.en', 'Our vision'),
  ('default', 'home.vision.title.fr', 'Construisons ensemble vos prochains projets'),
  ('default', 'home.vision.title.en', 'Let us build your next project together'),
  ('default', 'home.vision.point1.fr', 'Solutions numeriques'),
  ('default', 'home.vision.point1.en', 'Digital solutions'),
  ('default', 'home.vision.point2.fr', 'Conseil informatique'),
  ('default', 'home.vision.point2.en', 'IT consulting'),
  ('default', 'home.vision.point3.fr', 'Transformation numerique'),
  ('default', 'home.vision.point3.en', 'Digital transformation'),
  ('default', 'home.news.eyebrow.fr', 'Conseils et actualites'),
  ('default', 'home.news.eyebrow.en', 'Insights and updates'),
  ('default', 'home.news.title.fr', 'Nos actualites'),
  ('default', 'home.news.title.en', 'News and articles'),
  ('default', 'home.cta.title.fr', 'Faisons grandir vos projets ensemble'),
  ('default', 'home.cta.title.en', 'Let us grow your projects together'),
  ('default', 'home.testimonial.quote.fr', 'Nous mettons la technologie au service de solutions plus simples et plus utiles.'),
  ('default', 'home.testimonial.quote.en', 'We use technology to create simpler and more useful solutions.'),
  ('default', 'home.testimonial.author.fr', 'Client NovaTech'),
  ('default', 'home.testimonial.author.en', 'NovaTech client'),
  ('default', 'home.testimonial.role.fr', 'Temoignage client'),
  ('default', 'home.testimonial.role.en', 'Client testimonial'),
  ('default', 'home.stats.stat1.value', '45+'),
  ('default', 'home.stats.stat1.label.fr', 'Projets realises'),
  ('default', 'home.stats.stat1.label.en', 'Projects completed'),
  ('default', 'home.stats.stat2.value', '150+'),
  ('default', 'home.stats.stat2.label.fr', 'Clients accompagnes'),
  ('default', 'home.stats.stat2.label.en', 'Clients supported'),
  ('default', 'home.stats.stat3.value', '12+'),
  ('default', 'home.stats.stat3.label.fr', 'Annees d''experience'),
  ('default', 'home.stats.stat3.label.en', 'Years of experience'),
  ('default', 'home.stats.stat4.value', '100%'),
  ('default', 'home.stats.stat4.label.fr', 'Engagement qualite'),
  ('default', 'home.stats.stat4.label.en', 'Quality commitment'),
  ('default', 'home.mission.tab1.fr', 'Notre mission'),
  ('default', 'home.mission.tab1.en', 'Our mission'),
  ('default', 'home.mission.tab2.fr', 'Notre vision'),
  ('default', 'home.mission.tab2.en', 'Our vision'),
  ('default', 'home.mission.tab3.fr', 'Notre histoire'),
  ('default', 'home.mission.tab3.en', 'Our history'),
  ('default', 'home.mission.benefit1.title.fr', 'Solutions professionnelles'),
  ('default', 'home.mission.benefit1.title.en', 'Professional solutions'),
  ('default', 'home.mission.benefit1.body.fr', 'Des reponses concretes a vos besoins numeriques.'),
  ('default', 'home.mission.benefit1.body.en', 'Practical answers to your digital needs.'),
  ('default', 'home.mission.benefit2.title.fr', 'Valeur pour nos clients'),
  ('default', 'home.mission.benefit2.title.en', 'Value for our clients'),
  ('default', 'home.mission.benefit2.body.fr', 'Un accompagnement axe sur vos resultats.'),
  ('default', 'home.mission.benefit2.body.en', 'Support focused on your results.'),
  ('default', 'home.mission.experience.fr', 'Une equipe experimentee a vos cotes.'),
  ('default', 'home.mission.experience.en', 'An experienced team by your side.'),
  ('default', 'home.mission.content1.fr', 'Nous aidons nos clients a atteindre leurs objectifs grace a des solutions adaptees.'),
  ('default', 'home.mission.content1.en', 'We help clients reach their goals with solutions tailored to their needs.'),
  ('default', 'home.mission.content2.fr', 'Nous imaginons un avenir ou chaque organisation peut profiter du numerique.'),
  ('default', 'home.mission.content2.en', 'We envision a future where every organization can benefit from digital tools.'),
  ('default', 'home.mission.content3.fr', 'NovaTech accompagne les projets et les talents depuis ses debuts.'),
  ('default', 'home.mission.content3.en', 'NovaTech has supported projects and talent since its beginning.'),
  ('default', 'home.mission.readMore.fr', 'En savoir plus'),
  ('default', 'home.mission.readMore.en', 'Read more'),
  ('default', 'home.news.promo1.title.fr', 'Developpement de bout en bout'),
  ('default', 'home.news.promo1.title.en', 'End-to-end development'),
  ('default', 'home.news.promo1.body.fr', 'Des outils numeriques adaptes a votre activite.'),
  ('default', 'home.news.promo1.body.en', 'Digital tools adapted to your business.'),
  ('default', 'home.news.promo2.title.fr', 'Conseil informatique'),
  ('default', 'home.news.promo2.title.en', 'IT consulting'),
  ('default', 'home.news.promo2.body.fr', 'Un accompagnement pour faire avancer vos projets.'),
  ('default', 'home.news.promo2.body.en', 'Guidance to move your projects forward.'),
  ('default', 'home.footer.description.fr', 'Nous concevons des solutions numeriques et transmettons les competences qui font grandir les projets.'),
  ('default', 'home.footer.description.en', 'We build digital solutions and share the skills that help projects grow.'),
  ('default', 'home.footer.explore.fr', 'Explorer'),
  ('default', 'home.footer.explore.en', 'Explore'),
  ('default', 'home.footer.about.fr', 'A propos'),
  ('default', 'home.footer.about.en', 'About company'),
  ('default', 'home.footer.team.fr', 'Notre equipe'),
  ('default', 'home.footer.team.en', 'Meet the team'),
  ('default', 'home.footer.news.fr', 'Actualites'),
  ('default', 'home.footer.news.en', 'News and articles'),
  ('default', 'home.footer.projects.fr', 'Nos realisations'),
  ('default', 'home.footer.projects.en', 'Our projects'),
  ('default', 'home.footer.contact.fr', 'Contact'),
  ('default', 'home.footer.contact.en', 'Contact'),
  ('default', 'home.footer.gallery.fr', 'Galerie'),
  ('default', 'home.footer.gallery.en', 'Gallery'),
  ('default', 'home.footer.info.fr', 'Informations'),
  ('default', 'home.footer.info.en', 'Information'),
  ('default', 'home.footer.newsletterPaused.fr', 'Newsletter temporairement suspendue.'),
  ('default', 'home.footer.newsletterPaused.en', 'Newsletter temporarily paused.'),
  ('default', 'home.footer.copyright.fr', 'Tous droits reserves a NOVA-TECH-SOLUTION.'),
  ('default', 'home.footer.copyright.en', 'All rights reserved by NOVA-TECH-SOLUTION.')
ON CONFLICT (settings_id, setting_key) DO NOTHING;
