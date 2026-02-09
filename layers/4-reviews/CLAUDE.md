# Layer 4-reviews - CLAUDE.md

Revisão e curadoria de dados de clientes. Integração com API de review do Tucuxi via BFF.

## Estrutura

```
layers/4-reviews/
├── nuxt.config.ts
├── app/
│   ├── components/
│   │   ├── ReviewList.vue          # Tabela de clientes para curadoria
│   │   ├── ReviewActions.vue       # Botões aprovar/rejeitar/corrigir
│   │   ├── ReviewFilters.vue       # Filtros (nome, CPF, CNS, data)
│   │   └── ReviewHistory.vue       # Histórico de reviews de um cliente
│   ├── composables/
│   │   ├── types.ts                # Re-exporta tipos Kubb
│   │   ├── useReviewApi.ts         # Service ($fetch → /api/review/*)
│   │   └── useReviewStore.ts       # Pinia store (lista, filtros, paginação)
│   └── pages/app/reviews/
│       ├── index.vue               # Lista de clientes (filtros + tabela)
│       └── [uuid].vue              # Detalhe do cliente (dados + ações)
└── server/
    ├── api/review/
    │   ├── index.get.ts            # GET /api/review/ → listar clientes
    │   ├── registro.post.ts        # POST /api/review/registro → registrar review
    │   ├── relatorio.get.ts        # GET /api/review/relatorio → relatório
    │   ├── estatisticas.get.ts     # GET /api/review/estatisticas → stats
    │   ├── historico/[uuid].get.ts # GET /api/review/historico/:uuid
    │   └── reverter/[id].post.ts   # POST /api/review/reverter/:id
    └── utils/
        └── review-api.ts           # reviewFetch helper com Bearer token
```

## Endpoints BFF

| Rota                          | Método | API Externa                          |
| ----------------------------- | ------ | ------------------------------------ |
| `/api/review`                 | GET    | `GET /api/v1/review/`                |
| `/api/review/registro`        | POST   | `POST /api/v1/review/registro`       |
| `/api/review/relatorio`       | GET    | `GET /api/v1/review/relatorio`       |
| `/api/review/estatisticas`    | GET    | `GET /api/v1/review/estatisticas`    |
| `/api/review/historico/:uuid` | GET    | `GET /api/v1/review/historico/:uuid` |
| `/api/review/reverter/:id`    | POST   | `POST /api/v1/review/reverter/:id`   |

## Páginas

| Rota                 | Descrição                                        |
| -------------------- | ------------------------------------------------ |
| `/app/reviews`       | Lista de clientes com filtros e paginação cursor |
| `/app/reviews/:uuid` | Detalhe do cliente com dados, histórico e ações  |

## Tipos Kubb

```typescript
import type {
  ReviewSchema,
  ReviewCreateSchema,
  PaginatedResponseReviewSchema,
  PaginationMeta
} from '~/generated/tucuxi/types'
import { reviewCreateSchemaSchema } from '~/generated/tucuxi/zod'
```

## Uso

```typescript
const reviewStore = useReviewStore()

// Buscar lista de clientes para revisão
await reviewStore.fetchReviews()

// Aplicar filtros
reviewStore.setFilters({ nome: 'João', cpf: '123.456.789-00' })

// Submeter review
await reviewStore.submitReview({
  uuid_cliente: '...',
  acao: 'aprovação',
  status: 'aprovado',
  observacao: 'Dados corretos'
})
```

## Prioridade

```
4-reviews > 3-auth > 2-home > 0-base
```
