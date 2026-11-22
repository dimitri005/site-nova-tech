export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

export const STATUS: Record<string, { label: string; tone: Tone }> = {
  NEW: { label: 'Nouveau', tone: 'info' }, READ: { label: 'Lu', tone: 'neutral' }, IN_PROGRESS: { label: 'En cours', tone: 'warning' },
  ACCEPTED: { label: 'Accepté', tone: 'success' }, REJECTED: { label: 'Refusé', tone: 'danger' }, RESOLVED: { label: 'Traité', tone: 'success' },
  PENDING: { label: 'En attente', tone: 'warning' }, CONFIRMED: { label: 'Confirmé', tone: 'success' }, CANCELLED: { label: 'Annulé', tone: 'danger' },
  OPEN: { label: 'Ouverte', tone: 'success' }, FULL: { label: 'Complète', tone: 'warning' }, CLOSED: { label: 'Fermée', tone: 'neutral' }, COMPLETED: { label: 'Terminée', tone: 'info' },
  DRAFT: { label: 'Brouillon', tone: 'warning' }, PUBLISHED: { label: 'Publié', tone: 'success' },
  SUPER_ADMIN: { label: 'Super administrateur', tone: 'info' }, EDITOR: { label: 'Éditeur', tone: 'neutral' },
}

export function statusLabel(value: string) { return STATUS[value]?.label ?? value }
export const statusOptions = (values: string[]) => values.map((value) => ({ value, label: statusLabel(value) }))

export function formatDate(value?: string | null, withTime = false) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('fr-FR', withTime ? { dateStyle: 'medium', timeStyle: 'short' } : { dateStyle: 'medium' })
}
