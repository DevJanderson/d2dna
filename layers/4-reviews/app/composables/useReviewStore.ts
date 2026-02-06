import type {
  ReviewSchema,
  ReviewCreateSchema,
  ReviewStats,
  PaginationMeta
} from './types'

interface ReviewFilters {
  nome?: string | null
  cpf?: string | null
  cns?: string | null
  data_nascimento?: string | null
}

export const useReviewStore = defineStore('review', () => {
  const reviews = ref<ReviewSchema[]>([])
  const selectedReview = ref<ReviewSchema | null>(null)
  const history = ref<ReviewSchema[]>([])
  const stats = ref<ReviewStats | null>(null)
  const filters = ref<ReviewFilters>({})
  const pagination = ref<PaginationMeta>({})
  const historyPagination = ref<PaginationMeta>({})
  const isLoadingReviews = ref(false)
  const isLoadingHistory = ref(false)
  const isLoadingAction = ref(false)
  const error = ref<string | null>(null)

  const api = useReviewApi()

  /**
   * Busca lista de clientes para revisão
   */
  async function fetchReviews(cursor?: string | null) {
    isLoadingReviews.value = true
    error.value = null

    try {
      const response = await api.list({
        cursor,
        nome: filters.value.nome,
        cpf: filters.value.cpf,
        cns: filters.value.cns,
        data_nascimento: filters.value.data_nascimento
      })
      reviews.value = response.data
      pagination.value = response.pagination
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Erro ao carregar reviews'
    } finally {
      isLoadingReviews.value = false
    }
  }

  /**
   * Aplica filtros e recarrega
   */
  async function setFilters(newFilters: ReviewFilters) {
    filters.value = { ...newFilters }
    await fetchReviews()
  }

  /**
   * Limpa filtros e recarrega
   */
  async function clearFilters() {
    filters.value = {}
    await fetchReviews()
  }

  /**
   * Próxima página
   */
  async function nextPage() {
    if (pagination.value.has_next && pagination.value.next_cursor) {
      await fetchReviews(pagination.value.next_cursor)
    }
  }

  /**
   * Página anterior
   */
  async function prevPage() {
    if (pagination.value.has_previous && pagination.value.previous_cursor) {
      await fetchReviews(pagination.value.previous_cursor)
    }
  }

  /**
   * Submete review (aprovar/rejeitar/corrigir)
   */
  async function submitReview(body: ReviewCreateSchema): Promise<boolean> {
    isLoadingAction.value = true
    error.value = null

    try {
      await api.registro(body)
      // Recarrega a lista após submissão
      await fetchReviews()
      return true
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Erro ao registrar review'
      return false
    } finally {
      isLoadingAction.value = false
    }
  }

  /**
   * Busca estatísticas de revisão
   */
  async function fetchStats() {
    try {
      stats.value = await api.estatisticas()
    } catch {
      // Falha silenciosa — stats são complementares, não bloqueiam a página
      stats.value = null
    }
  }

  /**
   * Busca histórico de reviews de um cliente
   */
  async function fetchHistory(uuid: string, cursor?: string | null) {
    isLoadingHistory.value = true
    error.value = null

    try {
      const response = await api.historico(uuid, { cursor })
      history.value = response.data
      historyPagination.value = response.pagination
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Erro ao carregar histórico'
    } finally {
      isLoadingHistory.value = false
    }
  }

  /**
   * Reverte um review
   */
  async function revertReview(id: number): Promise<boolean> {
    isLoadingAction.value = true
    error.value = null

    try {
      await api.reverter(id)
      // Recarrega histórico do cliente selecionado
      if (selectedReview.value) {
        await fetchHistory(selectedReview.value.uuid_cliente)
      }
      return true
    } catch (e: unknown) {
      const err = e as { data?: { message?: string } }
      error.value = err.data?.message || 'Erro ao reverter review'
      return false
    } finally {
      isLoadingAction.value = false
    }
  }

  /**
   * Seleciona um review para visualização
   */
  function selectReview(review: ReviewSchema | null) {
    selectedReview.value = review
  }

  return {
    // Estado
    reviews,
    selectedReview,
    history,
    stats,
    filters,
    pagination,
    historyPagination,
    isLoadingReviews,
    isLoadingHistory,
    isLoadingAction,
    error,

    // Ações
    fetchReviews,
    setFilters,
    clearFilters,
    nextPage,
    prevPage,
    submitReview,
    fetchStats,
    fetchHistory,
    revertReview,
    selectReview
  }
})
