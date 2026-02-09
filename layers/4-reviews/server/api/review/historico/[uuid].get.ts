import type { PaginatedResponseReviewSchema } from '~/generated/tucuxi/types'

export default defineEventHandler(async event => {
  const uuid = getRouterParam(event, 'uuid')

  if (!uuid) {
    throw createError({
      statusCode: 400,
      message: 'UUID do cliente é obrigatório'
    })
  }

  const query = getQuery(event)

  return await reviewFetch<PaginatedResponseReviewSchema>(
    event,
    `/api/v1/review/historico/${uuid}`,
    { query: query as Record<string, unknown> }
  )
})
