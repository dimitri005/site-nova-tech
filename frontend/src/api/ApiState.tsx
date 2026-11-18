type ApiStateProps = {
  loading: boolean
  error: string
  onRetry?: () => void
}

export function ApiState({ loading, error, onRetry }: ApiStateProps) {
  if (loading) return <p className="api-state" role="status">Chargement…</p>
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
