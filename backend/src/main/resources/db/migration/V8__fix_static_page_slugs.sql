-- Le site public appelle les pages « about », « legal » et « privacy » : alignement des identifiants des pages statiques.
-- Le contenu est aussi converti en HTML (paragraphes), car il est affiché tel quel sur le site.
UPDATE static_pages SET slug = 'about'   WHERE slug = 'a-propos'          AND NOT EXISTS (SELECT 1 FROM static_pages WHERE slug = 'about');
UPDATE static_pages SET slug = 'legal'   WHERE slug = 'mentions-legales'  AND NOT EXISTS (SELECT 1 FROM static_pages WHERE slug = 'legal');
UPDATE static_pages SET slug = 'privacy' WHERE slug = 'confidentialite'   AND NOT EXISTS (SELECT 1 FROM static_pages WHERE slug = 'privacy');

UPDATE static_pages SET
    body_fr = '<p>NOVA-TECH-SOLUTION conçoit des solutions numériques et forme les talents de demain au Cameroun.</p><p>Notre équipe accompagne les entreprises, les associations et les particuliers dans leurs projets : sites web, applications, marketing digital et formations en présentiel.</p>',
    body_en = '<p>NOVA-TECH-SOLUTION builds digital solutions and trains tomorrow''s talent in Cameroon.</p><p>Our team supports businesses, organizations and individuals with websites, applications, digital marketing and in-person training.</p>'
WHERE slug = 'about' AND body_fr NOT LIKE '<%';
UPDATE static_pages SET
    body_fr = '<h2>Éditeur du site</h2><p>NOVA-TECH-SOLUTION, Cameroun.</p><h2>Contact</h2><p>Vous pouvez nous écrire via le formulaire de contact du site.</p>',
    body_en = '<h2>Site publisher</h2><p>NOVA-TECH-SOLUTION, Cameroon.</p><h2>Contact</h2><p>You can write to us through the contact form on the website.</p>'
WHERE slug = 'legal' AND body_fr NOT LIKE '<%';
UPDATE static_pages SET
    body_fr = '<h2>Données collectées</h2><p>Nous collectons uniquement les informations nécessaires pour répondre à vos demandes (nom, e-mail, téléphone, message).</p><h2>Utilisation</h2><p>Ces données ne sont jamais revendues et ne servent qu’à traiter votre demande.</p>',
    body_en = '<h2>Data we collect</h2><p>We only collect the information needed to answer your requests (name, email, phone, message).</p><h2>Use</h2><p>This data is never resold and is only used to handle your request.</p>'
WHERE slug = 'privacy' AND body_fr NOT LIKE '<%';
