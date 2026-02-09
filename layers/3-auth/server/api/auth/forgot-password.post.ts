import { getApiBaseUrl } from '../../utils/auth-api'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  if (!body.email) {
    throw createError({
      statusCode: 400,
      message: 'Email é obrigatório'
    })
  }

  try {
    // Chama API externa para solicitar reset
    await $fetch(`${getApiBaseUrl()}/api/v1/usuarios/reset-password`, {
      method: 'POST',
      body: { email: body.email }
    })

    // Sempre retorna sucesso para não expor se email existe
    return {
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.'
    }
  } catch {
    // Não expõe erro - sempre retorna sucesso
    return {
      success: true,
      message: 'Se o email existir, você receberá instruções para redefinir sua senha.'
    }
  }
})
