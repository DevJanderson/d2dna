import type { PaginatedResponseReviewSchema } from '~/generated/tucuxi/types'

export default defineEventHandler(async event => {
  const query = getQuery(event)

  return await reviewFetch<PaginatedResponseReviewSchema>(event, '/api/v1/review/', {
    query: query as Record<string, unknown>
  })
})
