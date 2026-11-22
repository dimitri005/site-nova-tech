/** Palette catégorielle validée (ordre fixe) — voir la méthode dataviz. Les 3 premiers emplacements restent distincts pour les daltoniens. */
export const SERIES = {
  blue: '#3372b7',
  orange: '#eb6834',
  aqua: '#1baf7a',
  yellow: '#eda100',
  magenta: '#e87ba4',
  green: '#008300',
} as const
export const CATEGORICAL = [SERIES.blue, SERIES.orange, SERIES.aqua, SERIES.yellow, SERIES.magenta, SERIES.green]

export const INK = { primary: '#17233b', secondary: '#52617a', muted: '#8391a8' }
export const SURFACE = '#ffffff'
export const GRID = '#e8edf5'

export const nf = new Intl.NumberFormat('fr-FR')
export const compact = (value: number) => (value >= 10000 ? `${Math.round(value / 1000)} k` : nf.format(value))
export const shortDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
export const longDate = (iso: string) => new Date(iso).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })

export function delta(current: number, previous: number): { pct: number | null; direction: 'up' | 'down' | 'flat' } {
  if (previous === 0) return { pct: current === 0 ? 0 : null, direction: current === 0 ? 'flat' : 'up' }
  const pct = Math.round(((current - previous) / previous) * 100)
  return { pct, direction: pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat' }
}
