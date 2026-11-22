
CREATE TABLE public.activity_logs (
    id uuid NOT NULL,
    actor_email character varying(254) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    method character varying(10) NOT NULL,
    path character varying(500) NOT NULL,
    response_status integer NOT NULL
);

CREATE TABLE public.admin_refresh_sessions (
    id uuid NOT NULL,
    admin_user_id uuid NOT NULL,
    expires_at timestamp(6) with time zone NOT NULL,
    revoked_at timestamp(6) with time zone,
    token_hash character varying(64) NOT NULL
);

CREATE TABLE public.admin_user_roles (
    admin_user_id uuid NOT NULL,
    role character varying(30) NOT NULL,
    CONSTRAINT admin_user_roles_role_check CHECK (((role)::text = ANY ((ARRAY['SUPER_ADMIN'::character varying, 'EDITOR'::character varying])::text[])))
);

CREATE TABLE public.admin_users (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    display_name character varying(120) NOT NULL,
    email character varying(254) NOT NULL,
    enabled boolean NOT NULL,
    password_hash character varying(100) NOT NULL
);

CREATE TABLE public.articles (
    id uuid NOT NULL,
    body_en text NOT NULL,
    body_fr text NOT NULL,
    category character varying(100) NOT NULL,
    cover_image_url character varying(500),
    created_at timestamp(6) with time zone NOT NULL,
    excerpt_en character varying(1000) NOT NULL,
    excerpt_fr character varying(1000) NOT NULL,
    published_at timestamp(6) with time zone,
    seo_description_en character varying(320),
    seo_description_fr character varying(320),
    seo_title_en character varying(180),
    seo_title_fr character varying(180),
    slug character varying(160) NOT NULL,
    status character varying(20) NOT NULL,
    title_en character varying(180) NOT NULL,
    title_fr character varying(180) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    CONSTRAINT articles_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'PUBLISHED'::character varying])::text[])))
);

CREATE TABLE public.contact_messages (
    id uuid NOT NULL,
    consent boolean NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    email character varying(254) NOT NULL,
    full_name character varying(160) NOT NULL,
    language character varying(2) NOT NULL,
    message text NOT NULL,
    phone character varying(40),
    status character varying(20) NOT NULL,
    subject character varying(180) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    CONSTRAINT contact_messages_status_check CHECK (((status)::text = ANY ((ARRAY['NEW'::character varying, 'READ'::character varying, 'IN_PROGRESS'::character varying, 'ACCEPTED'::character varying, 'REJECTED'::character varying, 'RESOLVED'::character varying])::text[])))
);

CREATE TABLE public.enrollments (
    id uuid NOT NULL,
    consent boolean NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    email character varying(254) NOT NULL,
    full_name character varying(160) NOT NULL,
    phone character varying(40) NOT NULL,
    preferred_language character varying(2) NOT NULL,
    session_id uuid NOT NULL,
    status character varying(20) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    CONSTRAINT enrollments_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'CANCELLED'::character varying])::text[])))
);

CREATE TABLE public.media_assets (
    id uuid NOT NULL,
    alt_en character varying(300),
    alt_fr character varying(300),
    content_type character varying(80) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    file_size bigint NOT NULL,
    original_name character varying(255) NOT NULL,
    storage_name character varying(100) NOT NULL
);

CREATE TABLE public.newsletter_subscribers (
    id uuid NOT NULL,
    active boolean NOT NULL,
    consent boolean NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    email character varying(254) NOT NULL,
    unsubscribe_token_hash character varying(64) NOT NULL,
    unsubscribed_at timestamp(6) with time zone
);

CREATE TABLE public.partners (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    display_order integer NOT NULL,
    logo_url character varying(500) NOT NULL,
    name character varying(180) NOT NULL,
    published boolean NOT NULL,
    website_url character varying(500)
);

CREATE TABLE public.project_gallery (
    project_id uuid NOT NULL,
    image_url character varying(500) NOT NULL
);

CREATE TABLE public.project_technologies (
    project_id uuid NOT NULL,
    technology character varying(80) NOT NULL
);

CREATE TABLE public.projects (
    id uuid NOT NULL,
    category character varying(80) NOT NULL,
    client_name character varying(180),
    cover_image_url character varying(500),
    created_at timestamp(6) with time zone NOT NULL,
    description_en text NOT NULL,
    description_fr text NOT NULL,
    featured boolean NOT NULL,
    project_date date,
    project_url character varying(500),
    published boolean NOT NULL,
    slug character varying(160) NOT NULL,
    title_en character varying(180) NOT NULL,
    title_fr character varying(180) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);

CREATE TABLE public.quote_requests (
    id uuid NOT NULL,
    budget_range character varying(100),
    consent boolean NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    desired_deadline character varying(160),
    email character varying(254) NOT NULL,
    full_name character varying(160) NOT NULL,
    internal_notes text,
    language character varying(2) NOT NULL,
    phone character varying(40),
    project_description text NOT NULL,
    service_type character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL,
    CONSTRAINT quote_requests_status_check CHECK (((status)::text = ANY ((ARRAY['NEW'::character varying, 'READ'::character varying, 'IN_PROGRESS'::character varying, 'ACCEPTED'::character varying, 'REJECTED'::character varying, 'RESOLVED'::character varying])::text[])))
);

CREATE TABLE public.site_services (
    id uuid NOT NULL,
    category character varying(80) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    description_en text NOT NULL,
    description_fr text NOT NULL,
    display_order integer NOT NULL,
    image_url character varying(500),
    published boolean NOT NULL,
    slug character varying(140) NOT NULL,
    title_en character varying(180) NOT NULL,
    title_fr character varying(180) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);

CREATE TABLE public.site_setting_values (
    settings_id character varying(255) NOT NULL,
    setting_value character varying(4000) NOT NULL,
    setting_key character varying(160) NOT NULL
);

CREATE TABLE public.site_settings (
    id character varying(255) NOT NULL
);

CREATE TABLE public.static_pages (
    slug character varying(100) NOT NULL,
    body_en text NOT NULL,
    body_fr text NOT NULL,
    published boolean NOT NULL,
    title_en character varying(180) NOT NULL,
    title_fr character varying(180) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);

CREATE TABLE public.team_members (
    id uuid NOT NULL,
    biography_en text NOT NULL,
    biography_fr text NOT NULL,
    category character varying(20) NOT NULL,
    created_at timestamp(6) with time zone NOT NULL,
    display_order integer NOT NULL,
    email character varying(254),
    facebook_url character varying(500),
    full_name character varying(140) NOT NULL,
    linked_in_url character varying(500),
    photo_url character varying(500),
    position_en character varying(140) NOT NULL,
    position_fr character varying(140) NOT NULL,
    published boolean NOT NULL,
    slug character varying(140) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);

CREATE TABLE public.testimonials (
    id uuid NOT NULL,
    author_name character varying(140) NOT NULL,
    author_role_en character varying(140),
    author_role_fr character varying(140),
    created_at timestamp(6) with time zone NOT NULL,
    display_order integer NOT NULL,
    organization_name character varying(180),
    published boolean NOT NULL,
    quote_en text NOT NULL,
    quote_fr text NOT NULL,
    rating integer NOT NULL
);

CREATE TABLE public.training_courses (
    id uuid NOT NULL,
    audience_en character varying(1000),
    audience_fr character varying(1000),
    created_at timestamp(6) with time zone NOT NULL,
    currency character varying(3),
    description_en text NOT NULL,
    description_fr text NOT NULL,
    duration_hours integer,
    image_url character varying(500),
    indicative_price numeric(12,2),
    objectives_en text,
    objectives_fr text,
    prerequisites_en character varying(1000),
    prerequisites_fr character varying(1000),
    program_en text,
    program_fr text,
    published boolean NOT NULL,
    slug character varying(160) NOT NULL,
    title_en character varying(180) NOT NULL,
    title_fr character varying(180) NOT NULL,
    updated_at timestamp(6) with time zone NOT NULL
);

CREATE TABLE public.training_sessions (
    id uuid NOT NULL,
    capacity integer NOT NULL,
    ends_at timestamp(6) with time zone NOT NULL,
    reserved_places integer NOT NULL,
    starts_at timestamp(6) with time zone NOT NULL,
    status character varying(20) NOT NULL,
    venue character varying(240) NOT NULL,
    version bigint NOT NULL,
    course_id uuid NOT NULL,
    CONSTRAINT training_sessions_status_check CHECK (((status)::text = ANY ((ARRAY['OPEN'::character varying, 'FULL'::character varying, 'CLOSED'::character varying, 'COMPLETED'::character varying])::text[])))
);

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_refresh_sessions
    ADD CONSTRAINT admin_refresh_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_user_roles
    ADD CONSTRAINT admin_user_roles_pkey PRIMARY KEY (admin_user_id, role);

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.enrollments
    ADD CONSTRAINT enrollments_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT media_assets_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_services
    ADD CONSTRAINT site_services_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.site_setting_values
    ADD CONSTRAINT site_setting_values_pkey PRIMARY KEY (settings_id, setting_key);

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.static_pages
    ADD CONSTRAINT static_pages_pkey PRIMARY KEY (slug);

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT training_courses_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT training_sessions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.admin_refresh_sessions
    ADD CONSTRAINT uk3ks87s8qy3aowjwt2kus4ree8 UNIQUE (token_hash);

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT uk8alkfprj713s66txbf8ople4s UNIQUE (slug);

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT ukcp8822350s9vtyww7xdbgeuvu UNIQUE (email);

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT ukcxqk67qijm09gpgig8a997mb0 UNIQUE (slug);

ALTER TABLE ONLY public.media_assets
    ADD CONSTRAINT ukeiuxu71ed11xx57b2y5l67llr UNIQUE (storage_name);

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT ukqqdefkuupml4s7190ettcy6jy UNIQUE (email);

ALTER TABLE ONLY public.site_services
    ADD CONSTRAINT ukslgklx9xesfvi3qfyqalj5ovu UNIQUE (slug);

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT uksn7al9fwhgtf98rvn8nxhjt4f UNIQUE (slug);

ALTER TABLE ONLY public.training_courses
    ADD CONSTRAINT uktjpt9b2bfqxdmamtwlxvv0aia UNIQUE (slug);

ALTER TABLE ONLY public.admin_user_roles
    ADD CONSTRAINT fk486l3h5kt03mw088cosejeud1 FOREIGN KEY (admin_user_id) REFERENCES public.admin_users(id);

ALTER TABLE ONLY public.project_gallery
    ADD CONSTRAINT fk961em0wd9gl94twpiouvu59kl FOREIGN KEY (project_id) REFERENCES public.projects(id);

ALTER TABLE ONLY public.site_setting_values
    ADD CONSTRAINT fkkpj6volro7lghbwttftgahw3s FOREIGN KEY (settings_id) REFERENCES public.site_settings(id);

ALTER TABLE ONLY public.training_sessions
    ADD CONSTRAINT fkku8ehfoyrxqp6rcmv5lg1y6i FOREIGN KEY (course_id) REFERENCES public.training_courses(id);

ALTER TABLE ONLY public.project_technologies
    ADD CONSTRAINT fkm4n7vw6u2ilmq85adm4igx3m1 FOREIGN KEY (project_id) REFERENCES public.projects(id);

