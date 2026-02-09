/**
 * Middleware guest
 * Redireciona para /app se já autenticado
 *
 * Uso:
 * definePageMeta({ middleware: 'guest' })
 */
export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()

  if (auth.isAuthenticated) return navigateTo('/app')

  const isAuthenticated = await auth.checkAuth()
  if (isAuthenticated) return navigateTo('/app')
})
