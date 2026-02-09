/**
 * GET /api/usuarios - Lista usuários (admin)
 * BFF para GET /api/v1/usuarios
 */
import { authFetch } from '../../utils/auth-api'

export default defineEventHandler(async event => {
  const query = getQuery(event)

  // Monta query string
  const params = new URLSearchParams()
  if (query.search) params.set('search', String(query.search))
  if (query.limit) params.set('limit', String(query.limit))
  if (query.cursor) params.set('cursor', String(query.cursor))

  const queryString = params.toString()
  const endpoint = `/api/v1/usuarios${queryString ? `?${queryString}` : ''}`

  return await authFetch(event, endpoint)
})
