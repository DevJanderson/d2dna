import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock useReviewApi
const mockList = vi.fn()
const mockRegistro = vi.fn()
const mockRelatorio = vi.fn()
const mockEstatisticas = vi.fn()
const mockHistorico = vi.fn()
const mockReverter = vi.fn()

vi.mock('~/layers/4-reviews/app/composables/useReviewApi', () => ({
  useReviewApi: () => ({
    list: mockList,
    registro: mockRegistro,
    relatorio: mockRelatorio,
    estatisticas: mockEstatisticas,
    historico: mockHistorico,
    reverter: mockReverter
  })
}))

// Import after mocking
const { useReviewStore } = await import('~/layers/4-reviews/app/composables/useReviewStore')

// Helpers
function createMockReview(overrides = {}) {
  return {
    id: 1,
    uuid_cliente: 'uuid-abc',
    nome: 'João da Silva',
    data_nascimento: '1990-05-15',
    sexo: 'M',
    cpf: '123.456.789-00',
    cns: null,
    nome_mae: 'Maria da Silva',
    status: null,
    obs_review: null,
    ...overrides
  }
}

function createPaginatedResponse(data: any[], hasNext = false, hasPrevious = false) {
  return {
    data,
    pagination: {
      has_next: hasNext,
      has_previous: hasPrevious,
      next_cursor: hasNext ? 'next-cursor' : null,
      previous_cursor: hasPrevious ? 'prev-cursor' : null
    }
  }
}

describe('useReviewStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('estado inicial', () => {
    it('deve começar com lista vazia', () => {
      const store = useReviewStore()
      expect(store.reviews).toEqual([])
      expect(store.history).toEqual([])
    })

    it('deve começar sem review selecionado', () => {
      const store = useReviewStore()
      expect(store.selectedReview).toBeNull()
    })

    it('deve começar sem stats', () => {
      const store = useReviewStore()
      expect(store.stats).toBeNull()
    })

    it('deve começar sem erro e sem loading', () => {
      const store = useReviewStore()
      expect(store.error).toBeNull()
      expect(store.isLoadingReviews).toBe(false)
      expect(store.isLoadingHistory).toBe(false)
      expect(store.isLoadingAction).toBe(false)
    })

    it('deve começar com filtros vazios', () => {
      const store = useReviewStore()
      expect(store.filters).toEqual({})
    })

    it('deve começar com paginação vazia', () => {
      const store = useReviewStore()
      expect(store.pagination).toEqual({})
      expect(store.historyPagination).toEqual({})
    })
  })

  describe('fetchReviews', () => {
    it('deve carregar lista de reviews', async () => {
      const reviews = [createMockReview(), createMockReview({ id: 2, nome: 'Maria' })]
      mockList.mockResolvedValue(createPaginatedResponse(reviews))

      const store = useReviewStore()
      await store.fetchReviews()

      expect(store.reviews).toEqual(reviews)
      expect(store.pagination).toEqual(
        expect.objectContaining({
          has_next: false,
          has_previous: false
        })
      )
    })

    it('deve setar isLoadingReviews durante carregamento', async () => {
      mockList.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(createPaginatedResponse([])), 50))
      )

      const store = useReviewStore()
      const promise = store.fetchReviews()

      expect(store.isLoadingReviews).toBe(true)

      await promise

      expect(store.isLoadingReviews).toBe(false)
    })

    it('deve enviar filtros ativos na requisição', async () => {
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      store.filters = { nome: 'João', cpf: '123.456.789-00' }
      await store.fetchReviews()

      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'João',
          cpf: '123.456.789-00'
        })
      )
    })

    it('deve enviar cursor para paginação', async () => {
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      await store.fetchReviews('cursor-abc')

      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          cursor: 'cursor-abc'
        })
      )
    })

    it('deve setar erro quando API falha', async () => {
      mockList.mockRejectedValue({
        data: { message: 'Erro interno' }
      })

      const store = useReviewStore()
      await store.fetchReviews()

      expect(store.error).toBe('Erro interno')
      expect(store.reviews).toEqual([])
    })

    it('deve usar mensagem padrão quando erro não tem message', async () => {
      mockList.mockRejectedValue({})

      const store = useReviewStore()
      await store.fetchReviews()

      expect(store.error).toBe('Erro ao carregar reviews')
    })

    it('deve limpar erro anterior ao carregar com sucesso', async () => {
      mockList.mockRejectedValueOnce({ data: { message: 'Erro' } })

      const store = useReviewStore()
      await store.fetchReviews()
      expect(store.error).toBe('Erro')

      mockList.mockResolvedValueOnce(createPaginatedResponse([]))
      await store.fetchReviews()
      expect(store.error).toBeNull()
    })
  })

  describe('setFilters', () => {
    it('deve atualizar filtros e recarregar', async () => {
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      await store.setFilters({ nome: 'Maria', cns: '123456' })

      expect(store.filters).toEqual({ nome: 'Maria', cns: '123456' })
      expect(mockList).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Maria',
          cns: '123456'
        })
      )
    })
  })

  describe('clearFilters', () => {
    it('deve limpar filtros e recarregar', async () => {
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      store.filters = { nome: 'João' }
      await store.clearFilters()

      expect(store.filters).toEqual({})
      expect(mockList).toHaveBeenCalled()
    })
  })

  describe('nextPage / prevPage', () => {
    it('deve avançar página quando has_next é true', async () => {
      const firstPage = createPaginatedResponse([createMockReview()], true, false)
      mockList.mockResolvedValueOnce(firstPage)

      const store = useReviewStore()
      await store.fetchReviews()

      mockList.mockResolvedValueOnce(
        createPaginatedResponse([createMockReview({ id: 2 })], false, true)
      )
      await store.nextPage()

      expect(mockList).toHaveBeenLastCalledWith(
        expect.objectContaining({
          cursor: 'next-cursor'
        })
      )
    })

    it('não deve avançar página quando has_next é false', async () => {
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      await store.fetchReviews()

      mockList.mockClear()
      await store.nextPage()

      expect(mockList).not.toHaveBeenCalled()
    })

    it('deve voltar página quando has_previous é true', async () => {
      const response = createPaginatedResponse([createMockReview()], false, true)
      mockList.mockResolvedValueOnce(response)

      const store = useReviewStore()
      await store.fetchReviews()

      mockList.mockResolvedValueOnce(createPaginatedResponse([]))
      await store.prevPage()

      expect(mockList).toHaveBeenLastCalledWith(
        expect.objectContaining({
          cursor: 'prev-cursor'
        })
      )
    })

    it('não deve voltar página quando has_previous é false', async () => {
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      await store.fetchReviews()

      mockList.mockClear()
      await store.prevPage()

      expect(mockList).not.toHaveBeenCalled()
    })
  })

  describe('submitReview', () => {
    it('deve submeter review e recarregar lista', async () => {
      mockRegistro.mockResolvedValue({ id: 1, status: 'aprovado' })
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      const result = await store.submitReview({
        uuid_cliente: 'uuid-abc',
        acao: 'aprovação',
        status: 'aprovado' as any,
        observacao: 'Dados corretos'
      })

      expect(result).toBe(true)
      expect(mockRegistro).toHaveBeenCalledWith(
        expect.objectContaining({
          uuid_cliente: 'uuid-abc',
          acao: 'aprovação',
          status: 'aprovado'
        })
      )
      // Deve recarregar a lista após submissão
      expect(mockList).toHaveBeenCalled()
    })

    it('deve setar isLoadingAction durante submissão', async () => {
      mockRegistro.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)))
      mockList.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      const promise = store.submitReview({
        uuid_cliente: 'uuid-abc',
        acao: 'rejeição',
        status: 'rejeitado' as any
      })

      expect(store.isLoadingAction).toBe(true)

      await promise

      expect(store.isLoadingAction).toBe(false)
    })

    it('deve retornar false e setar erro quando falha', async () => {
      mockRegistro.mockRejectedValue({
        data: { message: 'Erro de validação' }
      })

      const store = useReviewStore()
      const result = await store.submitReview({
        uuid_cliente: 'uuid-abc',
        acao: 'aprovação',
        status: 'aprovado' as any
      })

      expect(result).toBe(false)
      expect(store.error).toBe('Erro de validação')
    })

    it('deve usar mensagem padrão quando erro não tem message', async () => {
      mockRegistro.mockRejectedValue({})

      const store = useReviewStore()
      const result = await store.submitReview({
        uuid_cliente: 'uuid-abc',
        acao: 'aprovação',
        status: 'aprovado' as any
      })

      expect(result).toBe(false)
      expect(store.error).toBe('Erro ao registrar review')
    })
  })

  describe('fetchStats', () => {
    it('deve carregar estatísticas', async () => {
      const mockStats = {
        total: 100,
        pendentes: 20,
        aprovados: 60,
        rejeitados: 10,
        corrigidos: 10
      }
      mockEstatisticas.mockResolvedValue(mockStats)

      const store = useReviewStore()
      await store.fetchStats()

      expect(store.stats).toEqual(mockStats)
    })

    it('deve setar stats como null quando falha (falha silenciosa)', async () => {
      mockEstatisticas.mockRejectedValue(new Error('Network error'))

      const store = useReviewStore()
      await store.fetchStats()

      expect(store.stats).toBeNull()
      // Não deve setar error — stats são complementares
      expect(store.error).toBeNull()
    })
  })

  describe('fetchHistory', () => {
    it('deve carregar histórico de um cliente', async () => {
      const historyItems = [
        createMockReview({ id: 10, status: 'aprovado', obs_review: 'OK' }),
        createMockReview({ id: 11, status: 'rejeitado', obs_review: 'Dados inconsistentes' })
      ]
      mockHistorico.mockResolvedValue(createPaginatedResponse(historyItems))

      const store = useReviewStore()
      await store.fetchHistory('uuid-abc')

      expect(store.history).toEqual(historyItems)
      expect(mockHistorico).toHaveBeenCalledWith('uuid-abc', { cursor: undefined })
    })

    it('deve setar isLoadingHistory durante carregamento', async () => {
      mockHistorico.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(createPaginatedResponse([])), 50))
      )

      const store = useReviewStore()
      const promise = store.fetchHistory('uuid-abc')

      expect(store.isLoadingHistory).toBe(true)

      await promise

      expect(store.isLoadingHistory).toBe(false)
    })

    it('deve enviar cursor para paginação do histórico', async () => {
      mockHistorico.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      await store.fetchHistory('uuid-abc', 'cursor-xyz')

      expect(mockHistorico).toHaveBeenCalledWith('uuid-abc', { cursor: 'cursor-xyz' })
    })

    it('deve setar erro quando falha', async () => {
      mockHistorico.mockRejectedValue({
        data: { message: 'Cliente não encontrado' }
      })

      const store = useReviewStore()
      await store.fetchHistory('uuid-inexistente')

      expect(store.error).toBe('Cliente não encontrado')
      expect(store.history).toEqual([])
    })
  })

  describe('revertReview', () => {
    it('deve reverter review e recarregar histórico', async () => {
      mockReverter.mockResolvedValue({ success: true })
      mockHistorico.mockResolvedValue(createPaginatedResponse([]))

      const store = useReviewStore()
      store.selectedReview = createMockReview() as any
      const result = await store.revertReview(42)

      expect(result).toBe(true)
      expect(mockReverter).toHaveBeenCalledWith(42)
      // Deve recarregar o histórico do cliente selecionado
      expect(mockHistorico).toHaveBeenCalledWith('uuid-abc', { cursor: undefined })
    })

    it('deve setar isLoadingAction durante reversão', async () => {
      mockReverter.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 50)))

      const store = useReviewStore()
      store.selectedReview = createMockReview() as any
      const promise = store.revertReview(42)

      expect(store.isLoadingAction).toBe(true)

      await promise

      expect(store.isLoadingAction).toBe(false)
    })

    it('deve retornar false e setar erro quando falha', async () => {
      mockReverter.mockRejectedValue({
        data: { message: 'Não é possível reverter' }
      })

      const store = useReviewStore()
      const result = await store.revertReview(999)

      expect(result).toBe(false)
      expect(store.error).toBe('Não é possível reverter')
    })

    it('não deve recarregar histórico se não houver review selecionado', async () => {
      mockReverter.mockResolvedValue({ success: true })

      const store = useReviewStore()
      // selectedReview é null
      await store.revertReview(42)

      expect(mockReverter).toHaveBeenCalledWith(42)
      expect(mockHistorico).not.toHaveBeenCalled()
    })
  })

  describe('selectReview', () => {
    it('deve selecionar um review', () => {
      const store = useReviewStore()
      const review = createMockReview() as any

      store.selectReview(review)

      expect(store.selectedReview).toEqual(review)
    })

    it('deve desselecionar passando null', () => {
      const store = useReviewStore()
      store.selectedReview = createMockReview() as any

      store.selectReview(null)

      expect(store.selectedReview).toBeNull()
    })
  })
})
