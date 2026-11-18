export type PublicLocale = 'fr' | 'en'
export type PublicPageKey = 'home' | 'about' | 'services' | 'projects' | 'training' | 'team' | 'news' | 'contact' | 'quote' | 'legal' | 'privacy'

const paths: Record<PublicLocale, Record<PublicPageKey, string>> = {
  fr: { home: '/fr', about: '/fr/a-propos', services: '/fr/services', projects: '/fr/realisations', training: '/fr/formations', team: '/fr/equipe', news: '/fr/actualites', contact: '/fr/contact', quote: '/fr/devis', legal: '/fr/mentions-legales', privacy: '/fr/confidentialite' },
  en: { home: '/en', about: '/en/about', services: '/en/services', projects: '/en/projects', training: '/en/training', team: '/en/team', news: '/en/news', contact: '/en/contact', quote: '/en/quote', legal: '/en/legal-notice', privacy: '/en/privacy' },
}

export function publicPath(lang: PublicLocale, page: PublicPageKey, slug?: string) {
  return slug ? `${paths[lang][page]}/${slug}` : paths[lang][page]
}
