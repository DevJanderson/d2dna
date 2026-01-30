import type { H3Event } from 'h3'

const API_BASE_URL = 'https://api.d2dna.com'

/**
 * Verifica se a requisição está via HTTPS (incluindo via proxy/tunnel)
 */
function isSecureRequest(event: H3Event): boolean {
  // Em produção, sempre secure
  if (process.env.NODE_ENV === 'production') return true

  // Verifica headers de proxy (Cloudflare, nginx, etc.)
  const forwardedProto = getHeader(event, 'x-forwarded-proto')
  if (forwardedProto === 'https') return true

  // Verifica header do Cloudflare
  const cfVisitor = getHeader(event, 'cf-visitor')
  if (cfVisitor?.includes('"scheme":"https"')) return true

  return false
}

/**
 * Salva access token em cookie httpOnly (SEGURO)
 */
export function setAccessToken(event: H3Event, token: string, expiresIn = 3600) {
  const secure = isSecureRequest(event)
  setCookie(event, 'access_token', token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'strict' : 'lax',
    maxAge: expiresIn,
    path: '/'
  })
}

/**
 * Salva refresh token em cookie httpOnly
 */
export function setRefreshToken(event: H3Event, token: string) {
  const secure = isSecureRequest(event)
  setCookie(event, 'refresh_token', token, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'strict' : 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/'
  })
}

/**
 * Remove tokens (logout)
 */
export function clearAuthTokens(event: H3Event) {
  deleteCookie(event, 'access_token')
  deleteCookie(event, 'refresh_token')
}

/**
 * Pega access token do cookie
 */
export function getAccessToken(event: H3Event): string | undefined {
  return getCookie(event, 'access_token')
}

/**
 * Pega refresh token do cookie
 */
export function getRefreshToken(event: H3Event): string | undefined {
  return getCookie(event, 'refresh_token')
}

/**
 * Faz requisição autenticada para a API externa
 */
export async function authFetch<T>(
  event: H3Event,
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: Record<string, unknown>
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options
  const token = getAccessToken(event)

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  }

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const response = await $fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    body,
    headers: requestHeaders
  })

  return response as T
}

/**
 * URL base da API externa
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL
}
