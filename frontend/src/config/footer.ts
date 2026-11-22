export type FooterLink = { labelFr: string; labelEn: string; url: string }
export function parseFooterLinks(raw?: string): FooterLink[] {
  try {
    const parsed: unknown = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed.filter((item): item is FooterLink => typeof item?.url === 'string' && typeof item?.labelFr === 'string') : []
  } catch { return [] }
}

export const SOCIAL_NETWORKS = [
  { key: 'facebook', label: 'Facebook', short: 'f' }, { key: 'instagram', label: 'Instagram', short: 'ig' }, { key: 'linkedin', label: 'LinkedIn', short: 'in' },
  { key: 'youtube', label: 'YouTube', short: 'yt' }, { key: 'x', label: 'X', short: 'x' }, { key: 'tiktok', label: 'TikTok', short: 'tt' },
]
