import type { H3Event } from 'h3'

/**
 * Faz requisição autenticada para a API de review
 * Reutiliza getAccessToken e getApiBaseUrl do 3-auth
 */
export async function reviewFetch<T>(
  event: H3Event,
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: Record<string, unknown>
    query?: Record<string, unknown>
  } = {}
): Promise<T> {
  const { method = 'GET', body, query } = options
  const token = getAccessToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Não autenticado'
    })
  }

  const response = await $fetch(`${getApiBaseUrl()}${endpoint}`, {
    method,
    body,
    query,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  return response as T
}
