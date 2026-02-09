---
title: Autenticação
description: Fluxo de autenticação BFF com JWT, refresh token automático e middleware de proteção de rotas.
order: 2
---

# Autenticação

A autenticação do Tucuxi segue o padrão **BFF (Backend for Frontend)**, onde os tokens JWT são armazenados em cookies httpOnly no servidor Nuxt. O client nunca tem acesso direto aos tokens.

## Fluxo de Login

```
1. Usuário digita email e senha no formulário
2. Client envia POST /api/auth/login
3. BFF valida dados com Zod (loginSchemaSchema)
4. BFF chama API externa: POST api.d2dna.com/api/v1/usuarios/login
5. API retorna access_token + refresh_token
6. BFF salva tokens em cookies httpOnly
7. BFF busca dados do usuário: GET /api/v1/usuarios/logado
8. Retorna dados do usuário para o client (sem tokens)
```

### Cookies de Autenticação

| Cookie          | Duração | Descrição                                     |
| --------------- | ------- | --------------------------------------------- |
| `access_token`  | 1 hora  | Token de acesso para requisições autenticadas |
| `refresh_token` | 7 dias  | Token para renovar o access token             |

Ambos os cookies são configurados com:

```typescript
{
  httpOnly: true,          // Inacessível ao JavaScript
  secure: true,            // Apenas HTTPS (em produção)
  sameSite: 'strict',      // Proteção contra CSRF
  path: '/'                // Disponível em todas as rotas
}
```

## Refresh Token Automatico

Quando o access token expira, o sistema tenta renová-lo automaticamente:

```
1. Requisição retorna 401 (token expirado)
2. Middleware detecta a falha
3. Envia POST /api/auth/refresh
4. BFF usa refresh_token para obter novo access_token
5. Novos tokens são salvos nos cookies
6. Requisição original é repetida
```

Se o refresh token também estiver expirado ou inválido, o BFF limpa todos os cookies e o usuário é redirecionado para a página de login.

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
  throw createError({ statusCode: 401, message: 'Sessão expirada' })
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

A chamada a API externa é feita em modo "best effort" -- se falhar, o logout local ainda acontece.

## Middleware de Autenticação

O middleware `auth` protege rotas que exigem autenticação:

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

  // Verifica se já está autenticado
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

O middleware executa a seguinte sequência:

1. Verifica se há usuário em memória (store Pinia)
2. Se não, tenta verificar autenticação via cookie (`GET /api/auth/me`)
3. Se falhar, tenta renovar o token (`POST /api/auth/refresh`)
4. Se tudo falhar, redireciona para `/login`

## Store de Autenticação

O estado de autenticação é gerenciado pelo store Pinia `useAuthStore`:

```typescript
const auth = useAuthStore()

// Login
await auth.login(email, password)

// Verificar autenticação
if (auth.isAuthenticated) {
  console.log(auth.user?.nome)
}

// Logout
await auth.logout()
```

## Páginas Públicas

As seguintes páginas não exigem autenticação:

| Rota               | Descrição                     |
| ------------------ | ----------------------------- |
| `/login`           | Formulário de login           |
| `/forgot-password` | Solicitação de reset de senha |

O middleware `guest` impede que usuários já autenticados acessem essas páginas, redirecionando-os para a área logada.
