---
title: Integração Kubb
description: Geração automática de tipos TypeScript e schemas Zod a partir do OpenAPI spec da API Tucuxi.
order: 3
---

# Integração Kubb

O [Kubb](https://kubb.dev/) é utilizado para gerar automaticamente tipos TypeScript e schemas Zod a partir da especificação OpenAPI da API Tucuxi. Isso garante que o frontend e o BFF estejam sempre sincronizados com o contrato da API.

## Comando de Geração

```bash
npm run api:generate
```

Este comando lê o arquivo `openapi/tucuxi-api.json` e gera código em `generated/tucuxi/`.

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

## Configuração

A configuração do Kubb fica em `kubb.config.ts`:

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

Os tipos são agrupados por **tag** da especificação OpenAPI (ex: `LinkageTypes`, `ClientesTypes`, `Review & Qualidade de DadosTypes`).

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

Os schemas Zod são usados para validar dados no servidor antes de encaminhar à API:

```typescript
// server/api/auth/login.post.ts
import { loginSchemaSchema } from '~/generated/tucuxi/zod'

export default defineEventHandler(async event => {
  const body = await readBody(event)

  const result = loginSchemaSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Dados inválidos'
    })
  }

  // Dados validados e tipados
  const { email, password } = result.data
  // ...
})
```

## Cliente HTTP: NÃO Usar

O Kubb pode gerar clientes HTTP, mas o Tucuxi **não utiliza** essa funcionalidade. Todas as chamadas à API são feitas via `$fetch` no BFF:

```typescript
// CORRETO: usar $fetch via BFF
const response = await $fetch(`${getApiBaseUrl()}/api/v1/review/`, {
  headers: { Authorization: `Bearer ${token}` }
})

// INCORRETO: não usar cliente HTTP gerado pelo Kubb
// import { listClientes } from '~/generated/tucuxi/client'
```

Isso garante que:

- Tokens JWT nunca sejam expostos ao browser
- Toda validação passe pelo BFF
- A URL da API externa não seja visível no client

## Fluxo de Atualização

Quando a API externa muda:

1. Obtenha o novo arquivo OpenAPI spec
2. Substitua `openapi/tucuxi-api.json`
3. Execute `npm run api:generate`
4. Verifique se há breaking changes nos tipos
5. Atualize composables e server routes conforme necessário

::docs-warning
Os warnings de lint exibidos em arquivos dentro de `generated/` são normais e esperados. Esses arquivos são gerados automaticamente pelo Kubb e não devem ser editados manualmente. Os warnings não afetam o funcionamento da aplicação.
::
