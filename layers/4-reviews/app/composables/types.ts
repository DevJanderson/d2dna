/**
 * Re-exporta tipos do Kubb para uso na layer
 */
export type {
  ReviewSchema,
  ReviewCreateSchema,
  ReviewRelatorioSchema,
  PaginatedResponseReviewSchema,
  PaginatedResponseReviewRelatorioSchema,
  PaginationMeta
} from '~/generated/tucuxi/types'

export { ReviewCreateSchemaStatusEnum } from '~/generated/tucuxi/types'

/**
 * Re-exporta schemas Zod para validação
 */
export { reviewCreateSchemaSchema } from '~/generated/tucuxi/zod'

/**
 * Estatísticas de revisão (formato local — API retorna `any`)
 * Adaptar quando souber o formato real do endpoint
 */
export interface ReviewStats {
  total: number
  pendentes: number
  aprovados: number
  rejeitados: number
  corrigidos: number
}
