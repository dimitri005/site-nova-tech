import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'motion/react'
import { useLandingAnimations } from '../animations/useLandingAnimations'
import { getCourses, getServices } from '../data/siteContent'
import { ApiError, apiSend } from '../api/client'
import { useApiData } from '../api/hooks'
import novaTechLogo from '../assets/nova-tech-logo.png'
import novaTechLogoLight from '../assets/nova-tech-logo-light.png'
import '../App.css'
import '../styles/nova-home.css'

const photos = {
  hero: 'https://media.glassdoor.com/l/1570335/signaturit-office.jpg',
  team: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=85',
  office: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
  portrait: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=85',
  creator: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=85',
  podcast: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85',
  gamer: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85',
  meeting: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=85',
  meeting2: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85',
  meeting3: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85',
}

const projects = [
  { image: photos.team, title: 'Ideas that move business forward', type: 'Digital Strategy' },
  { image: photos.creator, title: 'A fresh perspective on creativity', type: 'Web Design' },
  { image: photos.podcast, title: 'Building brands with a voice', type: 'Content Studio' },
  { image: photos.gamer, title: 'Technology made for people', type: 'Product Design' },
]

const posts = [
  { image: photos.meeting, title: '10 strategies to attain your business objectives now.', category: 'Business' },
  { image: photos.meeting2, title: 'Get approaches to achieving your business goals today.', category: 'Technology' },
  { image: photos.meeting3, title: '10 paths to accomplish your business objectives.', category: 'Corporate' },
]

function Brand({ light = false }: { light?: boolean }) {
  return <a className={`brand${light ? ' brand-light' : ''}`} href="#top" aria-label="NOVA-TECH-SOLUTION, accueil"><img className="brand-image brand-image-dark" src={novaTechLogo} alt="NOVA-TECH-SOLUTION — On code votre réussite"/><img className="brand-image brand-image-light" src={novaTechLogoLight} alt="" aria-hidden="true"/></a>
}

function LandingPage() {
  const { lang: routeLang } = useParams()
  const lang = routeLang === 'en' ? 'en' : 'fr'
  const { t, i18n } = useTranslation()
  const { data: settings } = useApiData<Record<string, string>>('/settings/public')
  const pageRef = useRef<HTMLElement>(null)
  const prefersReducedMotion = useReducedMotion()
  useLandingAnimations(pageRef)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Our Vision')
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState('')
  const [sendingContact, setSendingContact] = useState(false)
  const emailAddress = settings?.['contact.email'] || 'contact@novatech.cm'
  const address = settings?.['contact.address'] || (lang === 'fr' ? 'Cameroun' : 'Cameroon')
  const phone = settings?.['contact.phone'] || ''
  const whatsapp = settings?.['social.whatsapp'] || import.meta.env.VITE_WHATSAPP_NUMBER
  const contactPath = `/${lang}/${lang === 'fr' ? 'contact' : 'contact'}`
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : contactPath
  const addressHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`


  const sendContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setContactError('')
    setSendingContact(true)
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      await apiSend('/contact-messages', 'POST', {
        fullName: String(values.get('name') || '').trim(),
        email: String(values.get('email') || '').trim(),
        phone: String(values.get('phone') || '').trim(),
        subject: lang === 'fr' ? 'Message depuis la page d’accueil' : 'Message from the homepage',
        message: String(values.get('message') || '').trim(),
        language: lang,
        consent: values.get('consent') === 'on',
        website: String(values.get('website') || ''),
      })
      setContactSent(true)
      form.reset()
    } catch (reason) {
      setContactError(reason instanceof ApiError ? reason.message : (lang === 'fr' ? 'Message impossible à envoyer pour le moment.' : 'Unable to send your message right now.'))
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
    document.title = lang === 'fr' ? 'NOVA-TECH-SOLUTION — Solutions numériques' : 'NOVA-TECH-SOLUTION — Digital solutions'
  }, [lang])

  return (
    <main id="top" ref={pageRef}>
      <header className="site-header">
        <div className="topbar"><div className="topbar-inner"><Link className="topbar-item" to={contactPath}><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4" width="15" height="12" rx="2"/><path d="m3.5 5 6.5 5 6.5-5"/></svg><span>{emailAddress}</span></Link><a className="topbar-item" href={addressHref} target="_blank" rel="noreferrer"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M16 8.2c0 4.1-6 9.3-6 9.3S4 12.3 4 8.2a6 6 0 1 1 12 0Z"/><circle cx="10" cy="8" r="2"/></svg><span>{address}</span></a><div className="top-links"><a href={phoneHref}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15.5 3.5 17l.6-3.1A6.5 6.5 0 1 1 6 16.2"/><path d="M7 7.3c.5 2.4 2 4 4.5 4.7l1.2-1.2 2 .9c-.1 1.1-.8 1.8-1.8 1.8-3.2-.2-5.8-2.8-6-6 0-1 .7-1.7 1.7-1.8l.9 2-1.1 1.1"/></svg><span>{lang === 'fr' ? 'Assistance' : 'Support'}</span></a><Link to={contactPath}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 4.5h14v11H3zM3.5 5l6.5 5 6.5-5"/><path d="M6 2.5h8"/></svg><span>{lang === 'fr' ? 'Contact' : 'Contact'}</span></Link></div></div></div>
        <nav className="navbar"><Brand light/><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={lang === 'fr' ? 'Ouvrir le menu' : 'Open menu'} aria-expanded={menuOpen}>☰</button><div className={`nav-links${menuOpen ? ' nav-open' : ''}`}><Link className="selected" to={`/${lang}`} onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link><Link to={`/${lang}/${lang === 'fr' ? 'a-propos' : 'about'}`}>{t('nav.about')}</Link><Link to={`/${lang}/services`}>{t('nav.services')}</Link><Link to={`/${lang}/${lang === 'fr' ? 'realisations' : 'projects'}`}>{t('nav.projects')}</Link><Link to={`/${lang}/${lang === 'fr' ? 'formations' : 'training'}`}>{t('nav.training')}</Link><Link to={`/${lang}/${lang === 'fr' ? 'equipe' : 'team'}`}>{t('nav.team')}</Link><Link to={`/${lang}/${lang === 'fr' ? 'contact' : 'contact'}`}>{t('nav.contact')}</Link><span className="home-language"><Link to="/fr" aria-current={lang === 'fr' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('fr'); localStorage.setItem('nova-language', 'fr') }}>FR</Link> / <Link to="/en" aria-current={lang === 'en' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('en'); localStorage.setItem('nova-language', 'en') }}>EN</Link></span></div><div className="nav-actions"><Link className="home-login" to="/admin/login">{lang === 'fr' ? 'Se connecter' : 'Sign in'}</Link><Link className="home-quote" to={'/' + lang + '/' + (lang === 'fr' ? 'devis' : 'quote')}>{t('nav.quote')}</Link></div></nav>
      </header>

      <section className="hero">
        <div className="hero-shape hero-shape-left" /><div className="hero-shape hero-shape-right" />
        <div className="hero-inner"><div className="hero-copy"><button className="play-button" aria-label="Lire la vidéo">▶</button><p className="eyebrow light">{t('home.eyebrow')}</p><h1>{t('home.title')}</h1><svg className="hero-arrow" viewBox="0 0 165 125" fill="none" aria-hidden="true"><path d="M4 105 28 78l20 24 27-48 26 34 37-66" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="m119 28 20-12-1 24" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg><a className="button" href="#about">EXPLORE MORE</a></div><div className="hero-controls"><button aria-label="Diapositive précédente">‹</button><button aria-label="Diapositive suivante">›</button></div></div>
      </section>

      <section className="feature-strip" aria-label="Nos expertises"><div className="feature-inner">{[
        { title: "Solution d'entreprise", icon: <><path d="M10 18V9a6 6 0 1 1 12 0v9"/><path d="M8 18h16v4H8zM12 22v3m4-3v3m4-3v3M12 10a4 4 0 0 0 8 0 4 4 0 0 0-8 0Z"/><path d="M15 8.5h2.2M15 11.5h2.2"/></> },
        { title: 'Planification de la croissance', icon: <><path d="M6 24h22M9 23V14h5v9m3 0V9h5v14m3 0v-7h4v7"/><path d="m8 8 5 3 6-4 6 2 3-4"/><circle cx="9" cy="6" r="3"/><path d="m26 4 2 1-1 3"/></> },
        { title: 'Conseils promotionnels', icon: <><rect x="5" y="4" width="26" height="19" rx="1"/><path d="M12 28h12m-6-5v5m-5 2h10"/></> },
      ].map((feature) => <article className="feature-item" key={feature.title}><span className="feature-icon"><svg viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{feature.icon}</svg></span><div><h2>{feature.title}</h2><p>Lorsqu'un imprimeur inconnu<br className="desktop-break"/> prit un livre de caractères<br className="desktop-break"/> typographiques.</p></div></article>)}</div><div className="feature-rule"/></section>

      <section className="about-section" id="about"><div className="about-grid"><div className="about-visual"><span className="about-accent"/><img className="about-main" src={photos.creator} alt="Un membre de l'équipe travaille dans un bureau lumineux"/><span className="about-orbit"/><img className="about-small" src={photos.office} alt="Espace de travail de l'équipe"/><div className="dots"/></div><div className="about-copy"><p className="eyebrow">À PROPOS DE NOTRE ENTREPRISE</p><h2>Nous mettons en œuvre nos idées de leur conception à leur réalisation.</h2><p className="about-lead">Une approche professionnelle de la technologie au service des clients.</p><p className="muted about-description">Le terme « système » désigne un ensemble organisé de symboles et de processus permettant d'opérer sur ces symboles.</p><div className="about-points"><article><h3><span>›</span> Réseautage interne</h3><p>Lorem ipsum dolor sit amet<br/>consectetur noté</p></article><article><h3><span>›</span> Basé sur le cloud</h3><p>Lorem ipsum dolor sit amet<br/>consectetur noté</p></article></div><div className="satisfaction"><div><b>Clients satisfaits</b><span>80 %</span></div><div className="progress"><span/></div></div><a className="button about-button" href="#services">DÉCOUVRIR NOS SERVICES <span>→</span></a></div></div><div className="about-chevron" aria-hidden="true"><i/><i/><i/></div></section>


      <section className="services-section" id="services"><img className="service-circuit-left" src="/images/circuit-motif.svg" alt="" aria-hidden="true"/><svg className="service-waves" viewBox="0 0 330 360" fill="none" aria-hidden="true">{[0,1,2,3,4,5,6].map((ring)=><path key={ring} d="M350 14 C286 19 263 64 220 80 C169 100 141 68 91 84 C31 103 16 157 57 203 C95 245 113 276 88 370" transform={`translate(${ring*13} ${ring*9})`} stroke="#2354a4" strokeWidth="1.35"/>)}</svg><div className="services-layout"><div className="services-heading"><p className="eyebrow light">{lang === 'fr' ? 'CE QUE NOUS PROPOSONS' : 'WHAT WE OFFER'}</p><h2>{lang === 'fr' ? 'Nos cinq pôles d’expertise' : 'Our five areas of expertise'}</h2></div>{getServices().map((service, i) => <motion.article className="service-card" key={service.slug} whileHover={prefersReducedMotion ? undefined : { y: -5, transition: { duration: 0.2 } }} whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}><span className="service-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{[
        <><path d="M12 30 25 13a8 8 0 0 1 13 2l3 5a5 5 0 0 1-6 7l-6-2-9 12-5-1 3-9-6 5-3-2 3-7Z"/><circle cx="31" cy="19" r="3"/><path d="m14 31-3 9 8-4m-4-4 7 4"/></>,
        <><rect x="7" y="9" width="34" height="25" rx="2"/><path d="M7 29h34M18 40h12m-6-6v6"/><path d="m21 23 6-7 4 3 5-7m-1 0h-4m4 0v4"/><circle cx="16" cy="16" r="2"/></>,
        <><path d="M24 5 28 8l5-1 2 5 5 2-1 6 3 4-3 5 1 5-5 3-2 5-6-1-4 4-5-3-5 1-2-5-5-2 1-6-4-4 3-5-1-5 5-3 2-5 6 1 4-4Z"/><circle cx="24" cy="23" r="9"/><circle cx="24" cy="21" r="3"/><path d="M19 30c1-4 9-4 10 0"/></>,
        <><path d="M8 39h33M12 37V24h6v13m4 0V15h6v22m4 0V21h6v16"/><circle cx="17" cy="12" r="6"/><path d="m17 9 2 3-2 3m14-12 1 4 4 1-4 2-1 4-2-4-4-2 4-1 2-4Z"/><path d="m30 13 4-3 3 1"/></>,
        <><rect x="14" y="8" width="27" height="20" rx="2"/><path d="M18 13h19m-19 5h13m-13 5h17M9 25v10m0 0c-3 0-4 2-4 5v3m4-8c3 0 4 2 4 5v3m-4-8v8"/><circle cx="9" cy="19" r="4"/></>,
        <><path d="M7 12h34v24H7zM7 9h34v4H7zM13 31h6v-9h-6zm10 0h6V19h-6zm10 0h5V16h-5z"/><path d="m15 26 5-4 5 2 6-7 4 2"/><path d="m30 19 1-3 4 1"/></>,
        <><path d="M18 31h12l-2 5H20l-2-5Z"/><path d="M19 31c0-5-7-8-7-15a12 12 0 0 1 24 0c0 7-7 10-7 15"/><path d="M20 39h8m-7 4h6M24 10v13m-4-4 4 4 4-4"/><circle cx="24" cy="15" r="2"/></>,
      ][i]}</svg></span><strong>0{i + 1}</strong><h3>{lang === 'fr' ? service.title.fr : service.title.en}</h3></motion.article>)}</div></section>


      <section className="projects-section" id="projects"><div className="container"><div className="section-heading"><div><p className="eyebrow">{t('home.projectsEyebrow')}</p><h2>{t('home.projects')}</h2></div><p className="muted">{t('home.projectsIntro')}</p></div><div className="project-grid">{projects.map((project, i) => <a href="#contact" className="project-card" key={project.title}><img src={project.image} alt={project.title} /><span className="image-hover-wash" aria-hidden="true"/><span className="project-overlay"><small>{project.type}</small><strong>{project.title}</strong><b>↗</b></span><span className="project-number">0{i + 1}</span></a>)}</div></div></section>

      <section className="home-training-preview"><div className="container"><div className="home-training-heading"><div><p className="eyebrow">{lang === 'fr' ? 'APPRENDRE EN PRÉSENTIEL' : 'LEARN IN PERSON'}</p><h2>{t('home.training')}</h2><p>{t('home.trainingIntro')}</p></div><Link className="button" to={`/${lang}/${lang === 'fr' ? 'formations' : 'training'}`}>{t('common.viewAll')} <span>→</span></Link></div><div className="home-training-grid">{getCourses().map((course, index) => <Link className="home-training-card" to={`/${lang}/${lang === 'fr' ? 'formations' : 'training'}/${course.slug}`} key={course.slug}><span>0{index + 1}</span><h3>{lang === 'fr' ? course.title.fr : course.title.en}</h3><p>{lang === 'fr' ? course.duration.fr : course.duration.en}</p><b>{t('common.learn')} →</b></Link>)}</div><p className="home-session-note">{lang === 'fr' ? 'Les dates et places des prochaines sessions sont à confirmer avec notre équipe.' : 'Upcoming session dates and availability can be confirmed with our team.'}</p></div></section>

      <section className="testimonial-section"><svg className="story-circuit" viewBox="0 0 300 390" fill="none" aria-hidden="true"><g stroke="#dfe2e8" strokeWidth="1"><path d="M34 0v155l45 45v190M53 0v145l46 46v199M72 0v135l48 45v210M92 50v76l44 43v221"/><path d="M34 155h19m26 45h20m19-20h18m-57 53h20m-17 29h20m-20 32h20m-20 32h20"/></g><g fill="#bfc5d0"><circle cx="34" cy="155" r="2"/><circle cx="79" cy="200" r="2"/><circle cx="120" cy="180" r="2"/><circle cx="99" cy="191" r="2"/><circle cx="136" cy="169" r="2"/></g></svg><div className="container testimonial-grid"><div className="testimonial-copy"><h2>About Company</h2><svg className="quote-mark" viewBox="0 0 65 43" fill="none" aria-hidden="true"><path d="M22 5C11 5 5 12 5 22c0 7 4 12 10 12 6 0 10-5 10-11 0-5-3-8-8-9 2-4 5-6 10-7M50 5C39 5 33 12 33 22c0 7 4 12 10 12 6 0 10-5 10-11 0-5-3-8-8-9 2-4 5-6 10-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg><div className="stars">★★★★★</div><p className="quote">We believe in four pillars of influence that drive our growth. This is ingrained in everything we do. We use technology to create a better and smarter environment.</p><b>Mike Hardson</b><small className="role">SENIOR DESIGNER</small><div className="slider-dots"><span/><span/><span/></div></div><div className="testimonial-photo"><img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85" alt="Portrait d'un membre de l'équipe"/><span className="avatar avatar-one"><img src={photos.team} alt="Portrait d'un collègue"/></span><span className="avatar avatar-two"><img src={photos.portrait} alt="Portrait d'une collègue"/></span><svg className="profile-circuit" viewBox="0 0 330 240" fill="none" aria-hidden="true"><g stroke="#2f6dbc" strokeWidth="1.3"><path d="M0 24h72l18 18h54l20-20h48l23 23h95M0 60h54l20 18h49l20-20h60l22 22h125M0 98h90l20 20h50l22-22h78l18 18h73M0 138h64l25 24h60l20-20h70l22 22h90M0 180h96l21 18h47l21-21h75l22 22h69"/></g><g fill="#235daf"><circle cx="290" cy="45" r="3"/><circle cx="310" cy="80" r="3"/><circle cx="278" cy="118" r="3"/><circle cx="285" cy="164" r="3"/><circle cx="303" cy="199" r="3"/></g></svg></div></div><div className="video-row"><div className="video-note"><span>Watch our video</span><svg viewBox="0 0 100 54" fill="none" aria-hidden="true"><path d="M5 7c8 28 35 34 48 25 10-8-1-18-10-12-15 10 5 34 41 24" stroke="#ff9d13" strokeWidth="2" strokeLinecap="round"/><path d="m76 36 11 8 10-12" stroke="#ff9d13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div><button className="video-cover" aria-label="Lire la vidéo de présentation"><span className="video-play">▶</span><img src={photos.meeting} alt="Réunion d'équipe autour d'une table connectée"/><span className="image-hover-wash" aria-hidden="true"/><span className="video-glow"/></button></div></section>

      <section className="success-section"><div className="container success-grid"><div className="success-copy"><p className="eyebrow light">WELCOME TO TECH</p><h2>{t('home.missionTitle')}</h2>{[t('home.missionOne'), t('home.missionTwo'), t('home.missionThree')].map((text, i) => <div className="success-point" key={text}><span>0{i + 1}</span><p>{text}</p></div>)}</div><img className="success-image" src={photos.meeting} alt="Équipe en collaboration dans une salle moderne" /></div></section>
      <section className="why-section"><div className="why-inner"><div className="why-visual"><span className="why-word">NOVA</span><img className="why-photo-one" src={photos.office} alt="Intérieur d'un bureau moderne"/><img className="why-photo-two" src={photos.meeting2} alt="Équipe réunie au bureau"/><span className="why-emblem">N</span><span className="why-photo-line"/></div><div className="why-copy"><p className="eyebrow">{lang === 'fr' ? 'POURQUOI NOUS CHOISIR' : 'WHY CHOOSE US'}</p><h2>{t('home.whyTitle')}</h2><p className="muted">With Nova-Tech-Solution, we’ve decided on passages of lorem free market need available, but the majority have alteration in some form, by injected humour, or randomised words.</p><blockquote>We possess over 35 years of expertise in Digital Agency Services solutions in town.</blockquote><div className="why-actions"><a className="button" href="#contact">DISCOVER MORE</a><div className="founder"><img src={photos.portrait} alt="Jon Martin, cofondateur"/><span><b>Jon Martin</b><small>Co Founder</small></span></div></div></div><svg className="why-circuit" viewBox="0 0 170 420" fill="none" aria-hidden="true"><g stroke="#d7e2ff" strokeWidth="1"><path d="M30 0v130l30 30v260M48 0v116l32 32v272M67 0v104l34 34v282M86 0v90l36 34v296M105 20v58l34 34v308M124 0v90l27 28v302"/><path d="M30 130h18m12 30h20m1-12h20m4-14h17m0-8h15"/></g><g fill="#8fb0ff"><circle cx="30" cy="130" r="2"/><circle cx="80" cy="148" r="2"/><circle cx="101" cy="138" r="2"/><circle cx="122" cy="124" r="2"/><circle cx="139" cy="112" r="2"/></g></svg></div></section>

      <section className="mission-section"><div className="mission-dark"><div className="mission-stats">{[
        { icon: <><path d="M10 30h31M12 29v-9h5v9m4 0V14h5v15m4 0V9h5v20"/><path d="M5 22h8l5 5h10l7-6-5-2-5 2H20l-3-3h7l3 2m-13-5v-8h13v8"/><path d="M28 13h11V5"/></>, number: '4524', label: 'PROJECT COMPLETE' },
        { icon: <><path d="M9 38h30M13 37v-8a11 11 0 0 1 22 0v8"/><circle cx="24" cy="14" r="8"/><path d="m18 14 3 3 8-8"/></>, number: '1500', label: 'HAPPY CLIENTS' },
        { icon: <><circle cx="24" cy="12" r="7"/><path d="M12 38v-5a12 12 0 0 1 24 0v5M4 38h40M8 33H3v8h8v-8zm29 0h8v8h-8zM24 19v8m-7-4h14"/></>, number: '2500', label: 'AWWORD WINGING' },
        { icon: <><circle cx="24" cy="24" r="12"/><circle cx="24" cy="24" r="7"/><path d="M22 20h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4m-2-11v14"/><circle cx="24" cy="5" r="3"/><circle cx="43" cy="14" r="3"/><circle cx="43" cy="34" r="3"/><circle cx="24" cy="43" r="3"/><circle cx="5" cy="34" r="3"/><circle cx="5" cy="14" r="3"/></>, number: '1000', label: 'COMPANY TEAM' },
      ].map((item) => <article className="mission-stat" key={item.label}><span className="mission-stat-icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{item.icon}</svg></span><strong>{item.number}</strong><small>{item.label}</small></article>)}</div><div className="mission-tabs">{['Our Mission','Our Vision','Our History'].map((tab) => <button key={tab} className={`mission-tab${activeTab === tab ? ' is-active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div></div><div className="mission-light"><svg className="mission-dots" viewBox="0 0 1897 390" preserveAspectRatio="none" aria-hidden="true">{Array.from({length:18},(_,i)=><path key={i} d={`M-20 ${70+i*12} C 210 ${-55+i*15}, 330 ${235+i*8}, 610 ${115+i*11} S 940 ${65+i*11}, 1160 ${230+i*8} S 1470 ${270+i*5}, 1920 ${40+i*13}`} fill="none" stroke="#dfe2eb" strokeWidth="1" strokeDasharray="1 6"/>)}</svg><div className="mission-card"><div className="mission-benefits"><article className="mission-benefit"><span className="mission-benefit-icon"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><circle cx="20" cy="14" r="8"/><path d="M17 12h5a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h5m-3-12v16M13 27h14v5H13zM15 32v3m4-3v3m4-3v3m4-3v3M8 35h24"/></svg></span><div><h3>Best Business Solution</h3><p>Lorem ipsum dolor sit consectetur<br/>adipiscing elit ullamcorper.</p></div></article><article className="mission-benefit"><span className="mission-benefit-icon"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"><path d="m10 25 13-16a7 7 0 0 1 12 4l-4 5-5-1-7 10-5-1 2-7-4 5-3-1 1-4Z"/><circle cx="29" cy="13" r="2.5"/><path d="m13 25-2 9 7-4m-4-4 6 3"/></svg></span><div><h3>Highest Customer Value</h3><p>Lorem ipsum dolor sit consectetur<br/>adipiscing elit ullamcorper.</p></div></article></div><div className="mission-experience"><span className="mini-rule"/><h3>We Have<br/>Over 24<br/>Years Of<br/>Experience</h3><a href="#about">READ MORE <span>›</span></a></div><div className="mission-photo"><img src={photos.meeting2} alt="Équipe réunie dans un bureau lumineux"/><span className="image-hover-wash" aria-hidden="true"/><span className="mission-photo-badge"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 32h8l6 5h10l9-8-5-3-8 3H22l-3-4h8l4 2m-17 5v-9h12m5-6v-9h5v9m-11 0v-6h4v6m7 0h6v-5"/><path d="m28 12 3-3 3 2"/></svg></span></div></div></div></section>
      <section className="contact-vision" id="contact"><div className="contact-vision-inner"><form className="contact-form" onSubmit={(event) => void sendContact(event)}>
          <p className="eyebrow">{lang === 'fr' ? 'CONTACTEZ-NOUS' : 'CONTACT US'}</p>
          <h2>{lang === 'fr' ? 'Parlons de votre projet' : 'Tell us about your project'}</h2>
          <input type="text" name="name" placeholder={lang === 'fr' ? 'Votre nom complet' : 'Your full name'} aria-label={lang === 'fr' ? 'Votre nom complet' : 'Your full name'} autoComplete="name" required/>
          <input type="email" name="email" placeholder={lang === 'fr' ? 'Adresse e-mail' : 'Email address'} aria-label={lang === 'fr' ? 'Adresse e-mail' : 'Email address'} autoComplete="email" required/>
          <input type="tel" name="phone" placeholder={lang === 'fr' ? 'Téléphone (facultatif)' : 'Phone (optional)'} aria-label={lang === 'fr' ? 'Téléphone' : 'Phone'} autoComplete="tel"/>
          <textarea name="message" placeholder={lang === 'fr' ? 'Décrivez votre besoin' : 'Tell us what you need'} aria-label={lang === 'fr' ? 'Votre message' : 'Your message'} rows={4} minLength={10} required/>
          <input className="contact-honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
          <label className="contact-consent"><input type="checkbox" name="consent" required/><span>{lang === 'fr' ? 'J’accepte que mes informations soient utilisées pour répondre à ma demande.' : 'I agree that my information may be used to respond to my request.'}</span></label>
          <button className="button" type="submit" disabled={sendingContact}>{sendingContact ? (lang === 'fr' ? 'Envoi en cours…' : 'Sending…') : (lang === 'fr' ? 'Envoyer le message' : 'Send message')} <span>→</span></button>
          {contactError && <p className="form-error" role="alert">{contactError}</p>}
          {contactSent && <p className="form-success" role="status">{lang === 'fr' ? 'Merci, votre message a bien été envoyé.' : 'Thank you. Your message has been sent.'}</p>}
        </form><img className="vision-portrait" src={photos.portrait} alt="Portrait d'un membre de l'équipe NOVA-TECH-SOLUTION"/><div className="vision-copy"><p className="eyebrow">GET TO KNOW</p><h2>Keep your Vision<br/>to Our Projects</h2>{['Business Solutions','IT Consulting','Digital Transformation'].map((item) => <p className="vision-check" key={item}><span>✓</span><b>{item}</b></p>)}</div></div></section>

      <section className="news-section" id="news"><div className="news-service-promos"><a className="news-promo" href="#services"><svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M25 5 30 9l7-1 2 7 6 3-2 7 3 6-5 5-1 7-7 1-4 6-7-4-7 2-3-7-7-3 2-7-4-6 5-5 1-7 7-1 4-7Z"/><circle cx="25" cy="26" r="10"/><circle cx="25" cy="23" r="3"/><path d="M19 34c1-5 11-5 12 0"/></svg><span><b>End to End Development</b><small>There are many variations of available</small></span></a><a className="news-promo" href="#services"><svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="25" cy="14" r="7"/><path d="M13 39v-6a12 12 0 0 1 24 0v6M7 40h36M17 13h-5m26 0h-5M18 23l-6 5m20-5 6 5"/><path d="M8 28v8m34-8v8"/></svg><span><b>Software IT Outsourcing</b><small>There are many variations of available</small></span></a></div><div className="container"><div className="news-heading"><p className="eyebrow light">{lang === 'fr' ? 'CONSEILS ET ACTUALITÉS' : 'INSIGHTS AND UPDATES'}</p><h2>{t('home.news')}</h2></div><div className="news-grid">{posts.map((post) => <article className="news-card" key={post.title}><a href="#contact" className="news-image"><img src={post.image} alt="Équipe au travail"/><span className="image-hover-wash" aria-hidden="true"/><span>28<br/><small>OCT</small></span></a><div className="news-content"><p className="meta">♟ By Admin　 ◆ {post.category}</p><h3><a href="#contact">{post.title}</a></h3><a className="read-more" href="#contact">READ MORE <span>→</span><small>◌ 05</small></a></div></article>)}</div></div></section>

      <section className="cta-section"><div className="container cta-inner"><Brand light/><h2>{t('home.cta')}</h2><Link className="button button-white" to={'/' + lang + '/' + (lang === 'fr' ? 'devis' : 'quote')}>{t('nav.quote')}</Link></div></section>

      <footer className="footer" id="footer"><div className="container footer-grid"><div className="footer-about"><Brand light/><p>{lang === 'fr' ? 'Nous concevons des solutions numériques et transmettons les compétences qui font grandir les projets.' : 'We build digital solutions and share the skills that help projects grow.'}</p><div className="socials"><a href="#top">𝕏</a><a href="#top">f</a><a href="#top">◎</a><a href="#top">◉</a></div></div><div className="footer-column"><h3>Explore</h3><a href="#about">About Company</a><a href="#about">Meet the Team</a><a href="#news">News &amp; Media</a><a href="#projects">Our Projects</a><a href="#contact">Contact</a></div><div className="footer-column contact-column"><h3>Contact</h3><p>{address}</p><Link to={contactPath}>✉ &nbsp;{emailAddress}</Link>{phone && <a href={`tel:${phone}`}>☎ &nbsp;{phone}</a>}</div><div className="footer-column gallery-column"><h3>Gallery</h3><div className="gallery">{[photos.team, photos.meeting2, photos.creator, photos.office, photos.meeting, photos.meeting3].map((src, i) => <img src={src} alt={`Galerie NOVA-TECH-SOLUTION ${i + 1}`} key={src}/>)}</div><div className="subscribe"><p>{lang === 'fr' ? 'Newsletter temporairement suspendue.' : 'Newsletter temporarily paused.'}</p></div></div></div><div className="container copyright">© Copyright reserved by NOVA-TECH-SOLUTION. Made with care.</div></footer>
      <a href="#top" className="back-top" aria-label="Retour en haut">⌃</a>

      <a className="whatsapp-float" href={whatsapp ? `https://wa.me/${whatsapp}` : `/${lang}/contact#contact`} aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8.5c.5 2.8 2.1 4.4 4.9 5l1.1-1.2 2 1c-.1 1.1-.8 1.8-2 1.8-3.7-.2-6.8-3.3-7-7 0-1.2.7-1.9 1.8-2l1 2-1.8.4Z" fill="currentColor"/></svg></a>
    </main>
  )
}

export default LandingPage
