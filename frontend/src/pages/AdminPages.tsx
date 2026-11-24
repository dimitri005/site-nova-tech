import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { FieldArray, Form, Formik } from 'formik'
import type { FormikProps } from 'formik'
import * as Yup from 'yup'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { usePageAnimations } from '../animations/usePageAnimations'
import logo from '../assets/nova-tech-logo.png'
import logoLight from '../assets/nova-tech-logo-light.png'
import { ApiError, apiDownload, apiMediaUrl, apiSend, getStoredSession, isAuthenticated, login, logout, mapFieldErrors } from '../api/client'
import { ApiState } from '../api/ApiState'
import { homepageDefaults, homepageFieldGroups } from '../data/homepageContent'
import { useApiData } from '../api/hooks'
import type { ActivityRecord, AdminUserRecord, ContactRecord, DashboardRecord, MediaRecord, NewsletterRecord, QuoteRecord, TrainingEnrollmentRecord, TrainingRecord, TrainingSessionRecord } from '../api/types'
import { EntityForm } from '../components/admin/EntityForm'
import { FeedbackProvider } from '../components/admin/feedback'
import { useConfirm, useToast } from '../components/admin/feedbackContext'
import { DataGrid } from '../components/admin/DataGrid'
import type { GridColumn } from '../components/admin/gridLogic'
import { Modal } from '../components/admin/Modal'
import { AnalyticsSkeleton, SkeletonForm } from '../components/Skeleton'
import { formatDate, statusLabel, statusOptions } from '../components/admin/format'
import { Badge, BoolBadge, EmptyState, PageHeader, StatusBadge } from '../components/admin/ui'
import type { Field, Row } from '../components/admin/fields'
import { parseFooterLinks, SOCIAL_NETWORKS } from '../config/footer'
import type { FooterLink } from '../config/footer'
import '../styles/site-pages.css'
import '../styles/admin-auth.css'
import '../styles/admin-workspace.css'
import '../styles/admin-ui.css'

type DashboardApi = { data: DashboardRecord | null; loading: boolean; error: string; reload: () => void }
const NO_ROWS: never[] = []
const AnalyticsSection = lazy(() => import('../components/admin/AnalyticsSection').then((module) => ({ default: module.AnalyticsSection })))
type Resource = { key: string; label: string; path: string; fields: Field[]; keyField?: 'id' | 'slug'; superAdminDelete?: boolean }

const resources: Resource[] = [
  { key: 'services', label: 'Services', path: '/management/services', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'category', label: 'Catégorie', required: true },
    { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'descriptionFr', label: 'Description (FR)', type: 'textarea', required: true }, { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
    { name: 'imageUrl', label: 'Image', type: 'image' }, { name: 'displayOrder', label: 'Ordre d’affichage', type: 'number', min: 0 }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'projects', label: 'Réalisations', path: '/management/projects', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'descriptionFr', label: 'Description (FR)', type: 'textarea', required: true }, { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
    { name: 'category', label: 'Catégorie', required: true }, { name: 'clientName', label: 'Client' },
    { name: 'technologies', label: 'Technologies (une par ligne)', type: 'list' }, { name: 'galleryUrls', label: 'Galerie d’images (une URL par ligne)', type: 'list' },
    { name: 'coverImageUrl', label: 'Image principale', type: 'image' }, { name: 'projectDate', label: 'Date du projet', type: 'date' }, { name: 'projectUrl', label: 'Lien du projet', type: 'url' },
    { name: 'featured', label: 'Mettre en avant', type: 'checkbox' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'trainings', label: 'Formations', path: '/management/trainings', superAdminDelete: true, fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'titleFr', label: 'Intitulé (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'descriptionFr', label: 'Description (FR)', type: 'textarea', required: true }, { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
    { name: 'objectivesFr', label: 'Objectifs (FR)', type: 'textarea' }, { name: 'objectivesEn', label: 'Objectives (EN)', type: 'textarea' },
    { name: 'audienceFr', label: 'Public cible (FR)', type: 'textarea' }, { name: 'audienceEn', label: 'Target audience (EN)', type: 'textarea' },
    { name: 'prerequisitesFr', label: 'Prérequis (FR)', type: 'textarea' }, { name: 'prerequisitesEn', label: 'Prerequisites (EN)', type: 'textarea' },
    { name: 'programFr', label: 'Programme (FR)', type: 'textarea' }, { name: 'programEn', label: 'Program (EN)', type: 'textarea' },
    { name: 'durationHours', label: 'Durée (heures)', type: 'number', min: 1 }, { name: 'indicativePrice', label: 'Tarif indicatif', type: 'number', min: 0 },
    { name: 'currency', label: 'Devise', maxLength: 3, placeholder: 'XAF' }, { name: 'imageUrl', label: 'Image', type: 'image' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'team', label: 'Équipe', path: '/management/team', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'fullName', label: 'Nom complet', required: true },
    { name: 'positionFr', label: 'Poste (FR)', required: true }, { name: 'positionEn', label: 'Position (EN)', required: true },
    { name: 'biographyFr', label: 'Biographie (FR)', type: 'textarea', required: true }, { name: 'biographyEn', label: 'Biography (EN)', type: 'textarea', required: true },
    { name: 'photoUrl', label: 'Photo', type: 'image' }, { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'linkedInUrl', label: 'LinkedIn', type: 'url' }, { name: 'facebookUrl', label: 'Facebook', type: 'url' },
    { name: 'category', label: 'Catégorie', type: 'select', required: true, options: [{ value: 'FOUNDER', label: 'Fondateur' }, { value: 'STAFF', label: 'Personnel' }] },
    { name: 'displayOrder', label: 'Ordre d’affichage', type: 'number', min: 0 }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'testimonials', label: 'Témoignages', path: '/management/testimonials', fields: [
    { name: 'authorName', label: 'Nom de l’auteur', required: true }, { name: 'authorRoleFr', label: 'Fonction (FR)' }, { name: 'authorRoleEn', label: 'Role (EN)' },
    { name: 'organizationName', label: 'Organisation' }, { name: 'quoteFr', label: 'Témoignage (FR)', type: 'textarea', required: true },
    { name: 'quoteEn', label: 'Testimonial (EN)', type: 'textarea', required: true }, { name: 'rating', label: 'Note (1 à 5)', type: 'number', required: true, min: 1, max: 5 },
    { name: 'displayOrder', label: 'Ordre d’affichage', type: 'number', min: 0 }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'partners', label: 'Partenaires', path: '/management/partners', fields: [
    { name: 'name', label: 'Nom', required: true }, { name: 'logoUrl', label: 'Logo', type: 'image', required: true },
    { name: 'websiteUrl', label: 'Site web', type: 'url' }, { name: 'displayOrder', label: 'Ordre d’affichage', type: 'number', min: 0 }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'articles', label: 'Articles', path: '/management/articles', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'excerptFr', label: 'Résumé (FR)', type: 'textarea', required: true }, { name: 'excerptEn', label: 'Excerpt (EN)', type: 'textarea', required: true },
    { name: 'bodyFr', label: 'Contenu HTML (FR)', type: 'textarea', required: true }, { name: 'bodyEn', label: 'HTML content (EN)', type: 'textarea', required: true },
    { name: 'category', label: 'Catégorie', required: true }, { name: 'coverImageUrl', label: 'Image de couverture', type: 'image' },
    { name: 'seoTitleFr', label: 'Titre SEO (FR)' }, { name: 'seoTitleEn', label: 'SEO title (EN)' },
    { name: 'seoDescriptionFr', label: 'Description SEO (FR)', type: 'textarea' }, { name: 'seoDescriptionEn', label: 'SEO description (EN)', type: 'textarea' },
    { name: 'status', label: 'Publication', type: 'select', required: true, options: [{ value: 'DRAFT', label: 'Brouillon' }, { value: 'PUBLISHED', label: 'Publié' }] },
  ] },
  { key: 'pages', label: 'Pages statiques', path: '/management/site-content/pages', keyField: 'slug', fields: [
    { name: 'slug', label: 'Slug (ex. about, legal, privacy)', required: true }, { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'bodyFr', label: 'Contenu HTML (FR)', type: 'textarea', required: true }, { name: 'bodyEn', label: 'HTML content (EN)', type: 'textarea', required: true }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
]

function useAuthChange() {
  const [, setRevision] = useState(0)
  useEffect(() => {
    const update = () => setRevision((value) => value + 1)
    window.addEventListener('nova:auth-changed', update)
    window.addEventListener('nova:auth-expired', update)
    return () => { window.removeEventListener('nova:auth-changed', update); window.removeEventListener('nova:auth-expired', update) }
  }, [])
}

function ErrorMessage({ value }: { value: string }) {
  return value ? <p className="form-error" role="alert">{value}</p> : null
}

function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const schema = Yup.object({
    email: Yup.string().trim().email('Adresse e-mail invalide.').required('Saisissez votre adresse e-mail.'),
    password: Yup.string().required('Saisissez votre mot de passe.'),
  })
  if (isAuthenticated()) return <Navigate to="/admin" replace/>
  return <main className="admin-login-page">
    <div className="admin-login-shell">
      <section className="admin-login-welcome" aria-label="Bienvenue">
        <img className="admin-login-logo-light" src={logoLight} alt="NovaTech Solution — On code votre réussite"/>
        <div className="admin-login-welcome-copy">
          <p className="admin-login-kicker">ESPACE D’ADMINISTRATION</p>
          <h2>Bienvenue dans votre <span>espace&nbsp;!</span></h2>
          <p>Connectez-vous pour gérer vos contenus, suivre vos demandes et faire grandir votre présence en ligne.</p>
        </div>
        <div className="admin-login-brand-card"><img src="/logo.png" alt="Logo NOVA-TECH-SOLUTION — On code votre réussite" width="320" height="320"/></div>
        <p className="admin-login-tagline">Des outils simples pour piloter votre réussite.</p>
      </section>
      <section className="admin-login-panel">
        <div className="admin-login-content">
          <img className="admin-login-logo" src={logo} alt="NovaTech Solution — On code votre réussite"/>
          <div className="admin-login-emblem" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10M6.5 10h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div>
          <div className="admin-login-title"><p className="admin-login-kicker">ACCÈS SÉCURISÉ</p><h1>Connexion</h1><p>Entrez vos identifiants pour accéder à votre espace.</p></div>
          <Formik initialValues={{ email: '', password: '' }} validationSchema={schema}
            onSubmit={async (values, helpers) => {
              helpers.setStatus(undefined)
              try {
                await login(values.email.trim(), values.password)
                const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
                navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true })
              } catch (reason) { helpers.setStatus(reason instanceof ApiError ? reason.message : 'Connexion impossible. Vérifiez que le serveur est lancé.'); helpers.setSubmitting(false) }
            }}>
            {(formik) => <Form className="admin-auth-form" noValidate>
              <label htmlFor="admin-login-email">Adresse e-mail</label>
              <div className="admin-auth-input"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg><input id="admin-login-email" type="email" autoComplete="username" placeholder="nom@exemple.com" aria-invalid={formik.touched.email && formik.errors.email ? true : undefined} {...formik.getFieldProps('email')}/></div>
              {formik.touched.email && formik.errors.email && <small className="field-validation-error" role="alert">{formik.errors.email}</small>}
              <div className="admin-auth-password-label"><label htmlFor="admin-login-password">Mot de passe</label></div>
              <div className="admin-auth-input"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg><input id="admin-login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Votre mot de passe" aria-invalid={formik.touched.password && formik.errors.password ? true : undefined} {...formik.getFieldProps('password')}/><button className="admin-auth-reveal" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? 'Masquer' : 'Afficher'}</button></div>
              {formik.touched.password && formik.errors.password && <small className="field-validation-error" role="alert">{formik.errors.password}</small>}
              <ErrorMessage value={String(formik.status ?? '')}/>
              <button className="admin-auth-submit" type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Connexion en cours…' : 'Se connecter'}<span aria-hidden="true">→</span></button>
              <p className="admin-auth-account-note">Mot de passe oublié ? Demandez au super administrateur de le réinitialiser dans la gestion des comptes.</p>
              <p className="admin-auth-account-note">La création des comptes est réservée au super administrateur.</p>
            </Form>}
          </Formik>
          <div className="admin-login-footer"><span className="admin-login-shield" aria-hidden="true">✓</span><span>Connexion sécurisée · Données protégées</span></div>
          <Link className="admin-login-back-site" to="/fr">← Retour au site</Link>
        </div>
      </section>
    </div>
  </main>
}

const NAV_ICONS: Record<string, string> = {
  dashboard: 'M4 4h7v7H4V4Zm9 0h7v4h-7V4ZM4 13h7v7H4v-7Zm9-3h7v10h-7V10Z',
  homepage: 'M3 11.5 12 4l9 7.5M5.5 10v9.5h13V10M10 19.5v-5h4v5',
  footer: 'M4 5h16v14H4V5Zm0 10h16M8 18h.01M12 18h.01',
  texts: 'M5 6h14M5 10h14M5 14h9M5 18h6',
  services: 'M12 3 4 7v6c0 4 3.4 6.8 8 8 4.6-1.2 8-4 8-8V7l-8-4Zm-3 9 2 2 4-4',
  projects: 'M4 7h16v13H4V7Zm4 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 13h16',
  trainings: 'M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm3 2v5c3.5 3 8.5 3 12 0v-5',
  sessions: 'M5 5v3m14-3v3M4 8h16v12H4V8Zm4 4h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01',
  team: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7 0a2.5 2.5 0 1 0 0-5M3.5 19c.5-3 2.7-5 5.5-5s5 2 5.5 5M16 14c2.4.2 4 1.9 4.5 4.5',
  testimonials: 'M5 5h14v10H9l-4 4V5Zm4 4h6m-6 3h4',
  partners: 'M8 12h8M6 8a4 4 0 0 0 0 8h2m8-8h2a4 4 0 0 1 0 8h-2',
  articles: 'M6 3h9l4 4v14H6V3Zm9 0v5h4m-9 4h5m-5 4h8',
  pages: 'M7 3h8l4 4v14H7V3Zm8 0v4h4M10 12h6m-6 3h6',
  media: 'M4 5h16v14H4V5Zm2 11 4-4 3 3 2-2 3 3M9 9h.01',
  messages: 'M4 5h16v11H8l-4 3V5Zm4 4h8m-8 3h5',
  quotes: 'M12 3v18m4-14H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7',
  enrollments: 'M16 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0ZM6 20c.6-3.2 3.2-5 6-5s5.4 1.8 6 5M19 6v4m2-2h-4',
  newsletter: 'M3 6h18v12H3V6Zm0 1 9 6 9-6',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.5-2-3.5-2.3 1a7.6 7.6 0 0 0-2-1.2L14.6 3h-4l-.4 2.6a7.6 7.6 0 0 0-2 1.2l-2.3-1-2 3.5 2 1.5a7.4 7.4 0 0 0 0 2.4l-2 1.5 2 3.5 2.3-1c.6.5 1.3.9 2 1.2l.4 2.6h4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3 1 2-3.5-2-1.5c.1-.4.1-.8.1-1.2Z',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  users: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8c.8-3.600 4-6 8-6s7.200 2.400 8 6',
}

type NavItem = { to: string; label: string; icon: string; end?: boolean; badge?: number }

function NavIcon({ name }: { name: string }) {
  return <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={NAV_ICONS[name] || NAV_ICONS.pages} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function AdminLayout() {
  useAuthChange()
  const location = useLocation()
  const navigate = useNavigate()
  const pageScope = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(() => { try { return localStorage.getItem('nova-admin-collapsed') === '1' } catch { return false } })
  const [mobileOpen, setMobileOpen] = useState(false)
  const dashboard = useApiData<DashboardRecord>(isAuthenticated() ? '/management/dashboard' : null)
  const summary = dashboard.data
  usePageAnimations(pageScope, location.pathname)
  useEffect(() => { try { localStorage.setItem('nova-admin-collapsed', collapsed ? '1' : '0') } catch { /* stockage indisponible */ } }, [collapsed])
  if (!isAuthenticated()) return <Navigate to="/admin/login" state={{ from: location }} replace/>
  const session = getStoredSession()
  const superAdmin = session?.roles.includes('SUPER_ADMIN') ?? false
  const canEditHomepage = superAdmin || (session?.roles.includes('EDITOR') ?? false)
  const doLogout = async () => { await logout(); navigate('/admin/login', { replace: true }) }
  const contentItems: NavItem[] = [...resources.map((item) => ({ to: `/admin/content/${item.key}`, label: item.label, icon: item.key })), { to: '/admin/sessions', label: 'Sessions', icon: 'sessions' }, { to: '/admin/media', label: 'Médiathèque', icon: 'media' }]
  const groups: { label: string; items: NavItem[] }[] = [
    { label: 'Pilotage', items: [{ to: '/admin', label: 'Tableau de bord', icon: 'dashboard', end: true }] },
    { label: 'Site public', items: [...(canEditHomepage ? [{ to: '/admin/homepage', label: 'Page d’accueil', icon: 'homepage' }] : []), { to: '/admin/footer', label: 'Pied de page & contact', icon: 'footer' }, { to: '/admin/texts', label: 'Textes du site', icon: 'texts' }] },
    { label: 'Contenus', items: contentItems },
    { label: 'Demandes', items: [
      { to: '/admin/requests/messages', label: 'Messages', icon: 'messages', badge: summary?.unreadMessages }, { to: '/admin/requests/quotes', label: 'Demandes de devis', icon: 'quotes', badge: summary?.pendingQuotes },
      { to: '/admin/requests/enrollments', label: 'Pré-inscriptions', icon: 'enrollments' }, { to: '/admin/newsletter', label: 'Newsletter', icon: 'newsletter' }] },
    { label: 'Administration', items: [{ to: '/admin/settings', label: 'Paramètres avancés', icon: 'settings' }, ...(superAdmin ? [{ to: '/admin/activity', label: 'Journal d’activité', icon: 'activity' }, { to: '/admin/users', label: 'Utilisateurs', icon: 'users' }] : [])] },
  ]
  const allItems = groups.flatMap((group) => group.items)
  const current = allItems.filter((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to))).sort((x, y) => y.to.length - x.to.length)[0]
  return <div className={`admin-shell${collapsed ? ' sidebar-collapsed' : ''}${mobileOpen ? ' sidebar-open' : ''}`} ref={pageScope}>
    <aside className="admin-sidebar" aria-label="Navigation de l’espace admin">
      <Link to="/admin" className="admin-logo" aria-label="Tableau de bord"><img src={logoLight} alt="NOVA-TECH-SOLUTION"/></Link>
      <nav className="admin-nav">{groups.map((group) => <div className="admin-nav-group" key={group.label}>
        <p className="admin-nav-label">{group.label}</p>
        {group.items.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className="admin-nav-link" title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)}>
          <NavIcon name={item.icon}/><span className="nav-text">{item.label}</span>{item.badge ? <b className="nav-badge" aria-label={`${item.badge} à traiter`}>{item.badge > 99 ? '99+' : item.badge}</b> : null}
        </NavLink>)}
      </div>)}</nav>
      <div className="admin-sidebar-footer">
        <div className="admin-account"><i aria-hidden="true">{session?.displayName?.slice(0, 2).toUpperCase() || 'NT'}</i>
          <span><strong>{session?.displayName || session?.email}</strong><small>{superAdmin ? 'Super administrateur' : 'Éditeur'}</small></span></div>
        <button type="button" className="admin-logout" onClick={() => void doLogout()} title="Déconnexion"><svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M10 4H5v16h5m4-4 4-4-4-4m4 4H9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg><span className="nav-text">Déconnexion</span></button>
      </div>
    </aside>
    {mobileOpen && <button type="button" className="sidebar-scrim" aria-label="Fermer le menu" onClick={() => setMobileOpen(false)}/>}
    <div className="admin-main">
      <header className="admin-topbar">
        <div className="topbar-left"><button className="sidebar-toggle" onClick={() => { if (window.innerWidth <= 760) setMobileOpen((value) => !value); else setCollapsed((value) => !value) }} aria-label="Afficher ou réduire le menu"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></button>
          <nav className="admin-breadcrumb" aria-label="Fil d’Ariane"><span>Espace admin</span><i aria-hidden="true">/</i><strong>{current?.label ?? 'Administration'}</strong></nav></div>
        <div className="topbar-right"><a className="topbar-site-link" href="/fr" target="_blank" rel="noreferrer">Voir le site <span aria-hidden="true">↗</span></a>
          <span className="admin-user"><i>{session?.displayName?.slice(0, 2).toUpperCase() || 'NT'}</i><span className="admin-user-name">{session?.displayName || session?.email}</span></span></div>
      </header>
      <div className="admin-content"><Outlet context={dashboard}/></div>
    </div>
  </div>
}

function DashboardIcon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    messages: 'M4 5h16v11H8l-4 3V5Zm4 4h8m-8 3h5',
    quotes: 'M12 3v18m4-14H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7',
    enrollments: 'M5 4v3m14-3v3M4 8h16v12H4V8Zm4 4h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01',
    projects: 'M4 7h16v13H4V7Zm4 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-8 5h8m-4-2v4',
    articles: 'M6 3h9l4 4v14H6V3Zm9 0v5h4m-9 4h5m-5 4h8m-8 3h8',
    add: 'M12 5v14m-7-7h14',
    training: 'M3 8.5 12 4l9 4.5-9 4.5-9-4.5Zm3 2v5c3.5 3 8.5 3 12 0v-5m3-2v7',
    media: 'M4 5h16v14H4V5Zm2 11 4-4 3 3 2-2 3 3M9 9h.01',
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d={paths[name] || paths.articles} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function DashboardStatsSkeleton({ count }: { count: number }) {
  return <div className="admin-stat-grid" role="status" aria-label="Chargement des indicateurs">
    {Array.from({ length: count }, (_, index) => <article className="admin-stat-card skeleton-card" key={index} aria-hidden="true">
      <span className="admin-stat-icon skeleton"/><div className="admin-stat-copy"><span className="skeleton skeleton-line skeleton-label"/><span className="skeleton skeleton-line skeleton-value"/><span className="skeleton skeleton-line skeleton-note"/></div>
    </article>)}
  </div>
}

function AdminDashboard() {
  const { data, loading, error, reload } = useOutletContext<DashboardApi>()
  const stats = [
    { label: 'Messages non lus', value: data?.unreadMessages, key: 'messages', note: 'À traiter' },
    { label: 'Devis en attente', value: data?.pendingQuotes, key: 'quotes', note: 'Demandes clients' },
    { label: 'Pré-inscriptions', value: data?.recentEnrollments, key: 'enrollments', note: 'Formations' },
    { label: 'Projets publiés', value: data?.publishedProjects, key: 'projects', note: 'Dans le portfolio' },
    { label: 'Articles publiés', value: data?.publishedArticles, key: 'articles', note: 'Actualités du site' },
  ]
  const showSkeleton = loading && !data
  const quickActions = [
    { to: '/admin/content/projects', icon: 'add', title: 'Ajouter une réalisation', description: 'Présentez un nouveau projet' },
    { to: '/admin/content/trainings', icon: 'training', title: 'Gérer les formations', description: 'Cours et sessions' },
    { to: '/admin/requests/messages', icon: 'messages', title: 'Consulter les messages', description: 'Échangez avec vos visiteurs' },
    { to: '/admin/media', icon: 'media', title: 'Ajouter un média', description: 'Enrichissez votre médiathèque' },
  ]
  return <>
    <div className="admin-page-heading admin-dashboard-heading">
      <div><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h1>Tableau de bord</h1><p>Retrouvez ici les indicateurs clés de votre activité.</p></div>
      <Link className="admin-dashboard-cta" to="/admin/content/projects"><span>Gérer les contenus</span><span aria-hidden="true">→</span></Link>
    </div>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <section className="admin-dashboard-section" aria-label="Indicateurs d’activité" aria-busy={showSkeleton}>
      <div className="admin-section-heading"><div><h2>À traiter</h2><p>Situation actuelle, actualisée toutes les 30 secondes.</p></div><span className="admin-live-label"><i/> En direct</span></div>
      {showSkeleton ? <DashboardStatsSkeleton count={stats.length}/> : <div className="admin-stat-grid">{stats.map((stat) => <article className="admin-stat-card" key={stat.key}><span className={`admin-stat-icon admin-stat-icon-${stat.key}`}><DashboardIcon name={stat.key}/></span><div className="admin-stat-copy"><small>{stat.label}</small><strong>{stat.value ?? '—'}</strong><i>{stat.note}</i></div></article>)}</div>}
    </section>
    <Suspense fallback={<AnalyticsSkeleton/>}><AnalyticsSection/></Suspense>
    <section className="admin-dashboard-section admin-quick-panel">
      <div className="admin-section-heading"><div><h2>Raccourcis</h2><p>Accédez directement aux tâches les plus courantes.</p></div></div>
      <div className="quick-actions">{quickActions.map((action) => <Link className="quick-action-card" to={action.to} key={action.to}><span className="quick-action-icon"><DashboardIcon name={action.icon}/></span><span className="quick-action-copy"><strong>{action.title}</strong><small>{action.description}</small></span><span className="quick-action-arrow" aria-hidden="true">↗</span></Link>)}</div>
    </section>
  </>
}
async function uploadAdminImage(file: File, altFr = '', altEn = ''): Promise<MediaRecord> {
  const body = new FormData()
  body.append('file', file)
  body.append('altFr', altFr)
  body.append('altEn', altEn)
  return apiSend<MediaRecord>('/management/media', 'POST', body)
}

function ContentManager() {
  const { resource = 'services' } = useParams()
  const definition = resources.find((item) => item.key === resource)
  if (!definition) return <p className="api-state">Type de contenu inconnu.</p>
  return <ResourceManager definition={definition}/>
}

const boolColumn = <T,>(key: string, header: string, value: (row: T) => boolean, labels: [string, string] = ['Oui', 'Non']): GridColumn<T> => ({
  key, header, type: 'boolean', booleanLabels: labels, value, render: (row) => <BoolBadge value={value(row)} yes={labels[0]} no={labels[1]}/>,
})

function resourceColumns(definition: Resource, rows: Row[]): GridColumn<Row>[] {
  const main = ['titleFr', 'fullName', 'authorName', 'name', 'slug', 'category', 'status', 'published', 'featured']
  const shown = new Set(definition.fields.filter((field) => main.includes(field.name)).slice(0, 5).map((field) => field.name))
  const columns: GridColumn<Row>[] = definition.fields.filter((field) => field.type !== 'image' && field.type !== 'list' && field.type !== 'textarea').map((field) => {
    const base = { key: field.name, header: field.label.replace(/\s*\(.*?\)\s*$/, (match) => match), hidden: !shown.has(field.name), primary: shown.size > 0 && field.name === [...shown][0] }
    if (field.type === 'checkbox') return boolColumn<Row>(field.name, field.label, (row) => Boolean(row[field.name]), field.name === 'published' ? ['Publié', 'Brouillon'] : ['Oui', 'Non'])
    if (field.type === 'number') return { ...base, type: 'number' as const, value: (row) => (row[field.name] as number | null | undefined) ?? null }
    if (field.type === 'date' || field.type === 'datetime-local') return { ...base, type: 'date' as const, value: (row) => row[field.name] as string | null | undefined, render: (row) => formatDate(row[field.name] as string | null | undefined) }
    if (field.type === 'select') return { ...base, type: 'select' as const, options: field.options, value: (row) => String(row[field.name] ?? ''), render: (row) => (field.name === 'status' ? <StatusBadge value={String(row[field.name] ?? '')}/> : field.options?.find((option) => option.value === row[field.name])?.label ?? String(row[field.name] ?? '—')) }
    if (field.name === 'category' || field.name === 'currency') return { ...base, type: 'select' as const, value: (row) => String(row[field.name] ?? '') }
    return { ...base, value: (row) => (row[field.name] == null ? '' : String(row[field.name])) }
  })
  for (const field of definition.fields.filter((item) => item.type === 'textarea' || item.type === 'list')) {
    columns.push({ key: field.name, header: field.label, hidden: true, sortable: false, value: (row) => (Array.isArray(row[field.name]) ? (row[field.name] as string[]).join(', ') : String(row[field.name] ?? '')) })
  }
  if (rows.some((row) => 'createdAt' in row)) columns.push({ key: 'createdAt', header: 'Créé le', type: 'date', hidden: true, value: (row) => row.createdAt as string | undefined, render: (row) => formatDate(row.createdAt as string | undefined) })
  if (rows.some((row) => 'updatedAt' in row)) columns.push({ key: 'updatedAt', header: 'Modifié le', type: 'date', hidden: true, value: (row) => row.updatedAt as string | undefined, render: (row) => formatDate(row.updatedAt as string | undefined) })
  return columns
}

const sessionColumns: GridColumn<TrainingSessionRecord>[] = [
  { key: 'startsAt', header: 'Début', type: 'date', primary: true, value: (s) => s.startsAt, render: (s) => formatDate(s.startsAt, true) },
  { key: 'endsAt', header: 'Fin', type: 'date', hidden: true, value: (s) => s.endsAt, render: (s) => formatDate(s.endsAt, true) },
  { key: 'venue', header: 'Lieu', value: (s) => s.venue },
  { key: 'capacity', header: 'Capacité', type: 'number', hidden: true, value: (s) => s.capacity },
  { key: 'reservedPlaces', header: 'Places réservées', type: 'number', value: (s) => s.reservedPlaces, render: (s) => <div className="capacity"><span>{s.reservedPlaces}/{s.capacity}</span><i><b style={{ width: `${Math.min(100, Math.round((s.reservedPlaces / Math.max(s.capacity, 1)) * 100))}%` }}/></i></div> },
  { key: 'status', header: 'Statut', type: 'select', options: statusOptions(['OPEN', 'FULL', 'CLOSED', 'COMPLETED']), value: (s) => s.status, render: (s) => <StatusBadge value={s.status}/> },
]

const mediaColumns: GridColumn<MediaRecord>[] = [
  { key: 'preview', header: 'Aperçu', sortable: false, filterable: false, value: () => '', render: (item) => <img className="media-thumb" src={apiMediaUrl(item.url)} alt={item.altFr || item.originalName} loading="lazy"/> },
  { key: 'originalName', header: 'Nom du fichier', primary: true, value: (item) => item.originalName },
  { key: 'contentType', header: 'Type', type: 'select', value: (item) => item.contentType },
  { key: 'fileSize', header: 'Taille (Ko)', type: 'number', value: (item) => Math.round(item.fileSize / 1024) },
  { key: 'altFr', header: 'Texte alternatif (FR)', hidden: true, value: (item) => item.altFr },
  { key: 'createdAt', header: 'Ajoutée le', type: 'date', value: (item) => item.createdAt, render: (item) => formatDate(item.createdAt) },
]

const newsletterColumns: GridColumn<NewsletterRecord>[] = [
  { key: 'email', header: 'E-mail', primary: true, value: (item) => item.email },
  boolColumn<NewsletterRecord>('active', 'Statut', (item) => item.active, ['Actif', 'Désabonné']),
  { key: 'createdAt', header: 'Inscrit le', type: 'date', value: (item) => item.createdAt, render: (item) => formatDate(item.createdAt) },
]

const methodTone = (method: string) => (method === 'DELETE' ? 'danger' : method === 'POST' ? 'success' : method === 'GET' ? 'neutral' : 'info')
const activityColumns: GridColumn<ActivityRecord>[] = [
  { key: 'actorEmail', header: 'Utilisateur', primary: true, value: (item) => item.actorEmail },
  { key: 'method', header: 'Méthode', type: 'select', value: (item) => item.method, render: (item) => <Badge tone={methodTone(item.method)}>{item.method}</Badge> },
  { key: 'path', header: 'Route', value: (item) => item.path, render: (item) => <code>{item.path}</code> },
  { key: 'responseStatus', header: 'Résultat', type: 'number', value: (item) => item.responseStatus, render: (item) => <Badge tone={item.responseStatus < 400 ? 'success' : 'danger'}>{item.responseStatus}</Badge> },
  { key: 'createdAt', header: 'Date', type: 'date', value: (item) => item.createdAt, render: (item) => formatDate(item.createdAt, true) },
]

const userColumns: GridColumn<AdminUserRecord>[] = [
  { key: 'displayName', header: 'Nom', primary: true, value: (user) => user.displayName },
  { key: 'email', header: 'E-mail', value: (user) => user.email },
  { key: 'roles', header: 'Rôle', type: 'select', options: statusOptions(['EDITOR', 'SUPER_ADMIN']), value: (user) => (user.roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : user.roles[0] ?? ''), render: (user) => <>{user.roles.map((role) => <StatusBadge key={role} value={role}/>)}</> },
  boolColumn<AdminUserRecord>('enabled', 'Statut', (user) => user.enabled, ['Actif', 'Désactivé']),
]

function ResourceManager({ definition }: { definition: Resource }) {
  const { data, loading, error, reload } = useApiData<Row[]>(definition.path)
  const [editing, setEditing] = useState<Row | null | false>(false)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()
  const keyName = definition.keyField || 'id'
  const columns = useMemo(() => resourceColumns(definition, data || []), [definition, data])
  const canDelete = !definition.superAdminDelete || getStoredSession()?.roles.includes('SUPER_ADMIN')
  const save = async (body: Row) => {
    const id = editing ? editing[keyName] : null
    if (definition.key === 'pages') await apiSend(definition.path, 'PUT', body)
    else if (id) await apiSend(`${definition.path}/${encodeURIComponent(String(id))}`, 'PUT', body)
    else await apiSend(definition.path, 'POST', body)
    setEditing(false); toast.success(id ? 'Modifications enregistrées.' : 'Élément créé avec succès.'); reload()
  }
  const remove = async (record: Row) => {
    const id = record[keyName]
    if (!id) return
    const label = String(record.titleFr || record.fullName || record.authorName || record.name || record.slug || 'cet élément')
    if (!await confirm({ title: 'Supprimer cet élément ?', message: <>« <strong>{label}</strong> » sera supprimé définitivement. Cette action est irréversible.</>, confirmLabel: 'Supprimer' })) return
    try { await apiSend(`${definition.path}/${encodeURIComponent(String(id))}`, 'DELETE'); toast.success('Élément supprimé.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  return <>
    <PageHeader eyebrow="CONTENU DU SITE" title={definition.label} description="Les modifications sont enregistrées dans la base NovaTech."
      actions={<button className="primary-action" onClick={() => setEditing(null)}>+ Ajouter</button>}/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id={`content-${definition.key}`} rows={data ?? NO_ROWS} columns={columns} loading={loading} rowKey={(record) => String(record.id || record.slug)} exportName={definition.key}
      searchPlaceholder={`Rechercher dans ${definition.label.toLowerCase()}…`} noun={['entrée', 'entrées']} emptyTitle="Aucun contenu pour le moment" emptyText="Créez votre premier élément avec le bouton « Ajouter »."
      defaultSort={{ key: 'createdAt', dir: 'desc' }}
      rowActions={(record) => <><button onClick={() => setEditing(record)}>Modifier</button>{canDelete && <button className="danger-action" onClick={() => void remove(record)}>Supprimer</button>}</>}/>
    <Modal open={editing !== false} size={definition.fields.length > 9 ? 'xl' : 'lg'} locked={busy} onClose={() => setEditing(false)}
      title={editing ? `Modifier · ${definition.label}` : `Ajouter · ${definition.label}`} subtitle="Les champs marqués d’un * sont obligatoires.">
      {editing !== false && <EntityForm key={editing ? String(editing[keyName]) : 'new'} fields={definition.fields} initial={editing} onCancel={() => setEditing(false)} onSubmit={save} onBusyChange={setBusy}/>}
    </Modal>
  </>
}

function TrainingSessionManager() {
  const { data: courses, loading: coursesLoading, error: coursesError, reload: reloadCourses } = useApiData<TrainingRecord[]>('/management/trainings')
  const [courseId, setCourseId] = useState('')
  const selectedCourse = courseId || courses?.[0]?.id || ''
  const { data: sessions, loading, error, reload } = useApiData<TrainingSessionRecord[]>(selectedCourse ? `/management/trainings/${selectedCourse}/sessions` : null)
  const [editing, setEditing] = useState<TrainingSessionRecord | null | false>(false)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()
  const fields: Field[] = [
    { name: 'courseId', label: 'Formation', type: 'select', required: true, wide: true, options: (courses || []).map((course) => ({ value: course.id, label: course.titleFr })) },
    { name: 'startsAt', label: 'Début', type: 'datetime-local', required: true }, { name: 'endsAt', label: 'Fin', type: 'datetime-local', required: true },
    { name: 'venue', label: 'Lieu', required: true, maxLength: 240 }, { name: 'capacity', label: 'Nombre de places', type: 'number', required: true, min: 1 },
    { name: 'status', label: 'Statut', type: 'select', required: true, options: statusOptions(['OPEN', 'FULL', 'CLOSED', 'COMPLETED']) },
  ]
  const save = async (body: Row) => {
    if (editing) await apiSend(`/management/training-sessions/${editing.id}`, 'PUT', body)
    else await apiSend('/management/training-sessions', 'POST', body)
    setEditing(false); toast.success(editing ? 'Session mise à jour.' : 'Session créée.'); reload()
  }
  const remove = async (session: TrainingSessionRecord) => {
    if (!await confirm({ title: 'Supprimer cette session ?', message: <>La session du <strong>{formatDate(session.startsAt, true)}</strong> sera supprimée définitivement.</>, confirmLabel: 'Supprimer' })) return
    try { await apiSend(`/management/training-sessions/${session.id}`, 'DELETE'); toast.success('Session supprimée.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  const superAdmin = getStoredSession()?.roles.includes('SUPER_ADMIN') ?? false
  return <>
    <PageHeader eyebrow="FORMATIONS" title="Sessions de formation" description="Capacités, lieux, dates et inscriptions par session."
      actions={<button className="primary-action" onClick={() => setEditing(null)} disabled={!selectedCourse}>+ Ajouter une session</button>}/>
    <ApiState loading={false} error={coursesError || error} onRetry={() => { reloadCourses(); reload() }}/>
    <DataGrid id="sessions" rows={sessions || []} columns={sessionColumns} loading={coursesLoading || loading} rowKey={(session) => session.id} exportName="sessions" noun={['session', 'sessions']}
      searchPlaceholder="Rechercher un lieu, un statut…" emptyTitle="Aucune session pour cette formation" emptyText="Planifiez une première session avec le bouton « Ajouter une session »." defaultSort={{ key: 'startsAt', dir: 'asc' }}
      toolbar={<label className="admin-select">Formation<select value={selectedCourse} onChange={(event) => setCourseId(event.target.value)}>{(courses || []).map((course) => <option key={course.id} value={course.id}>{course.titleFr}</option>)}</select></label>}
      rowActions={(session) => <><button onClick={() => setEditing(session)}>Modifier</button>{superAdmin && <button className="danger-action" onClick={() => void remove(session)}>Supprimer</button>}</>}/>
    <Modal open={editing !== false} size="lg" locked={busy} onClose={() => setEditing(false)} title={editing ? 'Modifier la session' : 'Ajouter une session'}>
      {editing !== false && <EntityForm key={editing ? editing.id : 'new'} fields={fields} initial={editing || { courseId: selectedCourse, status: 'OPEN' }} onCancel={() => setEditing(false)} onSubmit={save} onBusyChange={setBusy}
        validate={(values) => (values.startsAt && values.endsAt && new Date(String(values.endsAt)) <= new Date(String(values.startsAt)) ? { endsAt: 'La fin doit être postérieure au début.' } : {})}/>}
    </Modal>
  </>
}

function RequestManager() {
  const { requestType = 'messages' } = useParams()
  if (requestType === 'enrollments') return <EnrollmentManager/>
  const isQuote = requestType === 'quotes'
  const path = isQuote ? '/management/quote-requests' : '/management/contact-messages'
  return <InquiryManager key={requestType} path={path} kind={isQuote ? 'quote' : 'message'}/>
}

function InquiryManager({ path, kind }: { path: string; kind: 'quote' | 'message' }) {
  const { data, loading, error, reload } = useApiData<(QuoteRecord | ContactRecord)[]>(path)
  const [selected, setSelected] = useState<QuoteRecord | ContactRecord | null>(null)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()
  const statuses = kind === 'quote' ? ['NEW', 'READ', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'] : ['NEW', 'READ', 'IN_PROGRESS', 'RESOLVED']
  const patch = (row: QuoteRecord | ContactRecord, body: Record<string, unknown>) => apiSend(`${path}/${row.id}/status`, 'PATCH', body)
  const changeStatus = async (row: QuoteRecord | ContactRecord, status: string) => {
    try { await patch(row, kind === 'quote' ? { status, internalNotes: (row as QuoteRecord).internalNotes || '' } : { status }); toast.success('Statut mis à jour.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Mise à jour impossible.') }
  }
  const remove = async (row: QuoteRecord | ContactRecord) => {
    if (!await confirm({ title: 'Supprimer cette demande ?', message: <>La demande de <strong>{row.fullName}</strong> sera supprimée définitivement.</>, confirmLabel: 'Supprimer' })) return
    try { await apiSend(`${path}/${row.id}`, 'DELETE'); setSelected(null); toast.success('Demande supprimée.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  const columns: GridColumn<QuoteRecord | ContactRecord>[] = [
    { key: 'fullName', header: 'Demandeur', primary: true, value: (row) => row.fullName, render: (row) => <><strong>{row.fullName}</strong><small className="table-subtext">{row.email}{row.phone ? ` · ${row.phone}` : ''}</small></> },
    { key: 'email', header: 'E-mail', hidden: true, value: (row) => row.email },
    { key: 'phone', header: 'Téléphone', hidden: true, value: (row) => row.phone },
    ...(kind === 'quote' ? [
      { key: 'serviceType', header: 'Service', type: 'select' as const, value: (row: QuoteRecord | ContactRecord) => (row as QuoteRecord).serviceType, render: (row: QuoteRecord | ContactRecord) => <div className="cell-excerpt"><strong>{(row as QuoteRecord).serviceType}</strong><small className="table-subtext">{(row as QuoteRecord).projectDescription}</small></div> },
      { key: 'budgetRange', header: 'Budget', type: 'select' as const, hidden: true, value: (row: QuoteRecord | ContactRecord) => (row as QuoteRecord).budgetRange },
      { key: 'desiredDeadline', header: 'Délai souhaité', hidden: true, value: (row: QuoteRecord | ContactRecord) => (row as QuoteRecord).desiredDeadline },
      { key: 'projectDescription', header: 'Description', hidden: true, sortable: false, value: (row: QuoteRecord | ContactRecord) => (row as QuoteRecord).projectDescription },
    ] : [
      { key: 'subject', header: 'Sujet', value: (row: QuoteRecord | ContactRecord) => (row as ContactRecord).subject, render: (row: QuoteRecord | ContactRecord) => <div className="cell-excerpt"><strong>{(row as ContactRecord).subject}</strong><small className="table-subtext">{(row as ContactRecord).message}</small></div> },
      { key: 'message', header: 'Message', hidden: true, sortable: false, value: (row: QuoteRecord | ContactRecord) => (row as ContactRecord).message },
    ]),
    { key: 'createdAt', header: 'Reçu le', type: 'date', value: (row) => row.createdAt, render: (row) => formatDate(row.createdAt) },
    { key: 'status', header: 'Statut', type: 'select', options: statusOptions(statuses), value: (row) => row.status, render: (row) => <select className="status-select" aria-label={`Statut ${row.fullName}`} value={row.status} onChange={(event) => void changeStatus(row, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{statusLabel(status)}</option>)}</select> },
  ]
  const detailFields: Field[] = [
    { name: 'status', label: 'Statut', type: 'select', required: true, options: statusOptions(statuses) },
    ...(kind === 'quote' ? [{ name: 'internalNotes', label: 'Notes internes', type: 'textarea' as const, maxLength: 2000, help: 'Visibles uniquement par l’équipe.' }] : []),
  ]
  const saveDetail = async (body: Row) => {
    if (!selected) return
    await patch(selected, kind === 'quote' ? { status: body.status, internalNotes: body.internalNotes || '' } : { status: body.status })
    setSelected(null); toast.success('Demande mise à jour.'); reload()
  }
  const quote = selected as QuoteRecord | null
  const contact = selected as ContactRecord | null
  return <>
    <PageHeader eyebrow="BOÎTE DE RÉCEPTION" title={kind === 'quote' ? 'Demandes de devis' : 'Messages de contact'} description="Demandes reçues depuis le site et enregistrées par le serveur."/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id={`inquiries-${kind}`} rows={data ?? NO_ROWS} columns={columns} loading={loading} rowKey={(row) => row.id} exportName={kind === 'quote' ? 'devis' : 'messages'} noun={['demande', 'demandes']}
      searchPlaceholder="Rechercher un nom, un e-mail, un message…" emptyTitle="Aucune demande" emptyText="Les nouvelles demandes apparaîtront ici." defaultSort={{ key: 'createdAt', dir: 'desc' }}
      rowActions={(row) => <><button onClick={() => setSelected(row)}>Détails</button><button className="danger-action" onClick={() => void remove(row)}>Supprimer</button></>}/>
    <Modal open={selected !== null} size="lg" locked={busy} onClose={() => setSelected(null)} title={selected ? (kind === 'quote' ? `Devis · ${selected.fullName}` : (contact?.subject ?? 'Message')) : ''} subtitle={selected ? `Reçu le ${formatDate(selected.createdAt, true)}` : undefined}>
      {selected && <>
        <dl className="detail-list">
          <div><dt>Nom</dt><dd>{selected.fullName}</dd></div>
          <div><dt>E-mail</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
          <div><dt>Téléphone</dt><dd>{selected.phone || '—'}</dd></div>
          <div><dt>Langue</dt><dd>{((selected as { language?: string }).language ?? "—").toUpperCase()}</dd></div>
          {kind === 'quote' && quote && <><div><dt>Service</dt><dd>{quote.serviceType}</dd></div><div><dt>Budget</dt><dd>{quote.budgetRange || '—'}</dd></div><div><dt>Délai souhaité</dt><dd>{quote.desiredDeadline || '—'}</dd></div></>}
          <div className="detail-wide"><dt>{kind === 'quote' ? 'Description du projet' : 'Message'}</dt><dd className="detail-text">{kind === 'quote' ? quote?.projectDescription : contact?.message}</dd></div>
        </dl>
        <EntityForm key={selected.id} fields={detailFields} initial={{ status: selected.status, internalNotes: quote?.internalNotes || '' }} submitLabel="Mettre à jour" onCancel={() => setSelected(null)} onSubmit={saveDetail} onBusyChange={setBusy}/>
      </>}
    </Modal>
  </>
}

function EnrollmentManager() {
  const { data: courses, loading: courseLoading, error: courseError } = useApiData<TrainingRecord[]>('/management/trainings')
  const [courseId, setCourseId] = useState('')
  const selectedCourse = courseId || courses?.[0]?.id || ''
  const { data: sessions } = useApiData<TrainingSessionRecord[]>(selectedCourse ? `/management/trainings/${selectedCourse}/sessions` : null)
  const [sessionId, setSessionId] = useState('')
  const selectedSession = sessions?.some((item) => item.id === sessionId) ? sessionId : sessions?.[0]?.id || ''
  const { data, loading, error, reload } = useApiData<TrainingEnrollmentRecord[]>(selectedSession ? `/management/enrollments?sessionId=${encodeURIComponent(selectedSession)}` : null)
  const toast = useToast()
  const changeStatus = async (row: TrainingEnrollmentRecord, status: string) => {
    try { await apiSend(`/management/enrollments/${row.id}/status`, 'PATCH', { status }); toast.success('Statut mis à jour.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Mise à jour impossible.') }
  }
  const columns: GridColumn<TrainingEnrollmentRecord>[] = [
    { key: 'fullName', header: 'Nom', primary: true, value: (row) => row.fullName },
    { key: 'email', header: 'E-mail', value: (row) => row.email },
    { key: 'phone', header: 'Téléphone', value: (row) => row.phone },
    { key: 'preferredLanguage', header: 'Langue', type: 'select', value: (row) => (row.preferredLanguage ?? '').toUpperCase() },
    { key: 'createdAt', header: 'Reçue le', type: 'date', value: (row) => row.createdAt, render: (row) => formatDate(row.createdAt) },
    { key: 'status', header: 'Statut', type: 'select', options: statusOptions(['PENDING', 'CONFIRMED', 'CANCELLED']), value: (row) => row.status, render: (row) => <select className="status-select" value={row.status} aria-label={`Statut ${row.fullName}`} onChange={(event) => void changeStatus(row, event.target.value)}>{['PENDING', 'CONFIRMED', 'CANCELLED'].map((value) => <option key={value} value={value}>{statusLabel(value)}</option>)}</select> },
  ]
  const exportCsv = async () => { try { await adminApiExport(selectedSession, 'csv') } catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Export impossible.') } }
  const exportExcel = async () => { try { await adminApiExport(selectedSession, 'xlsx') } catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Export impossible.') } }
  return <>
    <PageHeader eyebrow="INSCRIPTIONS" title="Pré-inscriptions" description="Le statut synchronise les places disponibles de la session."
      actions={<><button className="secondary-action" disabled={!selectedSession} onClick={() => void exportCsv()}>Exporter en CSV</button><button className="secondary-action" disabled={!selectedSession} onClick={() => void exportExcel()}>Exporter en Excel</button></>}/>
    <ApiState loading={false} error={courseError || error}/>
    <DataGrid id="enrollments" rows={data ?? NO_ROWS} columns={columns} loading={courseLoading || loading} rowKey={(row) => row.id} noun={['inscription', 'inscriptions']}
      searchPlaceholder="Rechercher un nom ou un e-mail…" emptyTitle="Aucune pré-inscription" emptyText="Aucune inscription pour cette session." defaultSort={{ key: 'createdAt', dir: 'desc' }}
      toolbar={<><label className="admin-select">Formation<select value={selectedCourse} onChange={(event) => { setCourseId(event.target.value); setSessionId('') }}>{(courses || []).map((course) => <option key={course.id} value={course.id}>{course.titleFr}</option>)}</select></label>
        <label className="admin-select">Session<select value={selectedSession} onChange={(event) => setSessionId(event.target.value)}>{(sessions || []).map((session) => <option key={session.id} value={session.id}>{formatDate(session.startsAt)} · {session.venue}</option>)}</select></label></>}/>
  </>
}

async function adminApiExport(sessionId: string, format: 'csv' | 'xlsx') {
  const extension = format === 'xlsx' ? 'xlsx' : 'csv'
  const endpoint = format === 'xlsx' ? '/management/enrollments/export.xlsx' : '/management/enrollments/export'
  await apiDownload(`${endpoint}?sessionId=${encodeURIComponent(sessionId)}`, `pre-inscriptions-${sessionId}.${extension}`)
}

const MEDIA_TYPES = ['image/jpeg', 'image/png']
const mediaSchema = Yup.object({
  file: Yup.mixed<File>().required('Choisissez une image.')
    .test('type', 'Format accepté : JPEG ou PNG.', (file) => !file || MEDIA_TYPES.includes(file.type))
    .test('size', 'Le fichier dépasse 10 Mo.', (file) => !file || file.size <= 10 * 1024 * 1024),
  altFr: Yup.string().max(300, 'Maximum 300 caractères.'),
  altEn: Yup.string().max(300, 'Maximum 300 caractères.'),
})

function MediaUploadForm({ onDone, onCancel, onBusyChange }: { onDone: () => void; onCancel: () => void; onBusyChange: (busy: boolean) => void }) {
  return <Formik<{ file: File | null; altFr: string; altEn: string }> initialValues={{ file: null, altFr: '', altEn: '' }} validationSchema={mediaSchema}
    onSubmit={async (values, helpers) => {
      onBusyChange(true)
      try {
        const body = new FormData()
        body.append('file', values.file as File); body.append('altFr', values.altFr); body.append('altEn', values.altEn)
        await apiSend('/management/media', 'POST', body)
        onDone()
      } catch (reason) { helpers.setStatus(reason instanceof ApiError ? reason.message : 'Téléversement impossible.') }
      finally { onBusyChange(false) }
    }}>
    {(formik) => {
      const fileError = formik.touched.file ? (formik.errors.file as string | undefined) : undefined
      return <Form className="entity-form" noValidate>
        <div className="entity-form-grid">
          <div className="entity-field entity-field-wide">
            <label htmlFor="media-file">Fichier image <b aria-hidden="true">*</b></label>
            <label className={`dropzone${fileError ? ' field-has-error' : ''}`} htmlFor="media-file">
              <input id="media-file" type="file" accept="image/jpeg,image/png" aria-invalid={fileError ? true : undefined}
                onChange={(event) => { void formik.setFieldValue('file', event.currentTarget.files?.[0] ?? null); formik.setFieldTouched('file', true, false) }}/>
              {formik.values.file ? <><strong>{formik.values.file.name}</strong><small>{(formik.values.file.size / 1024).toFixed(0)} Ko</small></> : <><strong>Cliquez pour choisir une image</strong><small>JPEG ou PNG · 10 Mo maximum</small></>}
            </label>
            {fileError && <small className="field-validation-error" role="alert">{fileError}</small>}
          </div>
          <div className="entity-field"><label htmlFor="media-alt-fr">Texte alternatif (FR)</label><input id="media-alt-fr" {...formik.getFieldProps('altFr')} maxLength={300}/></div>
          <div className="entity-field"><label htmlFor="media-alt-en">Alt text (EN)</label><input id="media-alt-en" {...formik.getFieldProps('altEn')} maxLength={300}/></div>
        </div>
        {formik.status && <p className="form-error form-banner" role="alert">{String(formik.status)}</p>}
        <div className="modal-actions"><button type="button" className="secondary-action" onClick={onCancel} disabled={formik.isSubmitting}>Annuler</button>
          <button type="submit" className="primary-action" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Envoi…' : 'Téléverser'}</button></div>
      </Form>
    }}
  </Formik>
}

function MediaManager() {
  const { data, loading, error, reload } = useApiData<MediaRecord[]>('/management/media')
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()
  const remove = async (item: MediaRecord) => {
    if (!await confirm({ title: 'Supprimer cette image ?', message: <>« <strong>{item.originalName}</strong> » sera supprimée définitivement. Les pages qui l’utilisent afficheront une image manquante.</>, confirmLabel: 'Supprimer' })) return
    try { await apiSend(`/management/media/${item.id}`, 'DELETE'); toast.success('Image supprimée.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  const copy = async (item: MediaRecord) => {
    try { await navigator.clipboard.writeText(apiMediaUrl(item.url)); toast.success('Lien copié dans le presse-papiers.') }
    catch { toast.error('Copie impossible. Sélectionnez le lien manuellement.') }
  }
  return <>
    <PageHeader eyebrow="GESTION DES MÉDIAS" title="Médiathèque" description="Images JPEG ou PNG, 10 Mo maximum. Elles sont conservées sur le serveur."
      actions={<button className="primary-action" onClick={() => setOpen(true)}>+ Téléverser une image</button>}/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id="media" rows={data ?? NO_ROWS} columns={mediaColumns} loading={loading} rowKey={(item) => item.id} exportName="mediatheque" noun={['image', 'images']}
      searchPlaceholder="Rechercher une image…" emptyTitle="Aucune image" emptyText="Téléversez votre première image pour l’utiliser dans les contenus." emptyAction={<button className="primary-action" onClick={() => setOpen(true)}>+ Téléverser une image</button>}
      defaultSort={{ key: 'createdAt', dir: 'desc' }}
      rowActions={(item) => <><button onClick={() => void copy(item)}>Copier le lien</button><button className="danger-action" onClick={() => void remove(item)}>Supprimer</button></>}/>
    <Modal open={open} size="md" locked={busy} onClose={() => setOpen(false)} title="Téléverser une image" subtitle="L’image est optimisée automatiquement à l’envoi.">
      {open && <MediaUploadForm onBusyChange={setBusy} onCancel={() => setOpen(false)} onDone={() => { setOpen(false); toast.success('Image téléversée et optimisée.'); reload() }}/>}
    </Modal>
  </>
}

function HomepageManager() {
  const { data, loading, error, reload } = useApiData<Record<string, string>>('/management/homepage')
  if (!data) return <><PageHeader eyebrow="CONTENU DU SITE" title="Page d’accueil" description="Modifiez les textes et visuels de la page d’accueil."/><ApiState loading={false} error={error} onRetry={reload}/>{loading && <SkeletonForm fields={10}/>}</>
  return <HomepageEditor initialValues={{ ...homepageDefaults, ...data }}/>
}

function HomepageEditor({ initialValues }: { initialValues: Record<string, string> }) {
  const [tab, setTab] = useState(0)
  const [uploading, setUploading] = useState('')
  const toast = useToast()
  const schema = useMemo(() => Yup.object(Object.fromEntries(Object.keys(initialValues).map((key) => [key, Yup.string().max(4000, 'Maximum 4 000 caractères.')]))), [initialValues])
  const groupOf = (key: string) => homepageFieldGroups.findIndex((group) => group.fields.some((field) => `home.${field.key}` === key))
  return <Formik<Record<string, string>> initialValues={initialValues} validationSchema={schema} enableReinitialize={false}
    onSubmit={async (values, helpers) => {
      helpers.setStatus(undefined)
      try { await apiSend('/management/homepage', 'PUT', { values }); helpers.resetForm({ values }); toast.success('Page d’accueil enregistrée.') }
      catch (reason) {
        if (reason instanceof ApiError && Object.keys(reason.fields).length) {
          const mapped = mapFieldErrors(reason.fields, Object.keys(values))
          helpers.setErrors(mapped); helpers.setTouched(Object.fromEntries(Object.keys(mapped).map((key) => [key, true])), false)
          const first = Object.keys(mapped).map(groupOf).find((index) => index >= 0)
          if (first !== undefined) setTab(first)
          if (Object.keys(mapped).length < Object.keys(reason.fields).length) helpers.setStatus(reason.message)
        } else helpers.setStatus(reason instanceof ApiError ? reason.message : 'Enregistrement impossible.')
        toast.error('Certains champs sont à corriger.')
      }
    }}>
    {(formik) => <HomepageForm formik={formik} tab={tab} setTab={setTab} uploading={uploading} onUpload={async (key, file) => {
      setUploading(key)
      try { const asset = await uploadAdminImage(file); await formik.setFieldValue(`home.${key}`, asset.url); toast.info('Image téléversée. Enregistrez la page pour publier.') }
      catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Téléversement impossible.') }
      finally { setUploading('') }
    }}/>}
  </Formik>
}

function HomepageForm({ formik, tab, setTab, uploading, onUpload }: { formik: FormikProps<Record<string, string>>; tab: number; setTab: (index: number) => void; uploading: string; onUpload: (key: string, file: File) => Promise<void> }) {
  useEffect(() => {
    if (!formik.dirty) return
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [formik.dirty])
  const group = homepageFieldGroups[tab]
  const errorCount = (index: number) => homepageFieldGroups[index].fields.filter((field) => formik.errors[`home.${field.key}`]).length
  return <Form noValidate>
    <PageHeader eyebrow="CONTENU DU SITE" title="Page d’accueil" description="Les textes sont bilingues. Les aperçus de services, projets, formations et actualités utilisent les contenus publiés dans leurs rubriques."
      actions={<a className="secondary-action" href="/fr" target="_blank" rel="noreferrer">Voir le site ↗</a>}/>
    <div className="homepage-layout">
      <nav className="homepage-tabs" aria-label="Sections de la page d’accueil">{homepageFieldGroups.map((item, index) => <button type="button" key={item.title} className={index === tab ? 'active' : ''} aria-current={index === tab ? 'true' : undefined} onClick={() => setTab(index)}>{item.title}{errorCount(index) > 0 && <span className="tab-error">{errorCount(index)}</span>}</button>)}</nav>
      <section className="admin-panel homepage-editor-group" aria-label={group.title}>
        <h2>{group.title}</h2>
        <div className="entity-form-grid">{group.fields.map((field) => {
          const key = `home.${field.key}`
          const error = formik.touched[key] || formik.submitCount ? formik.errors[key] : undefined
          const value = formik.values[key] || ''
          const id = `hp-${field.key}`
          return <div key={field.key} className={`entity-field${field.kind === 'textarea' || field.kind === 'image' ? ' entity-field-wide' : ''}${error ? ' field-has-error' : ''}`}>
            <label htmlFor={id}>{field.label}</label>
            {field.kind === 'textarea' ? <textarea id={id} name={key} rows={3} maxLength={4000} value={value} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={error ? true : undefined}/>
              : field.kind === 'image' ? <div className="image-field">
                <input id={id} name={key} type="text" maxLength={4000} placeholder="https://… ou téléversez un fichier" value={value} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={error ? true : undefined}/>
                <label className="image-upload-button">{uploading === field.key ? 'Envoi…' : 'Téléverser'}<input type="file" accept="image/jpeg,image/png" disabled={uploading === field.key} aria-label={`Téléverser ${field.label}`} onChange={(event) => { const input = event.currentTarget; const file = input.files?.[0]; if (file) void onUpload(field.key, file).finally(() => { input.value = '' }) }}/></label>
                {value && <img className="image-field-preview" src={value.startsWith('/media/') ? apiMediaUrl(value) : value} alt="" onError={(event) => { event.currentTarget.style.display = 'none' }} onLoad={(event) => { event.currentTarget.style.display = '' }}/>}
              </div>
                : <input id={id} name={key} type="text" maxLength={4000} value={value} onChange={formik.handleChange} onBlur={formik.handleBlur} aria-invalid={error ? true : undefined}/>}
            {error && <small className="field-validation-error" role="alert">{String(error)}</small>}
          </div>
        })}</div>
      </section>
    </div>
    <div className="save-bar" data-dirty={formik.dirty}>
      <span>{formik.status ? <span className="form-error" role="alert">{String(formik.status)}</span> : formik.dirty ? 'Modifications non enregistrées' : 'Tout est enregistré'}</span>
      <div><button type="button" className="secondary-action" disabled={!formik.dirty || formik.isSubmitting} onClick={() => formik.resetForm()}>Annuler les modifications</button>
        <button type="submit" className="primary-action" disabled={!formik.dirty || formik.isSubmitting || Boolean(uploading)}>{formik.isSubmitting ? 'Enregistrement…' : 'Enregistrer la page'}</button></div>
    </div>
  </Form>
}

function SiteSettingsManager() {
  const { data, loading, error, reload } = useApiData<Record<string, string>>('/management/settings')
  if (!data) return <><PageHeader eyebrow="CONFIGURATION" title="Paramètres du site" description="Coordonnées publiques, réseaux sociaux et référencement du site."/><ApiState loading={false} error={error} onRetry={reload}/>{loading && <SkeletonForm fields={8}/>}</>
  const editable = Object.fromEntries(Object.entries(data).filter(([key]) => !key.startsWith('home.') && !MANAGED_KEYS.has(key)))
  return <SiteSettingsForm initialValues={editable} all={data} reload={reload}/>
}

function SiteSettingsForm({ initialValues, all, reload }: { initialValues: Record<string, string>; all: Record<string, string>; reload: () => void }) {
  const [adding, setAdding] = useState(false)
  const toast = useToast()
  const [extra, setExtra] = useState<string[]>([])
  const baseKeys = Object.keys(initialValues)
  const keys = [...baseKeys, ...extra.filter((key) => !baseKeys.includes(key))]
  const schema = Yup.lazy((values: Record<string, string>) => Yup.object(Object.fromEntries(Object.keys(values).map((key) => [key, Yup.string().max(4000, 'Maximum 4 000 caractères.')]))))
  return <Formik<Record<string, string>> initialValues={Object.fromEntries(keys.map((key) => [key, initialValues[key] ?? '']))} validationSchema={schema} enableReinitialize
    onSubmit={async (values, helpers) => {
      helpers.setStatus(undefined)
      try { await apiSend('/management/settings', 'PUT', { values: { ...Object.fromEntries(Object.entries(all).filter(([key]) => MANAGED_KEYS.has(key))), ...values } }); toast.success('Paramètres enregistrés.'); setExtra([]); reload() }
      catch (reason) { helpers.setStatus(reason instanceof ApiError ? reason.message : 'Enregistrement impossible.'); toast.error('Enregistrement impossible.') }
    }}>
    {(formik) => <Form noValidate>
      <PageHeader eyebrow="CONFIGURATION" title="Paramètres du site" description="Coordonnées publiques, réseaux sociaux et référencement du site."
        actions={<button type="button" className="secondary-action" onClick={() => setAdding(true)}>+ Nouveau paramètre</button>}/>
      <section className="admin-panel settings-panel">
        {keys.length === 0 ? <EmptyState title="Aucun paramètre enregistré" text="Créez des clés comme site.name, contact.email, social.facebook ou seo.home.title." action={<button type="button" className="primary-action" onClick={() => setAdding(true)}>+ Nouveau paramètre</button>}/>
          : <div className="entity-form-grid">{keys.map((key) => <div className={`entity-field${formik.errors[key] ? ' field-has-error' : ''}`} key={key}>
            <label htmlFor={`setting-${key}`}><code>{key}</code></label>
            <input id={`setting-${key}`} {...formik.getFieldProps(key)} aria-invalid={formik.errors[key] ? true : undefined}/>
            {formik.errors[key] && <small className="field-validation-error" role="alert">{formik.errors[key]}</small>}
          </div>)}</div>}
      </section>
      <div className="save-bar" data-dirty={formik.dirty}>
        <span>{formik.status ? <span className="form-error" role="alert">{String(formik.status)}</span> : formik.dirty ? 'Modifications non enregistrées' : 'Tout est enregistré'}</span>
        <div><button type="button" className="secondary-action" disabled={!formik.dirty || formik.isSubmitting} onClick={() => formik.resetForm()}>Annuler</button>
          <button type="submit" className="primary-action" disabled={!formik.dirty || formik.isSubmitting}>{formik.isSubmitting ? 'Enregistrement…' : 'Enregistrer les paramètres'}</button></div>
      </div>
      <Modal open={adding} size="sm" onClose={() => setAdding(false)} title="Nouveau paramètre" subtitle="La clé identifie la valeur, par exemple contact.opening-hours.">
        {adding && <EntityForm fields={[{ name: 'key', label: 'Clé du paramètre', required: true, maxLength: 160, placeholder: 'contact.opening-hours' }]} submitLabel="Ajouter" onCancel={() => setAdding(false)}
          validate={(values) => { const key = String(values.key || '').trim(); return key && !/^[A-Za-z0-9._-]+$/.test(key) ? { key: 'Utilisez des lettres, chiffres, points, tirets ou underscores.' } : key && keys.includes(key) ? { key: 'Cette clé existe déjà.' } : {} }}
          onSubmit={async (body) => { const key = String(body.key); setExtra((current) => [...current, key]); await formik.setFieldValue(key, ''); setAdding(false) }}/>}
      </Modal>
    </Form>}
  </Formik>
}

/* ---------- Pied de page, en-tête et coordonnées ---------- */
type SiteField = { key: string; label: string; type?: 'text' | 'textarea' | 'email' | 'url' | 'switch'; defaultOn?: boolean; help?: string; max?: number; placeholder?: string; wide?: boolean }
const SITE_SECTIONS: { title: string; description: string; fields: SiteField[] }[] = [
  { title: 'Coordonnées', description: 'Affichées dans la barre supérieure, le pied de page et la page contact.', fields: [
    { key: 'contact.email', label: 'Adresse e-mail publique', type: 'email', max: 254 },
    { key: 'contact.phone', label: 'Téléphone', max: 40, placeholder: '+237 6 00 00 00 00' },
    { key: 'contact.address.fr', label: 'Adresse (FR)', max: 300 }, { key: 'contact.address.en', label: 'Address (EN)', max: 300 },
    { key: 'contact.hours.fr', label: 'Horaires d’ouverture (FR)', max: 300, placeholder: 'Lun–Ven · 8 h – 17 h' }, { key: 'contact.hours.en', label: 'Opening hours (EN)', max: 300, placeholder: 'Mon–Fri · 8 am – 5 pm' },
    { key: 'social.whatsapp', label: 'Numéro WhatsApp', max: 30, help: 'Format international, chiffres uniquement (ex. 237600000000).' },
  ] },
  { title: 'Réseaux sociaux', description: 'Laissez vide pour masquer un réseau.', fields: SOCIAL_NETWORKS.map((item) => ({ key: `social.${item.key}`, label: item.label, type: 'url' as const, max: 300, placeholder: 'https://…' })) },
  { title: 'Barre supérieure', description: 'Bandeau fin affiché tout en haut des pages.', fields: [
    { key: 'topbar.visible', label: 'Afficher la barre supérieure', type: 'switch', defaultOn: true },
    { key: 'topbar.text.fr', label: 'Texte (FR)', max: 200 }, { key: 'topbar.text.en', label: 'Text (EN)', max: 200 },
  ] },
  { title: 'En-tête', description: 'Acces de connexion de l’en-tête.', fields: [
    { key: 'header.login-label.fr', label: 'Libellé (FR)', max: 60 }, { key: 'header.login-label.en', label: 'Label (EN)', max: 60 },
  ] },
  { title: 'Pied de page', description: 'Textes, titres de colonnes et mentions du pied de page (accueil et pages intérieures).', fields: [
    { key: 'footer.text.fr', label: 'Présentation (FR)', type: 'textarea', max: 600 }, { key: 'footer.text.en', label: 'Description (EN)', type: 'textarea', max: 600 },
    { key: 'footer.explore.fr', label: 'Titre colonne « Explorer » (FR)', max: 80 }, { key: 'footer.explore.en', label: 'Explore column title (EN)', max: 80 },
    { key: 'footer.contact-cta.fr', label: 'Lien d’invitation au contact (FR)', max: 120 }, { key: 'footer.contact-cta.en', label: 'Contact link text (EN)', max: 120 },
    { key: 'footer.info.fr', label: 'Titre colonne « Informations » (FR)', max: 80 }, { key: 'footer.info.en', label: 'Information column title (EN)', max: 80 },
    { key: 'footer.copyright.fr', label: 'Mention de copyright (FR)', max: 200, help: 'Utilisez {year} pour l’année en cours.' }, { key: 'footer.copyright.en', label: 'Copyright (EN)', max: 200, help: 'Use {year} for the current year.' },
    { key: 'footer.show-admin-link', label: 'Afficher le lien « Administration » dans le pied de page', type: 'switch', defaultOn: false, wide: true },
  ] },
]
const MANAGED_KEYS = new Set([...SITE_SECTIONS.flatMap((section) => section.fields.map((field) => field.key)), 'footer.links'])

type FooterFormValues = Record<string, string | boolean | FooterLink[]>
const linkSchema = Yup.object({
  labelFr: Yup.string().trim().required('Libellé obligatoire.').max(80, 'Maximum 80 caractères.'),
  labelEn: Yup.string().trim().max(80, 'Maximum 80 caractères.'),
  url: Yup.string().trim().required('Lien obligatoire.').max(500).test('url', 'Utilisez https://… ou un chemin commençant par /', (value) => !value || value.startsWith('/') || /^https?:\/\/\S+$/.test(value)),
})
const siteSchema = Yup.object({
  ...Object.fromEntries(SITE_SECTIONS.flatMap((section) => section.fields).filter((field) => field.type !== 'switch').map((field) => {
    let rule = Yup.string().trim().max(field.max ?? 300, `Maximum ${field.max ?? 300} caractères.`)
    if (field.type === 'email') rule = rule.email('Adresse e-mail invalide.')
    if (field.type === 'url') rule = rule.test('url', 'Saisissez une URL valide (https://…).', (value) => !value || /^https?:\/\/\S+$/.test(value))
    if (field.key === 'social.whatsapp') rule = rule.matches(/^\d{6,20}$|^$/, 'Chiffres uniquement, avec l’indicatif pays.')
    return [field.key, rule]
  })),
  links: Yup.array().of(linkSchema).max(10, 'Maximum 10 liens.'),
})

function FooterSettingsManager() {
  const { data, loading, error, reload } = useApiData<Record<string, string>>('/management/settings')
  if (!data) return <><PageHeader eyebrow="SITE PUBLIC" title="Pied de page et coordonnées" description="Coordonnées, réseaux sociaux, en-tête et pied de page."/><ApiState loading={false} error={error} onRetry={reload}/>{loading && <SkeletonForm fields={10}/>}</>
  return <FooterSettingsForm all={data} reload={reload}/>
}

function FooterSettingsForm({ all, reload }: { all: Record<string, string>; reload: () => void }) {
  const toast = useToast()
  const initial: FooterFormValues = {
    ...Object.fromEntries(SITE_SECTIONS.flatMap((section) => section.fields).map((field) => [field.key, field.type === 'switch' ? (field.defaultOn ? all[field.key] !== 'false' : all[field.key] === 'true') : all[field.key] ?? ''])),
    links: parseFooterLinks(all['footer.links']),
  }
  return <Formik<FooterFormValues> initialValues={initial} validationSchema={siteSchema} enableReinitialize
    onSubmit={async (values, helpers) => {
      helpers.setStatus(undefined)
      const next: Record<string, string> = Object.fromEntries(Object.entries(all).filter(([key]) => !key.startsWith('home.')))
      for (const field of SITE_SECTIONS.flatMap((section) => section.fields)) {
        const value = values[field.key]
        if (field.type === 'switch') next[field.key] = value ? 'true' : 'false'
        else if (String(value).trim() === '') delete next[field.key]
        else next[field.key] = String(value).trim()
      }
      const links = values.links as FooterLink[]
      if (links.length) next['footer.links'] = JSON.stringify(links.map((link) => ({ labelFr: link.labelFr.trim(), labelEn: (link.labelEn || '').trim(), url: link.url.trim() })))
      else delete next['footer.links']
      try { await apiSend('/management/settings', 'PUT', { values: next }); toast.success('Pied de page et coordonnées enregistrés.'); reload() }
      catch (reason) { helpers.setStatus(reason instanceof ApiError ? reason.message : 'Enregistrement impossible.'); toast.error('Enregistrement impossible.') }
    }}>
    {(formik) => <Form noValidate>
      <PageHeader eyebrow="SITE PUBLIC" title="Pied de page et coordonnées" description="Tout ce qui apparaît dans la barre supérieure, l’en-tête et le pied de page du site se modifie ici."
        actions={<a className="secondary-action" href="/fr" target="_blank" rel="noreferrer">Voir le site ↗</a>}/>
      {SITE_SECTIONS.map((section) => <section className="admin-panel settings-panel" key={section.title}>
        <header className="panel-title"><h2>{section.title}</h2><p>{section.description}</p></header>
        <div className="entity-form-grid">{section.fields.map((field) => {
          const error = formik.touched[field.key] ? (formik.errors[field.key] as string | undefined) : undefined
          const id = `site-${field.key}`
          if (field.type === 'switch') return <div className="entity-field entity-field-check entity-field-wide" key={field.key}><label className="switch"><input id={id} type="checkbox" checked={Boolean(formik.values[field.key])} onChange={(event) => void formik.setFieldValue(field.key, event.target.checked)}/><span className="switch-track" aria-hidden="true"/><span>{field.label}</span></label></div>
          return <div className={`entity-field${field.type === 'textarea' || field.wide ? ' entity-field-wide' : ''}${error ? ' field-has-error' : ''}`} key={field.key}>
            <label htmlFor={id}>{field.label}</label>
            {field.type === 'textarea' ? <textarea id={id} rows={3} placeholder={field.placeholder} aria-invalid={error ? true : undefined} {...formik.getFieldProps(field.key)}/> : <input id={id} type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'} placeholder={field.placeholder} aria-invalid={error ? true : undefined} {...formik.getFieldProps(field.key)}/>}
            {field.help && !error && <small className="field-help">{field.help}</small>}
            {error && <small className="field-validation-error" role="alert">{error}</small>}
          </div>
        })}</div>
      </section>)}
      <section className="admin-panel settings-panel">
        <header className="panel-title"><h2>Liens supplémentaires du pied de page</h2><p>Ajoutez vos propres liens (réseau partenaire, conditions de vente, etc.). Ils apparaissent dans la colonne « Informations ».</p></header>
        <FieldArray name="links">{(helpers) => <div className="links-editor">
          {(formik.values.links as FooterLink[]).map((_, index) => {
            const err = (name: 'labelFr' | 'labelEn' | 'url') => { const touched = (formik.touched.links as unknown as Array<Record<string, boolean>> | undefined)?.[index]?.[name]; const message = (formik.errors.links as unknown as Array<Record<string, string>> | undefined)?.[index]?.[name]; return touched ? message : undefined }
            return <div className="link-row" key={index}>
              {(['labelFr', 'labelEn', 'url'] as const).map((name) => <div className={`entity-field${err(name) ? ' field-has-error' : ''}`} key={name}>
                <label htmlFor={`link-${index}-${name}`}>{name === 'labelFr' ? 'Libellé (FR)' : name === 'labelEn' ? 'Label (EN)' : 'Lien'}</label>
                <input id={`link-${index}-${name}`} placeholder={name === 'url' ? 'https://… ou /fr/page' : ''} aria-invalid={err(name) ? true : undefined} {...formik.getFieldProps(`links.${index}.${name}`)}/>
                {err(name) && <small className="field-validation-error" role="alert">{err(name)}</small>}</div>)}
              <button type="button" className="icon-button danger" aria-label={`Supprimer le lien ${index + 1}`} onClick={() => helpers.remove(index)}>×</button>
            </div>
          })}
          <button type="button" className="secondary-action" disabled={(formik.values.links as FooterLink[]).length >= 10} onClick={() => helpers.push({ labelFr: '', labelEn: '', url: '' })}>+ Ajouter un lien</button>
        </div>}</FieldArray>
      </section>
      <div className="save-bar" data-dirty={formik.dirty}>
        <span>{formik.status ? <span className="form-error" role="alert">{String(formik.status)}</span> : formik.dirty ? 'Modifications non enregistrées' : 'Tout est enregistré'}</span>
        <div><button type="button" className="secondary-action" disabled={!formik.dirty || formik.isSubmitting} onClick={() => formik.resetForm()}>Annuler</button>
          <button type="submit" className="primary-action" disabled={!formik.dirty || formik.isSubmitting}>{formik.isSubmitting ? 'Enregistrement…' : 'Enregistrer'}</button></div>
      </div>
    </Form>}
  </Formik>
}

/* ---------- Textes du site (traductions modifiables) ---------- */
type TextEntry = { key: string; group: string; fr: string; en: string; defaultFr: string; defaultEn: string; overridden: boolean }
const GROUP_LABELS: Record<string, string> = {
  nav: 'Menu de navigation', common: 'Boutons et libellés communs', home: 'Accueil', pages: 'Titres des pages', about: 'À propos', forms: 'Formulaires', admin: 'Espace admin',
  'ui.landing': 'Accueil — autres textes', 'ui.pages': 'Pages publiques — textes', 'ui.layout': 'En-tête et pied de page',
}
const groupOf = (key: string) => (key.startsWith('ui.') ? key.split('.').slice(0, 2).join('.') : key.split('.')[0])

function TextsManager() {
  const { data, loading, error, reload } = useApiData<TextEntry[]>('/management/translations')
  const [editing, setEditing] = useState<TextEntry | null>(null)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()
  const columns = useMemo<GridColumn<TextEntry>[]>(() => [
    { key: 'key', header: 'Clé', primary: true, value: (item) => item.key, render: (item) => <code>{item.key}</code> },
    { key: 'group', header: 'Rubrique', type: 'select', value: (item) => groupOf(item.key), options: [...new Set((data || []).map((item) => groupOf(item.key)))].sort().map((value) => ({ value, label: GROUP_LABELS[value] ?? value })), render: (item) => GROUP_LABELS[groupOf(item.key)] ?? groupOf(item.key) },
    { key: 'fr', header: 'Français', value: (item) => item.fr, render: (item) => <div className="cell-excerpt">{item.fr}</div> },
    { key: 'en', header: 'English', value: (item) => item.en, render: (item) => <div className="cell-excerpt">{item.en}</div> },
    boolColumn<TextEntry>('overridden', 'Personnalisé', (item) => item.overridden, ['Modifié', 'Par défaut']),
  ], [data])
  const save = async (body: Row) => {
    if (!editing) return
    await apiSend(`/management/translations/${encodeURIComponent(editing.key)}`, 'PUT', { fr: body.fr ?? '', en: body.en ?? '' })
    setEditing(null); toast.success('Texte enregistré. Il est visible immédiatement sur le site.'); reload()
  }
  const reset = async (item: TextEntry) => {
    if (!await confirm({ title: 'Rétablir le texte d’origine ?', message: <>Le texte « <strong>{item.key}</strong> » reprendra sa valeur par défaut en français et en anglais.</>, confirmLabel: 'Rétablir', tone: 'primary' })) return
    try { await apiSend(`/management/translations/${encodeURIComponent(item.key)}`, 'DELETE'); toast.success('Texte d’origine rétabli.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Opération impossible.') }
  }
  const fields: Field[] = [
    { name: 'fr', label: 'Texte en français', type: 'textarea', maxLength: 2000, wide: true }, { name: 'en', label: 'Text in English', type: 'textarea', maxLength: 2000, wide: true },
  ]
  return <>
    <PageHeader eyebrow="SITE PUBLIC" title="Textes du site" description="Modifiez tous les textes du site public (menus, boutons, titres, formulaires) en français et en anglais."/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id="texts" rows={data ?? NO_ROWS} columns={columns} loading={loading} rowKey={(item) => item.key} exportName="textes-du-site" noun={['texte', 'textes']}
      searchPlaceholder="Rechercher un texte ou une clé…" emptyTitle="Aucun texte" defaultSort={{ key: 'group', dir: 'asc' }}
      rowActions={(item) => <><button onClick={() => setEditing(item)}>Modifier</button>{item.overridden && <button onClick={() => void reset(item)}>Rétablir</button>}</>}/>
    <Modal open={editing !== null} size="lg" locked={busy} onClose={() => setEditing(null)} title="Modifier le texte" subtitle={editing?.key}>
      {editing && <EntityForm key={editing.key} fields={fields} initial={{ fr: editing.fr, en: editing.en }} onCancel={() => setEditing(null)} onSubmit={save} onBusyChange={setBusy}/>}
    </Modal>
  </>
}

function NewsletterManager() {
  const { data, loading, error, reload } = useApiData<NewsletterRecord[]>('/management/newsletter/subscribers')
  return <>
    <PageHeader eyebrow="COMMUNICATION" title="Abonnés à la newsletter" description="Adresses enregistrées avec consentement."/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id="newsletter" rows={data ?? NO_ROWS} columns={newsletterColumns} loading={loading} rowKey={(item) => item.id} exportName="newsletter" noun={['abonné', 'abonnés']}
      searchPlaceholder="Rechercher une adresse e-mail…" emptyTitle="Aucun abonné" emptyText="Les inscriptions depuis le site apparaîtront ici." defaultSort={{ key: 'createdAt', dir: 'desc' }}/>
  </>
}

function ActivityManager() {
  const { data, loading, error, reload } = useApiData<ActivityRecord[]>('/management/activity?page=0&size=500&sort=createdAt,desc')
  const rows = useMemo(() => (Array.isArray(data) ? data : (data as unknown as { content?: ActivityRecord[] } | null)?.content || []), [data])
  return <>
    <PageHeader eyebrow="SÉCURITÉ" title="Journal d’activité" description="Actions administratives récentes."/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id="activity" rows={rows} columns={activityColumns} loading={loading} rowKey={(item) => item.id} exportName="journal-activite" noun={['action', 'actions']}
      searchPlaceholder="Rechercher un utilisateur ou une route…" emptyTitle="Aucune activité" emptyText="Les actions des administrateurs seront listées ici." defaultSort={{ key: 'createdAt', dir: 'desc' }}/>
  </>
}

function UserManager({ startCreating = false }: { startCreating?: boolean }) {
  const { data, loading, error, reload } = useApiData<AdminUserRecord[]>('/management/users')
  const [editing, setEditing] = useState<AdminUserRecord | null | false>(startCreating ? null : false)
  const [busy, setBusy] = useState(false)
  const toast = useToast()
  const confirm = useConfirm()
  const creating = editing === null
  const fields: Field[] = [
    { name: 'displayName', label: 'Nom affiché', required: true, maxLength: 120 }, { name: 'email', label: 'Adresse e-mail', type: 'email', required: true },
    { name: 'password', label: creating ? 'Mot de passe temporaire' : 'Nouveau mot de passe', type: 'password', required: creating, help: creating ? '12 caractères minimum, avec une minuscule, une majuscule et un chiffre.' : 'Laissez vide pour conserver le mot de passe actuel.' },
    { name: 'role', label: 'Rôle', type: 'select', required: true, options: statusOptions(['EDITOR', 'SUPER_ADMIN']) },
    { name: 'enabled', label: 'Compte actif', type: 'checkbox', help: 'Un compte désactivé ne peut plus se connecter.' },
  ]
  const save = async (body: Row) => {
    const payload: Row = { email: body.email, displayName: body.displayName, roles: [body.role], enabled: body.enabled }
    if (body.password) payload.password = body.password
    if (editing) await apiSend(`/management/users/${editing.id}`, 'PUT', payload)
    else await apiSend('/management/users', 'POST', payload)
    setEditing(false); toast.success(editing ? 'Utilisateur mis à jour.' : 'Compte créé. Transmettez le mot de passe de façon sécurisée.'); reload()
  }
  const remove = async (user: AdminUserRecord) => {
    if (!await confirm({ title: 'Supprimer ce compte ?', message: <>Le compte <strong>{user.email}</strong> ne pourra plus se connecter. Cette action est irréversible.</>, confirmLabel: 'Supprimer' })) return
    try { await apiSend(`/management/users/${user.id}`, 'DELETE'); toast.success('Compte supprimé.'); reload() }
    catch (reason) { toast.error(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  return <>
    <PageHeader eyebrow="ADMINISTRATION" title="Utilisateurs d’administration" description="Gestion réservée au super administrateur." actions={<button className="primary-action" onClick={() => setEditing(null)}>+ Créer un compte</button>}/>
    <ApiState loading={false} error={error} onRetry={reload}/>
    <DataGrid id="users" rows={data ?? NO_ROWS} columns={userColumns} loading={loading} rowKey={(user) => user.id} exportName="utilisateurs" noun={['compte', 'comptes']}
      searchPlaceholder="Rechercher un nom ou un e-mail…" emptyTitle="Aucun compte" emptyText="Créez un compte pour inviter un collaborateur." defaultSort={{ key: 'displayName', dir: 'asc' }}
      rowActions={(user) => <><button onClick={() => setEditing(user)}>Modifier</button><button className="danger-action" onClick={() => void remove(user)}>Supprimer</button></>}/>
    <Modal open={editing !== false} size="lg" locked={busy} onClose={() => setEditing(false)} title={editing ? 'Modifier le compte' : 'Créer un compte administrateur'} subtitle={editing ? editing.email : 'Le nouvel utilisateur pourra se connecter dès l’enregistrement.'}>
      {editing !== false && <EntityForm key={editing ? editing.id : 'new'} fields={fields} submitLabel={editing ? 'Enregistrer' : 'Créer le compte'} onCancel={() => setEditing(false)} onSubmit={save} onBusyChange={setBusy}
        initial={editing ? { ...editing, role: editing.roles.includes('SUPER_ADMIN') ? 'SUPER_ADMIN' : editing.roles[0] ?? 'EDITOR', password: '' } : { role: 'EDITOR', enabled: true }}/>}
    </Modal>
  </>
}


function Guarded({ children }: { children: ReactNode }) {
  const location = useLocation()
  useAuthChange()
  return isAuthenticated() ? children : <Navigate to="/admin/login" state={{ from: location }} replace/>
}

function HomepageEditorGuard() {
  const location = useLocation()
  const session = getStoredSession()
  if (!isAuthenticated()) return <Navigate to="/admin/login" state={{ from: location }} replace/>
  return session?.roles.some((role) => role === 'SUPER_ADMIN' || role === 'EDITOR') ? <Outlet/> : <Navigate to="/admin" replace/>
}

function SuperAdminGuard() {
  const location = useLocation()
  const session = getStoredSession()
  if (!isAuthenticated()) return <Navigate to="/admin/login" state={{ from: location }} replace/>
  return session?.roles.includes('SUPER_ADMIN') ? <Outlet/> : <Navigate to="/admin" replace/>
}

export function AdminRoutes() {
  return <FeedbackProvider><Routes>
    <Route path="login" element={<AdminLogin/>}/><Route path="forgot-password" element={<Navigate to="/admin/login" replace/>}/><Route path="reset-password" element={<Navigate to="/admin/login" replace/>}/>
    <Route element={<Guarded><AdminLayout/></Guarded>}>
      <Route index element={<AdminDashboard/>}/><Route path="content/:resource" element={<ContentManager/>}/><Route path="sessions" element={<TrainingSessionManager/>}/>
      <Route path="requests/:requestType" element={<RequestManager/>}/><Route path="media" element={<MediaManager/>}/><Route path="settings" element={<SiteSettingsManager/>}/><Route path="footer" element={<FooterSettingsManager/>}/><Route path="texts" element={<TextsManager/>}/>
      <Route path="newsletter" element={<NewsletterManager/>}/>
      <Route element={<HomepageEditorGuard/>}><Route path="homepage" element={<HomepageManager/>}/></Route>
      <Route element={<SuperAdminGuard/>}><Route path="activity" element={<ActivityManager/>}/><Route path="users" element={<UserManager/>}/><Route path="users/new" element={<UserManager startCreating/>}/></Route>
      <Route path="*" element={<Navigate to="/admin" replace/>}/>
    </Route>
  </Routes></FeedbackProvider>
}
