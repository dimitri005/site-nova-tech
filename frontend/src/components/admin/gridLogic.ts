export type CellValue = string | number | boolean | null | undefined
export type ColumnType = 'text' | 'select' | 'boolean' | 'date' | 'number'
export type Option = { value: string; label: string }

export type GridColumn<T> = {
  key: string
  header: string
  value: (row: T) => CellValue
  render?: (row: T) => import('react').ReactNode
  type?: ColumnType
  options?: Option[]
  filterable?: boolean
  sortable?: boolean
  /** Masquée par défaut (affichable via « Colonnes »). */
  hidden?: boolean
  primary?: boolean
  booleanLabels?: [string, string]
}

export type TextOp = 'contains' | 'notContains' | 'equals' | 'startsWith' | 'empty' | 'notEmpty'
export type FilterValue =
  | { type: 'text'; op: TextOp; v: string }
  | { type: 'select'; in: string[] }
  | { type: 'boolean'; v: 'yes' | 'no' }
  | { type: 'date'; from?: string; to?: string }
  | { type: 'number'; min?: string; max?: string }
export type Filters = Record<string, FilterValue>
export type SortState = { key: string; dir: 'asc' | 'desc' } | null

export const TEXT_OPS: { value: TextOp; label: string }[] = [
  { value: 'contains', label: 'contient' }, { value: 'notContains', label: 'ne contient pas' }, { value: 'equals', label: 'est égal à' },
  { value: 'startsWith', label: 'commence par' }, { value: 'empty', label: 'est vide' }, { value: 'notEmpty', label: 'n’est pas vide' },
]

const fold = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const asDay = (value: CellValue) => { const date = new Date(String(value ?? '')); return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10) }

/** Recherche multi-termes : mots (ET), "phrase exacte" et -exclusion, insensible aux accents. */
export function parseSearch(input: string) {
  const include: string[] = []
  const exclude: string[] = []
  for (const match of input.matchAll(/(-?)"([^"]+)"|(-?)(\S+)/g)) {
    const negative = (match[1] || match[3]) === '-'
    const term = fold(match[2] ?? match[4])
    if (term) (negative ? exclude : include).push(term)
  }
  return { include, exclude }
}

export function matchesSearch<T>(row: T, columns: GridColumn<T>[], search: string) {
  const { include, exclude } = parseSearch(search)
  if (!include.length && !exclude.length) return true
  const haystack = fold(columns.map((column) => column.value(row)).join(' | '))
  return include.every((term) => haystack.includes(term)) && !exclude.some((term) => haystack.includes(term))
}

export function matchesFilter(raw: CellValue, filter: FilterValue): boolean {
  switch (filter.type) {
    case 'text': {
      const value = fold(raw); const needle = fold(filter.v)
      if (filter.op === 'empty') return value === ''
      if (filter.op === 'notEmpty') return value !== ''
      if (!needle) return true
      if (filter.op === 'equals') return value === needle
      if (filter.op === 'startsWith') return value.startsWith(needle)
      if (filter.op === 'notContains') return !value.includes(needle)
      return value.includes(needle)
    }
    case 'select': return filter.in.length === 0 || filter.in.includes(String(raw ?? ''))
    case 'boolean': return filter.v === 'yes' ? raw === true : raw !== true
    case 'date': { const day = asDay(raw); if (!filter.from && !filter.to) return true; if (!day) return false; return (!filter.from || day >= filter.from) && (!filter.to || day <= filter.to) }
    case 'number': {
      if (filter.min === undefined && filter.max === undefined) return true
      if (raw === null || raw === undefined || raw === '') return false
      const n = Number(raw)
      return (filter.min === undefined || filter.min === '' || n >= Number(filter.min)) && (filter.max === undefined || filter.max === '' || n <= Number(filter.max))
    }
  }
}

export function isActive(filter: FilterValue): boolean {
  switch (filter.type) {
    case 'text': return filter.op === 'empty' || filter.op === 'notEmpty' || filter.v.trim() !== ''
    case 'select': return filter.in.length > 0
    case 'boolean': return true
    case 'date': return Boolean(filter.from || filter.to)
    case 'number': return Boolean(filter.min || filter.max)
  }
}

export function compareValues(a: CellValue, b: CellValue, type: ColumnType = 'text') {
  const empty = (v: CellValue) => v === null || v === undefined || v === ''
  if (empty(a) || empty(b)) return empty(a) === empty(b) ? 0 : empty(a) ? 1 : -1
  if (type === 'number') return Number(a) - Number(b)
  if (type === 'date') return new Date(String(a)).getTime() - new Date(String(b)).getTime()
  if (type === 'boolean') return Number(Boolean(a)) - Number(Boolean(b))
  return String(a).localeCompare(String(b), 'fr', { numeric: true, sensitivity: 'base' })
}

export function describeFilter<T>(column: GridColumn<T>, filter: FilterValue, options: Option[]): string {
  switch (filter.type) {
    case 'text': return `${column.header} ${TEXT_OPS.find((op) => op.value === filter.op)?.label ?? ''} ${filter.op === 'empty' || filter.op === 'notEmpty' ? '' : `« ${filter.v} »`}`.trim()
    case 'select': return `${column.header} : ${filter.in.map((value) => options.find((option) => option.value === value)?.label ?? value).join(', ')}`
    case 'boolean': return `${column.header} : ${filter.v === 'yes' ? (column.booleanLabels?.[0] ?? 'Oui') : (column.booleanLabels?.[1] ?? 'Non')}`
    case 'date': return `${column.header} : ${filter.from ? `du ${filter.from}` : ''} ${filter.to ? `au ${filter.to}` : ''}`.trim()
    case 'number': return `${column.header} : ${filter.min ? `≥ ${filter.min}` : ''} ${filter.max ? `≤ ${filter.max}` : ''}`.trim()
  }
}

export function toCsv<T>(rows: T[], columns: GridColumn<T>[]) {
  const escape = (value: CellValue) => { const text = value === null || value === undefined ? '' : typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value); return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text }
  const lines = [columns.map((column) => escape(column.header)).join(';'), ...rows.map((row) => columns.map((column) => escape(column.value(row))).join(';'))]
  return '﻿' + lines.join('\r\n')
}

export function downloadCsv(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url; link.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`; link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export type SavedView = { name: string; search: string; filters: Filters; sort: SortState; pageSize: number; hiddenColumns: string[] }
export function readViews(id: string): SavedView[] { try { const parsed: unknown = JSON.parse(localStorage.getItem(`nova-grid:${id}`) || '[]'); return Array.isArray(parsed) ? parsed as SavedView[] : [] } catch { return [] } }
export function writeViews(id: string, views: SavedView[]) { try { localStorage.setItem(`nova-grid:${id}`, JSON.stringify(views)) } catch { /* stockage indisponible */ } }
