import { loginSchemaSchema } from '~/generated/tucuxi/zod'
import type { UsuarioLogadoSchema } from '~/generated/tucuxi/types'
import { setAccessToken, setRefreshToken, getApiBaseUrl } from '../../utils/auth-api'

interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export default defineEventHandler(async event => {
  const body = await readBody(event)

  // Validação com Zod
  const result = loginSchemaSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Email e senha são obrigatórios'
    })
  }

  const { email, password } = result.data

  try {
    // Chama API externa para login
    const loginResponse = await $fetch<LoginResponse>(`${getApiBaseUrl()}/api/v1/usuarios/login`, {
      method: 'POST',
      body: { email, password }
    })

    // Salva tokens em cookies httpOnly
    setAccessToken(event, loginResponse.access_token)
    setRefreshToken(event, loginResponse.refresh_token)

    // Busca dados do usuário logado
    const user = await $fetch<UsuarioLogadoSchema>(`${getApiBaseUrl()}/api/v1/usuarios/logado`, {
      headers: {
        Authorization: `Bearer ${loginResponse.access_token}`
      }
    })

    // Retorna apenas dados do usuário (sem tokens)
    return {
      success: true,
      user
    }
  } catch (error: unknown) {
    const err = error as { statusCode?: number; data?: { detail?: string } }
    throw createError({
      statusCode: err.statusCode || 401,
      message: err.data?.detail || 'Credenciais inválidas'
    })
  }
})
