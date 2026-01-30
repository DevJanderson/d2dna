import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Import after mocking
const { useAuthApi } = await import(
  '~/layers/3-auth/app/composables/useAuthApi'
)

describe('useAuthApi', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('login', () => {
    it('should call POST /api/auth/login with credentials', async () => {
      const mockResponse = {
        success: true,
        user: { id: 1, nome: 'Test User', email: 'test@example.com' }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useAuthApi()
      const result = await api.login('test@example.com', 'password123')

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        body: { email: 'test@example.com', password: 'password123' }
      })
      expect(result).toEqual(mockResponse)
    })

    it('should throw on invalid credentials', async () => {
      mockFetch.mockRejectedValue({
        data: { message: 'Credenciais inválidas' }
      })

      const api = useAuthApi()
      await expect(api.login('bad@email.com', 'wrong')).rejects.toThrow()
    })
  })

  describe('logout', () => {
    it('should call POST /api/auth/logout', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const api = useAuthApi()
      await api.logout()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST'
      })
    })
  })

  describe('refresh', () => {
    it('should call POST /api/auth/refresh', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const api = useAuthApi()
      await api.refresh()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/refresh', {
        method: 'POST'
      })
    })
  })

  describe('me', () => {
    it('should call GET /api/auth/me', async () => {
      const mockUser = {
        user: { id: 1, nome: 'Test User', email: 'test@example.com' }
      }
      mockFetch.mockResolvedValue(mockUser)

      const api = useAuthApi()
      const result = await api.me()

      expect(mockFetch).toHaveBeenCalledWith('/api/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('should throw on unauthorized', async () => {
      mockFetch.mockRejectedValue({
        statusCode: 401,
        data: { message: 'Não autenticado' }
      })

      const api = useAuthApi()
      await expect(api.me()).rejects.toThrow()
    })
  })
})
