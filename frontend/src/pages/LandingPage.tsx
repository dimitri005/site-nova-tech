import { useEffect, useRef, useState } from 'react'
import { tr } from '../i18nText'
import { parseFooterLinks, SOCIAL_NETWORKS } from '../config/footer'
import { HomeSkeletons } from '../components/Skeleton'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import { useLandingAnimations } from '../animations/useLandingAnimations'
import { homepageDefaults } from '../data/homepageContent'
import { ApiError, apiMediaUrl, apiSend, mapFieldErrors } from '../api/client'
import type { ArticleRecord, ProjectRecord, ServiceRecord, TeamRecord, TestimonialRecord, TrainingRecord } from '../api/types'
import { useApiData } from '../api/hooks'
import novaTechLogo from '../assets/nova-tech-logo.png'
import novaTechLogoLight from '../assets/nova-tech-logo-light.png'
import '../App.css'
import '../styles/nova-home.css'

function Brand({ light = false, darkImage, lightImage }: { light?: boolean; darkImage?: string; lightImage?: string }) {
  return <a className={`brand${light ? ' brand-light' : ''}`} href="#top" aria-label="NOVA-TECH-SOLUTION, home"><img className="brand-image brand-image-dark" src={darkImage || novaTechLogo} alt="NOVA-TECH-SOLUTION"/><img className="brand-image brand-image-light" src={lightImage || novaTechLogoLight} alt="" aria-hidden="true"/></a>
}

function LandingPage() {
  const { lang: routeLang } = useParams()
  const lang = routeLang === 'en' ? 'en' : 'fr'
  const { t, i18n } = useTranslation()
  const { data: settings } = useApiData<Record<string, string>>('/settings/public')
  const { data: serviceRecords } = useApiData<ServiceRecord[]>('/services')
  const { data: projectRecords } = useApiData<ProjectRecord[]>('/projects')
  const { data: trainingRecords } = useApiData<TrainingRecord[]>('/trainings')
  const { data: articleRecords } = useApiData<ArticleRecord[]>('/articles')
  const { data: testimonialRecords } = useApiData<TestimonialRecord[]>('/testimonials')
  const { data: teamRecords } = useApiData<TeamRecord[]>('/team')
  const pageRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  useLandingAnimations(pageRef)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('2')
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState('')
  const [contactFieldErrors, setContactFieldErrors] = useState<Record<string, string>>({})
  const [sendingContact, setSendingContact] = useState(false)
  const homeText = (key: string) => settings?.[`home.${key}.${lang}`]?.trim() || homepageDefaults[`home.${key}.${lang}`] || ''
  const homeImage = (key: string, fallback = '') => { const value = settings?.[`home.${key}`] || homepageDefaults[`home.${key}`] || fallback; return value.startsWith('/media/') ? apiMediaUrl(value) : value }
  const clearContactFieldError = (name: string) => setContactFieldErrors((current) => {
    if (!current[name]) return current
    const next = { ...current }
    delete next[name]
    return next
  })
  const contactFieldMessage = (name: string) => contactFieldErrors[name] ? <small className="field-validation-error" id={`contact-${name}-error`} role="alert">{contactFieldErrors[name]}</small> : null
  const emailAddress = settings?.['contact.email']?.trim() || ''
  const address = settings?.[`contact.address.${lang}`]?.trim() || settings?.['contact.address']?.trim() || tr(lang, 'ui.landing.cameroun', 'Cameroun', 'Cameroon')
  const footerValue = (key: string, homeKey: string) => settings?.[`footer.${key}.${lang}`]?.trim() || homeText(homeKey)
  const extraLinks = parseFooterLinks(settings?.['footer.links'])
  const phone = settings?.['contact.phone'] || ''
  const whatsapp = settings?.['social.whatsapp'] || import.meta.env.VITE_WHATSAPP_NUMBER
  const contactPath = `/${lang}/contact`
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : contactPath
  const addressHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  const galleryImages = [...(projectRecords || []).map((item) => item.coverImageUrl), ...(articleRecords || []).map((item) => item.coverImageUrl), ...(teamRecords || []).map((item) => item.photoUrl), ...(serviceRecords || []).map((item) => item.imageUrl), ...(trainingRecords || []).map((item) => item.imageUrl)].filter((item): item is string => Boolean(item)).slice(0, 6)
  const socialLinks = SOCIAL_NETWORKS.filter((item) => Boolean(settings?.[`social.${item.key}`]))


  const sendContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setContactError('')
    setContactFieldErrors({})
    setSendingContact(true)
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      await apiSend('/contact-messages', 'POST', {
        fullName: String(values.get('name') || '').trim(),
        email: String(values.get('email') || '').trim(),
        phone: String(values.get('phone') || '').trim(),
        subject: tr(lang, 'ui.landing.message-depuis-la-page-daccueil', 'Message depuis la page d’accueil', 'Message from the homepage'),
        message: String(values.get('message') || '').trim(),
        language: lang,
        consent: values.get('consent') === 'on',
        website: String(values.get('website') || ''),
      })
      setContactSent(true)
      form.reset()
    } catch (reason) {
      if (reason instanceof ApiError && Object.keys(reason.fields).length) {
        const mapped = mapFieldErrors(reason.fields, ['fullName', 'email', 'phone', 'message', 'consent'])
        const visible: Record<string, string> = { email: mapped.email, phone: mapped.phone, message: mapped.message, consent: mapped.consent }
        if (mapped.fullName) visible.name = mapped.fullName
        for (const key of Object.keys(visible)) if (!visible[key]) delete visible[key]
        setContactFieldErrors(visible)
        if (Object.keys(visible).length < Object.keys(reason.fields).length) setContactError(reason.message)
        const firstField = ['name', 'email', 'phone', 'message', 'consent'].find((field) => visible[field])
        if (firstField) requestAnimationFrame(() => {
          const target = form.elements.namedItem(firstField)
          if (target instanceof HTMLElement) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' })
            target.focus({ preventScroll: true })
          }
        })
      } else setContactError(reason instanceof ApiError ? reason.message : 'Unable to send your message right now.')
    } finally {
      setSendingContact(false)
    }
  }

  useEffect(() => {
    const updateHeader = () => document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 80)
    updateHeader()
    window.addEventListener('scroll', updateHeader, { passive: true })
    return () => window.removeEventListener('scroll', updateHeader)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = tr(lang, 'ui.landing.nova-tech-solution-solutions-numerique', 'NOVA-TECH-SOLUTION — Solutions numériques', 'NOVA-TECH-SOLUTION — Digital solutions')
  }, [lang])

  return (
    <main id="top" ref={pageRef}>
      <header className="site-header">
        <div className="topbar"><div className="topbar-inner">{emailAddress && <Link className="topbar-item" to={contactPath}><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="m3.5 5 6.5 5 6.5-5"/></svg><span>{emailAddress}</span></Link>}<a className="topbar-item" href={addressHref} target="_blank" rel="noreferrer"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 8.2c0 4.1-6 9.3-6 9.3S4 12.3 4 8.2a6 6 0 1 1 12 0Z"/><circle cx="10" cy="8" r="2"/></svg><span>{address}</span></a><div className="top-links">{phone && <a href={phoneHref}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15.5 3.5 17l.6-3.1A6.5 6.5 0 1 1 6 16.2"/><path d="M7 7.3c.5 2.4 2 4 4.5 4.7l1.2-1.2 2 .9c-.1 1.1-.8 1.8-1.8 1.8-3.2-.2-5.8-2.8-6-6 0-1 .7-1.7 1.7-1.8l.9 2-1.1 1.1"/></svg><span>{tr(lang, 'ui.landing.assistance', 'Assistance', 'Support')}</span></a>}<Link to={contactPath}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4.5h14v11H3zM3.5 5l6.5 5 6.5-5"/><path d="M6 2.5h8"/></svg><span>{tr(lang, 'ui.landing.contact-2', 'Contact', 'Contact')}</span></Link></div></div></div>
        <nav className="navbar"><Brand light darkImage={homeImage('brand.dark.image', novaTechLogo)} lightImage={homeImage('brand.light.image', novaTechLogoLight)}/><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={tr(lang, 'ui.landing.ouvrir-le-menu', 'Ouvrir le menu', 'Open menu')} aria-expanded={menuOpen}>☰</button><div className={`nav-links${menuOpen ? ' nav-open' : ''}`}><Link className="selected" to={`/${lang}`} onClick={() => setMenuOpen(false)}>{homeText('nav.home')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'a-propos' : 'about')}`}>{homeText('nav.about')}</Link><Link to={`/${lang}/services`}>{homeText('nav.services')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'realisations' : 'projects')}`}>{homeText('nav.projects')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'formations' : 'training')}`}>{homeText('nav.training')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'equipe' : 'team')}`}>{homeText('nav.team')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'contact' : 'contact')}`}>{homeText('nav.contact')}</Link><span className="home-language"><Link to="/fr" aria-current={lang === 'fr' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('fr'); localStorage.setItem('nova-language', 'fr') }}>FR</Link> / <Link to="/en" aria-current={lang === 'en' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('en'); localStorage.setItem('nova-language', 'en') }}>EN</Link></span></div><div className="nav-actions"><Link className="home-login" to="/admin/login">{settings?.[`header.login-label.${lang}`]?.trim() || tr(lang, 'ui.landing.se-connecter', 'Se connecter', 'Sign in')}</Link><Link className="home-quote" to={'/' + lang + '/' + ((lang === 'fr' ? 'devis' : 'quote'))}>{homeText('nav.quote')}</Link></div></nav>
      </header>

      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg,rgba(10,13,24,.78),rgba(10,13,24,.78)),url("${homeImage('hero.image')}")` }}>
        <div className="hero-shape hero-shape-left" /><div className="hero-shape hero-shape-right" />
        <div className="hero-inner"><div className="hero-copy"><p className="eyebrow light">{homeText('hero.eyebrow')}</p><h1>{homeText('hero.title')}<svg className="hero-arrow" viewBox="0 0 165 125" fill="none" aria-hidden="true"><path d="M4 105 28 78l20 24 27-48 26 34 37-66" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="m119 28 20-12-1 24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg></h1><a className="button" href="#services">{homeText('hero.cta')}</a></div></div>
      </section>

      <section className="feature-strip" aria-label={homeText('services.title')}><div className="feature-inner">{!serviceRecords && <HomeSkeletons count={3} height={150}/>}{(serviceRecords || []).slice(0, 3).map((service) => <article className="feature-item" key={service.id}><span className="feature-icon"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="5" width="26" height="22" rx="2"/><path d="M12 32h12m-6-5v5M10 12h16M10 18h11"/></svg></span><div><h2>{lang === 'fr' ? service.titleFr : service.titleEn}</h2><p>{lang === 'fr' ? service.descriptionFr : service.descriptionEn}</p></div></article>)}</div><div className="feature-rule"/></section>

      <section className="about-section" id="about"><div className="about-grid"><div className="about-visual"><span className="about-accent"/><img className="about-main" src={homeImage('about.image')} alt={homeText('about.title')}/><span className="about-orbit"/><img className="about-small" src={homeImage('about.imageSecondary')} alt={homeText('about.title')}/><div className="dots"/></div><div className="about-copy"><p className="eyebrow">{homeText('about.eyebrow')}</p><h2>{homeText('about.title')}</h2><p className="about-lead">{homeText('about.lead')}</p><p className="muted about-description">{homeText('about.body')}</p><div className="about-points"><article><h3><span>&rsaquo;</span> {homeText('about.point1')}</h3><p>{homeText('about.lead')}</p></article><article><h3><span>&rsaquo;</span> {homeText('about.point2')}</h3><p>{homeText('about.body')}</p></article></div><div className="satisfaction"><div><b>{homeText('about.satisfaction')}</b><span>{settings?.['home.about.satisfactionValue'] || homepageDefaults['home.about.satisfactionValue']}%</span></div><div className="progress"><span style={{ width: `${settings?.['home.about.satisfactionValue'] || homepageDefaults['home.about.satisfactionValue']}%` }}/></div></div><a className="button about-button" href="#services">{homeText('about.cta')} <span>&rsaquo;</span></a></div></div></section>


      <section className="services-section" id="services"><img className="service-circuit-left" src="/images/circuit-motif.svg" alt="" aria-hidden="true"/><svg className="service-waves" viewBox="0 0 330 360" fill="none" aria-hidden="true">{[0,1,2,3,4,5,6].map((ring)=><path key={ring} d="M350 14 C286 19 263 64 220 80 C169 100 141 68 91 84 C31 103 16 157 57 203 C95 245 113 276 88 370" transform={`translate(${ring*13} ${ring*9})`} stroke="#2354a4" strokeWidth="1.35"/>)}</svg><div className="services-layout"><div className="services-heading"><p className="eyebrow light">{homeText('services.eyebrow')}</p><h2>{homeText('services.title')}</h2></div>{(serviceRecords || []).slice(0, 7).map((service, i) => <motion.article className="service-card" key={service.slug} whileHover={prefersReducedMotion ? undefined : { y: -5, transition: { duration: 0.2 } }} whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}><span className="service-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{[
        <><path d="M12 30 25 13a8 8 0 0 1 13 2l3 5a5 5 0 0 1-6 7l-6-2-9 12-5-1 3-9-6 5-3-2 3-7Z"/><circle cx="31" cy="19" r="3"/><path d="m14 31-3 9 8-4m-4-4 7 4"/></>,
        <><rect x="7" y="9" width="34" height="25" rx="2"/><path d="M7 29h34M18 40h12m-6-6v6"/><path d="m21 23 6-7 4 3 5-7m-1 0h-4m4 0v4"/><circle cx="16" cy="16" r="2"/></>,
        <><path d="M24 5 28 8l5-1 2 5 5 2-1 6 3 4-3 5 1 5-5 3-2 5-6-1-4 4-5-3-5 1-2-5-5-2 1-6-4-4 3-5-1-5 5-3 2-5 6 1 4-4Z"/><circle cx="24" cy="23" r="9"/><circle cx="24" cy="21" r="3"/><path d="M19 30c1-4 9-4 10 0"/></>,
        <><path d="M8 39h33M12 37V24h6v13m4 0V15h6v22m4 0V21h6v16"/><circle cx="17" cy="12" r="6"/><path d="m17 9 2 3-2 3m14-12 1 4 4 1-4 2-1 4-2-4-4-2 4-1 2-4Z"/><path d="m30 13 4-3 3 1"/></>,
        <><rect x="14" y="8" width="27" height="20" rx="2"/><path d="M18 13h19m-19 5h13m-13 5h17M9 25v10m0 0c-3 0-4 2-4 5v3m4-8c3 0 4 2 4 5v3m-4-8v8"/><circle cx="9" cy="19" r="4"/></>,
        <><path d="M7 12h34v24H7zM7 9h34v4H7zM13 31h6v-9h-6zm10 0h6V19h-6zm10 0h5V16h-5z"/><path d="m15 26 5-4 5 2 6-7 4 2"/><path d="m30 19 1-3 4 1"/></>,
        <><path d="M18 31h12l-2 5H20l-2-5Z"/><path d="M19 31c0-5-7-8-7-15a12 12 0 0 1 24 0c0 7-7 10-7 15"/><path d="M20 39h8m-7 4h6M24 10v13m-4-4 4 4 4-4"/><circle cx="24" cy="15" r="2"/></>,
      ][i]}</svg></span><strong>0{i + 1}</strong><h3>{lang === 'fr' ? service.titleFr : service.titleEn}</h3></motion.article>)}</div></section>


      <section className="projects-section" id="projects"><div className="container"><div className="section-heading"><div><p className="eyebrow">{homeText('projects.eyebrow')}</p><h2>{homeText('projects.title')}</h2></div><p className="muted">{homeText('projects.intro')}</p></div><div className="project-grid">{!projectRecords && <HomeSkeletons count={4} height={280}/>}{(projectRecords || []).slice(0, 4).map((project, i) => <Link to={`/${lang}/${(lang === 'fr' ? 'realisations' : 'projects')}/${project.slug}`} className="project-card" key={project.id}><img src={apiMediaUrl(project.coverImageUrl)} alt={lang === 'fr' ? project.titleFr : project.titleEn}/><span className="image-hover-wash" aria-hidden="true"/><span className="project-overlay"><small>{project.category}</small><strong>{lang === 'fr' ? project.titleFr : project.titleEn}</strong><b>{String.fromCharCode(8599)}</b></span><span className="project-number">0{i + 1}</span></Link>)}</div></div></section>

      <section className="home-training-preview"><div className="container"><div className="home-training-heading"><div><p className="eyebrow">{homeText('training.eyebrow')}</p><h2>{homeText('training.title')}</h2><p>{homeText('training.intro')}</p></div><Link className="button" to={`/${lang}/${(lang === 'fr' ? 'formations' : 'training')}`}>{t('common.viewAll')} <span>&rsaquo;</span></Link></div><div className="home-training-grid">{!trainingRecords && <HomeSkeletons count={3} height={200}/>}{(trainingRecords || []).slice(0, 3).map((course, index) => <Link className="home-training-card" to={`/${lang}/${(lang === 'fr' ? 'formations' : 'training')}/${course.slug}`} key={course.id}><span>0{index + 1}</span><h3>{lang === 'fr' ? course.titleFr : course.titleEn}</h3><p>{course.durationHours ? `${course.durationHours} ${tr(lang, 'ui.landing.heures', 'heures', 'hours')}` : (tr(lang, 'ui.landing.duree-a-confirmer', 'Duree a confirmer', 'Duration to be confirmed'))}</p><b>{t('common.learn')} ?</b></Link>)}</div><p className="home-session-note">{homeText('training.note')}</p></div></section>

      <section className="testimonial-section"><div className="container testimonial-grid"><div className="testimonial-copy"><p className="eyebrow">{homeText('testimonial.title')}</p><div className="stars">?????</div><p className="quote">{testimonialRecords?.[0] ? (lang === 'fr' ? testimonialRecords[0].quoteFr : testimonialRecords[0].quoteEn) : homeText('testimonial.quote')}</p><b>{testimonialRecords?.[0]?.authorName || homeText('testimonial.author')}</b><small className="role">{testimonialRecords?.[0] ? (lang === 'fr' ? testimonialRecords[0].authorRoleFr : testimonialRecords[0].authorRoleEn) : homeText('testimonial.role')}</small></div><div className="testimonial-photo"><img src={homeImage('testimonial.image')} alt={testimonialRecords?.[0]?.authorName || homeText('testimonial.author')}/>{teamRecords?.[0]?.photoUrl && <span className="avatar avatar-one"><img src={apiMediaUrl(teamRecords[0].photoUrl)} alt={teamRecords[0].fullName}/></span>}</div></div></section>

      <section className="success-section"><div className="container success-grid"><div className="success-copy"><p className="eyebrow light">{homeText('success.eyebrow')}</p><h2>{homeText('success.title')}</h2>{[homeText('success.point1'), homeText('success.point2'), homeText('success.point3')].map((text, i) => <div className="success-point" key={i}><span>0{i + 1}</span><p>{text}</p></div>)}</div><img className="success-image" src={homeImage('success.image')} alt={homeText('success.title')}/></div></section>
      <section className="why-section"><div className="why-inner"><div className="why-visual"><span className="why-word">NOVA</span><img className="why-photo-one" src={homeImage('why.image')} alt={homeText('why.title')}/><img className="why-photo-two" src={homeImage('why.imageSecondary')} alt={homeText('why.title')}/><span className="why-emblem">N</span><span className="why-photo-line"/></div><div className="why-copy"><p className="eyebrow">{homeText('why.eyebrow')}</p><h2>{homeText('why.title')}</h2><p className="muted">{homeText('why.body')}</p><blockquote>{homeText('why.quote')}</blockquote><div className="why-actions"><a className="button" href="#contact">{homeText('why.cta')}</a><div className="founder">{teamRecords?.[0]?.photoUrl && <img src={apiMediaUrl(teamRecords[0].photoUrl)} alt={teamRecords[0].fullName}/>}<span><b>{teamRecords?.[0]?.fullName || homeText('why.founderName')}</b><small>{teamRecords?.[0] ? (lang === 'fr' ? teamRecords[0].positionFr : teamRecords[0].positionEn) : homeText('why.founderRole')}</small></span></div></div></div></div></section>

      <section className="mission-section"><div className="mission-dark"><div className="mission-stats">{[1, 2, 3, 4].map((index) => <article className="mission-stat" key={index}><span className="mission-stat-icon"><span>{index}</span></span><strong>{settings?.[`home.stats.stat${index}.value`] || homepageDefaults[`home.stats.stat${index}.value`]}</strong><small>{homeText(`stats.stat${index}.label`)}</small></article>)}</div><div className="mission-tabs">{[1, 2, 3].map((index) => <button key={index} className={`mission-tab${activeTab === String(index) ? ' is-active' : ''}`} onClick={() => setActiveTab(String(index))}>{homeText(`mission.tab${index}`)}</button>)}</div></div><div className="mission-light"><div className="mission-card"><div className="mission-benefits"><article className="mission-benefit"><div><h3>{homeText('mission.benefit1.title')}</h3><p>{homeText('mission.benefit1.body')}</p></div></article><article className="mission-benefit"><div><h3>{homeText('mission.benefit2.title')}</h3><p>{homeText('mission.benefit2.body')}</p></div></article></div><div className="mission-experience"><span className="mini-rule"/><h3>{homeText(`mission.content${activeTab}`)}</h3><a href="#about">{homeText('mission.readMore')} <span>&rsaquo;</span></a></div><div className="mission-photo"><img src={homeImage('mission.image')} alt={homeText('mission.experience')}/></div></div></div></section>
      <section className="contact-vision" id="contact"><div className="contact-vision-inner"><form className="contact-form" onSubmit={(event) => void sendContact(event)} noValidate><p className="eyebrow">{homeText('contact.eyebrow')}</p><h2>{homeText('contact.title')}</h2><input type="text" name="name" aria-invalid={Boolean(contactFieldErrors.name)} aria-describedby={contactFieldErrors.name ? 'contact-name-error' : undefined} onChange={() => clearContactFieldError('name')} placeholder={tr(lang, 'ui.landing.votre-nom-complet', 'Votre nom complet', 'Your full name')} autoComplete="name" required/>{contactFieldMessage('name')}<input type="email" name="email" aria-invalid={Boolean(contactFieldErrors.email)} aria-describedby={contactFieldErrors.email ? 'contact-email-error' : undefined} onChange={() => clearContactFieldError('email')} placeholder={tr(lang, 'ui.landing.adresse-e-mail', 'Adresse e-mail', 'Email address')} autoComplete="email" required/>{contactFieldMessage('email')}<input type="tel" name="phone" aria-invalid={Boolean(contactFieldErrors.phone)} aria-describedby={contactFieldErrors.phone ? 'contact-phone-error' : undefined} onChange={() => clearContactFieldError('phone')} placeholder={tr(lang, 'ui.landing.telephone-facultatif', 'Téléphone (facultatif)', 'Phone (optional)')} autoComplete="tel"/>{contactFieldMessage('phone')}<textarea name="message" aria-invalid={Boolean(contactFieldErrors.message)} aria-describedby={contactFieldErrors.message ? 'contact-message-error' : undefined} onChange={() => clearContactFieldError('message')} placeholder={tr(lang, 'ui.landing.decrivez-votre-besoin', 'Décrivez votre besoin', 'Tell us what you need')} rows={4} minLength={10} required/>{contactFieldMessage('message')}<input className="contact-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/><label className="contact-consent"><input type="checkbox" name="consent" required aria-invalid={Boolean(contactFieldErrors.consent)} aria-describedby={contactFieldErrors.consent ? 'contact-consent-error' : undefined} onChange={() => clearContactFieldError('consent')}/><span>{tr(lang, 'ui.landing.jaccepte-que-mes-informations-soient-u', 'J’accepte que mes informations soient utilisées pour répondre à ma demande.', 'I agree that my information may be used to respond to my request.')}</span>{contactFieldMessage('consent')}</label><button className="button" type="submit" disabled={sendingContact}>{sendingContact ? (tr(lang, 'ui.landing.envoi-en-cours', 'Envoi en cours…', 'Sending...')) : (tr(lang, 'ui.landing.envoyer-le-message', 'Envoyer le message', 'Send message'))} <span>&rsaquo;</span></button>{contactError && <p className="form-error" role="alert">{contactError}</p>}{contactSent && <p className="form-success" role="status">{tr(lang, 'ui.landing.merci-votre-message-a-bien-ete-enregis', 'Merci. Votre message a bien été enregistré.', 'Thank you. Your message has been recorded.')}</p>}</form><img className="vision-portrait" src={homeImage('contact.image')} alt={homeText('vision.title')}/><div className="vision-copy"><p className="eyebrow">{homeText('vision.eyebrow')}</p><h2>{homeText('vision.title')}</h2>{[1,2,3].map((index) => <p className="vision-check" key={index}><span>&rsaquo;</span><b>{homeText(`vision.point${index}`)}</b></p>)}</div></div></section>

      <section className="news-section" id="news"><div className="news-service-promos">{[1,2].map((index) => <a className="news-promo" href="#services" key={index}><span className="promo-icon">&#10022;</span><span><b>{homeText(`news.promo${index}.title`)}</b><small>{homeText(`news.promo${index}.body`)}</small></span></a>)}</div><div className="container"><div className="news-heading"><p className="eyebrow light">{homeText('news.eyebrow')}</p><h2>{homeText('news.title')}</h2></div><div className="news-grid">{!articleRecords && <HomeSkeletons count={3} height={300}/>}{(articleRecords || []).slice(0, 3).map((post) => <article className="news-card" key={post.id}><Link to={`/${lang}/${(lang === 'fr' ? 'actualites' : 'news')}/${post.slug}`} className="news-image"><img src={apiMediaUrl(post.coverImageUrl)} alt={lang === 'fr' ? post.titleFr : post.titleEn}/><span className="image-hover-wash" aria-hidden="true"/><span>{post.publishedAt ? new Date(post.publishedAt).getDate() : ''}<br/><small>{post.publishedAt ? new Date(post.publishedAt).toLocaleString(lang, { month: 'short' }).toUpperCase() : ''}</small></span></Link><div className="news-content"><p className="meta">{post.category}</p><h3><Link to={`/${lang}/${(lang === 'fr' ? 'actualites' : 'news')}/${post.slug}`}>{lang === 'fr' ? post.titleFr : post.titleEn}</Link></h3><Link className="read-more" to={`/${lang}/${(lang === 'fr' ? 'actualites' : 'news')}/${post.slug}`}>{t('common.readMore')} <span>&rsaquo;</span></Link></div></article>)}</div></div></section>

      <section className="cta-section"><div className="container cta-inner"><Brand light darkImage={homeImage('brand.dark.image', novaTechLogo)} lightImage={homeImage('brand.light.image', novaTechLogoLight)}/><h2>{homeText('cta.title')}</h2><Link className="button button-white" to={'/' + lang + '/' + ((lang === 'fr' ? 'devis' : 'quote'))}>{homeText('nav.quote')}</Link></div></section>

      <footer className="footer" id="footer"><div className="container footer-grid"><div className="footer-about"><Brand light darkImage={homeImage('brand.dark.image', novaTechLogo)} lightImage={homeImage('brand.light.image', novaTechLogoLight)}/><p>{footerValue('text', 'footer.description')}</p><div className="socials">{socialLinks.map((item) => <a key={item.key} href={settings?.[`social.${item.key}`]} target="_blank" rel="noreferrer" aria-label={item.label}>{item.short}</a>)}</div></div><div className="footer-column"><h3>{footerValue('explore', 'footer.explore')}</h3><Link to={`/${lang}/${(lang === 'fr' ? 'a-propos' : 'about')}`}>{homeText('footer.about')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'equipe' : 'team')}`}>{homeText('footer.team')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'actualites' : 'news')}`}>{homeText('footer.news')}</Link><Link to={`/${lang}/${(lang === 'fr' ? 'realisations' : 'projects')}`}>{homeText('footer.projects')}</Link><Link to={contactPath}>{homeText('footer.contact')}</Link>{extraLinks.map((link, index) => <a key={`${link.url}-${index}`} href={link.url} {...(/^https?:/.test(link.url) ? { target: '_blank', rel: 'noreferrer' } : {})}>{lang === 'fr' ? link.labelFr : link.labelEn || link.labelFr}</a>)}</div><div className="footer-column contact-column"><h3>{homeText('footer.contact')}</h3><p>{address}</p>{emailAddress && <Link to={contactPath}>{emailAddress}</Link>}{phone && <a href={phoneHref}>{phone}</a>}{settings?.[`contact.hours.${lang}`]?.trim() && <p className="footer-hours">{settings[`contact.hours.${lang}`]}</p>}</div><div className="footer-column gallery-column"><h3>{homeText('footer.gallery')}</h3><div className="gallery">{galleryImages.map((src, i) => <img src={apiMediaUrl(src)} alt={`NOVA-TECH-SOLUTION ${i + 1}`} key={`${src}-${i}`}/>)}</div></div></div><div className="container copyright">{(settings?.[`footer.copyright.${lang}`]?.trim() || homeText('footer.copyright')).replace('{year}', String(new Date().getFullYear()))}</div></footer>
      <a href="#top" className="back-top" aria-label="Retour en haut">⌃</a>

      {whatsapp && <a className="whatsapp-float" href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8.5c.5 2.8 2.1 4.4 4.9 5l1.1-1.2 2 1c-.1 1.1-.8 1.8-2 1.8-3.7-.2-6.8-3.3-7-7 0-1.2.7-1.9 1.8-2l1 2-1.8.4Z" fill="currentColor"/></svg></a>}
    </main>
  )
}

export default LandingPage
