---
title: Padrao BFF
description: Como o Tucuxi-Blast implementa o padrao Backend for Frontend para autenticacao e comunicacao com APIs externas.
order: 3
---

# Padrao BFF (Backend for Frontend)

O Tucuxi-Blast usa o padrao **BFF** para toda comunicacao com a API externa (`api.d2dna.com`). O client-side nunca faz requisicoes diretamente para a API externa — tudo passa pelo servidor Nuxt, que atua como intermediario.

## Fluxo Geral

```
Browser (Client)
  |
  | $fetch('/api/auth/me')
  v
Nuxt Server (BFF)
  |
  | $fetch('https://api.d2dna.com/api/v1/usuarios/logado')
  | + Bearer token do cookie httpOnly
  v
API Externa (api.d2dna.com)
```

### Por que usar BFF?

1. **Seguranca**: Tokens ficam em cookies `httpOnly` — Javascript no browser nao tem acesso
2. **Simplificacao**: O client faz `$fetch('/api/review')` sem se preocupar com tokens
3. **Controle**: O server pode validar, transformar e filtrar dados antes de enviar ao client
4. **CORS**: Eliminado, pois o client so fala com o proprio dominio

## Armazenamento de Tokens

Tokens sao **sempre** armazenados em cookies `httpOnly`, **nunca** em `localStorage` ou `sessionStorage`:

```typescript
// layers/3-auth/server/utils/auth-api.ts
export function setAccessToken(event: H3Event, token: string, expiresIn = 3600) {
  setCookie(event, 'access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: expiresIn,
    path: '/'
  })
}
```

| Cookie          | Duracao | Uso                             |
| --------------- | ------- | ------------------------------- |
| `access_token`  | 1 hora  | Autenticacao em cada requisicao |
| `refresh_token` | 7 dias  | Renovacao do access token       |

::docs-warning{title="Nunca expor tokens ao client-side"}
Os tokens JWT **nunca** devem ser retornados ao browser. O endpoint de login salva os tokens em cookies httpOnly e retorna apenas os dados do usuario (nome, email, permissoes).
::

## Fluxo de Autenticacao

### Login

1. Usuario envia email/senha via `POST /api/auth/login`
2. BFF repassa para `POST api.d2dna.com/api/v1/usuarios/login`
3. API retorna tokens + dados do usuario
4. BFF salva tokens em cookies httpOnly
5. BFF retorna apenas os dados do usuario (sem tokens)

### Requisicoes Autenticadas

1. Browser envia cookie automaticamente em cada requisicao
2. BFF extrai o token do cookie
3. BFF adiciona `Authorization: Bearer {token}` na requisicao a API externa
4. Resposta da API e repassada ao client

### Refresh

1. Access token expirado detectado (401)
2. Client chama `POST /api/auth/refresh`
3. BFF usa `refresh_token` do cookie para obter novo `access_token`
4. Novos tokens salvos em cookies

### Logout

1. Client chama `POST /api/auth/logout`
2. BFF limpa ambos os cookies (`access_token` e `refresh_token`)

## Exemplo de Endpoint BFF

Um endpoint tipico do BFF extrai o token, faz a requisicao para a API externa e retorna o resultado:

```typescript
// layers/3-auth/server/api/auth/me.get.ts
export default defineEventHandler(async event => {
  const token = getAccessToken(event)

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Nao autenticado'
    })
  }

  try {
    const user = await $fetch(`${getApiBaseUrl()}/api/v1/usuarios/logado`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return { user }
  } catch {
    clearAuthTokens(event)
    throw createError({
      statusCode: 401,
      message: 'Token invalido'
    })
  }
})
```

## Reutilizacao entre Layers

Layers podem reutilizar os utilitarios de autenticacao do `3-auth`. Por exemplo, a layer `4-reviews` usa `getAccessToken` e `getApiBaseUrl` sem reimplementa-los:

```typescript
// layers/4-reviews/server/utils/review-api.ts
export async function reviewFetch<T>(
  event: H3Event,
  endpoint: string,
  options: { method?: string; body?: Record<string, unknown> } = {}
): Promise<T> {
  const token = getAccessToken(event) // Reutiliza do 3-auth

  if (!token) {
    throw createError({ statusCode: 401, message: 'Nao autenticado' })
  }

  return (await $fetch(`${getApiBaseUrl()}${endpoint}`, {
    method: options.method || 'GET',
    body: options.body,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })) as T
}
```

::docs-tip
Os `server/utils/` de uma layer sao auto-importados em todas as outras layers. Isso permite que `getAccessToken` e `getApiBaseUrl` definidos no `3-auth` sejam usados diretamente no `4-reviews` sem import explicito.
::

## Validacao no Server

Toda entrada do usuario deve ser validada no server com **Zod** (schemas gerados pelo Kubb):

```typescript
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

  // Prosseguir com dados validados
  const { email, password } = result.data
})
```
