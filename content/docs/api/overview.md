---
title: Visão Geral da API
description: Arquitetura da API externa, padrão BFF e organização dos endpoints por feature.
order: 1
---

# Visão Geral da API

O Tucuxi-Webapp se comunica com a API externa hospedada em `api.d2dna.com`. Toda comunicação entre o frontend e a API passa por um **BFF (Backend for Frontend)** implementado nas server routes do Nuxt.

## Arquitetura BFF

O client (browser) **nunca** se comunica diretamente com a API externa. Todas as requisições passam pelo servidor Nuxt:

```
Browser → Nuxt Server (BFF) → api.d2dna.com
                ↕
         Cookies httpOnly
         (tokens JWT)
```

### Por que usar BFF?

| Benefício         | Descrição                                                            |
| ----------------- | ------------------------------------------------------------------- |
| **Segurança**     | Tokens JWT ficam em cookies httpOnly, inacessíveis ao JavaScript    |
| **Controle**      | Servidor valida dados com Zod antes de enviar a API                 |
| **Simplificação** | Client usa rotas simples (`/api/auth/login`), BFF traduz para a API |
| **Privacidade**   | URL da API externa não é exposta ao browser                         |

## Endpoints Organizados por Feature

Cada layer do Nuxt expõe seus próprios endpoints BFF:

### Autenticação (layer 3-auth)

| Rota BFF                    | Método | API Externa                             |
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

## Autenticação via JWT

Os tokens JWT são gerenciados inteiramente pelo BFF:

1. **Login**: BFF recebe credenciais, autentica na API e armazena tokens em cookies httpOnly
2. **Requisições**: BFF extrai o token do cookie e adiciona no header `Authorization: Bearer <token>`
3. **Refresh**: BFF renova o access token automaticamente usando o refresh token
4. **Logout**: BFF limpa os cookies e notifica a API

O client nunca tem acesso direto aos tokens. Ele envia requisições para as rotas BFF e os cookies são incluídos automaticamente pelo browser.

## Validação de Dados

Todas as requisições ao BFF são validadas com schemas Zod antes de serem encaminhadas à API:

```typescript
// server/api/auth/login.post.ts
const result = loginSchemaSchema.safeParse(body)
if (!result.success) {
  throw createError({ statusCode: 400, message: 'Email e senha são obrigatórios' })
}
```

Os schemas Zod são gerados automaticamente pelo Kubb a partir do OpenAPI spec da API. Veja [Integração Kubb](/docs/api/kubb-integration) para detalhes.

## Helper de Requisição Autenticada

Cada layer pode criar seu próprio helper para requisições autenticadas:

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

As funções `getAccessToken` e `getApiBaseUrl` são fornecidas pela layer `3-auth` e ficam disponíveis automaticamente via auto-import do Nitro.
