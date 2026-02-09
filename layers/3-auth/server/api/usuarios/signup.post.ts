/**
 * POST /api/usuarios/signup - Criar novo usuário (admin)
 * BFF para POST /api/v1/usuarios/signup
 */
import { getApiBaseUrl } from '../../utils/auth-api'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  // Signup não precisa de autenticação, mas precisa da master_key
  const response = await $fetch(`${getApiBaseUrl()}/api/v1/usuarios/signup`, {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return response
})
