import { useCallback, useEffect, useState } from 'react'
import { ApiError, apiGet } from './client'

type ApiDataState<T> = {
  requestKey: string | null
  data: T | null
  error: string
  loading: boolean
}

export function useApiData<T>(path: string | null) {
  const [revision, setRevision] = useState(0)
  const requestKey = path === null ? null : JSON.stringify([path, revision])
  const [state, setState] = useState<ApiDataState<T>>({
    requestKey: null,
    data: null,
    error: '',
    loading: false,
  })

  useEffect(() => {
    if (path === null || requestKey === null) return

    const controller = new AbortController()
    apiGet<T>(path, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) {
          setState({ requestKey, data: result, error: '', loading: false })
        }
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setState({
            requestKey,
            data: null,
            error: reason instanceof ApiError ? reason.message : 'Impossible de joindre le serveur.',
            loading: false,
          })
        }
      })

    return () => controller.abort()
  }, [path, requestKey])

  const reload = useCallback(() => setRevision((value) => value + 1), [])
  const stateMatchesRequest = state.requestKey === requestKey

  return {
    data: stateMatchesRequest ? state.data : null,
    loading: path !== null && (!stateMatchesRequest || state.loading),
    error: stateMatchesRequest ? state.error : '',
    reload,
  }
}
