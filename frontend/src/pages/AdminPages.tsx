import { useEffect, useRef, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { usePageAnimations } from '../animations/usePageAnimations'
import logo from '../assets/nova-tech-logo.png'
import logoLight from '../assets/nova-tech-logo-light.png'
import { ApiError, apiDownload, apiMediaUrl, apiSend, getStoredSession, isAuthenticated, login, logout } from '../api/client'
import { ApiState } from '../api/ApiState'
import { useApiData } from '../api/hooks'
import type { ActivityRecord, AdminUserRecord, ContactRecord, DashboardRecord, MediaRecord, NewsletterRecord, QuoteRecord, TrainingEnrollmentRecord, TrainingRecord, TrainingSessionRecord } from '../api/types'
import '../styles/site-pages.css'
import '../styles/admin-auth.css'
import '../styles/admin-workspace.css'

type Field = { name: string; label: string; type?: 'text' | 'textarea' | 'number' | 'date' | 'datetime-local' | 'url' | 'email' | 'checkbox' | 'select' | 'list'; required?: boolean; options?: { value: string; label: string }[] }
type Row = Record<string, unknown> & { id?: string; slug?: string }
type Resource = { key: string; label: string; path: string; fields: Field[]; keyField?: 'id' | 'slug'; superAdminDelete?: boolean }

const resources: Resource[] = [
  { key: 'services', label: 'Services', path: '/admin/services', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'category', label: 'Catégorie', required: true },
    { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'descriptionFr', label: 'Description (FR)', type: 'textarea', required: true }, { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
    { name: 'imageUrl', label: 'URL de l’image', type: 'url' }, { name: 'displayOrder', label: 'Ordre', type: 'number' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'projects', label: 'Réalisations', path: '/admin/projects', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'descriptionFr', label: 'Description (FR)', type: 'textarea', required: true }, { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
    { name: 'category', label: 'Catégorie', required: true }, { name: 'clientName', label: 'Client' },
    { name: 'technologies', label: 'Technologies (une par ligne)', type: 'list' }, { name: 'galleryUrls', label: 'Galerie d’images (une URL par ligne)', type: 'list' },
    { name: 'coverImageUrl', label: 'Image principale', type: 'url' }, { name: 'projectDate', label: 'Date du projet', type: 'date' }, { name: 'projectUrl', label: 'Lien du projet', type: 'url' },
    { name: 'featured', label: 'Mettre en avant', type: 'checkbox' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'trainings', label: 'Formations', path: '/admin/trainings', superAdminDelete: true, fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'titleFr', label: 'Intitulé (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'descriptionFr', label: 'Description (FR)', type: 'textarea', required: true }, { name: 'descriptionEn', label: 'Description (EN)', type: 'textarea', required: true },
    { name: 'objectivesFr', label: 'Objectifs (FR)', type: 'textarea' }, { name: 'objectivesEn', label: 'Objectives (EN)', type: 'textarea' },
    { name: 'audienceFr', label: 'Public cible (FR)', type: 'textarea' }, { name: 'audienceEn', label: 'Target audience (EN)', type: 'textarea' },
    { name: 'prerequisitesFr', label: 'Prérequis (FR)', type: 'textarea' }, { name: 'prerequisitesEn', label: 'Prerequisites (EN)', type: 'textarea' },
    { name: 'programFr', label: 'Programme (FR)', type: 'textarea' }, { name: 'programEn', label: 'Program (EN)', type: 'textarea' },
    { name: 'durationHours', label: 'Durée (heures)', type: 'number' }, { name: 'indicativePrice', label: 'Tarif indicatif', type: 'number' },
    { name: 'currency', label: 'Devise' }, { name: 'imageUrl', label: 'Image', type: 'url' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'team', label: 'Équipe', path: '/admin/team', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'fullName', label: 'Nom complet', required: true },
    { name: 'positionFr', label: 'Poste (FR)', required: true }, { name: 'positionEn', label: 'Position (EN)', required: true },
    { name: 'biographyFr', label: 'Biographie (FR)', type: 'textarea', required: true }, { name: 'biographyEn', label: 'Biography (EN)', type: 'textarea', required: true },
    { name: 'photoUrl', label: 'Photo', type: 'url' }, { name: 'email', label: 'E-mail', type: 'email' },
    { name: 'linkedInUrl', label: 'LinkedIn', type: 'url' }, { name: 'facebookUrl', label: 'Facebook', type: 'url' },
    { name: 'category', label: 'Catégorie', type: 'select', required: true, options: [{ value: 'FOUNDER', label: 'Fondateur' }, { value: 'STAFF', label: 'Personnel' }] },
    { name: 'displayOrder', label: 'Ordre', type: 'number' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'testimonials', label: 'Témoignages', path: '/admin/testimonials', fields: [
    { name: 'authorName', label: 'Nom de l’auteur', required: true }, { name: 'authorRoleFr', label: 'Fonction (FR)' }, { name: 'authorRoleEn', label: 'Role (EN)' },
    { name: 'organizationName', label: 'Organisation' }, { name: 'quoteFr', label: 'Témoignage (FR)', type: 'textarea', required: true },
    { name: 'quoteEn', label: 'Testimonial (EN)', type: 'textarea', required: true }, { name: 'rating', label: 'Note (1 à 5)', type: 'number', required: true },
    { name: 'displayOrder', label: 'Ordre', type: 'number' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'partners', label: 'Partenaires', path: '/admin/partners', fields: [
    { name: 'name', label: 'Nom', required: true }, { name: 'logoUrl', label: 'Logo', type: 'url', required: true },
    { name: 'websiteUrl', label: 'Site web', type: 'url' }, { name: 'displayOrder', label: 'Ordre', type: 'number' }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
  { key: 'articles', label: 'Articles', path: '/admin/articles', fields: [
    { name: 'slug', label: 'Slug', required: true }, { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'excerptFr', label: 'Résumé (FR)', type: 'textarea', required: true }, { name: 'excerptEn', label: 'Excerpt (EN)', type: 'textarea', required: true },
    { name: 'bodyFr', label: 'Contenu HTML (FR)', type: 'textarea', required: true }, { name: 'bodyEn', label: 'HTML content (EN)', type: 'textarea', required: true },
    { name: 'category', label: 'Catégorie', required: true }, { name: 'coverImageUrl', label: 'Image de couverture', type: 'url' },
    { name: 'seoTitleFr', label: 'Titre SEO (FR)' }, { name: 'seoTitleEn', label: 'SEO title (EN)' },
    { name: 'seoDescriptionFr', label: 'Description SEO (FR)', type: 'textarea' }, { name: 'seoDescriptionEn', label: 'SEO description (EN)', type: 'textarea' },
    { name: 'status', label: 'Publication', type: 'select', required: true, options: [{ value: 'DRAFT', label: 'Brouillon' }, { value: 'PUBLISHED', label: 'Publié' }] },
  ] },
  { key: 'pages', label: 'Pages statiques', path: '/admin/site-content/pages', keyField: 'slug', fields: [
    { name: 'slug', label: 'Slug (ex. about, legal, privacy)', required: true }, { name: 'titleFr', label: 'Titre (FR)', required: true }, { name: 'titleEn', label: 'Title (EN)', required: true },
    { name: 'bodyFr', label: 'Contenu HTML (FR)', type: 'textarea', required: true }, { name: 'bodyEn', label: 'HTML content (EN)', type: 'textarea', required: true }, { name: 'published', label: 'Publié', type: 'checkbox' },
  ] },
]

const requestLinks = [
  { key: 'messages', label: 'Messages' }, { key: 'quotes', label: 'Demandes de devis' }, { key: 'enrollments', label: 'Pré-inscriptions' },
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
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setError('')
    const data = new FormData(event.currentTarget)
    try {
      await login(String(data.get('email')), String(data.get('password')))
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname
      navigate(from && from.startsWith('/admin') ? from : '/admin', { replace: true })
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Connexion impossible. Vérifiez que le serveur est lancé.') }
    finally { setBusy(false) }
  }
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
        <div className="admin-login-art" aria-hidden="true">
          <div className="admin-login-chart-card"><div className="admin-login-art-label"><i/> VOTRE ACTIVITÉ</div><div className="admin-login-bars"><i/><i/><i/><i/><i/><i/><i/></div><div className="admin-login-chart-line"><i/><i/><i/><i/><i/></div></div>
          <div className="admin-login-float-card"><span>✓</span><div><strong>Tout est prêt</strong><small>Votre espace sécurisé</small></div></div>
          <span className="admin-login-orbit admin-login-orbit-one"/><span className="admin-login-orbit admin-login-orbit-two"/>
        </div>
        <p className="admin-login-tagline">Des outils simples pour piloter votre réussite.</p>
      </section>
      <section className="admin-login-panel">
        <div className="admin-login-content">
          <img className="admin-login-logo" src={logo} alt="NovaTech Solution — On code votre réussite"/>
          <div className="admin-login-emblem" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10M6.5 10h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 18.5v-7A1.5 1.5 0 0 1 6.5 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 14v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></div>
          <div className="admin-login-title"><p className="admin-login-kicker">ACC?S S?CURIS?</p><h1>Connexion</h1><p>Entrez vos identifiants pour acc?der ? votre espace.</p></div>
          <form className="admin-auth-form" onSubmit={submit}>
            <label htmlFor="admin-login-email">Adresse e-mail</label>
            <div className="admin-auth-input"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg><input id="admin-login-email" name="email" type="email" autoComplete="username" placeholder="nom@exemple.com" required/></div>
            <div className="admin-auth-password-label"><label htmlFor="admin-login-password">Mot de passe</label></div>
            <div className="admin-auth-input"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg><input id="admin-login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Votre mot de passe" required/><button className="admin-auth-reveal" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? 'Masquer' : 'Afficher'}</button></div>
            <ErrorMessage value={error}/>
            <button className="admin-auth-submit" type="submit" disabled={busy}>{busy ? 'Connexion en cours?' : 'Se connecter'}<span aria-hidden="true">?</span></button>
            <p className="admin-auth-account-note">Mot de passe oubli? ? Demandez au super administrateur de le r?initialiser dans la gestion des comptes.</p>
            <p className="admin-auth-account-note">La cr?ation des comptes est r?serv?e au super administrateur.</p>
          </form>
          <div className="admin-login-footer"><span className="admin-login-shield" aria-hidden="true">✓</span><span>Connexion sécurisée · Données protégées</span></div>
          <Link className="admin-login-back-site" to="/fr">← Retour au site</Link>
        </div>
      </section>
    </div>
  </main>
}

function AdminLayout() {
  useAuthChange()
  const location = useLocation()
  const navigate = useNavigate()
  const pageScope = useRef<HTMLDivElement>(null)
  const [collapsed, setCollapsed] = useState(false)
  usePageAnimations(pageScope, location.pathname)
  if (!isAuthenticated()) return <Navigate to="/admin/login" state={{ from: location }} replace/>
  const session = getStoredSession()
  const superAdmin = session?.roles.includes('SUPER_ADMIN') ?? false
  const doLogout = async () => { await logout(); navigate('/admin/login', { replace: true }) }
  return <div className={`admin-shell${collapsed ? ' sidebar-collapsed' : ''}`} ref={pageScope}><aside className="admin-sidebar"><Link to="/admin" className="admin-logo"><img src={logo} alt="NOVA-TECH-SOLUTION"/></Link><p className="admin-nav-label">ESPACE ADMIN</p><NavLink end to="/admin" className="admin-nav-link">Tableau de bord</NavLink><p className="admin-nav-label">CONTENUS</p>{resources.map((item) => <NavLink key={item.key} to={`/admin/content/${item.key}`} className="admin-nav-link">{item.label}</NavLink>)}<NavLink to="/admin/sessions" className="admin-nav-link">Sessions</NavLink><NavLink to="/admin/media" className="admin-nav-link">Médiathèque</NavLink><p className="admin-nav-label">DEMANDES</p>{requestLinks.map((item) => <NavLink key={item.key} to={`/admin/requests/${item.key}`} className="admin-nav-link">{item.label}</NavLink>)}<NavLink to="/admin/newsletter" className="admin-nav-link">Newsletter</NavLink><NavLink to="/admin/settings" className="admin-nav-link">Paramètres</NavLink>{superAdmin && <NavLink to="/admin/activity" className="admin-nav-link">Journal d&#39;activit&#233;</NavLink>}{superAdmin && <NavLink to="/admin/users" className="admin-nav-link">Utilisateurs</NavLink>}<button className="admin-logout" onClick={() => void doLogout()}>Déconnexion</button></aside><div className="admin-main"><header className="admin-topbar"><button className="sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label="Réduire le menu">☰</button><div><span className="admin-user"><i>{session?.displayName?.slice(0, 2).toUpperCase() || 'NT'}</i>{session?.displayName || session?.email}</span></div></header><div className="admin-content"><Outlet/></div></div></div>
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

function AdminDashboard() {
  const { data, loading, error, reload } = useApiData<DashboardRecord>('/admin/dashboard')
  const stats = [
    { label: 'Messages non lus', value: data?.unreadMessages, key: 'messages', note: 'À traiter' },
    { label: 'Devis en attente', value: data?.pendingQuotes, key: 'quotes', note: 'Demandes clients' },
    { label: 'Pré-inscriptions', value: data?.recentEnrollments, key: 'enrollments', note: 'Formations' },
    { label: 'Projets publiés', value: data?.publishedProjects, key: 'projects', note: 'Dans le portfolio' },
    { label: 'Articles publiés', value: data?.publishedArticles, key: 'articles', note: 'Actualités du site' },
  ]
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
    <ApiState loading={loading} error={error} onRetry={reload}/>
    <section className="admin-dashboard-section" aria-label="Indicateurs d’activité">
      <div className="admin-section-heading"><div><h2>Vue d’ensemble</h2><p>Les données sont actualisées depuis le serveur.</p></div><span className="admin-live-label"><i/> En direct</span></div>
      <div className="admin-stat-grid">{stats.map((stat) => <article className="admin-stat-card" key={stat.key}><span className={`admin-stat-icon admin-stat-icon-${stat.key}`}><DashboardIcon name={stat.key}/></span><div className="admin-stat-copy"><small>{stat.label}</small><strong>{stat.value ?? '—'}</strong><i>{stat.note}</i></div></article>)}</div>
    </section>
    <section className="admin-dashboard-section admin-quick-panel">
      <div className="admin-section-heading"><div><h2>Raccourcis</h2><p>Accédez directement aux tâches les plus courantes.</p></div></div>
      <div className="quick-actions">{quickActions.map((action) => <Link className="quick-action-card" to={action.to} key={action.to}><span className="quick-action-icon"><DashboardIcon name={action.icon}/></span><span className="quick-action-copy"><strong>{action.title}</strong><small>{action.description}</small></span><span className="quick-action-arrow" aria-hidden="true">↗</span></Link>)}</div>
    </section>
  </>
}
function fieldValue(field: Field, value: unknown): string {
  if (field.type === 'checkbox') return value ? 'true' : ''
  if (field.type === 'list') return Array.isArray(value) ? value.join('\n') : String(value ?? '')
  if (field.type === 'datetime-local' && value) return new Date(String(value)).toISOString().slice(0, 16)
  return value == null ? '' : String(value)
}

function fieldsToBody(form: HTMLFormElement, fields: Field[]): Row {
  const body: Row = {}
  const data = new FormData(form)
  for (const field of fields) {
    const value = field.type === 'checkbox' ? data.get(field.name) === 'on' : data.get(field.name)
    if (field.type === 'list') body[field.name] = String(value || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    else if (field.type === 'number') body[field.name] = value === '' || value == null ? null : Number(value)
    else if (field.type === 'datetime-local') body[field.name] = value ? new Date(String(value)).toISOString() : null
    else body[field.name] = value === '' ? null : value
  }
  return body
}

function EditorForm({ fields, initial, title, onCancel, onSave }: { fields: Field[]; initial?: Row | null; title: string; onCancel: () => void; onSave: (body: Row) => Promise<void> }) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setBusy(true)
    try { await onSave(fieldsToBody(event.currentTarget, fields)) }
    catch (reason) { setError(reason instanceof ApiError ? `${reason.message}${Object.values(reason.fields).length ? ` — ${Object.values(reason.fields).join(' ')}` : ''}` : 'Enregistrement impossible.') }
    finally { setBusy(false) }
  }
  return <form className="admin-edit-form" onSubmit={submit}><h2>{title}</h2><div className="form-two-columns">{fields.map((field) => <label key={field.name} className={field.type === 'checkbox' ? 'admin-checkbox-field' : ''}>{field.type === 'checkbox' ? <><input type="checkbox" name={field.name} defaultChecked={Boolean(initial?.[field.name])}/>{field.label}</> : <>{field.label}{field.type === 'textarea' || field.type === 'list' ? <textarea name={field.name} rows={field.type === 'list' ? 3 : 4} defaultValue={fieldValue(field, initial?.[field.name])} required={field.required}/> : field.type === 'select' ? <select name={field.name} defaultValue={fieldValue(field, initial?.[field.name])} required={field.required}><option value="">Choisir…</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select> : <input name={field.name} type={field.type || 'text'} defaultValue={fieldValue(field, initial?.[field.name])} required={field.required} step={field.type === 'number' ? 'any' : undefined}/>}</>}</label>)}</div><ErrorMessage value={error}/><div className="edit-form-actions"><button type="button" className="secondary-action" onClick={onCancel}>Annuler</button><button className="primary-action" type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button></div></form>
}

function ContentManager() {
  const { resource = 'services' } = useParams()
  const definition = resources.find((item) => item.key === resource)
  if (!definition) return <p className="api-state">Type de contenu inconnu.</p>
  return <ResourceManager definition={definition}/>
}

function ResourceManager({ definition }: { definition: Resource }) {
  const { data, loading, error, reload } = useApiData<Row[]>(definition.path)
  const [editing, setEditing] = useState<Row | null | false>(false)
  const [notice, setNotice] = useState('')
  const records = data || []
  const columns = definition.fields.filter((field) => ['titleFr', 'fullName', 'authorName', 'name', 'slug', 'category', 'status', 'published', 'featured'].includes(field.name)).slice(0, 4)
  const save = async (body: Row) => {
    const keyName = definition.keyField || 'id'
    const id = editing ? editing[keyName] : null
    if (definition.key === 'pages') await apiSend(definition.path, 'PUT', body)
    else if (id) await apiSend(`${definition.path}/${encodeURIComponent(String(id))}`, 'PUT', body)
    else await apiSend(definition.path, 'POST', body)
    setEditing(false); setNotice('Enregistré.'); reload()
  }
  const remove = async (record: Row) => {
    if (!window.confirm('Supprimer cet élément ?')) return
    const keyName = definition.keyField || 'id'
    const id = record[keyName]
    if (!id) return
    try { await apiSend(`${definition.path}/${encodeURIComponent(String(id))}`, 'DELETE'); reload() }
    catch (reason) { setNotice(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">CONTENU DU SITE <i/></p><h1>{definition.label}</h1><p>Les modifications sont enregistrées dans la base NovaTech.</p></div><button className="primary-action" onClick={() => { setEditing(null); setNotice('') }}>Ajouter</button></div>{notice && <p className="form-success" role="status">{notice}</p>}{editing !== false && <EditorForm fields={definition.fields} initial={editing || null} title={editing ? 'Modifier' : 'Ajouter'} onCancel={() => setEditing(false)} onSave={save}/>}<ApiState loading={loading} error={error} onRetry={reload}/><section className="admin-panel"><div className="admin-panel-heading"><h2>{records.length} entrée(s)</h2></div><div className="admin-table-wrap"><table><thead><tr>{columns.map((field) => <th key={field.name}>{field.label}</th>)}<th>Actions</th></tr></thead><tbody>{records.map((record, index) => <tr key={String(record.id || record.slug || index)}>{columns.map((field) => <td key={field.name}>{field.type === 'checkbox' || typeof record[field.name] === 'boolean' ? (record[field.name] ? 'Oui' : 'Non') : String(record[field.name] ?? '—')}</td>)}<td className="table-actions"><button onClick={() => { setEditing(record); setNotice('') }}>Modifier</button>{(!definition.superAdminDelete || getStoredSession()?.roles.includes('SUPER_ADMIN')) && <button className="danger-action" onClick={() => void remove(record)}>Supprimer</button>}</td></tr>)}</tbody></table>{!loading && records.length === 0 && <div className="admin-empty"><p>Aucun contenu pour le moment.</p></div>}</div></section></>
}

function TrainingSessionManager() {
  const { data: courses, loading: coursesLoading, error: coursesError, reload: reloadCourses } = useApiData<TrainingRecord[]>('/admin/trainings')
  const [courseId, setCourseId] = useState('')
  const selectedCourse = courseId || courses?.[0]?.id || ''
  const { data: sessions, loading, error, reload } = useApiData<TrainingSessionRecord[]>(selectedCourse ? `/admin/trainings/${selectedCourse}/sessions` : null)
  const [editing, setEditing] = useState<TrainingSessionRecord | null | false>(false)
  const fields: Field[] = [
    { name: 'courseId', label: 'Formation', type: 'select', required: true, options: (courses || []).map((course) => ({ value: course.id, label: course.titleFr })) },
    { name: 'startsAt', label: 'Début', type: 'datetime-local', required: true }, { name: 'endsAt', label: 'Fin', type: 'datetime-local', required: true },
    { name: 'venue', label: 'Lieu', required: true }, { name: 'capacity', label: 'Nombre de places', type: 'number', required: true },
    { name: 'status', label: 'Statut', type: 'select', required: true, options: ['OPEN', 'FULL', 'CLOSED', 'COMPLETED'].map((value) => ({ value, label: value })) },
  ]
  const save = async (body: Row) => {
    if (editing) await apiSend(`/admin/training-sessions/${editing.id}`, 'PUT', body)
    else await apiSend('/admin/training-sessions', 'POST', body)
    setEditing(false); reload()
  }
  const remove = async (session: TrainingSessionRecord) => {
    if (!window.confirm('Supprimer cette session ?')) return
    try { await apiSend(`/admin/training-sessions/${session.id}`, 'DELETE'); reload() }
    catch (reason) { window.alert(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  const superAdmin = getStoredSession()?.roles.includes('SUPER_ADMIN') ?? false
  return <><div className="admin-page-heading"><div><p className="eyebrow">FORMATIONS <i/></p><h1>Sessions de formation</h1><p>Capacités, lieux, dates et inscriptions par session.</p></div><button className="primary-action" onClick={() => setEditing(null)} disabled={!selectedCourse}>Ajouter une session</button></div><label className="admin-filter">Formation<select value={selectedCourse} onChange={(event) => setCourseId(event.target.value)}><option value="">Choisir une formation</option>{(courses || []).map((course) => <option key={course.id} value={course.id}>{course.titleFr}</option>)}</select></label><ApiState loading={coursesLoading || loading} error={coursesError || error} onRetry={() => { reloadCourses(); reload() }}/>{editing !== false && <EditorForm fields={fields} initial={editing || (selectedCourse ? { courseId: selectedCourse, status: 'OPEN' } : null)} title={editing ? 'Modifier la session' : 'Ajouter une session'} onCancel={() => setEditing(false)} onSave={save}/>}<section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Date</th><th>Lieu</th><th>Places</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{(sessions || []).map((session) => <tr key={session.id}><td>{new Date(session.startsAt).toLocaleString()}</td><td>{session.venue}</td><td>{session.reservedPlaces}/{session.capacity}</td><td>{session.status}</td><td className="table-actions"><button onClick={() => setEditing(session)}>Modifier</button>{superAdmin && <button className="danger-action" onClick={() => void remove(session)}>Supprimer</button>}</td></tr>)}</tbody></table>{!loading && !sessions?.length && <div className="admin-empty">Aucune session pour cette formation.</div>}</div></section></>
}

function RequestManager() {
  const { requestType = 'messages' } = useParams()
  if (requestType === 'enrollments') return <EnrollmentManager/>
  const isQuote = requestType === 'quotes'
  const path = isQuote ? '/admin/quote-requests' : '/admin/contact-messages'
  return <InquiryManager key={requestType} path={path} kind={isQuote ? 'quote' : 'message'}/>
}

function InquiryManager({ path, kind }: { path: string; kind: 'quote' | 'message' }) {
  const { data, loading, error, reload } = useApiData<(QuoteRecord | ContactRecord)[]>(path)
  const [message, setMessage] = useState('')
  const rows = data || []
  const statusOptions = kind === 'quote' ? ['NEW', 'IN_PROGRESS', 'ACCEPTED', 'REJECTED'] : ['NEW', 'READ', 'RESOLVED']
  const changeStatus = async (row: QuoteRecord | ContactRecord, status: string) => {
    const body = kind === 'quote' ? { status, internalNotes: (row as QuoteRecord).internalNotes || '' } : { status }
    try { await apiSend(`${path}/${row.id}/status`, 'PATCH', body); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Mise à jour impossible.') }
  }
  const remove = async (row: QuoteRecord | ContactRecord) => {
    if (!window.confirm('Supprimer cette demande ?')) return
    try { await apiSend(`${path}/${row.id}`, 'DELETE'); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  const updateNotes = async (row: QuoteRecord) => {
    const internalNotes = window.prompt('Notes internes pour cette demande :', row.internalNotes || '')
    if (internalNotes === null) return
    try { await apiSend(`${path}/${row.id}/status`, 'PATCH', { status: row.status, internalNotes }); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Mise à jour impossible.') }
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">BOÎTE DE RÉCEPTION <i/></p><h1>{kind === 'quote' ? 'Demandes de devis' : 'Messages de contact'}</h1><p>Demandes reçues depuis le site et enregistrées par le serveur.</p></div></div><ErrorMessage value={message}/><ApiState loading={loading} error={error} onRetry={reload}/><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Demandeur</th><th>Coordonnées</th><th>{kind === 'quote' ? 'Projet / budget' : 'Message'}</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.fullName}</strong></td><td>{row.email}<small className="table-subtext">{row.phone}</small></td><td>{kind === 'quote' ? <>{(row as QuoteRecord).serviceType}: {(row as QuoteRecord).projectDescription}<small className="table-subtext">{(row as QuoteRecord).budgetRange} · {(row as QuoteRecord).desiredDeadline}</small></> : <>{(row as ContactRecord).subject}: {(row as ContactRecord).message}</>}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td><select aria-label={`Statut ${row.fullName}`} value={row.status} onChange={(event) => void changeStatus(row, event.target.value)}>{statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td className="table-actions">{kind === 'quote' && <button onClick={() => void updateNotes(row as QuoteRecord)}>Notes</button>}<button className="danger-action" onClick={() => void remove(row)}>Supprimer</button></td></tr>)}</tbody></table>{!loading && rows.length === 0 && <div className="admin-empty">Aucune demande reçue.</div>}</div></section></>
}

function EnrollmentManager() {
  const { data: courses, loading: courseLoading, error: courseError } = useApiData<TrainingRecord[]>('/admin/trainings')
  const [courseId, setCourseId] = useState('')
  const selectedCourse = courseId || courses?.[0]?.id || ''
  const { data: sessions } = useApiData<TrainingSessionRecord[]>(selectedCourse ? `/admin/trainings/${selectedCourse}/sessions` : null)
  const [sessionId, setSessionId] = useState('')
  const selectedSession = sessions?.some((item) => item.id === sessionId) ? sessionId : sessions?.[0]?.id || ''
  const { data, loading, error, reload } = useApiData<TrainingEnrollmentRecord[]>(selectedSession ? `/admin/enrollments?sessionId=${encodeURIComponent(selectedSession)}` : null)
  const [message, setMessage] = useState('')
  const changeStatus = async (row: TrainingEnrollmentRecord, status: string) => {
    try { await apiSend(`/admin/enrollments/${row.id}/status`, 'PATCH', { status }); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Mise à jour impossible.') }
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">INSCRIPTIONS <i/></p><h1>Pré-inscriptions</h1><p>Le statut synchronise les places disponibles de la session.</p></div><button className="secondary-action" disabled={!selectedSession} onClick={() => void adminApiExport(selectedSession)}>Exporter CSV</button></div><div className="form-two-columns admin-filter"><label>Formation<select value={selectedCourse} onChange={(event) => { setCourseId(event.target.value); setSessionId('') }}><option value="">Choisir</option>{(courses || []).map((course) => <option key={course.id} value={course.id}>{course.titleFr}</option>)}</select></label><label>Session<select value={selectedSession} onChange={(event) => setSessionId(event.target.value)}><option value="">Choisir</option>{(sessions || []).map((session) => <option key={session.id} value={session.id}>{new Date(session.startsAt).toLocaleString()} · {session.venue}</option>)}</select></label></div><ErrorMessage value={message}/><ApiState loading={courseLoading || loading} error={courseError || error}/><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Nom</th><th>E-mail</th><th>Téléphone</th><th>Langue</th><th>Date</th><th>Statut</th></tr></thead><tbody>{(data || []).map((row) => <tr key={row.id}><td>{row.fullName}</td><td>{row.email}</td><td>{row.phone}</td><td>{row.preferredLanguage}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td><select value={row.status} aria-label={`Statut ${row.fullName}`} onChange={(event) => void changeStatus(row, event.target.value)}>{['PENDING', 'CONFIRMED', 'CANCELLED'].map((value) => <option key={value}>{value}</option>)}</select></td></tr>)}</tbody></table>{selectedSession && !loading && !data?.length && <div className="admin-empty">Aucune pré-inscription pour cette session.</div>}</div></section></>
}

async function adminApiExport(sessionId: string) {
  await apiDownload(`/admin/enrollments/export?sessionId=${encodeURIComponent(sessionId)}`, `pre-inscriptions-${sessionId}.csv`)
}

function MediaManager() {
  const { data, loading, error, reload } = useApiData<MediaRecord[]>('/admin/media')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage('')
    const form = event.currentTarget
    const body = new FormData(form)
    try { await apiSend('/admin/media', 'POST', body); form.reset(); reload(); setMessage('Image téléversée et optimisée.') }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Téléversement impossible.') }
    finally { setBusy(false) }
  }
  const remove = async (item: MediaRecord) => {
    if (!window.confirm('Supprimer définitivement cette image ?')) return
    try { await apiSend(`/admin/media/${item.id}`, 'DELETE'); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">GESTION DES MÉDIAS <i/></p><h1>Médiathèque</h1><p>Images JPEG ou PNG, 10 Mo maximum. Elles sont conservées sur le serveur.</p></div></div><form className="admin-edit-form" onSubmit={(event) => void upload(event)}><label>Fichier image<input type="file" name="file" accept="image/jpeg,image/png" required/></label><div className="form-two-columns"><label>Texte alternatif (FR)<input name="altFr" maxLength={300}/></label><label>Alt text (EN)<input name="altEn" maxLength={300}/></label></div><button className="primary-action" disabled={busy}>{busy ? 'Envoi…' : 'Téléverser'}</button><ErrorMessage value={message}/></form><ApiState loading={loading} error={error} onRetry={reload}/><div className="media-grid">{(data || []).map((item) => <article className="media-item" key={item.id}><img src={apiMediaUrl(item.url)} alt={item.altFr || item.originalName}/><div><strong>{item.originalName}</strong><small>{(item.fileSize / 1024).toFixed(0)} Ko</small><small>{apiMediaUrl(item.url)}</small></div><button className="danger-action" onClick={() => void remove(item)}>Supprimer</button></article>)}</div></>
}

function SiteSettingsManager() {
  const { data, loading, error, reload } = useApiData<Record<string, string>>('/admin/settings')
  if (!data) {
    return <>
      <div className="admin-page-heading"><div><p className="eyebrow">CONFIGURATION <i/></p><h1>Paramètres du site</h1><p>Coordonn?es publiques, r?seaux sociaux et r?f?rencement du site.</p></div></div>
      <ApiState loading={loading} error={error} onRetry={reload}/>
    </>
  }
  return <SiteSettingsForm initialValues={data} reload={reload}/>
}

function SiteSettingsForm({ initialValues, reload }: { initialValues: Record<string, string>; reload: () => void }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [values, setValues] = useState(initialValues)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); setMessage('')
    try { await apiSend('/admin/settings', 'PUT', { values }); setMessage('Paramètres enregistrés.'); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Enregistrement impossible.') }
    finally { setBusy(false) }
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">CONFIGURATION <i/></p><h1>Paramètres du site</h1><p>Coordonn?es publiques, r?seaux sociaux et r?f?rencement du site.</p></div></div><form className="admin-panel admin-settings-form" onSubmit={(event) => void submit(event)}><div className="form-two-columns">{Object.entries(values).map(([key, value]) => <label key={key}>{key}<input value={value} onChange={(event) => setValues((previous) => ({ ...previous, [key]: event.target.value }))}/></label>)}</div><div className="form-two-columns"><label>Nouvelle clé de paramètre<input value={newKey} onChange={(event) => setNewKey(event.target.value)} placeholder="ex. contact.opening-hours"/></label><button className="secondary-action" type="button" disabled={!newKey.trim() || Object.hasOwn(values, newKey.trim())} onClick={() => { const key = newKey.trim(); if (key && !Object.hasOwn(values, key)) setValues((previous) => ({ ...previous, [key]: '' })); setNewKey('') }}>Ajouter une clé</button></div>{!Object.keys(values).length && <p>Aucun paramètre enregistré. Créez des clés comme site.name, contact.email, social.facebook ou seo.home.title.</p>}<ErrorMessage value={message}/><button className="primary-action" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer les paramètres'}</button></form></>
}

function NewsletterManager() {
  const { data, loading, error, reload } = useApiData<NewsletterRecord[]>('/admin/newsletter/subscribers')
  return <><div className="admin-page-heading"><div><h1>Abonnés à la newsletter</h1><p>Adresses enregistrées avec consentement.</p></div><button className="secondary-action" onClick={() => void apiDownload('/admin/newsletter/subscribers/export', 'newsletter.csv')}>Exporter CSV</button></div><ApiState loading={loading} error={error} onRetry={reload}/><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>E-mail</th><th>Statut</th><th>Date</th></tr></thead><tbody>{(data || []).map((item) => <tr key={item.id}><td>{item.email}</td><td>{item.active ? 'Actif' : 'Désabonné'}</td><td>{new Date(item.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></section></>
}

function ActivityManager() {
  const { data, loading, error, reload } = useApiData<ActivityRecord[]>('/admin/activity?page=0&size=50&sort=createdAt,desc')
  const rows = Array.isArray(data) ? data : (data as unknown as { content?: ActivityRecord[] } | null)?.content || []
  return <><div className="admin-page-heading"><div><h1>Journal d’activité</h1><p>Actions administratives récentes.</p></div></div><ApiState loading={loading} error={error} onRetry={reload}/><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Utilisateur</th><th>Méthode</th><th>Route</th><th>Résultat</th><th>Date</th></tr></thead><tbody>{rows.map((item) => <tr key={item.id}><td>{item.actorEmail}</td><td>{item.method}</td><td>{item.path}</td><td>{item.responseStatus}</td><td>{new Date(item.createdAt).toLocaleString()}</td></tr>)}</tbody></table></div></section></>
}

function UserManager() {
  const { data, loading, error, reload } = useApiData<AdminUserRecord[]>('/admin/users')
  const [editing, setEditing] = useState<AdminUserRecord | null | false>(false)
  const [message, setMessage] = useState('')
  const fields: Field[] = [
    { name: 'email', label: 'E-mail', type: 'email', required: true }, { name: 'displayName', label: 'Nom affiché', required: true },
    { name: 'password', label: 'Mot de passe (vide pour ne pas changer)', type: 'text' },
    { name: 'roles', label: 'Rôles (SUPER_ADMIN, EDITOR séparés par des virgules)', type: 'list', required: true }, { name: 'enabled', label: 'Compte actif', type: 'checkbox' },
  ]
  const save = async (body: Row) => {
    body.roles = String(body.roles || '').split(/[\n,]/).map((role) => role.trim()).filter(Boolean)
    if (!body.password) delete body.password
    if (editing) await apiSend(`/admin/users/${editing.id}`, 'PUT', body)
    else await apiSend('/admin/users', 'POST', body)
    setEditing(false); reload()
  }
  const remove = async (user: AdminUserRecord) => {
    if (!window.confirm(`Supprimer ${user.email} ?`)) return
    try { await apiSend(`/admin/users/${user.id}`, 'DELETE'); reload() }
    catch (reason) { setMessage(reason instanceof ApiError ? reason.message : 'Suppression impossible.') }
  }
  return <><div className="admin-page-heading"><div><h1>Utilisateurs d’administration</h1><p>Gestion réservée au super administrateur.</p></div><Link className="primary-action" to="/admin/users/new">Créer un compte administrateur</Link></div><ErrorMessage value={message}/>{editing !== false && <EditorForm fields={fields} initial={editing ? { ...editing, roles: editing.roles.join('\n'), password: '' } : { roles: ['EDITOR'], enabled: true }} title={editing ? 'Modifier un utilisateur' : 'Créer un utilisateur'} onCancel={() => setEditing(false)} onSave={save}/>}<ApiState loading={loading} error={error} onRetry={reload}/><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Nom</th><th>E-mail</th><th>Rôles</th><th>Actif</th><th>Actions</th></tr></thead><tbody>{(data || []).map((user) => <tr key={user.id}><td>{user.displayName}</td><td>{user.email}</td><td>{user.roles.join(', ')}</td><td>{user.enabled ? 'Oui' : 'Non'}</td><td className="table-actions"><button onClick={() => setEditing(user)}>Modifier</button><button className="danger-action" onClick={() => void remove(user)}>Supprimer</button></td></tr>)}</tbody></table></div></section></>
}

function CreateAdminAccount() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    try {
      await apiSend('/admin/users', 'POST', {
        email: String(form.get('email')),
        displayName: String(form.get('displayName')),
        password: String(form.get('password')),
        roles: [String(form.get('role'))],
        enabled: true,
      })
      navigate('/admin/users', { replace: true })
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'Impossible de créer ce compte.')
    } finally {
      setBusy(false)
    }
  }

  return <><div className="admin-page-heading"><div><h1>Créer un compte administrateur</h1><p>Cette action est réservée au super administrateur.</p></div></div><form className="admin-edit-form" onSubmit={(event) => void submit(event)}>
    <label>Adresse e-mail<input name="email" type="email" autoComplete="email" maxLength={254} required/></label>
    <label>Nom affiché<input name="displayName" autoComplete="name" maxLength={120} required/></label>
    <label>Mot de passe temporaire<input name="password" type="password" autoComplete="new-password" minLength={12} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{12,200}" title="12 caractères minimum, avec une minuscule, une majuscule et un chiffre." required/></label>
    <label>Rôle<select name="role" defaultValue="EDITOR"><option value="EDITOR">Éditeur</option><option value="SUPER_ADMIN">Super administrateur</option></select></label>
    <p>Le nouvel utilisateur pourra se connecter dès l’enregistrement. Transmets-lui son mot de passe de manière sécurisée.</p>
    <ErrorMessage value={error}/><div className="form-actions"><Link className="secondary-action" to="/admin/users">Annuler</Link><button className="primary-action" disabled={busy}>{busy ? 'Création…' : 'Créer le compte'}</button></div>
  </form></>
}

function Guarded({ children }: { children: ReactNode }) {
  const location = useLocation()
  useAuthChange()
  return isAuthenticated() ? children : <Navigate to="/admin/login" state={{ from: location }} replace/>
}

function SuperAdminGuard() {
  const location = useLocation()
  const session = getStoredSession()
  if (!isAuthenticated()) return <Navigate to="/admin/login" state={{ from: location }} replace/>
  return session?.roles.includes('SUPER_ADMIN') ? <Outlet/> : <Navigate to="/admin" replace/>
}

export function AdminRoutes() {
  return <Routes>
    <Route path="login" element={<AdminLogin/>}/><Route path="forgot-password" element={<Navigate to="/admin/login" replace/>}/><Route path="reset-password" element={<Navigate to="/admin/login" replace/>}/>
    <Route element={<Guarded><AdminLayout/></Guarded>}>
      <Route index element={<AdminDashboard/>}/><Route path="content/:resource" element={<ContentManager/>}/><Route path="sessions" element={<TrainingSessionManager/>}/>
      <Route path="requests/:requestType" element={<RequestManager/>}/><Route path="media" element={<MediaManager/>}/><Route path="settings" element={<SiteSettingsManager/>}/>
      <Route path="newsletter" element={<NewsletterManager/>}/>
      <Route element={<SuperAdminGuard/>}><Route path="activity" element={<ActivityManager/>}/><Route path="users" element={<UserManager/>}/><Route path="users/new" element={<CreateAdminAccount/>}/></Route>
      <Route path="*" element={<Navigate to="/admin" replace/>}/>
    </Route>
  </Routes>
}
