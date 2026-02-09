import type { ReviewSchema } from '~/generated/tucuxi/types'
import { reviewCreateSchemaSchema } from '~/generated/tucuxi/zod'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const result = reviewCreateSchemaSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Dados inválidos para registro de review'
    })
  }

  return await reviewFetch<ReviewSchema>(event, '/api/v1/review/registro', {
    method: 'POST',
    body: result.data as unknown as Record<string, unknown>
  })
})
