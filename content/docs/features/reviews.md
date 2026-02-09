---
title: Curadoria de Dados
description: Sistema de revisao humana dos resultados de linkage, com interface de curadoria para aprovar, rejeitar ou corrigir registros.
order: 2
---

# Curadoria de Dados

O sistema de curadoria permite que analistas revisem os resultados do record linkage, garantindo que decisoes criticas sobre unificacao de registros passem por supervisao humana. A curadoria e essencial para a "zona cinzenta" -- matches com score entre 75% e 95% que nao sao automaticamente classificados.

## Layer 4-reviews

A funcionalidade de curadoria esta implementada na layer `4-reviews`, que segue a arquitetura de layers do Nuxt:

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

## Paginas

A curadoria possui duas paginas principais:

### Lista de clientes (`/app/reviews`)

Exibe todos os clientes pendentes de revisao com:

- **Filtros** por nome, CPF, CNS e data de nascimento
- **Paginacao cursor** para navegacao eficiente em grandes volumes
- **Barra de estatisticas** com totais por status
- **Tabela** com dados resumidos de cada cliente

### Detalhe do cliente (`/app/reviews/[uuid]`)

Exibe informacoes completas de um cliente especifico:

- Dados pessoais (nome, CPF, CNS, data de nascimento, nome da mae)
- Historico de revisoes anteriores
- Timeline de acoes
- Botoes de acao (aprovar, rejeitar, corrigir)
- Campo de observacao para justificativa

## Status dos Reviews

Cada registro pode ter um dos seguintes status:

| Status        | Cor      | Descricao                                         |
| ------------- | -------- | ------------------------------------------------- |
| **pendente**  | Cinza    | Aguardando revisao de um analista                 |
| **aprovado**  | Verde    | Dados confirmados como corretos                   |
| **rejeitado** | Vermelho | Dados identificados como incorretos ou duplicados |
| **corrigido** | Amarelo  | Dados foram ajustados durante a revisao           |

## Endpoints BFF

A layer expoe os seguintes endpoints via BFF (Backend for Frontend):

| Rota                          | Metodo | Descricao                           |
| ----------------------------- | ------ | ----------------------------------- |
| `/api/review`                 | GET    | Listar clientes para revisao        |
| `/api/review/registro`        | POST   | Registrar uma revisao               |
| `/api/review/relatorio`       | GET    | Obter relatorio de revisoes         |
| `/api/review/estatisticas`    | GET    | Estatisticas por status             |
| `/api/review/historico/:uuid` | GET    | Historico de revisoes de um cliente |
| `/api/review/reverter/:id`    | POST   | Reverter uma revisao registrada     |

## Integracao com Autenticacao

O BFF da layer `4-reviews` reutiliza a infraestrutura de autenticacao da layer `3-auth`:

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

As funcoes `getAccessToken` e `getApiBaseUrl` sao importadas automaticamente do server utils da layer `3-auth`, garantindo que todas as requisicoes a API externa (`api.d2dna.com`) sejam autenticadas.

## Fluxo de Curadoria

```
1. Analista acessa /app/reviews
2. Aplica filtros (opcional)
3. Seleciona um cliente da lista
4. Visualiza dados completos em /app/reviews/:uuid
5. Analisa historico e informacoes
6. Decide: aprovar, rejeitar ou corrigir
7. Adiciona observacao (obrigatoria para rejeicao)
8. Submete a decisao via POST /api/review/registro
9. Sistema registra a acao com timestamp e usuario
```
