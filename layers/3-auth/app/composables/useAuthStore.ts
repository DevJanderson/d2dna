import type { UsuarioLogadoSchema } from './types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UsuarioLogadoSchema | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useAuthApi()

  /**
   * Usuário está autenticado?
   */
  const isAuthenticated = computed(() => !!user.value)

  /**
   * Usuário é admin?
   */
  const isAdmin = computed(() => user.value?.admin === true)

  /**
   * Login com email e senha
   */
  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.login(email, password)
      user.value = response.user
      return true
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Erro ao fazer login'
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout
   */
  async function logout(): Promise<void> {
    try {
      await api.logout()
    } catch {
      // Ignora erros de logout - sempre limpa o estado local
    } finally {
      user.value = null
      error.value = null
    }
  }

  /**
   * Verifica se usuário está autenticado (checa token)
   */
  async function checkAuth(): Promise<boolean> {
    try {
      const response = await api.me()
      user.value = response.user
      return true
    } catch {
      user.value = null
      return false
    }
  }

  /**
   * Renova token
   */
  async function refreshToken(): Promise<boolean> {
    try {
      await api.refresh()
      return true
    } catch {
      user.value = null
      return false
    }
  }

  return {
    // Estado
    user,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,

    // Ações
    login,
    logout,
    checkAuth,
    refreshToken
  }
})
