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
 */
export function useAuthApi() {
  /**
   * Login com email e senha
   */
  async function login(email: string, password: string): Promise<LoginResponse> {
    return await $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
  }

  /**
   * Logout (limpa sessão)
   */
  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' })
  }

  /**
   * Renova access token
   */
  async function refresh(): Promise<void> {
    await $fetch('/api/auth/refresh', { method: 'POST' })
  }

  /**
   * Busca dados do usuário logado
   */
  async function me(): Promise<MeResponse> {
    return await $fetch<MeResponse>('/api/auth/me')
  }

  return {
    login,
    logout,
    refresh,
    me
  }
}
