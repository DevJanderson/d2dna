/**
 * Middleware de autenticação
 * Redireciona para /login se não autenticado
 *
 * Uso:
 * definePageMeta({ middleware: 'auth' })
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Não aplicar na página de login
  if (to.path === '/login') {
    return
  }

  const auth = useAuthStore()

  // Se já tem usuário em memória, está ok
  if (auth.isAuthenticated) {
    return
  }

  // Tenta verificar autenticação via cookie
  const isAuthenticated = await auth.checkAuth()

  if (!isAuthenticated) {
    return navigateTo('/login')
  }
})
