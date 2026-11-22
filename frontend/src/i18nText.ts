import i18n from './i18n'

/** Texte traduit avec valeur par défaut intégrée ; modifiable depuis l'administration (rubrique « Textes du site »). */
export function tr(lang: string, key: string, fr: string, en: string): string {
  const locale = lang === 'en' ? 'en' : 'fr'
  return i18n.t(key, { lng: locale, defaultValue: locale === 'en' ? en : fr })
}
