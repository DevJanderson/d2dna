# Layer 3-auth - CLAUDE.md

Autenticação com padrão BFF (Backend for Frontend). Tokens armazenados em cookies httpOnly.

## Estrutura

```
layers/3-auth/
├── nuxt.config.ts
├── app/
│   ├── components/
│   │   ├── AuthLoginForm.vue    # Formulário de login
│   │   └── AuthUserMenu.vue     # Menu do usuário (avatar, logout)
│   ├── composables/
│   │   ├── types.ts             # Re-exporta tipos do Kubb
│   │   ├── useAuthApi.ts        # Service para endpoints auth
│   │   └── useAuthStore.ts      # Estado de autenticação (Pinia)
│   ├── middleware/
│   │   └── auth.ts              # Guard de rotas autenticadas
│   └── pages/
│       └── login.vue            # Página de login
└── server/
    ├── api/auth/
    │   ├── login.post.ts        # POST /api/auth/login
    │   ├── logout.post.ts       # POST /api/auth/logout
    │   ├── refresh.post.ts      # POST /api/auth/refresh
    │   └── me.get.ts            # GET /api/auth/me
    └── utils/
        └── auth-api.ts          # Helpers de token (cookies httpOnly)
```

## Endpoints BFF

| Rota | Método | Descrição |
|------|--------|-----------|
| `/api/auth/login` | POST | Login com email/senha |
| `/api/auth/logout` | POST | Logout (limpa cookies) |
| `/api/auth/refresh` | POST | Renova access token |
| `/api/auth/me` | GET | Dados do usuário logado |

## Fluxo de Autenticação

```
Login:
  1. Usuário envia email/senha → POST /api/auth/login
  2. BFF chama API externa → POST /api/v1/usuarios/login
  3. BFF salva tokens em cookies httpOnly
  4. Retorna dados do usuário (sem tokens)

Requisições:
  1. Cookie enviado automaticamente pelo browser
  2. BFF extrai token do cookie
  3. BFF adiciona Bearer token na requisição à API externa

Refresh:
  1. Token expirado detectado
  2. POST /api/auth/refresh
  3. BFF usa refresh_token para obter novo access_token
  4. Novos tokens salvos em cookies

Logout:
  1. POST /api/auth/logout
  2. BFF limpa cookies
```

## Tipos Kubb

```typescript
import type { LoginSchema, UsuarioLogadoSchema } from '~/generated/tucuxi/types'
import { loginSchemaSchema } from '~/generated/tucuxi/zod'
```

## Uso

```typescript
// Em qualquer componente
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

## Middleware

Adicione `definePageMeta({ middleware: 'auth' })` em páginas protegidas.

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```
