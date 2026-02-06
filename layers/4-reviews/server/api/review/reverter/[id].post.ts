export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'ID da revisão é obrigatório e deve ser numérico'
    })
  }

  return await reviewFetch(event, `/api/v1/review/reverter/${id}`, {
    method: 'POST'
  })
})
