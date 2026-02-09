---
title: Curadoria de Dados
description: Sistema de revisão humana dos resultados de linkage, com interface de curadoria para aprovar, rejeitar ou corrigir registros.
order: 2
---

# Curadoria de Dados

O sistema de curadoria permite que analistas revisem os resultados do record linkage, garantindo que decisões críticas sobre unificação de registros passem por supervisão humana. A curadoria é essencial para a "zona cinzenta" -- matches com score entre 75% e 95% que não são automaticamente classificados.

## Layer 4-reviews

A funcionalidade de curadoria está implementada na layer `4-reviews`, que segue a arquitetura de layers do Nuxt:

```
layers/4-reviews/
├── app/
│   ├── components/        # ReviewList, ReviewActions, ReviewFilters, etc.
│   ├── composables/       # useReviewApi, useReviewStore, types
│   ├── pages/app/reviews/ # index.vue e [uuid].vue
│   └── utils/             # reviewFormatters.ts
└── server/
    ├── api/review/        # Endpoints BFF
    └── utils/             # reviewFetch helper
```

## Páginas

A curadoria possui duas páginas principais:

### Lista de clientes (`/app/reviews`)

Exibe todos os clientes pendentes de revisão com:

- **Filtros** por nome, CPF, CNS e data de nascimento
- **Paginação cursor** para navegação eficiente em grandes volumes
- **Barra de estatisticas** com totais por status
- **Tabela** com dados resumidos de cada cliente

### Detalhe do cliente (`/app/reviews/[uuid]`)

Exibe informações completas de um cliente específico:

- Dados pessoais (nome, CPF, CNS, data de nascimento, nome da mae)
- Histórico de revisões anteriores
- Timeline de acoes
- Botões de ação (aprovar, rejeitar, corrigir)
- Campo de observação para justificativa

## Status dos Reviews

Cada registro pode ter um dos seguintes status:

| Status        | Cor      | Descricao                                         |
| ------------- | -------- | ------------------------------------------------- |
| **pendente**  | Cinza    | Aguardando revisão de um analista                 |
| **aprovado**  | Verde    | Dados confirmados como corretos                   |
| **rejeitado** | Vermelho | Dados identificados como incorretos ou duplicados |
| **corrigido** | Amarelo  | Dados foram ajustados durante a revisão           |

## Endpoints BFF

A layer expõe os seguintes endpoints via BFF (Backend for Frontend):

| Rota                          | Método | Descrição                           |
| ----------------------------- | ------ | ----------------------------------- |
| `/api/review`                 | GET    | Listar clientes para revisão        |
| `/api/review/registro`        | POST   | Registrar uma revisão               |
| `/api/review/relatorio`       | GET    | Obter relatório de revisões         |
| `/api/review/estatisticas`    | GET    | Estatísticas por status             |
| `/api/review/historico/:uuid` | GET    | Histórico de revisões de um cliente |
| `/api/review/reverter/:id`    | POST   | Reverter uma revisão registrada     |

## Integração com Autenticação

O BFF da layer `4-reviews` reutiliza a infraestrutura de autenticação da layer `3-auth`:

```typescript
// server/utils/review-api.ts
export async function reviewFetch<T>(event: H3Event, endpoint: string, options = {}) {
  const token = getAccessToken(event) // Reutiliza do 3-auth
  // ...
  const response = await $fetch(`${getApiBaseUrl()}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
```

As funções `getAccessToken` e `getApiBaseUrl` são importadas automaticamente do server utils da layer `3-auth`, garantindo que todas as requisições à API externa (`api.d2dna.com`) sejam autenticadas.

## Fluxo de Curadoria

```
1. Analista acessa /app/reviews
2. Aplica filtros (opcional)
3. Seleciona um cliente da lista
4. Visualiza dados completos em /app/reviews/:uuid
5. Analisa histórico e informações
6. Decide: aprovar, rejeitar ou corrigir
7. Adiciona observação (obrigatória para rejeição)
8. Submete a decisão via POST /api/review/registro
9. Sistema registra a ação com timestamp e usuário
```
