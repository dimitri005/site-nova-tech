import { SkeletonCards, SkeletonLines } from '../components/Skeleton'

type ApiStateProps = {
  /** Forme du squelette affiché pendant le chargement. */
  skeleton?: 'cards' | 'text'
  loading: boolean
  error: string
  onRetry?: () => void
}

export function ApiState({ loading, error, onRetry, skeleton = 'cards' }: ApiStateProps) {
  if (loading) return skeleton === 'text' ? <SkeletonLines rows={6}/> : <SkeletonCards count={3}/>
  if (error) {
    return (
      <div className="api-state api-error" role="alert">
        <span>{error}</span>
        {onRetry && <button className="text-action" onClick={onRetry}>Réessayer</button>}
      </div>
    )
  }
  return null
}
