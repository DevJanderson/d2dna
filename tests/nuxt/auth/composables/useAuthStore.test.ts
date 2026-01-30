import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock useAuthApi
const mockLogin = vi.fn()
const mockLogout = vi.fn()
const mockMe = vi.fn()
const mockRefresh = vi.fn()

vi.mock('~/layers/3-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: mockLogin,
    logout: mockLogout,
    me: mockMe,
    refresh: mockRefresh
  })
}))

// Import after mocking
const { useAuthStore } = await import(
  '~/layers/3-auth/app/composables/useAuthStore'
)

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should start with null user', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
      expect(store.isAdmin).toBe(false)
    })

    it('should not be loading initially', () => {
      const store = useAuthStore()
      expect(store.isLoading).toBe(false)
    })

    it('should have no error initially', () => {
      const store = useAuthStore()
      expect(store.error).toBeNull()
    })
  })

  describe('login', () => {
    it('should set user on successful login', async () => {
      const mockUser = { id: 1, nome: 'Test User', email: 'test@example.com' }
      mockLogin.mockResolvedValue({ success: true, user: mockUser })

      const store = useAuthStore()
      const result = await store.login('test@example.com', 'password')

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
      expect(store.isAuthenticated).toBe(true)
      expect(store.error).toBeNull()
    })

    it('should set isLoading during login', async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      )

      const store = useAuthStore()
      const promise = store.login('test@example.com', 'password')

      expect(store.isLoading).toBe(true)

      await promise

      expect(store.isLoading).toBe(false)
    })

    it('should set error on failed login', async () => {
      mockLogin.mockRejectedValue({
        data: { message: 'Credenciais inválidas' }
      })

      const store = useAuthStore()
      const result = await store.login('bad@email.com', 'wrong')

      expect(result).toBe(false)
      expect(store.user).toBeNull()
      expect(store.error).toBe('Credenciais inválidas')
    })

    it('should detect admin user', async () => {
      const mockAdminUser = {
        id: 1,
        nome: 'Admin User',
        email: 'admin@example.com',
        admin: true
      }
      mockLogin.mockResolvedValue({ success: true, user: mockAdminUser })

      const store = useAuthStore()
      await store.login('admin@example.com', 'password')

      expect(store.isAdmin).toBe(true)
    })
  })

  describe('logout', () => {
    it('should clear user on logout', async () => {
      const mockUser = { id: 1, nome: 'Test User', email: 'test@example.com' }
      mockLogin.mockResolvedValue({ success: true, user: mockUser })
      mockLogout.mockResolvedValue({ success: true })

      const store = useAuthStore()
      await store.login('test@example.com', 'password')

      expect(store.isAuthenticated).toBe(true)

      await store.logout()

      expect(store.user).toBeNull()
      expect(store.isAuthenticated).toBe(false)
    })

    it('should clear user even if logout API fails', async () => {
      const mockUser = { id: 1, nome: 'Test User', email: 'test@example.com' }
      mockLogin.mockResolvedValue({ success: true, user: mockUser })
      mockLogout.mockRejectedValue({ message: 'Network error' })

      const store = useAuthStore()
      await store.login('test@example.com', 'password')

      // Should not throw, just clear user
      await store.logout()

      expect(store.user).toBeNull()
    })
  })

  describe('checkAuth', () => {
    it('should set user if authenticated', async () => {
      const mockUser = { id: 1, nome: 'Test User', email: 'test@example.com' }
      mockMe.mockResolvedValue({ user: mockUser })

      const store = useAuthStore()
      const result = await store.checkAuth()

      expect(result).toBe(true)
      expect(store.user).toEqual(mockUser)
    })

    it('should return false if not authenticated', async () => {
      mockMe.mockRejectedValue({ statusCode: 401 })

      const store = useAuthStore()
      const result = await store.checkAuth()

      expect(result).toBe(false)
      expect(store.user).toBeNull()
    })
  })

  describe('refreshToken', () => {
    it('should return true on successful refresh', async () => {
      mockRefresh.mockResolvedValue({ success: true })

      const store = useAuthStore()
      const result = await store.refreshToken()

      expect(result).toBe(true)
    })

    it('should clear user on failed refresh', async () => {
      const mockUser = { id: 1, nome: 'Test User', email: 'test@example.com' }
      mockLogin.mockResolvedValue({ success: true, user: mockUser })
      mockRefresh.mockRejectedValue({ statusCode: 401 })

      const store = useAuthStore()
      await store.login('test@example.com', 'password')

      const result = await store.refreshToken()

      expect(result).toBe(false)
      expect(store.user).toBeNull()
    })
  })
})
