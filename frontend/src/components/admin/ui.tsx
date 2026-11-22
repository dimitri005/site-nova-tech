import type { ReactNode } from 'react'
import { STATUS } from './format'
import type { Tone } from './format'


export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function StatusBadge({ value }: { value: string }) {
  const item = STATUS[value]
  return <Badge tone={item?.tone ?? 'neutral'}>{item?.label ?? value}</Badge>
}

export function BoolBadge({ value, yes = 'Oui', no = 'Non' }: { value: boolean; yes?: string; no?: string }) {
  return <Badge tone={value ? 'success' : 'neutral'}>{value ? yes : no}</Badge>
}

export function TableSkeleton({ rows = 6, columns = 5 }: { rows?: number; columns?: number }) {
  return <div className="table-skeleton" role="status" aria-label="Chargement des données">
    {Array.from({ length: rows }, (_, row) => <div className="table-skeleton-row" key={row} aria-hidden="true">
      {Array.from({ length: columns }, (_, column) => <span className="skeleton skeleton-line" key={column} style={{ width: `${column === 0 ? 70 : 45 + ((row + column) * 13) % 45}%` }}/>)}
    </div>)}
  </div>
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return <div className="admin-empty-state">
    <span aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M4 7h16v12H4V7Zm0 0 2-3h12l2 3M9 12h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
    <strong>{title}</strong>{text && <p>{text}</p>}{action}
  </div>
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: string; title: string; description?: string; actions?: ReactNode }) {
  return <div className="admin-page-heading">
    <div>{eyebrow && <p className="eyebrow">{eyebrow} <i/></p>}<h1>{title}</h1>{description && <p>{description}</p>}</div>
    {actions && <div className="admin-page-actions">{actions}</div>}
  </div>
}
