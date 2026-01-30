/**
 * POST /api/usuarios/change-password - Alterar senha do usuário logado
 * BFF para POST /api/v1/usuarios/change-password
 */
import { authFetch } from '../../utils/auth-api'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  return await authFetch(event, '/api/v1/usuarios/change-password', {
    method: 'POST',
    body
  })
})
