import { clearAuthTokens, getAccessToken, getApiBaseUrl } from '../../utils/auth-api'

export default defineEventHandler(async event => {
  const token = getAccessToken(event)

  // Tenta fazer logout na API externa (opcional, não bloqueia se falhar)
  if (token) {
    try {
      await $fetch(`${getApiBaseUrl()}/api/v1/usuarios/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    } catch {
      // Ignora erros da API externa no logout
    }
  }

  // Sempre limpa os cookies locais
  clearAuthTokens(event)

  return { success: true }
})
