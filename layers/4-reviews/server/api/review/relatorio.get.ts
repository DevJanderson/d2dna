import type { PaginatedResponseReviewRelatorioSchema } from '~/generated/tucuxi/types'

export default defineEventHandler(async event => {
  const query = getQuery(event)

  return await reviewFetch<PaginatedResponseReviewRelatorioSchema>(
    event,
    '/api/v1/review/relatorio',
    { query: query as Record<string, unknown> }
  )
})
