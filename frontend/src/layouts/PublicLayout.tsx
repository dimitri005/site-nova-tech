import { useMemo } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import darkLogo from '../assets/nova-tech-logo.png'
import lightLogo from '../assets/nova-tech-logo-light.png'
import { getSiteSettings } from '../config/siteSettings'

type Locale = 'fr' | 'en'
type PageKey = 'home' | 'about' | 'services' | 'projects' | 'training' | 'team' | 'news' | 'contact' | 'quote' | 'legal' | 'privacy'

const paths: Record<Locale, Record<PageKey, string>> = {
  fr: { home: '/fr', about: '/fr/a-propos', services: '/fr/services', projects: '/fr/realisations', training: '/fr/formations', team: '/fr/equipe', news: '/fr/actualites', contact: '/fr/contact', quote: '/fr/devis', legal: '/fr/mentions-legales', privacy: '/fr/confidentialite' },
  en: { home: '/en', about: '/en/about', services: '/en/services', projects: '/en/projects', training: '/en/training', team: '/en/team', news: '/en/news', contact: '/en/contact', quote: '/en/quote', legal: '/en/legal-notice', privacy: '/en/privacy' },
}

const nav: PageKey[] = ['home', 'about', 'services', 'projects', 'training', 'team', 'news', 'contact']

function getLanguagePath(pathname: string, target: Locale) {
  const pieces = pathname.split('/').filter(Boolean)
  const source = pieces.shift() as Locale | undefined
  const sourcePaths = source === 'en' ? paths.en : paths.fr
  const targetPaths = paths[target]
  const page = (Object.keys(sourcePaths) as PageKey[]).find((key) => sourcePaths[key] === `/${source}/${pieces[0] ?? ''}` || (key === 'home' && pieces.length === 0))
  if (page && pieces.length <= 1) return targetPaths[page]
  const section = pieces[0]
  const aliases: Record<string, PageKey> = { 'a-propos': 'about', about: 'about', services: 'services', realisations: 'projects', projects: 'projects', formations: 'training', training: 'training', equipe: 'team', team: 'team', actualites: 'news', news: 'news', contact: 'contact', devis: 'quote', quote: 'quote', 'mentions-legales': 'legal', 'legal-notice': 'legal', confidentialite: 'privacy', privacy: 'privacy' }
  const key = section ? aliases[section] : 'home'
  return key ? `${targetPaths[key]}${pieces.length > 1 ? `/${pieces.slice(1).join('/')}` : ''}` : targetPaths.home
}

export function publicPath(lang: Locale, page: PageKey, slug?: string) {
  return slug ? `${paths[lang][page]}/${slug}` : paths[lang][page]
}

export function PublicLayout({ lang, children }: { lang: Locale; children: ReactNode }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const settings = useMemo(getSiteSettings, [])
  const email = settings.email || ''
  const address = settings.address || (lang === 'fr' ? 'Cameroun' : 'Cameroon')
  const whatsapp = settings.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER
  const whatsappHref = useMemo(() => whatsapp ? `https://wa.me/${whatsapp}` : `${paths[lang].contact}#contact-form`, [lang, whatsapp])

  return <div className="public-site">
    <div className="public-topbar"><div className="public-shell"><span>{lang === 'fr' ? 'Solutions numériques · Cameroun' : 'Digital solutions · Cameroon'}</span><span>{email ? <a href={`mailto:${email}`}>{email}</a> : (lang === 'fr' ? 'E-mail à configurer' : 'Email to be configured')}<span className="public-top-separator">·</span>{address}</span></div></div>
    <header className="public-header"><div className="public-shell public-nav"><Link to={paths[lang].home} className="public-brand" aria-label="NOVA-TECH-SOLUTION"><img src={darkLogo} alt="NOVA-TECH-SOLUTION — On code votre réussite"/></Link><nav aria-label={lang === 'fr' ? 'Navigation principale' : 'Main navigation'}>{nav.map((page) => <Link key={page} to={paths[lang][page]} className={location.pathname === paths[lang][page] ? 'is-active' : ''}>{t(`nav.${page}`)}</Link>)}</nav><div className="public-nav-actions"><Link className="public-quote-link" to={paths[lang].quote}>{t('nav.quote')}</Link><div className="public-language" aria-label="Language"><Link to={getLanguagePath(location.pathname, 'fr')} aria-current={lang === 'fr' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('fr'); localStorage.setItem('nova-language', 'fr') }}>FR</Link><span>/</span><Link to={getLanguagePath(location.pathname, 'en')} aria-current={lang === 'en' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('en'); localStorage.setItem('nova-language', 'en') }}>EN</Link></div></div></div></header>
    <main>{children}</main>
    <footer className="public-footer"><div className="public-shell public-footer-grid"><div><Link to={paths[lang].home} className="public-brand public-brand-light"><img src={lightLogo} alt="NOVA-TECH-SOLUTION"/></Link><p>{lang === 'fr' ? 'Nous concevons des solutions numériques et transmettons les compétences qui font grandir les projets.' : 'We build digital solutions and share the skills that help projects grow.'}</p>{email && <a className="footer-email" href={`mailto:${email}`}>{email}</a>}</div><div><h2>{lang === 'fr' ? 'Explorer' : 'Explore'}</h2>{(['about','services','projects','training','team'] as PageKey[]).map((page) => <Link key={page} to={paths[lang][page]}>{t(`nav.${page}`)}</Link>)}</div><div><h2>{t('nav.contact')}</h2><Link to={paths[lang].contact}>{lang === 'fr' ? 'Écrivez-nous pour vos projets' : 'Get in touch about your project'}</Link><Link to={paths[lang].quote}>{t('nav.quote')}</Link><a href={whatsappHref} target={whatsapp ? '_blank' : undefined} rel={whatsapp ? 'noreferrer' : undefined}>WhatsApp</a><Link to={paths[lang].news}>{t('nav.news')}</Link></div><div><h2>{lang === 'fr' ? 'Informations' : 'Information'}</h2><Link to={paths[lang].legal}>{t('pages.legal')}</Link><Link to={paths[lang].privacy}>{t('pages.privacy')}</Link><Link to="/admin/login">{t('nav.admin')}</Link></div></div><div className="public-shell public-footer-bottom"><span>© {new Date().getFullYear()} NOVA-TECH-SOLUTION</span><span>{address}</span></div></footer>
    <a href={whatsappHref} className="whatsapp-float" aria-label="WhatsApp" target={whatsapp ? '_blank' : undefined} rel={whatsapp ? 'noreferrer' : undefined}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8.5c.5 2.8 2.1 4.4 4.9 5l1.1-1.2 2 1c-.1 1.1-.8 1.8-2 1.8-3.7-.2-6.8-3.3-7-7 0-1.2.7-1.9 1.8-2l1 2-1.8.4Z" fill="currentColor"/></svg></a>
  </div>
}
