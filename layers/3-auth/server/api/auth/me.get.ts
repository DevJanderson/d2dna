import type { UsuarioLogadoSchema } from '~/generated/tucuxi/types'
import { getAccessToken, clearAuthTokens, getApiBaseUrl } from '../../utils/auth-api'

export default defineEventHandler(async (event) => {
  const token = getAccessToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Não autenticado'
    })
  }

  try {
    const user = await $fetch<UsuarioLogadoSchema>(
      `${getApiBaseUrl()}/api/v1/usuarios/logado`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return { user }
  } catch {
    // Token inválido ou expirado
    clearAuthTokens(event)
    throw createError({
      statusCode: 401,
      message: 'Token inválido'
    })
  }
})
