---
title: Visao Geral da API
description: Arquitetura da API externa, padrao BFF e organizacao dos endpoints por feature.
order: 1
---

# Visao Geral da API

O Tucuxi-Webapp se comunica com a API externa hospedada em `api.d2dna.com`. Toda comunicacao entre o frontend e a API passa por um **BFF (Backend for Frontend)** implementado nas server routes do Nuxt.

## Arquitetura BFF

O client (browser) **nunca** se comunica diretamente com a API externa. Todas as requisicoes passam pelo servidor Nuxt:

```
Browser → Nuxt Server (BFF) → api.d2dna.com
                ↕
         Cookies httpOnly
         (tokens JWT)
```

### Por que usar BFF?

| Beneficio         | Descricao                                                           |
| ----------------- | ------------------------------------------------------------------- |
| **Seguranca**     | Tokens JWT ficam em cookies httpOnly, inacessiveis ao JavaScript    |
| **Controle**      | Servidor valida dados com Zod antes de enviar a API                 |
| **Simplificacao** | Client usa rotas simples (`/api/auth/login`), BFF traduz para a API |
| **Privacidade**   | URL da API externa nao e exposta ao browser                         |

## Endpoints Organizados por Feature

Cada layer do Nuxt expoe seus proprios endpoints BFF:

### Autenticacao (layer 3-auth)

| Rota BFF                    | Metodo | API Externa                             |
| --------------------------- | ------ | --------------------------------------- |
| `/api/auth/login`           | POST   | `POST /api/v1/usuarios/login`           |
| `/api/auth/logout`          | POST   | `POST /api/v1/usuarios/logout`          |
| `/api/auth/refresh`         | POST   | `POST /api/v1/usuarios/refresh-token`   |
| `/api/auth/me`              | GET    | `GET /api/v1/usuarios/logado`           |
| `/api/auth/forgot-password` | POST   | `POST /api/v1/usuarios/forgot-password` |

### Curadoria (layer 4-reviews)

| Rota BFF                      | Metodo | API Externa                          |
| ----------------------------- | ------ | ------------------------------------ |
| `/api/review`                 | GET    | `GET /api/v1/review/`                |
| `/api/review/registro`        | POST   | `POST /api/v1/review/registro`       |
| `/api/review/relatorio`       | GET    | `GET /api/v1/review/relatorio`       |
| `/api/review/estatisticas`    | GET    | `GET /api/v1/review/estatisticas`    |
| `/api/review/historico/:uuid` | GET    | `GET /api/v1/review/historico/:uuid` |
| `/api/review/reverter/:id`    | POST   | `POST /api/v1/review/reverter/:id`   |

## Autenticacao via JWT

Os tokens JWT sao gerenciados inteiramente pelo BFF:

1. **Login**: BFF recebe credenciais, autentica na API e armazena tokens em cookies httpOnly
2. **Requisicoes**: BFF extrai o token do cookie e adiciona no header `Authorization: Bearer <token>`
3. **Refresh**: BFF renova o access token automaticamente usando o refresh token
4. **Logout**: BFF limpa os cookies e notifica a API

O client nunca tem acesso direto aos tokens. Ele envia requisicoes para as rotas BFF e os cookies sao incluidos automaticamente pelo browser.

## Validacao de Dados

Todas as requisicoes ao BFF sao validadas com schemas Zod antes de serem encaminhadas a API:

```typescript
// server/api/auth/login.post.ts
const result = loginSchemaSchema.safeParse(body)
if (!result.success) {
  throw createError({ statusCode: 400, message: 'Email e senha sao obrigatorios' })
}
```

Os schemas Zod sao gerados automaticamente pelo Kubb a partir do OpenAPI spec da API. Veja [Integracao Kubb](/docs/api/kubb-integration) para detalhes.

## Helper de Requisicao Autenticada

Cada layer pode criar seu proprio helper para requisicoes autenticadas:

```typescript
// server/utils/review-api.ts
export async function reviewFetch<T>(event: H3Event, endpoint: string, options = {}) {
  const token = getAccessToken(event)
  if (!token) throw createError({ statusCode: 401 })

  return await $fetch(`${getApiBaseUrl()}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
}
```

As funcoes `getAccessToken` e `getApiBaseUrl` sao fornecidas pela layer `3-auth` e ficam disponiveis automaticamente via auto-import do Nitro.
