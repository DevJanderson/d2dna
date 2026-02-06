import type { PaginatedResponseReviewSchema } from '~/generated/tucuxi/types'

const MAX_PAGES = 50

/**
 * Agrega estatísticas iterando todas as páginas de clientes em revisão
 * Conta por status: pendente, aprovado, rejeitado, corrigido
 */
export default defineEventHandler(async (event) => {
  const token = getAccessToken(event)

  if (!token) {
    throw createError({ statusCode: 401, message: 'Não autenticado' })
  }

  const baseUrl = getApiBaseUrl()
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  let cursor: string | null = null
  let pages = 0
  let total = 0
  let pendentes = 0
  let aprovados = 0
  let rejeitados = 0
  let corrigidos = 0

  do {
    const query: Record<string, unknown> = { limit: 100 }
    if (cursor) query.cursor = cursor

    const response = await $fetch<PaginatedResponseReviewSchema>(
      `${baseUrl}/api/v1/review/`,
      { headers, query }
    )

    for (const item of response.data) {
      total++
      switch (item.status) {
        case 'aprovado':
          aprovados++
          break
        case 'rejeitado':
          rejeitados++
          break
        case 'corrigido':
          corrigidos++
          break
        default:
          pendentes++
      }
    }

    cursor = response.pagination.has_next ? (response.pagination.next_cursor ?? null) : null
    pages++
  } while (cursor && pages < MAX_PAGES)

  return { total, pendentes, aprovados, rejeitados, corrigidos }
})
