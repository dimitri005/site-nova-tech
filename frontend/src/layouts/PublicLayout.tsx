import { useMemo, useRef } from 'react'
import { tr } from '../i18nText'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import darkLogo from '../assets/nova-tech-logo.png'
import lightLogo from '../assets/nova-tech-logo-light.png'
import { usePageAnimations } from '../animations/usePageAnimations'
import { useApiData } from '../api/hooks'
import type { PublicLocale, PublicPageKey } from '../config/publicRoutes'
import { parseFooterLinks, SOCIAL_NETWORKS } from '../config/footer'

type Locale = PublicLocale
type PageKey = PublicPageKey

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

export function PublicLayout({ lang, children }: { lang: Locale; children: ReactNode }) {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const pageScope = useRef<HTMLDivElement>(null)
  usePageAnimations(pageScope, location.pathname)
  const { data: values } = useApiData<Record<string, string>>('/settings/public')
  const setting = (key: string) => values?.[key]?.trim() || ''
  const localized = (key: string, fallback: string) => values?.[`${key}.${lang}`]?.trim() || fallback
  const enabled = (key: string) => setting(key) !== 'false'
  const optIn = (key: string) => setting(key) === 'true'
  const email = setting('contact.email')
  const phone = setting('contact.phone')
  const address = values?.[`contact.address.${lang}`]?.trim() || setting('contact.address') || tr(lang, 'ui.layout.cameroun', 'Cameroun', 'Cameroon')
  const hours = localized('contact.hours', '')
  const whatsapp = setting('social.whatsapp') || import.meta.env.VITE_WHATSAPP_NUMBER
  const footerText = localized('footer.text', tr(lang, 'ui.layout.nous-concevons-des-solutions-numerique', 'Nous concevons des solutions numériques et transmettons les compétences qui font grandir les projets.', 'We build digital solutions and share the skills that help projects grow.'))
  const copyright = localized('footer.copyright', '© {year} NOVA-TECH-SOLUTION').replace('{year}', String(new Date().getFullYear()))
  const socials = SOCIAL_NETWORKS.filter((item) => setting(`social.${item.key}`))
  const extraLinks = useMemo(() => parseFooterLinks(values?.['footer.links']), [values])
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}` : ''
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : ''

  return <div className="public-site" ref={pageScope}>
    {enabled('topbar.visible') && <div className="public-topbar"><div className="public-shell"><span>{localized('topbar.text', tr(lang, 'ui.layout.solutions-numeriques-cameroun', 'Solutions numériques · Cameroun', 'Digital solutions · Cameroon'))}</span><span>{email && <a href={`mailto:${email}`}>{email}</a>}{email && phone && <span className="public-top-separator">·</span>}{phone && <a href={phoneHref}>{phone}</a>}{(email || phone) && <span className="public-top-separator">·</span>}{address}</span></div></div>}
    <header className="public-header"><div className="public-shell public-nav"><Link to={paths[lang].home} className="public-brand" aria-label="NOVA-TECH-SOLUTION"><img src={darkLogo} alt="NOVA-TECH-SOLUTION — On code votre réussite"/></Link><nav aria-label={tr(lang, 'ui.layout.navigation-principale', 'Navigation principale', 'Main navigation')}>{nav.map((page) => <Link key={page} to={paths[lang][page]} className={location.pathname === paths[lang][page] ? 'is-active' : ''}>{t(`nav.${page}`)}</Link>)}</nav><div className="public-nav-actions">{optIn('header.show-login') && <Link className="public-account-link" to="/admin/login">{localized('header.login-label', tr(lang, 'ui.layout.se-connecter', 'Se connecter', 'Sign in'))}</Link>}<Link className="public-quote-link" to={paths[lang].quote}>{t('nav.quote')}</Link><div className="public-language" aria-label="Language"><Link to={getLanguagePath(location.pathname, 'fr')} aria-current={lang === 'fr' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('fr'); localStorage.setItem('nova-language', 'fr') }}>FR</Link><span>/</span><Link to={getLanguagePath(location.pathname, 'en')} aria-current={lang === 'en' ? 'page' : undefined} onClick={() => { void i18n.changeLanguage('en'); localStorage.setItem('nova-language', 'en') }}>EN</Link></div></div></div></header>
    <main className="public-page-content">{children}</main>
    <footer className="public-footer"><div className="public-shell public-footer-grid">
      <div><Link to={paths[lang].home} className="public-brand public-brand-light"><img src={lightLogo} alt="NOVA-TECH-SOLUTION"/></Link><p>{footerText}</p>{email && <Link className="footer-email" to={paths[lang].contact}>{email}</Link>}{socials.length > 0 && <div className="public-socials">{socials.map((item) => <a key={item.key} href={setting(`social.${item.key}`)} target="_blank" rel="noreferrer" aria-label={item.label}>{item.short}</a>)}</div>}</div>
      <div><h2>{localized('footer.explore', tr(lang, 'ui.layout.explorer', 'Explorer', 'Explore'))}</h2>{(['about','services','projects','training','team'] as PageKey[]).map((page) => <Link key={page} to={paths[lang][page]}>{t(`nav.${page}`)}</Link>)}</div>
      <div><h2>{t('nav.contact')}</h2><Link to={paths[lang].contact}>{localized('footer.contact-cta', tr(lang, 'ui.layout.ecrivez-nous-pour-vos-projets', 'Écrivez-nous pour vos projets', 'Get in touch about your project'))}</Link><Link to={paths[lang].quote}>{t('nav.quote')}</Link>{whatsapp && <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>}<Link to={paths[lang].news}>{t('nav.news')}</Link>{phone && <a href={phoneHref}>{phone}</a>}{hours && <span className="footer-hours">{hours}</span>}</div>
      <div><h2>{localized('footer.info', tr(lang, 'ui.layout.informations', 'Informations', 'Information'))}</h2><Link to={paths[lang].legal}>{t('pages.legal')}</Link><Link to={paths[lang].privacy}>{t('pages.privacy')}</Link>{extraLinks.map((link, index) => <a key={`${link.url}-${index}`} href={link.url} {...(/^https?:/.test(link.url) ? { target: '_blank', rel: 'noreferrer' } : {})}>{lang === 'fr' ? link.labelFr : link.labelEn || link.labelFr}</a>)}{optIn('footer.show-admin-link') && <Link to="/admin/login">{t('nav.admin')}</Link>}</div>
    </div><div className="public-shell public-footer-bottom"><span>{copyright}</span></div></footer>
    {whatsapp && <a href={whatsappHref} className="whatsapp-float" aria-label="WhatsApp" target="_blank" rel="noreferrer"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.7a8 8 0 0 1-11.8 7L4 20l1.3-4A8 8 0 1 1 20 11.7Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 8.5c.5 2.8 2.1 4.4 4.9 5l1.1-1.2 2 1c-.1 1.1-.8 1.8-2 1.8-3.7-.2-6.8-3.3-7-7 0-1.2.7-1.9 1.8-2l1 2-1.8.4Z" fill="currentColor"/></svg></a>}
  </div>
}
