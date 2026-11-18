export interface ApiEnvelope<T> {
  data: T
  message?: string
}

export interface AdminSession {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresAt: string
  refreshExpiresAt: string
  userId: string
  email: string
  displayName: string
  roles: string[]
}

export class ApiError extends Error {
  readonly status: number
  readonly fields: Record<string, string>

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fields = fields
  }
}

const ACCESS_TOKEN_KEY = 'nova-api-access'
const REFRESH_TOKEN_KEY = 'nova-api-refresh'
const SESSION_KEY = 'nova-api-user'
const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1').replace(/\/$/, '')
let refreshInFlight: Promise<AdminSession | null> | null = null

function readJson<T>(value: string | null, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

export function getStoredSession(): AdminSession | null {
  return readJson<AdminSession | null>(sessionStorage.getItem(SESSION_KEY), null)
}

export function isAuthenticated(): boolean {
  return Boolean(sessionStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY))
}

function saveSession(session: AdminSession) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
  sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event('nova:auth-changed'))
}

export function clearSession() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  window.dispatchEvent(new Event('nova:auth-changed'))
}

function endpoint(path: string) {
  return `${baseUrl}/${path.replace(/^\/+/, '')}`
}

async function rawRequest(path: string, init: RequestInit = {}, allowRefresh = true): Promise<Response> {
  const headers = new Headers(init.headers)
  const isForm = init.body instanceof FormData
  if (init.body !== undefined && !isForm && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY)
  if (accessToken && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(endpoint(path), { ...init, headers })
  if (response.status === 401 && allowRefresh && !path.startsWith('/auth/') && sessionStorage.getItem(REFRESH_TOKEN_KEY)) {
    const refreshed = await refreshSession()
    if (refreshed) return rawRequest(path, init, false)
    clearSession()
    window.dispatchEvent(new Event('nova:auth-expired'))
  }
  return response
}

async function errorFrom(response: Response): Promise<ApiError> {
  const body = await response.json().catch(() => null) as { message?: string; fields?: Record<string, string> } | null
  return new ApiError(body?.message ?? `Erreur serveur (${response.status}).`, response.status, body?.fields ?? {})
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await rawRequest(path, init)
  if (!response.ok) throw await errorFrom(response)
  if (response.status === 204) return undefined as T
  const payload = await response.json() as ApiEnvelope<T> | T
  return payload && typeof payload === 'object' && 'data' in payload
    ? (payload as ApiEnvelope<T>).data
    : payload as T
}

export function apiGet<T>(path: string, signal?: AbortSignal) {
  return apiRequest<T>(path, { method: 'GET', signal })
}

export function apiSend<T>(path: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: unknown) {
  return apiRequest<T>(path, { method, ...(body === undefined ? {} : { body: body instanceof FormData ? body : JSON.stringify(body) }) })
}

export async function apiDownload(path: string, filename: string) {
  const response = await rawRequest(path)
  if (!response.ok) throw await errorFrom(response)
  const url = URL.createObjectURL(await response.blob())
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function login(email: string, password: string) {
  const session = await apiRequest<AdminSession>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
  saveSession(session)
  return session
}

export async function refreshSession(): Promise<AdminSession | null> {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
  if (!refreshToken) return null
  refreshInFlight ??= fetch(endpoint('/auth/refresh'), {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refreshToken }),
    }).then(async (response) => {
      if (!response.ok) return null
      const payload = await response.json() as ApiEnvelope<AdminSession> | AdminSession
      const session = payload && typeof payload === 'object' && 'data' in payload ? payload.data : payload as AdminSession
      saveSession(session)
      return session
    }).catch(() => null).finally(() => { refreshInFlight = null })
  return refreshInFlight
}

export async function logout() {
  const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY)
  try {
    if (refreshToken) await apiSend('/auth/logout', 'POST', { refreshToken })
  } finally {
    clearSession()
  }
}

export function apiMediaUrl(path?: string | null) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const origin = baseUrl.replace(/\/api\/v1$/, '')
  return `${origin}/${path.replace(/^\/+/, '')}`
}
