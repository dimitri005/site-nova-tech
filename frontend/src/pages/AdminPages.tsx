import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import logo from '../assets/nova-tech-logo.png'
import { courses, projects, services, team } from '../data/siteContent'
import '../styles/site-pages.css'

type RecordItem = { id: string; title: string; titleEn?: string; descriptionFr?: string; descriptionEn?: string; status: string; category?: string; client?: string; date?: string; link?: string; technologies?: string; image?: string; updatedAt?: string; [key: string]: unknown }
const storeKey = (resource: string) => `nova-admin-${resource}`
const initialRecords: Record<string, RecordItem[]> = {
  services: services.map((item) => ({ id: item.slug, title: item.title.fr, titleEn: item.title.en, descriptionFr: item.description.fr, descriptionEn: item.description.en, status: 'Publié', category: item.category })),
  projects: projects.map((item) => ({ id: item.slug, title: item.title.fr, titleEn: item.title.en, descriptionFr: item.description.fr, descriptionEn: item.description.en, client: item.client, technologies: item.technologies.join(', '), image: item.image, status: item.featured ? 'Publié' : 'Brouillon', category: item.category })),
  courses: courses.map((item) => ({ id: item.slug, title: item.title.fr, titleEn: item.title.en, descriptionFr: item.summary.fr, descriptionEn: item.summary.en, status: 'Publié', category: 'Présentiel' })),
  sessions: courses.flatMap((course) => course.sessions.map((session, index) => ({ id: `${course.slug}-${index}`, title: `${course.title.fr} — ${session.date.fr}`, status: session.status === 'open' ? 'Ouverte' : 'Complète', category: session.location.fr }))),
  team: team.map((item, index) => ({ id: `member-${index + 1}`, title: item.name, titleEn: item.name, descriptionFr: item.bio.fr, descriptionEn: item.bio.en, status: 'Publié', category: item.role.fr, image: item.image })),
  articles: [{ id: 'article-numerique', title: 'Comment faire du numérique un levier pour votre PME', status: 'Brouillon', category: 'Conseils' }],
  testimonials: [{ id: 'testimonial-1', title: 'Témoignage client à renseigner', status: 'Brouillon', category: 'Client' }],
  pages: [{ id: 'about', title: 'À propos', titleEn: 'About', status: 'Publié', category: 'Page statique' }, { id: 'legal', title: 'Mentions légales', titleEn: 'Legal notice', status: 'Brouillon', category: 'Page légale' }, { id: 'privacy', title: 'Politique de confidentialité', titleEn: 'Privacy policy', status: 'Brouillon', category: 'Page légale' }],
}
const resources = [
  { key: 'services', label: 'Services' }, { key: 'projects', label: 'Réalisations' }, { key: 'courses', label: 'Formations' }, { key: 'sessions', label: 'Sessions' }, { key: 'team', label: 'Équipe' }, { key: 'testimonials', label: 'Témoignages' }, { key: 'articles', label: 'Articles' }, { key: 'pages', label: 'Pages statiques' },
]
const leadResources = [
  { key: 'messages', label: 'Messages', storage: 'nova-demo-messages' }, { key: 'quotes', label: 'Demandes de devis', storage: 'nova-demo-quotes' }, { key: 'registrations', label: 'Pré-inscriptions', storage: 'nova-demo-registrations' },
]

function readRecords(resource: string): RecordItem[] {
  const stored = localStorage.getItem(storeKey(resource))
  if (stored) { try { return JSON.parse(stored) as RecordItem[] } catch { return [] } }
  return initialRecords[resource] ?? []
}

function AdminLogin() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { t } = useTranslation()
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (!String(data.get('email')).includes('@') || String(data.get('password')).length < 6) { setError('Saisissez un e-mail valide et au moins 6 caractères.'); return }
    localStorage.setItem('nova-admin-demo-session', 'active')
    navigate('/admin')
  }
  if (localStorage.getItem('nova-admin-demo-session') === 'active') return <Navigate to="/admin" replace/>
  return <main className="admin-login-page"><Link to="/fr" className="admin-login-brand"><img src={logo} alt="NOVA-TECH-SOLUTION"/></Link><div className="admin-login-card"><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h1>{t('admin.login')}</h1><p>{t('admin.subtitle')}</p><form className="public-form" onSubmit={submit}><label>{t('admin.email')}<input name="email" type="email" autoComplete="username" required/></label><label>{t('admin.password')}<input name="password" type="password" autoComplete="current-password" minLength={6} required/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="primary-action" type="submit">{t('admin.signIn')} <span>→</span></button></form><div className="demo-access"><b>{t('admin.demoAccess')}</b><span>admin@nova-tech.local</span><span>frontend-demo</span></div><p className="demo-caption">{t('admin.localNotice')}</p><Link className="back-link" to="/fr">← {t('common.back')}</Link></div></main>
}

function AdminLayout() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  if (localStorage.getItem('nova-admin-demo-session') !== 'active') return <Navigate to="/admin/login" state={{ from: location }} replace/>
  const logout = () => { localStorage.removeItem('nova-admin-demo-session'); navigate('/admin/login') }
  return <div className={`admin-shell${collapsed ? ' sidebar-collapsed' : ''}`}><aside className="admin-sidebar"><Link to="/admin" className="admin-logo"><img src={logo} alt="NOVA-TECH-SOLUTION"/></Link><p className="admin-nav-label">WORKSPACE</p><NavLink end to="/admin" className="admin-nav-link"><span>▦</span>{t('admin.dashboard')}</NavLink><p className="admin-nav-label">CONTENU DU SITE</p>{resources.map((item) => <NavLink key={item.key} to={`/admin/content/${item.key}`} className="admin-nav-link"><span>◈</span>{item.label}</NavLink>)}<NavLink to="/admin/media" className="admin-nav-link"><span>▧</span>Médiathèque</NavLink><p className="admin-nav-label">DEMANDES</p>{leadResources.map((item) => <NavLink key={item.key} to={`/admin/requests/${item.key}`} className="admin-nav-link"><span>◉</span>{item.label}</NavLink>)}<NavLink to="/admin/settings" className="admin-nav-link"><span>⚙</span>{t('admin.settings')}</NavLink><button className="admin-logout" onClick={logout}><span>↪</span>{t('admin.logout')}</button></aside><div className="admin-main"><header className="admin-topbar"><button className="sidebar-toggle" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar">☰</button><div><span className="admin-demo-pill">FRONTEND DEMO</span><span className="admin-user"><i>NT</i> Administrateur</span></div></header><div className="admin-content"><Outlet/></div></div></div>
}

function AdminDashboard() {
  const { t } = useTranslation()
  const allLeads = leadResources.flatMap((item) => { try { return JSON.parse(localStorage.getItem(item.storage) || '[]') as object[] } catch { return [] } })
  const stats = [
    { label: 'Contenus publiés', value: Object.values(initialRecords).flat().filter((item) => item.status === 'Publié').length, icon: '◈' },
    { label: 'Messages & demandes', value: allLeads.length, icon: '✉' },
    { label: 'Formations', value: courses.length, icon: '▤' },
    { label: 'Projets', value: projects.length, icon: '⌘' },
  ]
  return <><div className="admin-page-heading"><div><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h1>{t('admin.welcome')}</h1><p>{t('admin.subtitle')}</p></div><Link className="primary-action inline-action" to="/admin/content/projects">Gérer les contenus <span>→</span></Link></div><div className="admin-stat-grid">{stats.map((item) => <article className="admin-stat-card" key={item.label}><span>{item.icon}</span><small>{item.label}</small><strong>{item.value}</strong><i>{item.label === 'Messages & demandes' ? 'Enregistrés dans ce navigateur' : 'Données de démonstration'}</i></article>)}</div><section className="admin-panel"><div className="admin-panel-heading"><div><h2>{t('admin.recent')}</h2><p>Dernières demandes conservées en local</p></div><Link to="/admin/requests/messages">Voir les demandes →</Link></div>{allLeads.length ? <div className="admin-table-wrap"><table><thead><tr><th>Type</th><th>Demandeur</th><th>E-mail</th><th>Statut</th></tr></thead><tbody>{allLeads.slice(0, 5).map((item, index) => { const lead = item as Record<string, string>; return <tr key={`${lead.email}-${index}`}><td>{lead.service || lead.subject || lead.course || 'Message'}</td><td>{lead.name}</td><td>{lead.email}</td><td><span className="status-tag">Nouveau</span></td></tr> })}</tbody></table></div> : <div className="admin-empty"><span>✉</span><p>{t('admin.noData')}</p><small>Les demandes de la partie publique apparaîtront ici dans cette démonstration.</small></div>}</section><div className="admin-notice">{t('admin.localNotice')}</div></>
}

function ContentManager() {
  const { resource = 'services' } = useParams()
  const { t } = useTranslation()
  const [items, setItems] = useState<RecordItem[]>(() => readRecords(resource))
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<RecordItem | null>(null)
  const [adding, setAdding] = useState(false)
  const [saved, setSaved] = useState(false)
  const label = resources.find((item) => item.key === resource)?.label ?? resource
  useEffect(() => { setItems(readRecords(resource)); setSearch(''); setEditing(null); setAdding(false) }, [resource])
  const filtered = useMemo(() => items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase())), [items, search])
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const record: RecordItem = { id: editing?.id ?? crypto.randomUUID(), title: String(data.get('title')), titleEn: String(data.get('titleEn') || ''), descriptionFr: String(data.get('descriptionFr') || ''), descriptionEn: String(data.get('descriptionEn') || ''), status: String(data.get('status')), category: String(data.get('category') || ''), client: String(data.get('client') || ''), date: String(data.get('date') || ''), link: String(data.get('link') || ''), technologies: String(data.get('technologies') || ''), image: String(data.get('image') || ''), updatedAt: new Date().toISOString() }
    const next = editing ? items.map((item) => item.id === editing.id ? record : item) : [record, ...items]
    setItems(next); localStorage.setItem(storeKey(resource), JSON.stringify(next)); setEditing(null); setAdding(false); setSaved(true); window.setTimeout(() => setSaved(false), 2500)
  }
  const remove = (id: string) => { if (!window.confirm('Supprimer cet élément de la démonstration locale ?')) return; const next = items.filter((item) => item.id !== id); setItems(next); localStorage.setItem(storeKey(resource), JSON.stringify(next)) }
  return <><div className="admin-page-heading"><div><p className="eyebrow">CONTENU DU SITE <i/></p><h1>{label}</h1><p>Gestion de démonstration — données locales au navigateur.</p></div><button className="primary-action" onClick={() => { setAdding(true); setEditing(null) }}>{t('admin.create')} <span>＋</span></button></div>{saved && <p className="admin-toast" role="status">Modifications enregistrées localement.</p>}{(adding || editing) && <form className="admin-edit-form" onSubmit={save}><h2>{editing ? t('admin.edit') : t('admin.create')} · {label}</h2><div className="form-two-columns"><label>Titre (FR)<input name="title" defaultValue={editing?.title ?? ''} required autoFocus/></label><label>Title (EN)<input name="titleEn" defaultValue={editing?.titleEn ?? ''}/></label></div><div className="form-two-columns"><label>Description (FR)<textarea name="descriptionFr" rows={3} defaultValue={editing?.descriptionFr ?? ''}/></label><label>Description (EN)<textarea name="descriptionEn" rows={3} defaultValue={editing?.descriptionEn ?? ''}/></label></div><div className="form-two-columns"><label>{t('admin.status')}<select name="status" defaultValue={editing?.status ?? 'Brouillon'}><option>Publié</option><option>Brouillon</option><option>En cours</option><option>Ouverte</option><option>Complète</option></select></label><label>{t('common.category')}<input name="category" defaultValue={editing?.category ?? ''}/></label></div><div className="form-two-columns"><label>Client / lieu<input name="client" defaultValue={editing?.client ?? ''}/></label><label>Date de publication / session<input name="date" type="date" defaultValue={editing?.date ?? ''}/></label></div><div className="form-two-columns"><label>Technologies / programme<input name="technologies" defaultValue={editing?.technologies ?? ''}/></label><label>URL de l’image<input name="image" type="url" defaultValue={editing?.image ?? ''}/></label></div><label>Lien externe<input name="link" type="url" defaultValue={editing?.link ?? ''}/></label><div className="edit-form-actions"><button type="button" className="secondary-action" onClick={() => { setAdding(false); setEditing(null) }}>{t('admin.cancel')}</button><button className="primary-action" type="submit">{t('admin.save')} <span>✓</span></button></div></form>}<section className="admin-panel"><div className="admin-panel-heading"><div><h2>{items.length} {label.toLowerCase()}</h2><p>Ajoutez, modifiez ou supprimez les entrées de démonstration.</p></div><label className="search-field"><span className="sr-only">{t('common.search')}</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('common.search')}/><span>⌕</span></label></div><div className="admin-table-wrap"><table><thead><tr><th>{t('admin.titleField')} FR</th><th>Title EN</th><th>{t('common.category')}</th><th>{t('admin.status')}</th><th>{t('admin.actions')}</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><strong>{item.title}</strong></td><td>{item.titleEn || '—'}</td><td>{item.category || '—'}</td><td><span className={`status-tag ${item.status.toLowerCase()}`}>{item.status}</span></td><td className="table-actions"><button onClick={() => { setEditing(item); setAdding(false) }}>{t('admin.edit')}</button><button className="danger-action" onClick={() => remove(item.id)}>{t('admin.delete')}</button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="admin-empty"><p>{t('admin.noData')}</p></div>}</div></section><div className="admin-notice">{t('admin.localNotice')}</div></>
}

function RequestManager() {
  const { requestType = 'messages' } = useParams()
  const resource = leadResources.find((item) => item.key === requestType) ?? leadResources[0]
  const [items, setItems] = useState<RecordItem[]>([])
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(resource.storage) || '[]') as RecordItem[]) } catch { setItems([]) } }, [resource])
  const update = (next: RecordItem[]) => { setItems(next); localStorage.setItem(resource.storage, JSON.stringify(next)) }
  const exportCsv = () => {
    const fields = ['name', 'email', 'phone', 'service', 'subject', 'course', 'session', 'description', 'message', 'status', 'createdAt']
    const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`
    const csv = [fields.join(';'), ...items.map((item) => fields.map((field) => quote(item[field])).join(';'))].join('\r\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${resource.key}-nova-tech.csv`; anchor.click(); URL.revokeObjectURL(url)
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">BOÎTE DE RÉCEPTION <i/></p><h1>{resource.label}</h1><p>Les demandes soumises depuis le site sont conservées localement.</p></div><button className="secondary-action" onClick={exportCsv} disabled={!items.length}>Exporter en CSV</button></div><section className="admin-panel"><div className="admin-table-wrap"><table><thead><tr><th>Demandeur</th><th>Coordonnées</th><th>Sujet</th><th>Date</th><th>Statut</th><th>Action</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{String(item.name || '—')}</strong><small className="table-subtext">{String(item.message || item.description || '')}</small></td><td>{String(item.email || '')}<small className="table-subtext">{String(item.phone || '')}</small></td><td>{String(item.service || item.subject || item.course || 'Message')}</td><td>{item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : '—'}</td><td><select aria-label="Statut" value={String(item.status || 'new')} onChange={(event) => update(items.map((row) => row.id === item.id ? { ...row, status: event.target.value } : row))}><option value="new">Nouveau</option><option value="read">Lu</option><option value="in_progress">En cours</option><option value="done">Traité</option><option value="accepted">Confirmée / accepté</option><option value="cancelled">Annulée / refusé</option></select></td><td><button className="danger-action" onClick={() => update(items.filter((row) => row.id !== item.id))}>Supprimer</button></td></tr>)}</tbody></table>{items.length === 0 && <div className="admin-empty"><span>⌑</span><p>Aucune demande enregistrée.</p></div>}</div></section><div className="admin-notice">L’envoi d’e-mail et la synchronisation des places nécessiteront une API backend.</div></>
}

function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>(() => { try { return JSON.parse(localStorage.getItem('nova-admin-settings') || '{}') as Record<string, string> } catch { return {} } })
  const { t } = useTranslation()
  const update = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); setSettings(data as Record<string, string>); localStorage.setItem('nova-admin-settings', JSON.stringify(data)); setSaved(true) }
  return <><div className="admin-page-heading"><div><p className="eyebrow">CONFIGURATION <i/></p><h1>{t('admin.settings')}</h1><p>Informations locales destinées à préparer la configuration du site.</p></div></div><form className="admin-panel admin-settings-form" onSubmit={update}><label>Nom de l’entreprise<input name="company" defaultValue={settings.company || 'NOVA-TECH-SOLUTION'}/></label><label>E-mail de contact<input name="email" type="email" defaultValue={settings.email || ''}/></label><label>Adresse<input name="address" defaultValue={settings.address || 'Cameroun'}/></label><label>Numéro WhatsApp<input name="whatsapp" defaultValue={settings.whatsapp || ''} placeholder="2376XXXXXXXX"/></label><label>Texte du pied de page<textarea name="footer" rows={3} defaultValue={settings.footer || ''}/></label><button className="primary-action" type="submit">{t('admin.save')} <span>✓</span></button>{saved && <p role="status" className="form-success">Paramètres enregistrés localement.</p>}<p className="admin-notice">{t('admin.localNotice')}</p></form></>
}

type MediaPreview = { id: string; name: string; size: number; url: string }
function MediaManager() {
  const [media, setMedia] = useState<MediaPreview[]>([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const urls = useRef<string[]>([])
  useEffect(() => () => { urls.current.forEach((url) => URL.revokeObjectURL(url)) }, [])
  const addFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    const accepted: MediaPreview[] = []
    const rejected: string[] = []
    for (const file of files) {
      if (!file.type.startsWith('image/')) { rejected.push(`${file.name}: format non image`); continue }
      if (file.size > 5 * 1024 * 1024) { rejected.push(`${file.name}: plus de 5 Mo`); continue }
      const url = URL.createObjectURL(file)
      urls.current.push(url)
      accepted.push({ id: crypto.randomUUID(), name: file.name, size: file.size, url })
    }
    setMedia((current) => [...accepted, ...current])
    setError(rejected.join(' · '))
    setMessage(accepted.length ? `${accepted.length} image(s) chargée(s) dans cette session.` : '')
    event.currentTarget.value = ''
  }
  const remove = (item: MediaPreview) => {
    URL.revokeObjectURL(item.url)
    urls.current = urls.current.filter((url) => url !== item.url)
    setMedia((current) => current.filter((entry) => entry.id !== item.id))
  }
  return <><div className="admin-page-heading"><div><p className="eyebrow">GESTION DES MÉDIAS <i/></p><h1>Médiathèque</h1><p>Prévisualisez les images dans cette démonstration locale.</p></div></div><section className="admin-panel media-panel"><label className="media-dropzone"><input type="file" accept="image/*" multiple onChange={addFiles}/><span>＋</span><b>Choisir des images</b><small>Images uniquement · 5 Mo maximum par fichier</small></label>{error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}<p className="admin-notice">Les fichiers restent en mémoire pendant cette session et ne sont pas envoyés au serveur. L’upload et la compression définitifs nécessiteront le backend.</p></section>{media.length > 0 && <div className="media-grid">{media.map((item) => <article className="media-item" key={item.id}><img src={item.url} alt={item.name}/><div><strong>{item.name}</strong><small>{(item.size / 1024).toFixed(0)} Ko</small></div><button className="danger-action" onClick={() => remove(item)}>Supprimer</button></article>)}</div>}</>
}

export function AdminRoutes() {
  return <Routes><Route path="login" element={<AdminLogin/>}/><Route element={<AdminLayout/>}><Route index element={<AdminDashboard/>}/><Route path="content/:resource" element={<ContentManager/>}/><Route path="requests/:requestType" element={<RequestManager/>}/><Route path="media" element={<MediaManager/>}/><Route path="settings" element={<AdminSettings/>}/><Route path="*" element={<Navigate to="/admin" replace/>}/></Route></Routes>
}
