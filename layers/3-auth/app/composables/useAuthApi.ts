import type { UsuarioLogadoSchema } from './types'

interface LoginResponse {
  success: boolean
  user: UsuarioLogadoSchema
}

interface MeResponse {
  user: UsuarioLogadoSchema
}

/**
 * Service para endpoints de autenticação
 *
 * No SSR, $fetch para rotas internas não repassa cookies automaticamente.
 * useRequestHeaders('cookie') captura os cookies do request original do browser
 * e os injeta nas chamadas internas, garantindo que o middleware auth funcione.
 */
export function useAuthApi() {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}

  /**
   * Login com email e senha
   */
  async function login(email: string, password: string): Promise<LoginResponse> {
    return await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      headers
    })
  }

  /**
   * Logout (limpa sessão)
   */
  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST', headers })
  }

  /**
   * Renova access token
   */
  async function refresh(): Promise<void> {
    await $fetch('/api/auth/refresh', { method: 'POST', headers })
  }

  /**
   * Busca dados do usuário logado
   */
  async function me(): Promise<MeResponse> {
    return await $fetch<MeResponse>('/api/auth/me', { headers })
  }

  return {
    login,
    logout,
    refresh,
    me
  }
}
