/**
 * PUT /api/usuarios/:id - Atualizar usuário
 * BFF para PUT /api/v1/usuarios/:id
 */
import { authFetch } from '../../utils/auth-api'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return await authFetch(event, `/api/v1/usuarios/${id}`, {
    method: 'PUT',
    body
  })
})
