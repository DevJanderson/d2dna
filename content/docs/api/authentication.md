---
title: Autenticacao
description: Fluxo de autenticacao BFF com JWT, refresh token automatico e middleware de protecao de rotas.
order: 2
---

# Autenticacao

A autenticacao do Tucuxi segue o padrao **BFF (Backend for Frontend)**, onde os tokens JWT sao armazenados em cookies httpOnly no servidor Nuxt. O client nunca tem acesso direto aos tokens.

## Fluxo de Login

```
1. Usuario digita email e senha no formulario
2. Client envia POST /api/auth/login
3. BFF valida dados com Zod (loginSchemaSchema)
4. BFF chama API externa: POST api.d2dna.com/api/v1/usuarios/login
5. API retorna access_token + refresh_token
6. BFF salva tokens em cookies httpOnly
7. BFF busca dados do usuario: GET /api/v1/usuarios/logado
8. Retorna dados do usuario para o client (sem tokens)
```

### Cookies de Autenticacao

| Cookie          | Duracao | Descricao                                     |
| --------------- | ------- | --------------------------------------------- |
| `access_token`  | 1 hora  | Token de acesso para requisicoes autenticadas |
| `refresh_token` | 7 dias  | Token para renovar o access token             |

Ambos os cookies sao configurados com:

```typescript
{
  httpOnly: true,          // Inacessivel ao JavaScript
  secure: true,            // Apenas HTTPS (em producao)
  sameSite: 'strict',      // Protecao contra CSRF
  path: '/'                // Disponivel em todas as rotas
}
```

## Refresh Token Automatico

Quando o access token expira, o sistema tenta renova-lo automaticamente:

```
1. Requisicao retorna 401 (token expirado)
2. Middleware detecta a falha
3. Envia POST /api/auth/refresh
4. BFF usa refresh_token para obter novo access_token
5. Novos tokens sao salvos nos cookies
6. Requisicao original e repetida
```

Se o refresh token tambem estiver expirado ou invalido, o BFF limpa todos os cookies e o usuario e redirecionado para a pagina de login.

```typescript
// server/api/auth/refresh.post.ts
try {
  const response = await $fetch('/api/v1/usuarios/refresh-token', {
    method: 'POST',
    query: { refresh_token: refreshToken }
  })
  setAccessToken(event, response.access_token)
  setRefreshToken(event, response.refresh_token)
} catch {
  clearAuthTokens(event)
  throw createError({ statusCode: 401, message: 'Sessao expirada' })
}
```

## Logout

O logout limpa os cookies locais e notifica a API externa:

```
1. Client envia POST /api/auth/logout
2. BFF tenta chamar API externa: POST /api/v1/usuarios/logout
3. Independente do resultado, BFF limpa os cookies
4. Retorna { success: true }
```

A chamada a API externa e feita em modo "best effort" -- se falhar, o logout local ainda acontece.

## Middleware de Autenticacao

O middleware `auth` protege rotas que exigem autenticacao:

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### Funcionamento do Middleware

```typescript
export default defineNuxtRouteMiddleware(async to => {
  if (to.path === '/login') return

  const auth = useAuthStore()

  // Verifica se ja esta autenticado
  if (auth.isAuthenticated) return

  // Tenta verificar via cookie
  const isAuthenticated = await auth.checkAuth()
  if (!isAuthenticated) {
    // Tenta renovar o token
    const refreshed = await auth.refreshToken()
    if (refreshed) return
    // Redireciona para login
    return navigateTo('/login')
  }
})
```

O middleware executa a seguinte sequencia:

1. Verifica se ha usuario em memoria (store Pinia)
2. Se nao, tenta verificar autenticacao via cookie (`GET /api/auth/me`)
3. Se falhar, tenta renovar o token (`POST /api/auth/refresh`)
4. Se tudo falhar, redireciona para `/login`

## Store de Autenticacao

O estado de autenticacao e gerenciado pelo store Pinia `useAuthStore`:

```typescript
const auth = useAuthStore()

// Login
await auth.login(email, password)

// Verificar autenticacao
if (auth.isAuthenticated) {
  console.log(auth.user?.nome)
}

// Logout
await auth.logout()
```

## Paginas Publicas

As seguintes paginas nao exigem autenticacao:

| Rota               | Descricao                     |
| ------------------ | ----------------------------- |
| `/login`           | Formulario de login           |
| `/forgot-password` | Solicitacao de reset de senha |

O middleware `guest` impede que usuarios ja autenticados acessem essas paginas, redirecionando-os para a area logada.
