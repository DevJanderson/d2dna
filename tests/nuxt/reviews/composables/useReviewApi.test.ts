import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock $fetch
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

// Mock useRequestHeaders (usado no SSR)
vi.stubGlobal('useRequestHeaders', () => ({}))

// Import after mocking
const { useReviewApi } = await import(
  '~/layers/4-reviews/app/composables/useReviewApi'
)

describe('useReviewApi', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  describe('list', () => {
    it('deve chamar GET /api/review sem parâmetros', async () => {
      const mockResponse = {
        data: [{ id: 1, uuid_cliente: 'abc', nome: 'João' }],
        pagination: { has_next: false, has_previous: false }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useReviewApi()
      const result = await api.list()

      expect(mockFetch).toHaveBeenCalledWith('/api/review', expect.objectContaining({
        params: {},
        headers: {}
      }))
      expect(result).toEqual(mockResponse)
    })

    it('deve enviar filtros como parâmetros de query', async () => {
      const mockResponse = {
        data: [],
        pagination: { has_next: false, has_previous: false }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useReviewApi()
      await api.list({ nome: 'Maria', cpf: '123.456.789-00' })

      expect(mockFetch).toHaveBeenCalledWith('/api/review', expect.objectContaining({
        params: { nome: 'Maria', cpf: '123.456.789-00' }
      }))
    })

    it('deve enviar cursor para paginação', async () => {
      const mockResponse = {
        data: [],
        pagination: { has_next: false, has_previous: true, previous_cursor: 'prev123' }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useReviewApi()
      await api.list({ cursor: 'abc123', limit: 25 })

      expect(mockFetch).toHaveBeenCalledWith('/api/review', expect.objectContaining({
        params: { cursor: 'abc123', limit: 25 }
      }))
    })

    it('deve propagar erro da API', async () => {
      mockFetch.mockRejectedValue({
        statusCode: 401,
        data: { message: 'Não autenticado' }
      })

      const api = useReviewApi()
      await expect(api.list()).rejects.toEqual(
        expect.objectContaining({ statusCode: 401 })
      )
    })
  })

  describe('registro', () => {
    it('deve chamar POST /api/review/registro com body', async () => {
      const body = {
        uuid_cliente: 'uuid-123',
        acao: 'aprovação',
        status: 'aprovado' as const,
        observacao: 'Dados corretos'
      }
      const mockResponse = { id: 1, uuid_cliente: 'uuid-123', nome: 'João', status: 'aprovado' }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useReviewApi()
      const result = await api.registro(body as any)

      expect(mockFetch).toHaveBeenCalledWith('/api/review/registro', expect.objectContaining({
        method: 'POST',
        body
      }))
      expect(result).toEqual(mockResponse)
    })

    it('deve propagar erro de validação', async () => {
      mockFetch.mockRejectedValue({
        statusCode: 400,
        data: { message: 'Dados inválidos' }
      })

      const api = useReviewApi()
      await expect(api.registro({} as any)).rejects.toEqual(
        expect.objectContaining({ statusCode: 400 })
      )
    })
  })

  describe('relatorio', () => {
    it('deve chamar GET /api/review/relatorio sem parâmetros', async () => {
      const mockResponse = {
        data: [],
        pagination: { has_next: false, has_previous: false }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useReviewApi()
      const result = await api.relatorio()

      expect(mockFetch).toHaveBeenCalledWith('/api/review/relatorio', expect.objectContaining({
        params: {},
        headers: {}
      }))
      expect(result).toEqual(mockResponse)
    })

    it('deve enviar filtros de relatório', async () => {
      mockFetch.mockResolvedValue({ data: [], pagination: {} })

      const api = useReviewApi()
      await api.relatorio({
        status: 'aprovado',
        data_inicio: '2025-01-01',
        data_fim: '2025-12-31'
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/review/relatorio', expect.objectContaining({
        params: {
          status: 'aprovado',
          data_inicio: '2025-01-01',
          data_fim: '2025-12-31'
        }
      }))
    })
  })

  describe('estatisticas', () => {
    it('deve chamar GET /api/review/estatisticas', async () => {
      const mockStats = {
        total: 100,
        pendentes: 20,
        aprovados: 60,
        rejeitados: 10,
        corrigidos: 10
      }
      mockFetch.mockResolvedValue(mockStats)

      const api = useReviewApi()
      const result = await api.estatisticas()

      expect(mockFetch).toHaveBeenCalledWith('/api/review/estatisticas', expect.objectContaining({
        headers: {}
      }))
      expect(result).toEqual(mockStats)
    })
  })

  describe('historico', () => {
    it('deve chamar GET /api/review/historico/:uuid', async () => {
      const mockResponse = {
        data: [
          { id: 1, uuid_cliente: 'uuid-abc', nome: 'João', status: 'aprovado' },
          { id: 2, uuid_cliente: 'uuid-abc', nome: 'João', status: 'rejeitado' }
        ],
        pagination: { has_next: false, has_previous: false }
      }
      mockFetch.mockResolvedValue(mockResponse)

      const api = useReviewApi()
      const result = await api.historico('uuid-abc')

      expect(mockFetch).toHaveBeenCalledWith('/api/review/historico/uuid-abc', expect.objectContaining({
        params: {},
        headers: {}
      }))
      expect(result).toEqual(mockResponse)
    })

    it('deve enviar cursor para paginação do histórico', async () => {
      mockFetch.mockResolvedValue({ data: [], pagination: {} })

      const api = useReviewApi()
      await api.historico('uuid-abc', { cursor: 'next-page' })

      expect(mockFetch).toHaveBeenCalledWith('/api/review/historico/uuid-abc', expect.objectContaining({
        params: { cursor: 'next-page' }
      }))
    })
  })

  describe('reverter', () => {
    it('deve chamar POST /api/review/reverter/:id', async () => {
      mockFetch.mockResolvedValue({ success: true })

      const api = useReviewApi()
      await api.reverter(42)

      expect(mockFetch).toHaveBeenCalledWith('/api/review/reverter/42', expect.objectContaining({
        method: 'POST',
        headers: {}
      }))
    })

    it('deve propagar erro ao reverter', async () => {
      mockFetch.mockRejectedValue({
        statusCode: 404,
        data: { message: 'Review não encontrado' }
      })

      const api = useReviewApi()
      await expect(api.reverter(999)).rejects.toEqual(
        expect.objectContaining({ statusCode: 404 })
      )
    })
  })
})
