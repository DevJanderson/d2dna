import {
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  clearAuthTokens,
  getApiBaseUrl
} from '../../utils/auth-api'

interface RefreshResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export default defineEventHandler(async event => {
  const refreshToken = getRefreshToken(event)

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message: 'Sessão expirada'
    })
  }

  try {
    const response = await $fetch<RefreshResponse>(
      `${getApiBaseUrl()}/api/v1/usuarios/refresh-token`,
      {
        method: 'POST',
        query: { refresh_token: refreshToken }
      }
    )

    // Atualiza tokens nos cookies
    setAccessToken(event, response.access_token)
    setRefreshToken(event, response.refresh_token)

    return { success: true }
  } catch {
    // Se refresh falhar, limpa tudo
    clearAuthTokens(event)
    throw createError({
      statusCode: 401,
      message: 'Sessão expirada'
    })
  }
})
