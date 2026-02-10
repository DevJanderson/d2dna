import { z } from 'zod'

/**
 * Re-exporta tipos do Kubb para uso na layer
 */
export type { UsuarioLogadoSchema } from '~/generated/tucuxi/types'

/**
 * Schema de login (removido da spec OpenAPI, definido localmente)
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export type LoginSchema = z.infer<typeof loginSchema>
