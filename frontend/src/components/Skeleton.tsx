import '../styles/skeleton.css'

export function SkeletonLines({ rows = 5, title = true }: { rows?: number; title?: boolean }) {
  return <div className="sk-lines" role="status" aria-label="Chargement en cours">
    {title && <span className="skeleton sk-title"/>}
    {Array.from({ length: rows }, (_, index) => <span key={index} className="skeleton" style={{ width: `${index === rows - 1 ? 60 : 100 - ((index * 7) % 18)}%` }}/>)}
  </div>
}

export function SkeletonCards({ count = 6 }: { count?: number }) {
  return <div className="sk-grid" role="status" aria-label="Chargement en cours">
    {Array.from({ length: count }, (_, index) => <div className="sk-card" key={index} aria-hidden="true"><span className="skeleton sk-image"/><span className="skeleton"/><span className="skeleton"/><span className="skeleton"/></div>)}
  </div>
}

export function SkeletonForm({ fields = 8 }: { fields?: number }) {
  return <div className="admin-panel sk-form" role="status" aria-label="Chargement du formulaire">
    <span className="skeleton sk-title"/>
    <div className="sk-form-row">{Array.from({ length: fields }, (_, index) => <div className="sk-field" key={index}><span className="skeleton"/><span className="skeleton"/></div>)}</div>
  </div>
}

/** Page entière (chargement d'une route) : barre de navigation, bandeau et cartes. */
export function PageSkeleton() {
  return <div className="sk-page" role="status" aria-label="Chargement de la page">
    <div className="sk-page-bar" aria-hidden="true"><span className="skeleton"/><span className="skeleton"/></div>
    <div className="sk-page-hero" aria-hidden="true"><span className="skeleton"/><span className="skeleton"/><span className="skeleton"/></div>
    <div className="sk-page-body" aria-hidden="true"><SkeletonCards count={3}/></div>
  </div>
}

/** Cases de remplissage pour les grilles de l'accueil pendant le chargement des données. */
export function HomeSkeletons({ count, height = 240 }: { count: number; height?: number }) {
  return <>{Array.from({ length: count }, (_, index) => <span className="skeleton home-skeleton" key={index} style={{ minHeight: height }} role="status" aria-label="Chargement en cours"/>)}</>
}

/** Squelette du bloc d'analyses du tableau de bord (indicateurs et graphiques). */
export function AnalyticsSkeleton() {
  return <div className="analytics-skeleton" role="status" aria-label="Chargement des analyses">
    <div className="kpi-grid">{Array.from({ length: 4 }, (_, index) => <span className="skeleton" key={index} style={{ height: 128 }}/>)}</div>
    <span className="skeleton" style={{ height: 340 }}/>
    <div className="chart-grid"><span className="skeleton" style={{ height: 300 }}/><span className="skeleton" style={{ height: 300 }}/></div>
  </div>
}
