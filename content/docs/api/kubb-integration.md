---
title: Integracao Kubb
description: Geracao automatica de tipos TypeScript e schemas Zod a partir do OpenAPI spec da API Tucuxi.
order: 3
---

# Integracao Kubb

O [Kubb](https://kubb.dev/) e utilizado para gerar automaticamente tipos TypeScript e schemas Zod a partir da especificacao OpenAPI da API Tucuxi. Isso garante que o frontend e o BFF estejam sempre sincronizados com o contrato da API.

## Comando de Geracao

```bash
npm run api:generate
```

Este comando le o arquivo `openapi/tucuxi-api.json` e gera codigo em `generated/tucuxi/`.

## Estrutura Gerada

```
generated/tucuxi/
├── types/                    # Tipos TypeScript
│   ├── index.ts              # Barrel export
│   ├── ReviewSchema.ts       # Tipo de review
│   ├── LoginSchema.ts        # Tipo de login
│   ├── SmartSearchRequest.ts # Tipo de busca inteligente
│   ├── LinkageTypes/         # Tipos agrupados por tag
│   ├── ClientesTypes/        # Tipos de clientes
│   └── ...
├── zod/                      # Schemas Zod
│   ├── index.ts              # Barrel export
│   ├── reviewCreateSchemaSchema.ts
│   ├── loginSchemaSchema.ts
│   └── ...
└── index.ts                  # Export principal
```

## Configuracao

A configuracao do Kubb fica em `kubb.config.ts`:

```typescript
import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

export default defineConfig({
  input: {
    path: './openapi/tucuxi-api.json'
  },
  output: {
    path: './generated/tucuxi',
    clean: true
  },
  plugins: [
    pluginOas(),
    pluginTs({ output: { path: './types' } }),
    pluginZod({ output: { path: './zod' } })
  ]
})
```

Os tipos sao agrupados por **tag** da especificacao OpenAPI (ex: `LinkageTypes`, `ClientesTypes`, `Review & Qualidade de DadosTypes`).

## Usando Tipos nas Composables

Importe os tipos gerados para tipar suas composables e stores:

```typescript
// layers/4-reviews/app/composables/types.ts
export type {
  ReviewSchema,
  ReviewCreateSchema,
  PaginatedResponseReviewSchema,
  PaginationMeta
} from '~/generated/tucuxi/types'
```

```typescript
// layers/3-auth/app/composables/types.ts
export type { LoginSchema, UsuarioLogadoSchema } from '~/generated/tucuxi/types'
```

## Usando Schemas Zod no BFF

Os schemas Zod sao usados para validar dados no servidor antes de encaminhar a API:

```typescript
// server/api/auth/login.post.ts
import { loginSchemaSchema } from '~/generated/tucuxi/zod'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const result = loginSchemaSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Dados invalidos'
    })
  }

  // Dados validados e tipados
  const { email, password } = result.data
  // ...
})
```

## Cliente HTTP: NAO Usar

O Kubb pode gerar clientes HTTP, mas o Tucuxi **nao utiliza** essa funcionalidade. Todas as chamadas a API sao feitas via `$fetch` no BFF:

```typescript
// CORRETO: usar $fetch via BFF
const response = await $fetch(`${getApiBaseUrl()}/api/v1/review/`, {
  headers: { Authorization: `Bearer ${token}` }
})

// INCORRETO: nao usar cliente HTTP gerado pelo Kubb
// import { listClientes } from '~/generated/tucuxi/client'
```

Isso garante que:

- Tokens JWT nunca sejam expostos ao browser
- Toda validacao passe pelo BFF
- A URL da API externa nao seja visivel no client

## Fluxo de Atualizacao

Quando a API externa muda:

1. Obtenha o novo arquivo OpenAPI spec
2. Substitua `openapi/tucuxi-api.json`
3. Execute `npm run api:generate`
4. Verifique se ha breaking changes nos tipos
5. Atualize composables e server routes conforme necessario

::docs-warning
Os warnings de lint exibidos em arquivos dentro de `generated/` sao normais e esperados. Esses arquivos sao gerados automaticamente pelo Kubb e nao devem ser editados manualmente. Os warnings nao afetam o funcionamento da aplicacao.
::
