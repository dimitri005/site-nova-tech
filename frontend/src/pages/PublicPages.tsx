import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCourses, getProjects, getServices, getTeam, projects, services } from '../data/siteContent'
import { getSiteSettings } from '../config/siteSettings'
import { PublicLayout, publicPath } from '../layouts/PublicLayout'
import '../styles/site-pages.css'

const LandingPage = lazy(() => import('./LandingPage'))

type Locale = 'fr' | 'en'
type PageKind = 'about' | 'services' | 'projects' | 'training' | 'team' | 'contact' | 'quote' | 'news' | 'legal' | 'privacy' | 'notFound'
const local = (lang: Locale, value: { fr: string; en: string }) => value[lang]
const news = [
  { slug: 'numerique-pme', category: 'Conseils', title: { fr: 'Comment faire du numérique un levier pour votre PME', en: 'How digital tools can help your small business grow' }, image: projects[0].image, body: { fr: 'Commencez par comprendre les besoins réels de vos clients et de vos équipes. Choisissez ensuite des outils simples, mesurables et adaptés à votre activité.', en: 'Start by understanding the real needs of your customers and team. Then choose tools that are practical, measurable and suited to your business.' } },
  { slug: 'apprendre-programmation', category: 'Formation', title: { fr: 'Apprendre la programmation en partant de projets concrets', en: 'Learn programming through practical projects' }, image: projects[3].image, body: { fr: 'La pratique régulière et des objectifs progressifs permettent de construire des bases solides en programmation.', en: 'Regular practice and clear milestones help learners build a strong programming foundation.' } },
  { slug: 'presence-en-ligne', category: 'Actualités', title: { fr: 'Les bases d’une présence en ligne cohérente', en: 'Building a consistent online presence' }, image: projects[1].image, body: { fr: 'Une identité claire, des informations à jour et des contenus utiles renforcent la confiance de vos visiteurs.', en: 'A clear identity, accurate information and useful content help earn visitors’ trust.' } },
]

function PageHero({ lang, title, intro }: { lang: Locale; title: string; intro?: string }) {
  return <section className="inner-hero"><div className="public-shell"><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h1>{title}</h1>{intro && <p>{intro}</p>}<div className="breadcrumbs"><Link to={`/${lang}`}>{lang === 'fr' ? 'Accueil' : 'Home'}</Link><span>/</span><span>{title}</span></div></div></section>
}

function RequestForm({ lang, kind, courseTitle }: { lang: Locale; kind: 'contact' | 'quote' | 'registration'; courseTitle?: string }) {
  const { t } = useTranslation()
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = event.currentTarget
    const data = new FormData(form)
    if (data.get('website')) { setBusy(false); return }
    const record = Object.fromEntries(data.entries())
    const key = kind === 'registration' ? 'nova-demo-registrations' : kind === 'quote' ? 'nova-demo-quotes' : 'nova-demo-messages'
    const previous = JSON.parse(localStorage.getItem(key) || '[]') as object[]
    localStorage.setItem(key, JSON.stringify([{ ...record, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: 'new' }, ...previous]))
    setBusy(false)
    setSent(true)
    form.reset()
  }
  const title = kind === 'quote' ? t('pages.quote') : kind === 'registration' ? (lang === 'fr' ? 'Pré-inscription' : 'Pre-register') : t('pages.contact')

  return <div className="request-card"><div className="request-card-heading"><p className="eyebrow">{lang === 'fr' ? 'ÉCRIVEZ-NOUS' : 'GET IN TOUCH'} <i/></p><h2>{title}</h2><p>{t('common.demo')}</p></div>
    {sent ? <div className="form-success-card" role="status"><span aria-hidden="true">✓</span><h3>{lang === 'fr' ? 'Demande enregistrée' : 'Request saved'}</h3><p>{t('forms.success')}</p><button className="text-action" type="button" onClick={() => setSent(false)}>{lang === 'fr' ? 'Envoyer une autre demande' : 'Send another request'}</button></div> : <form id="contact-form" className="public-form" onSubmit={submit}>
      <label>{t('common.name')}<input name="name" autoComplete="name" required minLength={2}/></label>
      <div className="form-two-columns"><label>{t('common.email')}<input type="email" name="email" autoComplete="email" required/></label><label>{t('common.phone')}<input name="phone" autoComplete="tel" type="tel" required/></label></div>
      {kind === 'quote' && <><label>{t('forms.serviceType')}<select name="service" required defaultValue=""><option value="" disabled>{t('common.choose', { defaultValue: t('common.all') })}</option>{services.map((service) => <option key={service.slug} value={service.slug}>{local(lang, service.title)}</option>)}</select></label><label>{t('forms.need')}<textarea name="description" rows={4} required minLength={15}/></label><div className="form-two-columns"><label>{t('forms.budget')}<select name="budget" defaultValue=""><option value="">{lang === 'fr' ? 'À définir' : 'To be discussed'}</option><option>Under 250,000 XAF</option><option>250,000–750,000 XAF</option><option>Over 750,000 XAF</option></select></label><label>{t('forms.deadline')}<input name="deadline" placeholder={lang === 'fr' ? 'Ex. 2 mois' : 'e.g. 2 months'}/></label></div></>}
      {kind === 'registration' && <><input type="hidden" name="course" value={courseTitle || ''}/><label>{t('forms.session')}<select name="session" required defaultValue=""><option value="" disabled>{t('forms.selectSession')}</option><option>{lang === 'fr' ? 'Prochaine session — à confirmer' : 'Next session — to be confirmed'}</option></select></label><label>{lang === 'fr' ? 'Votre objectif' : 'Your learning goal'}<textarea name="message" rows={3}/></label></>}
      {kind === 'contact' && <><label>{lang === 'fr' ? 'Objet' : 'Subject'}<select name="subject" required defaultValue=""><option value="" disabled>{lang === 'fr' ? 'Sélectionner un sujet' : 'Select a subject'}</option><option>{t('nav.quote')}</option><option>{t('nav.training')}</option><option>{lang === 'fr' ? 'Autre demande' : 'Other request'}</option></select></label><label>{t('common.message')}<textarea name="message" rows={5} required minLength={10}/></label></>}
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <label className="consent-label"><input type="checkbox" name="consent" required/><span>{t('forms.consent')} <Link to={publicPath(lang, 'privacy')}>{t('pages.privacy')}</Link>.</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="primary-action" type="submit" disabled={busy}>{busy ? (lang === 'fr' ? 'Envoi…' : 'Sending…') : t('common.send')}<span aria-hidden="true">→</span></button>
      <p className="demo-caption">{t('common.demo')}</p>
    </form>}
  </div>
}

function ServiceGrid({ lang }: { lang: Locale }) {
  const { t } = useTranslation()
  return <div className="content-card-grid service-list">{getServices().map((service, index) => <Link className="public-card service-public-card" key={service.slug} to={publicPath(lang, 'services', service.slug)}><span className="card-index">0{index + 1}</span><span className="card-icon"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="5" width="24" height="17" rx="2"/><path d="M10 27h12m-6-5v5m-5-13 4-4 3 3 5-6m-3 0h3v3"/></svg></span><h2>{local(lang, service.title)}</h2><p>{local(lang, service.summary)}</p><span className="card-link">{t('common.learn')} <b>→</b></span></Link>)}</div>
}

function ProjectsPage({ lang, detailSlug }: { lang: Locale; detailSlug?: string }) {
  const { t } = useTranslation()
  const projects = getProjects()
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const project = detailSlug ? projects.find((item) => item.slug === detailSlug) : undefined
  const categories = ['all', 'web', 'mobile', 'marketing', 'training']
  const visible = useMemo(() => projects.filter((item) => (category === 'all' || item.category === category) && `${local(lang, item.title)} ${item.client} ${item.technologies.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [category, lang, query])
  if (detailSlug) return project ? <><PageHero lang={lang} title={local(lang, project.title)} intro={local(lang, project.description)}/><section className="content-section"><div className="public-shell project-detail"><img src={project.image} alt={local(lang, project.title)}/><div><p className="eyebrow">{lang === 'fr' ? 'RÉALISATION' : 'PROJECT'} <i/></p><h2>{local(lang, project.title)}</h2><p>{local(lang, project.description)}</p><dl><div><dt>{lang === 'fr' ? 'Client' : 'Client'}</dt><dd>{project.client}</dd></div><div><dt>{lang === 'fr' ? 'Technologies' : 'Technologies'}</dt><dd>{project.technologies.join(' · ')}</dd></div></dl><Link className="primary-action inline-action" to={publicPath(lang, 'quote')}>{t('nav.quote')} <span>→</span></Link></div></div></section></> : <NotFound lang={lang}/>
  return <><PageHero lang={lang} title={t('pages.projects')} intro={lang === 'fr' ? 'Quelques exemples de projets et d’accompagnements menés avec nos partenaires.' : 'A selection of projects and collaborations with our partners.'}/><section className="content-section"><div className="public-shell"><div className="filter-toolbar"><div className="filter-chips" aria-label={t('common.category')}>{categories.map((item) => <button type="button" key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item === 'all' ? t('common.all') : item}</button>)}</div><label className="search-field"><span className="sr-only">{t('common.search')}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('common.search')}/><span aria-hidden="true">⌕</span></label></div><div className="content-card-grid project-list">{visible.map((item) => <Link to={publicPath(lang, 'projects', item.slug)} className="public-card project-public-card" key={item.slug}><div className="public-card-image"><img loading="lazy" src={item.image} alt=""/><span>{item.category}</span></div><div className="public-card-body"><small>{item.client}</small><h2>{local(lang, item.title)}</h2><p>{local(lang, item.description)}</p><span className="card-link">{t('common.readMore')} <b>→</b></span></div></Link>)}</div>{visible.length === 0 && <p className="empty-state">{t('admin.noData')}</p>}</div></section></>
}

function TrainingPage({ lang, detailSlug }: { lang: Locale; detailSlug?: string }) {
  const { t } = useTranslation()
  const courses = getCourses()
  const course = detailSlug ? courses.find((item) => item.slug === detailSlug) : undefined
  if (detailSlug) return course ? <><PageHero lang={lang} title={local(lang, course.title)} intro={local(lang, course.summary)}/><section className="content-section"><div className="public-shell course-detail"><div className="course-main"><div className="course-callout"><strong>{local(lang, course.duration)}</strong><span>{local(lang, course.price)}</span></div><h2>{lang === 'fr' ? 'Ce que vous allez apprendre' : 'What you will learn'}</h2><ul className="check-list">{course.program.map((item) => <li key={item.fr}><span>✓</span>{local(lang, item)}</li>)}</ul><h2>{lang === 'fr' ? 'À qui s’adresse cette formation ?' : 'Who is this course for?'}</h2><p>{local(lang, course.audience)}</p><h3>{lang === 'fr' ? 'Prérequis' : 'Prerequisites'}</h3><p>{local(lang, course.prerequisites)}</p><h2>{lang === 'fr' ? 'Sessions à venir' : 'Upcoming sessions'}</h2>{course.sessions.map((session) => <article className="session-row" key={session.date.fr}><div><b>{local(lang, session.date)}</b><span>{local(lang, session.location)}</span></div><span className="session-spots">{session.remaining} {lang === 'fr' ? 'places indicatives' : 'indicative places'}</span></article>)}</div><RequestForm lang={lang} kind="registration" courseTitle={local(lang, course.title)}/></div></section></> : <NotFound lang={lang}/>
  return <><PageHero lang={lang} title={t('pages.training')} intro={lang === 'fr' ? 'Des formations en présentiel pour apprendre en pratiquant, à votre rythme.' : 'In-person courses that help you learn by doing, at your own pace.'}/><section className="content-section"><div className="public-shell content-card-grid course-list">{courses.map((item, index) => <Link className="public-card course-card" to={publicPath(lang, 'training', item.slug)} key={item.slug}><span className="course-count">0{index + 1}</span><p className="eyebrow">{lang === 'fr' ? 'FORMATION EN PRÉSENTIEL' : 'IN-PERSON COURSE'} <i/></p><h2>{local(lang, item.title)}</h2><p>{local(lang, item.summary)}</p><div className="course-meta"><span>{local(lang, item.duration)}</span><span>{local(lang, item.price)}</span></div><span className="card-link">{t('common.learn')} <b>→</b></span></Link>)}</div></section></>
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
    void i18n.changeLanguage(lang)
    localStorage.setItem('nova-language', lang)
    document.documentElement.lang = lang
  }, [i18n, lang, pathLang])

  if (pathLang !== 'fr' && pathLang !== 'en') return <NotFound lang="fr"/>

  const segments = location.pathname.split('/').filter(Boolean).slice(1)
  const root = segments[0]
  const slug = segments[1]
  let page: PageKind = 'notFound'
  if (!root) return <LandingPageBridge lang={lang}/>
  const routeMap: Record<string, PageKind> = {
    'a-propos': 'about', about: 'about', services: 'services', realisations: 'projects', projects: 'projects', formations: 'training', training: 'training', equipe: 'team', team: 'team', contact: 'contact', devis: 'quote', quote: 'quote', actualites: 'news', news: 'news', 'mentions-legales': 'legal', 'legal-notice': 'legal', confidentialite: 'privacy', privacy: 'privacy',
  }
  page = routeMap[root] ?? 'notFound'
  return <PublicLayout lang={lang}><ContentPage lang={lang} page={page} slug={slug}/></PublicLayout>
}

function LandingPageBridge({ lang }: { lang: Locale }) {
  const { i18n } = useTranslation()
  useEffect(() => { void i18n.changeLanguage(lang); localStorage.setItem('nova-language', lang); document.documentElement.lang = lang }, [i18n, lang])
  return <Suspense fallback={<div className="page-loading" role="status">NOVA-TECH-SOLUTION</div>}><LandingPage/></Suspense>
}

function ContentPage({ lang, page, slug }: { lang: Locale; page: PageKind; slug?: string }) {
  const { t } = useTranslation()
  const settings = getSiteSettings()
  const title = t(`pages.${page}`, { defaultValue: t('pages.notFound') })
  useEffect(() => {
    document.title = `${title} | NOVA-TECH-SOLUTION`
    const description = document.querySelector('meta[name="description"]')
    description?.setAttribute('content', `${title} — NOVA-TECH-SOLUTION, solutions numériques et formations à Cameroon.`)
  }, [title])
  if (page === 'notFound') return <NotFound lang={lang}/>
  if (page === 'projects') return <ProjectsPage lang={lang} detailSlug={slug}/>
  if (page === 'training') return <TrainingPage lang={lang} detailSlug={slug}/>
  if (page === 'services') {
    const service = slug ? getServices().find((item) => item.slug === slug) : undefined
    if (slug && !service) return <NotFound lang={lang}/>
    return service ? <><PageHero lang={lang} title={local(lang, service.title)} intro={local(lang, service.description)}/><section className="content-section"><div className="public-shell service-detail"><div><p className="eyebrow">{lang === 'fr' ? 'NOTRE ACCOMPAGNEMENT' : 'HOW WE HELP'} <i/></p><h2>{local(lang, service.summary)}</h2><p>{local(lang, service.description)}</p><p>{lang === 'fr' ? 'Nous définissons avec vous les priorités, le périmètre et les étapes de mise en œuvre pour transformer votre besoin en résultat concret.' : 'Together we define priorities, scope and next steps to turn your needs into a practical result.'}</p><Link className="primary-action inline-action" to={publicPath(lang, 'quote')}>{t('nav.quote')} <span>→</span></Link></div><div className="service-detail-aside"><h3>{lang === 'fr' ? 'Parlons de vos besoins' : 'Let’s discuss your needs'}</h3><p>{lang === 'fr' ? 'Présentez-nous votre projet et nous vous recontacterons.' : 'Tell us about your project and we will get back to you.'}</p><Link to={publicPath(lang, 'contact')}>{t('nav.contact')} →</Link></div></div></section><section className="content-section content-section-soft"><div className="public-shell"><SectionHeading eyebrow={lang === 'fr' ? 'NOS PÔLES' : 'OUR SERVICES'} title={t('pages.services')}/><ServiceGrid lang={lang}/></div></section></> : <><PageHero lang={lang} title={title} intro={lang === 'fr' ? 'Découvrez les cinq domaines dans lesquels nous accompagnons les organisations et les apprenants.' : 'Explore the five areas where we support organizations and learners.'}/><section className="content-section"><div className="public-shell"><ServiceGrid lang={lang}/></div></section></>
  }
  if (page === 'about') return <><PageHero lang={lang} title={title} intro={t('about.intro')}/><section className="content-section"><div className="public-shell about-page-grid"><div className="about-page-image"><img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80" alt={lang === 'fr' ? 'Équipe en réunion dans un espace de travail' : 'Team meeting in a workspace'} loading="lazy"/><span>NOVA<br/>TECH</span></div><div className="about-page-copy"><p className="eyebrow">{lang === 'fr' ? 'NOTRE HISTOIRE' : 'OUR STORY'} <i/></p><h2>{lang === 'fr' ? 'La technologie pensée pour les personnes.' : 'Technology designed for people.'}</h2><p>{t('about.intro')}</p><p>{lang === 'fr' ? 'Basée au Cameroun, NOVA-TECH-SOLUTION réunit le développement, le conseil et la formation pour rendre les outils numériques plus utiles au quotidien.' : 'Based in Cameroon, NOVA-TECH-SOLUTION brings development, consulting and training together to make digital tools more useful every day.'}</p></div></div><div className="public-shell value-grid">{(['mission','vision','values'] as const).map((key, index) => <article className="public-card value-card" key={key}><span>0{index + 1}</span><h3>{t(`about.${key}`)}</h3><p>{t(`about.${key}Text`)}</p></article>)}</div></section></>
  if (page === 'team') return <><PageHero lang={lang} title={title} intro={lang === 'fr' ? 'Les personnes qui font avancer vos projets et vos compétences.' : 'The people moving your projects and skills forward.'}/><section className="content-section"><div className="public-shell content-card-grid team-grid">{getTeam().map((member) => <article className="public-card team-card" key={member.name}><div className="team-photo"><img src={member.image} alt={member.name} loading="lazy"/></div><div className="public-card-body"><p className="eyebrow">{local(lang, member.role)} <i/></p><h2>{member.name}</h2><p>{local(lang, member.bio)}</p></div></article>)}</div></section></>
  if (page === 'contact' || page === 'quote') return <><PageHero lang={lang} title={title} intro={page === 'quote' ? (lang === 'fr' ? 'Décrivez votre besoin, votre budget indicatif et votre calendrier.' : 'Tell us about your needs, estimated budget and desired timeline.') : t('home.contact')}/><section className="content-section"><div className="public-shell contact-layout"><RequestForm lang={lang} kind={page === 'quote' ? 'quote' : 'contact'}/><aside className="contact-aside"><p className="eyebrow">NOVA-TECH-SOLUTION <i/></p><h2>{lang === 'fr' ? 'À votre écoute au Cameroun' : 'Here to help in Cameroon'}</h2><p>{lang === 'fr' ? 'Contactez-nous pour discuter de votre projet, d’une formation ou d’un partenariat.' : 'Get in touch to discuss a project, a course or a partnership.'}</p><p>{settings.email || (lang === 'fr' ? 'Adresse e-mail à configurer' : 'Email to be configured')}</p><p>{lang === 'fr' ? 'Cameroun' : 'Cameroon'}</p><div className="map-placeholder" role="img" aria-label={lang === 'fr' ? 'Carte de Cameroun' : 'Map of Cameroon'}><span>{lang === 'fr' ? 'CAMEROUN' : 'CAMEROON'}</span><small>{lang === 'fr' ? 'Cameroun' : 'Cameroon'}</small><i/></div></aside></div></section></>
  if (page === 'news') {
    const article = slug ? news.find((item) => item.slug === slug) : undefined
    if (slug && !article) return <NotFound lang={lang}/>
    return article ? <><PageHero lang={lang} title={local(lang, article.title)} intro={article.category}/><article className="content-section"><div className="public-shell article-detail"><img src={article.image} alt=""/><div><p className="eyebrow">{article.category} <i/></p><h2>{local(lang, article.title)}</h2><p>{local(lang, article.body)}</p><p>{lang === 'fr' ? 'Vous souhaitez en savoir plus sur nos solutions et nos formations ? Contactez notre équipe pour échanger sur votre projet.' : 'Would you like to learn more about our services and training? Contact our team to discuss your project.'}</p></div></div></article></> : <><PageHero lang={lang} title={title} intro={lang === 'fr' ? 'Conseils, actualités et ressources autour du numérique et de la formation.' : 'Ideas, updates and resources on technology and learning.'}/><section className="content-section"><div className="public-shell content-card-grid article-list">{news.map((item) => <Link className="public-card project-public-card" key={item.slug} to={publicPath(lang, 'news', item.slug)}><div className="public-card-image"><img src={item.image} alt="" loading="lazy"/><span>{item.category}</span></div><div className="public-card-body"><h2>{local(lang, item.title)}</h2><p>{local(lang, item.body)}</p><span className="card-link">{t('common.readMore')} <b>→</b></span></div></Link>)}</div></section></>
  }
  const legal = page === 'legal'
  return <><PageHero lang={lang} title={title} intro={legal ? (lang === 'fr' ? 'Informations relatives à l’éditeur et à l’utilisation de ce site.' : 'Information about this website and its publisher.') : (lang === 'fr' ? 'Comment vos données sont collectées et utilisées.' : 'How your data is collected and used.')}/><section className="content-section"><div className="public-shell legal-content"><h2>{legal ? (lang === 'fr' ? 'Éditeur du site' : 'Website publisher') : (lang === 'fr' ? 'Données collectées' : 'Information we collect')}</h2><p>{lang === 'fr' ? 'NOVA-TECH-SOLUTION · Cameroun · Adresse e-mail à configurer. Les informations affichées ici sont à compléter et valider par l’entreprise avant mise en ligne.' : 'NOVA-TECH-SOLUTION · Cameroon · Email to be configured. The information shown here must be completed and approved by the company before launch.'}</p><h2>{legal ? (lang === 'fr' ? 'Responsabilité' : 'Liability') : (lang === 'fr' ? 'Utilisation des informations' : 'How we use information')}</h2><p>{lang === 'fr' ? 'Les formulaires de cette version frontend sont des démonstrations locales. Ils ne transmettent aucune donnée à l’entreprise.' : 'Forms in this frontend version are local demos and do not send data to the company.'}</p><h2>{lang === 'fr' ? 'Contact' : 'Contact'}</h2><p>{settings.email || (lang === 'fr' ? 'Adresse e-mail à configurer' : 'Email to be configured')}</p></div></section></>
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <div className="page-section-heading"><p className="eyebrow">{eyebrow} <i/></p><h2>{title}</h2></div>
}

export { PageHero, RequestForm, ServiceGrid, SectionHeading, NotFound }
