import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '')

const resources = {
  fr: { translation: {
    nav: { home: 'Accueil', about: 'À propos', services: 'Services', projects: 'Réalisations', training: 'Formations', team: 'Équipe', news: 'Actualités', contact: 'Contact', quote: 'Demander un devis', admin: 'Administration' },
    common: { learn: 'En savoir plus', viewAll: 'Voir tout', readMore: 'Lire la suite', all: 'Toutes', search: 'Rechercher', },
    pages: { about: 'À propos', services: 'Nos services', projects: 'Nos réalisations', training: 'Nos formations', team: 'Notre équipe', contact: 'Contactez-nous', blog: 'Actualités', legal: 'Mentions légales', privacy: 'Politique de confidentialité', quote: 'Demander un devis', notFound: 'Page introuvable' },
    admin: { noData: 'Aucune donnée pour le moment', },
  } },
  en: { translation: {
    nav: { home: 'Home', about: 'About', services: 'Services', projects: 'Projects', training: 'Training', team: 'Team', news: 'News', contact: 'Contact', quote: 'Request a quote', admin: 'Admin' },
    common: { learn: 'Learn more', viewAll: 'View all', readMore: 'Read more', all: 'All', search: 'Search', },
    pages: { about: 'About us', services: 'Our services', projects: 'Our projects', training: 'Our training', team: 'Our team', contact: 'Contact us', blog: 'News', legal: 'Legal notice', privacy: 'Privacy policy', quote: 'Request a quote', notFound: 'Page not found' },
    admin: { noData: 'No data yet', },
  } },
}

const initialLanguage = localStorage.getItem('nova-language') === 'en' ? 'en' : 'fr'

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
  react: { bindI18nStore: 'added' },
})

async function loadCatalog(locale: 'fr' | 'en') {
  try {
    const response = await fetch(`${apiBaseUrl}/i18n/${locale}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    })
    if (!response.ok) return

    const payload = await response.json() as { data?: unknown }
    if (!payload.data || typeof payload.data !== 'object' || Array.isArray(payload.data)) return
    i18n.addResourceBundle(locale, 'translation', payload.data, true, true)
  } catch {
    // Keep the bundled catalog when the backend is unavailable.
  }
}

void Promise.all([loadCatalog('fr'), loadCatalog('en')])

export default i18n
