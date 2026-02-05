# Arquitetura do Tucuxi WebApp

Este documento descreve a arquitetura de layers e integração com a API Tucuxi.

## Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  layers/                                                         │
│  ├── 0-base/      → Fundação + UI (shadcn-vue)                  │
│  ├── 1-desktop/   → Sistema de janelas (workspace do analista)  │
│  ├── 2-home/      → Página inicial (design MX)                  │
│  ├── 3-auth/      → Autenticação                                │
│  ├── 4-clientes/  → Gestão de clientes + histórico              │
│  ├── 5-busca/     → Motor de busca (Linkage + Tucuxi v2)        │
│  └── 6-admin/     → Administração (usuários + métricas)         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ $fetch('/api/*')
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVIDOR (Nitro BFF)                        │
├─────────────────────────────────────────────────────────────────┤
│  layers/*/server/api/                                           │
│  ├── auth/        → Login, logout, refresh (cookies httpOnly)   │
│  ├── clientes/    → Proxy para API externa                      │
│  ├── busca/       → Proxy para Linkage/Tucuxi v2                │
│  └── admin/       → Proxy para usuários/métricas                │
└───────────────────────────┬─────────────────────────────────────┘
                            │ fetch() com Bearer token
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API EXTERNA (api.d2dna.com)                   │
├─────────────────────────────────────────────────────────────────┤
│  /api/v1/usuarios/    → Autenticação e usuários                 │
│  /api/v1/clientes/    → CRUD de clientes                        │
│  /api/v1/historico_cliente/ → Auditoria                         │
│  /api/v1/review/      → Qualidade de dados                      │
│  /api/v1/linkage/     → Busca determinística/probabilística     │
│  /api/v1/v2/          → Tucuxi v2 (busca híbrida)               │
│  /api/v1/metrics/     → Métricas FASTA                          │
└─────────────────────────────────────────────────────────────────┘
```

## Estrutura de Layers

### Prioridade

```
6-admin > 5-busca > 4-clientes > 3-auth > 2-home > 1-desktop > 0-base
```

Número maior = maior prioridade = sobrescreve layers anteriores.

### Responsabilidades

| Layer | Responsabilidade | Dependências |
|-------|------------------|--------------|
| `0-base` | UI (shadcn-vue), utils, tipos globais | - |
| `1-desktop` | Sistema de janelas, dock, workspace | 0-base |
| `2-home` | Página inicial (design MX) | 0-base, 3-auth |
| `3-auth` | Login, logout, refresh, guard de rotas | 0-base |
| `4-clientes` | CRUD clientes, histórico, review | 3-auth |
| `5-busca` | Linkage, Tucuxi v2, busca inteligente | 3-auth |
| `6-admin` | Gestão de usuários, métricas | 3-auth |

### Estrutura de cada Layer

```
layers/{N}-{feature}/
├── nuxt.config.ts
├── CLAUDE.md                    # Documentação da layer
├── app/
│   ├── components/
│   │   └── {Feature}*.vue       # Prefixo com nome da feature
│   ├── composables/
│   │   ├── types.ts             # Re-exporta tipos do Kubb
│   │   ├── use{Feature}Api.ts   # Service (chama BFF)
│   │   └── use{Feature}Store.ts # Pinia store
│   └── pages/{feature}/
│       └── *.vue
└── server/
    ├── api/{feature}/           # Rotas BFF
    │   └── *.ts
    └── utils/
        └── {feature}-api.ts     # Helper para API externa
```

## Integração com API Externa

### Tipos e Schemas (Kubb)

```typescript
// Tipos - usar em qualquer lugar
import type { ClienteSchemaBaseGeral } from '~/generated/tucuxi/types'

// Schemas Zod - usar no BFF para validação
import { clienteSchemaBaseGeralSchema } from '~/generated/tucuxi/zod'
```

### Padrão BFF

**Frontend (composable):**
```typescript
// layers/4-clientes/app/composables/useClientesApi.ts
export function useClientesApi() {
  async function buscarPorCpf(cpf: string) {
    return $fetch(`/api/clientes/cpf/${cpf}`)
  }
  return { buscarPorCpf }
}
```

**Backend (server route):**
```typescript
// layers/4-clientes/server/api/clientes/cpf/[cpf].get.ts
export default defineEventHandler(async (event) => {
  const cpf = getRouterParam(event, 'cpf')
  const token = getApiToken(event) // Cookie httpOnly

  return await $fetch(`https://api.d2dna.com/api/v1/linkage/deterministic/cpf/${cpf}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
})
```

## Fluxo de Autenticação

```
1. Login
   Browser → POST /api/auth/login → { email, password }
   Server  → API Externa → { access_token, refresh_token }
   Server  → setCookie(httpOnly) → Tokens seguros

2. Requisições autenticadas
   Browser → GET /api/clientes/* → Cookie enviado automaticamente
   Server  → getCookie() → Token recuperado
   Server  → API Externa → Bearer token

3. Refresh automático
   Server  → Token expirado? → POST /api/v1/usuarios/refresh-token
   Server  → Novos tokens → setCookie()

4. Logout
   Browser → POST /api/auth/logout
   Server  → deleteCookie() → Tokens removidos
```

## Fluxo do Analista

```
┌─────────┐     ┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  Login  │ ──▶ │   Busca     │ ──▶ │  Visualiza/  │ ──▶ │  Review  │
│ (3-auth)│     │  (5-busca)  │     │    Edita     │     │(4-client)│
└─────────┘     └─────────────┘     │ (4-clientes) │     └──────────┘
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Histórico   │
                                    │ (4-clientes) │
                                    └──────────────┘
```

## Decisões Técnicas

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Tokens | Cookie httpOnly | Segurança (XSS) |
| Validação | Zod (Kubb) | Type-safe + runtime |
| Estado | Pinia | Reatividade Vue |
| HTTP Client | $fetch (Nuxt) | SSR + interceptors |
| UI | shadcn-vue | Customizável + acessível |
| Janelas | 1-desktop | UX de analista |
