import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ApiError, apiMediaUrl, apiSend } from '../api/client'
import { ApiState } from '../api/ApiState'
import { useApiData } from '../api/hooks'
import type { ArticleRecord, ProjectRecord, ServiceRecord, StaticPageRecord, TeamRecord, TrainingRecord, TrainingSessionRecord } from '../api/types'
import { PublicLayout } from '../layouts/PublicLayout'
import { publicPath } from '../config/publicRoutes'
import '../styles/site-pages.css'

const LandingPage = lazy(() => import('./LandingPage'))
type Locale = 'fr' | 'en'
type PageKind = 'about' | 'services' | 'projects' | 'training' | 'team' | 'contact' | 'quote' | 'news' | 'legal' | 'privacy' | 'notFound'
const text = (lang: Locale, fr?: string | null, en?: string | null) => lang === 'fr' ? fr || en || '' : en || fr || ''

function PageHero({ lang, title, intro }: { lang: Locale; title: string; intro?: string }) {
  return <section className="inner-hero"><div className="public-shell"><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h1>{title}</h1>{intro && <p>{intro}</p>}<div className="breadcrumbs"><Link to={`/${lang}`}>{lang === 'fr' ? 'Accueil' : 'Home'}</Link><span>/</span><span>{title}</span></div></div></section>
}

function RequestForm({ lang, kind, course, sessions = [] }: { lang: Locale; kind: 'contact' | 'quote' | 'registration'; course?: TrainingRecord; sessions?: TrainingSessionRecord[] }) {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setBusy(true)
    const form = event.currentTarget
    const formData = new FormData(form)
    const base = { fullName: String(formData.get('fullName') || '').trim(), email: String(formData.get('email') || '').trim(), phone: String(formData.get('phone') || '').trim(), language: lang, consent: formData.get('consent') === 'on', website: String(formData.get('website') || '') }
    try {
      if (kind === 'contact') await apiSend('/contact-messages', 'POST', { ...base, subject: formData.get('subject'), message: formData.get('message') })
      else if (kind === 'quote') await apiSend('/quote-requests', 'POST', { ...base, serviceType: formData.get('serviceType'), projectDescription: formData.get('projectDescription'), budgetRange: formData.get('budgetRange'), desiredDeadline: formData.get('desiredDeadline') })
      else await apiSend('/enrollments', 'POST', { fullName: base.fullName, email: base.email, phone: base.phone, preferredLanguage: lang, consent: base.consent, website: base.website, sessionId: formData.get('sessionId') })
      setSent(true); form.reset()
    } catch (reason) { setError(reason instanceof ApiError ? `${reason.message}${Object.values(reason.fields).length ? ` ${Object.values(reason.fields).join(' ')}` : ''}` : 'Le serveur est injoignable. Réessayez plus tard.') }
    finally { setBusy(false) }
  }
  const heading = kind === 'quote' ? (lang === 'fr' ? 'Demander un devis' : 'Request a quote') : kind === 'registration' ? (lang === 'fr' ? 'Pré-inscription' : 'Pre-registration') : (lang === 'fr' ? 'Écrivez-nous' : 'Contact us')
  if (sent) return <div className="request-card form-success-card" role="status"><span aria-hidden="true">✓</span><h2>{lang === 'fr' ? 'Demande envoyée' : 'Request sent'}</h2><p>{kind === 'registration' ? (lang === 'fr' ? 'Votre pré-inscription est reçue. Notre équipe vous contactera pour confirmer la place. Aucun paiement en ligne n’est demandé.' : 'Your pre-registration was received. Our team will contact you to confirm your place. No online payment is required.') : (lang === 'fr' ? 'Merci. Votre demande a été transmise à notre équipe.' : 'Thank you. Your request has been sent to our team.')}</p><button className="text-action" type="button" onClick={() => setSent(false)}>{lang === 'fr' ? 'Envoyer une autre demande' : 'Send another request'}</button></div>
  return <div className="request-card"><div className="request-card-heading"><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h2>{heading}</h2></div><form className="public-form" onSubmit={(event) => void submit(event)}>
    <label>{lang === 'fr' ? 'Nom complet' : 'Full name'}<input name="fullName" autoComplete="name" minLength={2} maxLength={160} required/></label>
    <div className="form-two-columns"><label>E-mail<input type="email" name="email" autoComplete="email" maxLength={254} required/></label><label>{lang === 'fr' ? 'Téléphone' : 'Phone'}<input name="phone" type="tel" autoComplete="tel" maxLength={40}/></label></div>
    {kind === 'contact' && <><label>{lang === 'fr' ? 'Objet' : 'Subject'}<input name="subject" maxLength={180} required/></label><label>{lang === 'fr' ? 'Votre message' : 'Your message'}<textarea name="message" rows={5} minLength={10} maxLength={12000} required/></label></>}
    {kind === 'quote' && <><label>{lang === 'fr' ? 'Type de service' : 'Service type'}<input name="serviceType" maxLength={100} required/></label><label>{lang === 'fr' ? 'Décrivez votre besoin' : 'Describe your needs'}<textarea name="projectDescription" rows={5} minLength={15} maxLength={16000} required/></label><div className="form-two-columns"><label>{lang === 'fr' ? 'Budget indicatif' : 'Estimated budget'}<input name="budgetRange" maxLength={100}/></label><label>{lang === 'fr' ? 'Délai souhaité' : 'Desired timeline'}<input name="desiredDeadline" maxLength={160}/></label></div></>}
    {kind === 'registration' && <><p>{course ? text(lang, course.titleFr, course.titleEn) : ''}</p><label>{lang === 'fr' ? 'Session' : 'Session'}<select name="sessionId" required defaultValue=""><option value="" disabled>{lang === 'fr' ? 'Choisir une session ouverte' : 'Choose an open session'}</option>{sessions.filter((session) => session.status === 'OPEN').map((session) => <option value={session.id} key={session.id}>{new Date(session.startsAt).toLocaleString(lang)} · {session.venue} · {session.placesRemaining} {lang === 'fr' ? 'places restantes' : 'places left'}</option>)}</select></label>{!sessions.some((session) => session.status === 'OPEN') && <p>{lang === 'fr' ? 'Aucune session ouverte actuellement. Contactez-nous pour être informé des prochaines dates.' : 'There is no open session at the moment. Contact us about upcoming dates.'}</p>}</>}
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <label className="consent-label"><input type="checkbox" name="consent" required/><span>{lang === 'fr' ? 'J’accepte que mes informations soient utilisées pour traiter ma demande.' : 'I agree that my information may be used to process my request.'} <Link to={publicPath(lang, 'privacy')}>{lang === 'fr' ? 'Politique de confidentialité' : 'Privacy policy'}</Link>.</span></label>
    <ErrorMessage value={error}/><button className="primary-action" type="submit" disabled={busy || (kind === 'registration' && !sessions.some((session) => session.status === 'OPEN'))}>{busy ? (lang === 'fr' ? 'Envoi…' : 'Sending…') : (lang === 'fr' ? 'Envoyer' : 'Send')} <span aria-hidden="true">→</span></button>
  </form></div>
}

function ErrorMessage({ value }: { value: string }) { return value ? <p className="form-error" role="alert">{value}</p> : null }

function ProjectsPage({ lang, detailSlug }: { lang: Locale; detailSlug?: string }) {
  const { t } = useTranslation()
  const { data, loading, error, reload } = useApiData<ProjectRecord[]>('/projects')
  const { data: detail } = useApiData<ProjectRecord>(detailSlug ? `/projects/${encodeURIComponent(detailSlug)}` : null)
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const projects = useMemo(() => data ?? [], [data])
  const project = detailSlug ? detail || projects.find((item) => item.slug === detailSlug) : undefined
  const categories = [...new Set(projects.map((item) => item.category))]
  const visible = useMemo(() => projects.filter((item) => (category === 'all' || item.category === category) && `${text(lang, item.titleFr, item.titleEn)} ${item.clientName || ''} ${item.technologies.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [category, lang, projects, query])
  if (detailSlug && project) return <><PageHero lang={lang} title={text(lang, project.titleFr, project.titleEn)} intro={text(lang, project.descriptionFr, project.descriptionEn)}/><section className="content-section"><div className="public-shell project-detail"><img src={apiMediaUrl(project.coverImageUrl)} alt={text(lang, project.titleFr, project.titleEn)}/><div><p className="eyebrow">{lang === 'fr' ? 'RÉALISATION' : 'PROJECT'} <i/></p><h2>{text(lang, project.titleFr, project.titleEn)}</h2><p>{text(lang, project.descriptionFr, project.descriptionEn)}</p><dl><div><dt>Client</dt><dd>{project.clientName || '—'}</dd></div><div><dt>Technologies</dt><dd>{project.technologies.join(' · ')}</dd></div></dl>{project.galleryUrls.map((url) => <img key={url} src={apiMediaUrl(url)} alt="" loading="lazy"/>)}{project.projectUrl && <a className="primary-action inline-action" href={project.projectUrl} target="_blank" rel="noreferrer">{lang === 'fr' ? 'Voir le projet' : 'View project'} ↗</a>}</div></div></section></>
  if (detailSlug && !loading && !error) return <NotFound lang={lang}/>
  return <><PageHero lang={lang} title={t('pages.projects')} intro={lang === 'fr' ? 'Réalisations publiées par notre équipe.' : 'Projects published by our team.'}/><section className="content-section"><div className="public-shell"><div className="filter-toolbar"><div className="filter-chips"><button type="button" className={category === 'all' ? 'selected' : ''} onClick={() => setCategory('all')}>{t('common.all')}</button>{categories.map((item) => <button type="button" key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="search-field"><span className="sr-only">{t('common.search')}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('common.search')}/></label></div><ApiState loading={loading} error={error} onRetry={reload}/><div className="content-card-grid project-list">{visible.map((item) => <Link to={publicPath(lang, 'projects', item.slug)} className="public-card project-public-card" key={item.id}><div className="public-card-image"><img loading="lazy" src={apiMediaUrl(item.coverImageUrl)} alt=""/><span>{item.category}</span></div><div className="public-card-body"><small>{item.clientName}</small><h2>{text(lang, item.titleFr, item.titleEn)}</h2><p>{text(lang, item.descriptionFr, item.descriptionEn)}</p><span className="card-link">{t('common.readMore')} <b>→</b></span></div></Link>)}</div>{!loading && !error && !visible.length && <p className="empty-state">{t('admin.noData')}</p>}</div></section></>
}

function TrainingPage({ lang, detailSlug }: { lang: Locale; detailSlug?: string }) {
  const { t } = useTranslation()
  const { data, loading, error, reload } = useApiData<TrainingRecord[]>('/trainings')
  const { data: detail } = useApiData<TrainingRecord>(detailSlug ? `/trainings/${encodeURIComponent(detailSlug)}` : null)
  const courses = data || []
  const course = detailSlug ? detail || courses.find((item) => item.slug === detailSlug) : undefined
  const { data: sessions, loading: sessionsLoading, error: sessionsError } = useApiData<TrainingSessionRecord[]>(course ? `/trainings/${encodeURIComponent(course.slug)}/sessions` : null)
  if (detailSlug && !loading && !error && !course) return <NotFound lang={lang}/>
  if (detailSlug && course) return <><PageHero lang={lang} title={text(lang, course.titleFr, course.titleEn)} intro={text(lang, course.descriptionFr, course.descriptionEn)}/><section className="content-section"><div className="public-shell course-detail"><div className="course-main"><div className="course-callout"><strong>{course.durationHours} {lang === 'fr' ? 'heures' : 'hours'}</strong><span>{course.indicativePrice ?? '—'} {course.currency || 'XAF'}</span></div><h2>{lang === 'fr' ? 'Objectifs' : 'Objectives'}</h2><p>{text(lang, course.objectivesFr, course.objectivesEn)}</p><h2>{lang === 'fr' ? 'Programme' : 'Program'}</h2><div className="course-program" dangerouslySetInnerHTML={{ __html: text(lang, course.programFr, course.programEn) }}/><h2>{lang === 'fr' ? 'Public cible' : 'Target audience'}</h2><p>{text(lang, course.audienceFr, course.audienceEn)}</p><h3>{lang === 'fr' ? 'Prérequis' : 'Prerequisites'}</h3><p>{text(lang, course.prerequisitesFr, course.prerequisitesEn)}</p><h2>{lang === 'fr' ? 'Sessions à venir' : 'Upcoming sessions'}</h2><ApiState loading={sessionsLoading} error={sessionsError}/>{(sessions || []).map((session) => <article className="session-row" key={session.id}><div><b>{new Date(session.startsAt).toLocaleString(lang)}</b><span>{session.venue}</span></div><span className="session-spots">{session.placesRemaining} {lang === 'fr' ? 'places restantes' : 'places left'}</span></article>)}</div><RequestForm lang={lang} kind="registration" course={course} sessions={sessions || []}/></div></section></>
  return <><PageHero lang={lang} title={t('pages.training')} intro={lang === 'fr' ? 'Formations en présentiel proposées par NovaTech.' : 'In-person courses offered by NovaTech.'}/><section className="content-section"><div className="public-shell content-card-grid course-list"><ApiState loading={loading} error={error} onRetry={reload}/>{courses.map((item, index) => <Link className="public-card course-card" to={publicPath(lang, 'training', item.slug)} key={item.id}><span className="course-count">{String(index + 1).padStart(2, '0')}</span><p className="eyebrow">{lang === 'fr' ? 'FORMATION EN PRÉSENTIEL' : 'IN-PERSON COURSE'} <i/></p><h2>{text(lang, item.titleFr, item.titleEn)}</h2><p>{text(lang, item.descriptionFr, item.descriptionEn)}</p><div className="course-meta"><span>{item.durationHours} h</span><span>{item.indicativePrice ?? '—'} {item.currency || 'XAF'}</span></div><span className="card-link">{t('common.learn')} <b>→</b></span></Link>)}</div></section></>
}

function NotFound({ lang }: { lang: Locale }) {
  const { t } = useTranslation()
  return <section className="not-found"><span>404</span><h1>{t('pages.notFound')}</h1><p>{lang === 'fr' ? 'Cette adresse ne correspond à aucune page.' : 'We could not find a page at this address.'}</p><Link className="primary-action inline-action" to={`/${lang}`}>{t('nav.home')} <span>→</span></Link></section>
}

export function LocalizedPage() {
  const { lang: pathLang } = useParams()
  const lang: Locale = pathLang === 'en' ? 'en' : 'fr'
  const location = useLocation()
  const { i18n } = useTranslation()
  useEffect(() => {
    if (pathLang !== 'fr' && pathLang !== 'en') return
    void i18n.changeLanguage(lang); localStorage.setItem('nova-language', lang); document.documentElement.lang = lang
  }, [i18n, lang, pathLang])
  if (pathLang !== 'fr' && pathLang !== 'en') return <NotFound lang="fr"/>
  const segments = location.pathname.split('/').filter(Boolean).slice(1)
  const root = segments[0]
  const slug = segments[1]
  if (!root) return <Suspense fallback={<div className="page-loading" role="status">NOVA-TECH-SOLUTION</div>}><LandingPage/></Suspense>
  const routeMap: Record<string, PageKind> = { 'a-propos': 'about', about: 'about', services: 'services', realisations: 'projects', projects: 'projects', formations: 'training', training: 'training', equipe: 'team', team: 'team', contact: 'contact', devis: 'quote', quote: 'quote', actualites: 'news', news: 'news', 'mentions-legales': 'legal', 'legal-notice': 'legal', confidentialite: 'privacy', privacy: 'privacy' }
  const page = routeMap[root] ?? 'notFound'
  return <PublicLayout lang={lang}><ContentPage lang={lang} page={page} slug={slug}/></PublicLayout>
}

export function NewsletterUnsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>(token ? 'loading' : 'error')
  const submitted = useRef(false)
  useEffect(() => {
    if (!token || submitted.current) return
    submitted.current = true
    apiSend(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, 'POST', undefined)
      .then(() => setStatus('done'))
      .catch(() => setStatus('error'))
  }, [token])
  const language: Locale = localStorage.getItem('nova-language') === 'en' ? 'en' : 'fr'
  const message = status === 'loading'
    ? (language === 'fr' ? 'Traitement du désabonnement…' : 'Processing your unsubscribe…')
    : status === 'done'
      ? (language === 'fr' ? 'Vous êtes désabonné(e) de la newsletter NovaTech.' : 'You have been unsubscribed from the NovaTech newsletter.')
      : (language === 'fr' ? 'Ce lien de désabonnement est invalide ou a déjà été utilisé.' : 'This unsubscribe link is invalid or has already been used.')
  return <PublicLayout lang={language}><main className="not-found"><h1>{language === 'fr' ? 'Newsletter' : 'Newsletter'}</h1><p role={status === 'error' ? 'alert' : 'status'}>{message}</p><Link className="primary-action inline-action" to={`/${language}`}>{language === 'fr' ? 'Retour au site' : 'Back to the website'} →</Link></main></PublicLayout>
}

function ContentPage({ lang, page, slug }: { lang: Locale; page: PageKind; slug?: string }) {
  const { t } = useTranslation()
  const pageSlug = page === 'about' ? 'about' : page === 'legal' ? 'legal' : page === 'privacy' ? 'privacy' : null
  const { data: staticPage, loading: pageLoading, error: pageError, reload } = useApiData<StaticPageRecord>(pageSlug ? `/site-content/pages/${pageSlug}` : null)
  const { data: publicPages } = useApiData<StaticPageRecord[]>(pageSlug ? '/site-content/pages' : null)
  const resolvedStaticPage = staticPage || publicPages?.find((item) => item.slug === pageSlug)
  const { data: services, loading: servicesLoading, error: servicesError, reload: reloadServices } = useApiData<ServiceRecord[]>('/services')
  const { data: serviceDetail } = useApiData<ServiceRecord>(page === 'services' && slug ? `/services/${encodeURIComponent(slug)}` : null)
  const { data: team, loading: teamLoading, error: teamError, reload: reloadTeam } = useApiData<TeamRecord[]>(page === 'team' ? '/team' : null)
  const { data: articles, loading: articlesLoading, error: articlesError, reload: reloadArticles } = useApiData<ArticleRecord[]>('/articles')
  const { data: articleDetail } = useApiData<ArticleRecord>(page === 'news' && slug ? `/articles/${encodeURIComponent(slug)}` : null)
  const { data: settings } = useApiData<Record<string, string>>('/settings/public')
  const title = t(`pages.${page}`, { defaultValue: t('pages.notFound') })
  useEffect(() => {
    document.title = `${resolvedStaticPage ? text(lang, resolvedStaticPage.titleFr, resolvedStaticPage.titleEn) : title} | NOVA-TECH-SOLUTION`
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', settings?.[`seo.${page}.description.${lang}`] || `${title} — NOVA-TECH-SOLUTION`)
  }, [lang, page, resolvedStaticPage, settings, title])
  if (page === 'notFound') return <NotFound lang={lang}/>
  if (page === 'projects') return <ProjectsPage lang={lang} detailSlug={slug}/>
  if (page === 'training') return <TrainingPage lang={lang} detailSlug={slug}/>
  if (page === 'services') {
    const service = slug ? serviceDetail || services?.find((item) => item.slug === slug) : null
    if (slug && !service && !servicesLoading) return <NotFound lang={lang}/>
    return <><PageHero lang={lang} title={service ? text(lang, service.titleFr, service.titleEn) : title} intro={service ? text(lang, service.descriptionFr, service.descriptionEn) : lang === 'fr' ? 'Nos services et expertises.' : 'Our services and areas of expertise.'}/><section className="content-section"><div className="public-shell">{service && <div className="service-detail"><div><p className="eyebrow">{service.category} <i/></p><h2>{text(lang, service.titleFr, service.titleEn)}</h2><p>{text(lang, service.descriptionFr, service.descriptionEn)}</p><Link className="primary-action inline-action" to={publicPath(lang, 'quote')}>{t('nav.quote')} →</Link></div></div>}<ApiState loading={servicesLoading} error={servicesError} onRetry={reloadServices}/><div className="content-card-grid service-list">{(services || []).map((item) => <Link className="public-card service-public-card" key={item.id} to={publicPath(lang, 'services', item.slug)}><span className="card-index">{String(item.displayOrder).padStart(2, '0')}</span><h2>{text(lang, item.titleFr, item.titleEn)}</h2><p>{text(lang, item.descriptionFr, item.descriptionEn)}</p></Link>)}</div></div></section></>
  }
  if (page === 'team') return <><PageHero lang={lang} title={title} intro={lang === 'fr' ? 'Les personnes qui font avancer vos projets.' : 'The people moving your projects forward.'}/><section className="content-section"><div className="public-shell"><ApiState loading={teamLoading} error={teamError} onRetry={reloadTeam}/><div className="content-card-grid team-grid">{(team || []).map((member) => <article className="public-card team-card" key={member.id}><div className="team-photo"><img src={apiMediaUrl(member.photoUrl)} alt={member.fullName} loading="lazy"/></div><div className="public-card-body"><p className="eyebrow">{text(lang, member.positionFr, member.positionEn)} <i/></p><h2>{member.fullName}</h2><p>{text(lang, member.biographyFr, member.biographyEn)}</p></div></article>)}</div></div></section></>
  if (page === 'contact' || page === 'quote') return <><PageHero lang={lang} title={title} intro={page === 'quote' ? (lang === 'fr' ? 'Décrivez votre besoin et votre budget indicatif.' : 'Tell us about your needs and estimated budget.') : (lang === 'fr' ? 'Parlons de votre projet ou de votre formation.' : 'Get in touch about a project or course.')}/><section className="content-section"><div className="public-shell contact-layout"><RequestForm lang={lang} kind={page === 'quote' ? 'quote' : 'contact'}/><aside className="contact-aside"><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h2>{lang === 'fr' ? 'À votre écoute au Cameroun' : 'Here to help in Cameroon'}</h2><p>{settings?.['contact.email'] || '—'}</p><p>{settings?.['contact.address'] || (lang === 'fr' ? 'Cameroun' : 'Cameroon')}</p><p>{settings?.['contact.hours'] || ''}</p><div className="map-placeholder" role="img" aria-label={lang === 'fr' ? 'Carte du Cameroun' : 'Map of Cameroon'}><span>{lang === 'fr' ? 'CAMEROUN' : 'CAMEROON'}</span></div></aside></div></section></>
  if (page === 'news') {
    const article = slug ? articleDetail || articles?.find((item) => item.slug === slug) : null
    if (slug && !article && !articlesLoading) return <NotFound lang={lang}/>
    return article ? <><PageHero lang={lang} title={text(lang, article.titleFr, article.titleEn)} intro={text(lang, article.excerptFr, article.excerptEn)}/><article className="content-section"><div className="public-shell article-detail"><img src={apiMediaUrl(article.coverImageUrl)} alt=""/><div><p className="eyebrow">{article.category} <i/></p><div dangerouslySetInnerHTML={{ __html: text(lang, article.bodyFr, article.bodyEn) }}/></div></div></article></> : <><PageHero lang={lang} title={title}/><section className="content-section"><div className="public-shell"><ApiState loading={articlesLoading} error={articlesError} onRetry={reloadArticles}/><div className="content-card-grid article-list">{(articles || []).map((item) => <Link className="public-card project-public-card" key={item.id} to={publicPath(lang, 'news', item.slug)}><div className="public-card-image"><img src={apiMediaUrl(item.coverImageUrl)} alt="" loading="lazy"/><span>{item.category}</span></div><div className="public-card-body"><h2>{text(lang, item.titleFr, item.titleEn)}</h2><p>{text(lang, item.excerptFr, item.excerptEn)}</p></div></Link>)}</div></div></section></>
  }
  if (page === 'about' || page === 'legal' || page === 'privacy') return <><ApiState loading={pageLoading} error={pageError} onRetry={reload}/><PageHero lang={lang} title={resolvedStaticPage ? text(lang, resolvedStaticPage.titleFr, resolvedStaticPage.titleEn) : title}/><section className="content-section"><article className="public-shell legal-content">{resolvedStaticPage ? <div dangerouslySetInnerHTML={{ __html: text(lang, resolvedStaticPage.bodyFr, resolvedStaticPage.bodyEn) }}/> : <p>{lang === 'fr' ? 'Cette page sera publiée par l’équipe NovaTech.' : 'This page will be published by the NovaTech team.'}</p>}</article></section></>
  return <NotFound lang={lang}/>
}
