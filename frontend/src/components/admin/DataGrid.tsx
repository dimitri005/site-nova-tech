import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { EmptyState, TableSkeleton } from './ui'
import { compareValues, describeFilter, downloadCsv, isActive, matchesFilter, matchesSearch, readViews, TEXT_OPS, toCsv, writeViews } from './gridLogic'
import type { Filters, FilterValue, GridColumn, Option, SavedView, SortState, TextOp } from './gridLogic'

type DataGridProps<T> = {
  id: string
  rows: T[]
  columns: GridColumn<T>[]
  rowKey: (row: T) => string
  loading?: boolean
  rowActions?: (row: T) => ReactNode
  searchPlaceholder?: string
  noun?: [string, string]
  emptyTitle?: string
  emptyText?: string
  emptyAction?: ReactNode
  exportName?: string
  defaultSort?: SortState
  pageSizes?: number[]
  /** Contrôles propres à la page (ex. choix de la formation). */
  toolbar?: ReactNode
}

const iconSearch = <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>

export function DataGrid<T>({ id, rows, columns, rowKey, loading, rowActions, searchPlaceholder = 'Rechercher…', noun = ['élément', 'éléments'], emptyTitle = 'Aucun résultat', emptyText, emptyAction, exportName, defaultSort = null, pageSizes = [10, 25, 50, 100], toolbar }: DataGridProps<T>) {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<Filters>({})
  const [sort, setSort] = useState<SortState>(defaultSort)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizes[0])
  const [hiddenColumns, setHiddenColumns] = useState<string[]>(() => columns.filter((column) => column.hidden).map((column) => column.key))
  const [panel, setPanel] = useState<'filters' | 'columns' | 'views' | null>(null)
  const [views, setViews] = useState<SavedView[]>(() => readViews(id))
  const [viewName, setViewName] = useState('')
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (panel !== 'columns' && panel !== 'views') return
    const close = (event: MouseEvent) => { if (!toolbarRef.current?.contains(event.target as Node)) setPanel(null) }
    const esc = (event: KeyboardEvent) => { if (event.key === 'Escape') setPanel(null) }
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [panel])

  const optionsFor = useMemo(() => {
    const map: Record<string, Option[]> = {}
    for (const column of columns) {
      if (column.type !== 'select') continue
      map[column.key] = column.options ?? [...new Set(rows.map((row) => String(column.value(row) ?? '')).filter(Boolean))].sort().map((value) => ({ value, label: value }))
    }
    return map
  }, [columns, rows])

  const visibleColumns = columns.filter((column) => !hiddenColumns.includes(column.key))
  const activeFilters = Object.entries(filters).filter(([, filter]) => isActive(filter))

  const filtered = useMemo(() => rows.filter((row) => matchesSearch(row, columns, search)
    && activeFilters.every(([key, filter]) => { const column = columns.find((item) => item.key === key); return column ? matchesFilter(column.value(row), filter) : true })),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [rows, columns, search, filters])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const column = columns.find((item) => item.key === sort.key)
    if (!column) return filtered
    const factor = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => factor * compareValues(column.value(a), column.value(b), column.type))
  }, [filtered, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const current = Math.min(page, pageCount)
  const pageRows = sorted.slice((current - 1) * pageSize, current * pageSize)
  const from = sorted.length === 0 ? 0 : (current - 1) * pageSize + 1
  const to = Math.min(current * pageSize, sorted.length)
  const reset = () => setPage(1)

  const setFilter = (key: string, filter: FilterValue | null) => { setFilters((currentFilters) => { const next = { ...currentFilters }; if (filter) next[key] = filter; else delete next[key]; return next }); reset() }
  const toggleSort = (key: string) => setSort((s) => (!s || s.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null))
  const clearAll = () => { setFilters({}); setSearch(''); reset() }
  const filterCount = activeFilters.length + (search.trim() ? 1 : 0)

  const saveView = () => {
    const name = viewName.trim(); if (!name) return
    const next = [...views.filter((view) => view.name !== name), { name, search, filters, sort, pageSize, hiddenColumns }]
    setViews(next); writeViews(id, next); setViewName('')
  }
  const applyView = (view: SavedView) => { setSearch(view.search); setFilters(view.filters); setSort(view.sort); setPageSize(view.pageSize); setHiddenColumns(view.hiddenColumns); setPage(1); setPanel(null) }
  const removeView = (name: string) => { const next = views.filter((view) => view.name !== name); setViews(next); writeViews(id, next) }

  const pageNumbers = useMemo(() => {
    const set = new Set([1, pageCount, current - 1, current, current + 1].filter((n) => n >= 1 && n <= pageCount))
    const list = [...set].sort((a, b) => a - b)
    return list.flatMap((n, index) => (index > 0 && n - list[index - 1] > 1 ? ['…', n] : [n]))
  }, [current, pageCount])

  const noun1 = rows.length === 1 ? noun[0] : noun[1]
  return <section className="admin-panel data-grid" aria-label="Liste">
    <div className="admin-toolbar" ref={toolbarRef}>
      <label className="admin-search">{iconSearch}<span className="sr-only">Rechercher</span>
        <input type="search" value={search} onChange={(event) => { setSearch(event.target.value); reset() }} placeholder={searchPlaceholder} title={'Astuces : plusieurs mots (ET), "phrase exacte", -exclure'}/></label>
      <button type="button" className={`tool-button${panel === 'filters' ? ' is-open' : ''}`} aria-expanded={panel === 'filters'} onClick={() => setPanel(panel === 'filters' ? null : 'filters')}>
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>Filtres avancés{filterCount > 0 && <span className="tool-count">{filterCount}</span>}</button>
      <div className="tool-menu"><button type="button" className="tool-button" aria-expanded={panel === 'columns'} onClick={() => setPanel(panel === 'columns' ? null : 'columns')}>Colonnes</button>
        {panel === 'columns' && <div className="tool-popover" role="menu">{columns.map((column) => <label key={column.key} className="check-row"><input type="checkbox" checked={!hiddenColumns.includes(column.key)} disabled={!hiddenColumns.includes(column.key) && visibleColumns.length <= 1}
          onChange={(event) => setHiddenColumns((list) => (event.target.checked ? list.filter((key) => key !== column.key) : [...list, column.key]))}/>{column.header}</label>)}</div>}</div>
      <div className="tool-menu"><button type="button" className="tool-button" aria-expanded={panel === 'views'} onClick={() => setPanel(panel === 'views' ? null : 'views')}>Vues{views.length > 0 && <span className="tool-count">{views.length}</span>}</button>
        {panel === 'views' && <div className="tool-popover tool-popover-wide">
          <p className="popover-title">Enregistrer la vue actuelle</p>
          <div className="view-save"><input value={viewName} onChange={(event) => setViewName(event.target.value)} placeholder="Nom de la vue" maxLength={40} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); saveView() } }}/><button type="button" className="secondary-action" disabled={!viewName.trim()} onClick={saveView}>Enregistrer</button></div>
          {views.length === 0 ? <p className="popover-empty">Aucune vue enregistrée.</p> : <ul className="view-list">{views.map((view) => <li key={view.name}><button type="button" onClick={() => applyView(view)}>{view.name}</button><button type="button" className="view-remove" aria-label={`Supprimer la vue ${view.name}`} onClick={() => removeView(view.name)}>×</button></li>)}</ul>}
        </div>}</div>
      {exportName && <button type="button" className="tool-button" disabled={sorted.length === 0} onClick={() => downloadCsv(exportName, toCsv(sorted, visibleColumns))}>Exporter CSV</button>}
      <span className="admin-count">{loading ? '…' : `${sorted.length} ${sorted.length === 1 ? noun[0] : noun[1]}${sorted.length !== rows.length ? ` sur ${rows.length}` : ''}`}</span>
      {toolbar && <div className="admin-toolbar-extra">{toolbar}</div>}
    </div>

    {panel === 'filters' && <div className="filter-panel">
      <div className="filter-grid">{columns.filter((column) => column.filterable !== false).map((column) => <FilterControl key={column.key} column={column} filter={filters[column.key]} options={optionsFor[column.key] ?? []} onChange={(filter) => setFilter(column.key, filter)}/>)}</div>
      <div className="filter-actions"><span>Recherche : plusieurs mots (ET), <code>"phrase exacte"</code>, <code>-exclure</code></span><button type="button" className="secondary-action" disabled={filterCount === 0} onClick={clearAll}>Réinitialiser</button></div>
    </div>}

    {(activeFilters.length > 0 || search.trim()) && <div className="filter-chips" aria-label="Filtres actifs">
      {search.trim() && <span className="chip">Recherche : « {search.trim()} »<button type="button" aria-label="Retirer la recherche" onClick={() => { setSearch(''); reset() }}>×</button></span>}
      {activeFilters.map(([key, filter]) => { const column = columns.find((item) => item.key === key); return column ? <span className="chip" key={key}>{describeFilter(column, filter, optionsFor[key] ?? [])}<button type="button" aria-label={`Retirer le filtre ${column.header}`} onClick={() => setFilter(key, null)}>×</button></span> : null })}
      <button type="button" className="chip-clear" onClick={clearAll}>Tout effacer</button>
    </div>}

    {loading && rows.length === 0 ? <TableSkeleton columns={Math.min(visibleColumns.length + 1, 6)}/> : sorted.length === 0
      ? <EmptyState title={filterCount > 0 ? 'Aucun résultat' : emptyTitle} text={filterCount > 0 ? 'Aucun élément ne correspond à vos critères. Modifiez ou réinitialisez les filtres.' : emptyText} action={filterCount > 0 ? <button type="button" className="secondary-action" onClick={clearAll}>Réinitialiser les filtres</button> : emptyAction}/>
      : <div className="admin-table-wrap"><table className="data-table"><thead><tr>
        {visibleColumns.map((column) => { const direction = sort?.key === column.key ? sort.dir : undefined; return <th key={column.key} aria-sort={direction ? (direction === 'asc' ? 'ascending' : 'descending') : undefined}>
          {column.sortable === false ? column.header : <button type="button" className={`th-sort${direction ? ' is-sorted' : ''}`} onClick={() => toggleSort(column.key)}>{column.header}<span aria-hidden="true">{direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}</span></button>}</th> })}
        {rowActions && <th className="col-actions">Actions</th>}</tr></thead>
        <tbody>{pageRows.map((row) => <tr key={rowKey(row)}>{visibleColumns.map((column) => <td key={column.key} className={column.primary ? 'cell-primary' : undefined}>{column.render ? column.render(row) : (() => { const value = column.value(row); return value === null || value === undefined || value === '' ? '—' : typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value) })()}</td>)}
          {rowActions && <td className="table-actions">{rowActions(row)}</td>}</tr>)}</tbody></table></div>}

    {sorted.length > 0 && <nav className="pagination" aria-label="Pagination">
      <span className="pagination-info">{from}–{to} sur {sorted.length} {noun1 && sorted.length === 1 ? noun[0] : noun[1]}</span>
      <label className="pagination-size">Lignes par page<select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); reset() }}>{pageSizes.map((size) => <option key={size} value={size}>{size}</option>)}</select></label>
      <div className="pagination-pages">
        <button type="button" onClick={() => setPage(1)} disabled={current === 1} aria-label="Première page">«</button>
        <button type="button" onClick={() => setPage(current - 1)} disabled={current === 1} aria-label="Page précédente">‹</button>
        {pageNumbers.map((item, index) => item === '…' ? <span key={`gap-${index}`} className="pagination-gap">…</span> : <button type="button" key={item} className={item === current ? 'is-current' : ''} aria-current={item === current ? 'page' : undefined} onClick={() => setPage(Number(item))}>{item}</button>)}
        <button type="button" onClick={() => setPage(current + 1)} disabled={current === pageCount} aria-label="Page suivante">›</button>
        <button type="button" onClick={() => setPage(pageCount)} disabled={current === pageCount} aria-label="Dernière page">»</button>
      </div>
    </nav>}
  </section>
}

function FilterControl<T>({ column, filter, options, onChange }: { column: GridColumn<T>; filter?: FilterValue; options: Option[]; onChange: (filter: FilterValue | null) => void }) {
  const type = column.type ?? 'text'
  const id = `flt-${column.key}`
  if (type === 'select') {
    const selected = filter?.type === 'select' ? filter.in : []
    return <fieldset className="filter-field"><legend>{column.header}</legend><div className="filter-options">{options.map((option) => <label key={option.value} className="check-row"><input type="checkbox" checked={selected.includes(option.value)}
      onChange={(event) => { const next = event.target.checked ? [...selected, option.value] : selected.filter((value) => value !== option.value); onChange(next.length ? { type: 'select', in: next } : null) }}/>{option.label}</label>)}</div></fieldset>
  }
  if (type === 'boolean') {
    const value = filter?.type === 'boolean' ? filter.v : ''
    const labels = column.booleanLabels ?? ['Oui', 'Non']
    return <div className="filter-field"><label htmlFor={id}>{column.header}</label><select id={id} value={value} onChange={(event) => onChange(event.target.value ? { type: 'boolean', v: event.target.value as 'yes' | 'no' } : null)}><option value="">Tous</option><option value="yes">{labels[0]}</option><option value="no">{labels[1]}</option></select></div>
  }
  if (type === 'date') {
    const f = filter?.type === 'date' ? filter : { type: 'date' as const }
    const update = (patch: { from?: string; to?: string }) => { const next = { ...f, ...patch }; onChange(next.from || next.to ? { type: 'date', from: next.from || undefined, to: next.to || undefined } : null) }
    return <div className="filter-field"><span className="filter-label">{column.header}</span><div className="filter-range"><input type="date" aria-label={`${column.header} — du`} value={f.from ?? ''} onChange={(event) => update({ from: event.target.value })}/><span>→</span><input type="date" aria-label={`${column.header} — au`} value={f.to ?? ''} onChange={(event) => update({ to: event.target.value })}/></div></div>
  }
  if (type === 'number') {
    const f = filter?.type === 'number' ? filter : { type: 'number' as const }
    const update = (patch: { min?: string; max?: string }) => { const next = { ...f, ...patch }; onChange(next.min || next.max ? { type: 'number', min: next.min || undefined, max: next.max || undefined } : null) }
    return <div className="filter-field"><span className="filter-label">{column.header}</span><div className="filter-range"><input type="number" placeholder="Min" aria-label={`${column.header} — minimum`} value={f.min ?? ''} onChange={(event) => update({ min: event.target.value })}/><span>→</span><input type="number" placeholder="Max" aria-label={`${column.header} — maximum`} value={f.max ?? ''} onChange={(event) => update({ max: event.target.value })}/></div></div>
  }
  const f = filter?.type === 'text' ? filter : { type: 'text' as const, op: 'contains' as TextOp, v: '' }
  const needsValue = f.op !== 'empty' && f.op !== 'notEmpty'
  return <div className="filter-field"><label htmlFor={id}>{column.header}</label><div className="filter-text">
    <select aria-label={`${column.header} — condition`} value={f.op} onChange={(event) => { const op = event.target.value as TextOp; onChange(op === 'empty' || op === 'notEmpty' || f.v ? { type: 'text', op, v: f.v } : null) }}>{TEXT_OPS.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}</select>
    {needsValue && <input id={id} value={f.v} onChange={(event) => onChange(event.target.value ? { type: 'text', op: f.op, v: event.target.value } : null)} placeholder="Valeur"/>}
  </div></div>
}
