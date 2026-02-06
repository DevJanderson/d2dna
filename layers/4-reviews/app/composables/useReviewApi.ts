import type {
  PaginatedResponseReviewSchema,
  PaginatedResponseReviewRelatorioSchema,
  ReviewSchema,
  ReviewCreateSchema,
  ReviewStats
} from './types'

interface ReviewListParams {
  cursor?: string | null
  limit?: number
  order?: string
  uuid_cliente?: string | null
  cpf?: string | null
  cns?: string | null
  nome?: string | null
  nome_mae?: string | null
  data_nascimento?: string | null
}

interface RelatorioParams {
  cursor?: string | null
  limit?: number
  id_revisor?: number | null
  tipo_revisao?: string | null
  status?: string | null
  data_inicio?: string | null
  data_fim?: string | null
}

interface HistoricoParams {
  cursor?: string | null
  limit?: number
}

/**
 * Service para endpoints de review (curadoria de dados)
 *
 * No SSR, $fetch para rotas internas não repassa cookies automaticamente.
 * useRequestHeaders('cookie') captura os cookies do request original do browser
 * e os injeta nas chamadas internas, garantindo que o token auth funcione.
 */
export function useReviewApi() {
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : {}

  /**
   * Lista clientes para curadoria (paginação cursor)
   */
  async function list(params: ReviewListParams = {}): Promise<PaginatedResponseReviewSchema> {
    return await $fetch<PaginatedResponseReviewSchema>('/api/review', {
      params,
      headers
    })
  }

  /**
   * Registra review (aprovar/rejeitar/corrigir)
   */
  async function registro(body: ReviewCreateSchema): Promise<ReviewSchema> {
    return await $fetch<ReviewSchema>('/api/review/registro', {
      method: 'POST',
      body,
      headers
    })
  }

  /**
   * Relatório de reviews feitos (paginação cursor)
   */
  async function relatorio(
    params: RelatorioParams = {}
  ): Promise<PaginatedResponseReviewRelatorioSchema> {
    return await $fetch<PaginatedResponseReviewRelatorioSchema>('/api/review/relatorio', {
      params,
      headers
    })
  }

  /**
   * Estatísticas gerais de revisão
   */
  async function estatisticas(): Promise<ReviewStats> {
    return await $fetch<ReviewStats>('/api/review/estatisticas', {
      headers
    })
  }

  /**
   * Histórico de reviews de um cliente
   */
  async function historico(
    uuid: string,
    params: HistoricoParams = {}
  ): Promise<PaginatedResponseReviewSchema> {
    return await $fetch<PaginatedResponseReviewSchema>(`/api/review/historico/${uuid}`, {
      params,
      headers
    })
  }

  /**
   * Reverte um review
   */
  async function reverter(id: number): Promise<unknown> {
    return await $fetch(`/api/review/reverter/${id}`, {
      method: 'POST',
      headers
    })
  }

  return {
    list,
    registro,
    relatorio,
    estatisticas,
    historico,
    reverter
  }
}
