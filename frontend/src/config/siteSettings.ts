export interface SiteSettings {
  company?: string
  email?: string
  address?: string
  whatsapp?: string
  footer?: string
}

export function getSiteSettings(): SiteSettings {
  try {
    return JSON.parse(localStorage.getItem('nova-admin-settings') || '{}') as SiteSettings
  } catch {
    return {}
  }
}de