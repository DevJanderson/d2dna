import type { H3Event } from 'h3'

const API_BASE_URL = 'https://api.d2dna.com'

/**
 * Salva access token em cookie httpOnly (SEGURO)
 */
export function setAccessToken(event: H3Event, token: string, expiresIn = 3600) {
  setCookie(event, 'access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/'
  })
}

/**
 * Salva refresh token em cookie httpOnly
 */
export function setRefreshToken(event: H3Event, token: string) {
  setCookie(event, 'refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
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
