# Roadmap de Implementação

Este documento define a ordem de implementação das features do Tucuxi WebApp.

## Fase 1: Fundação (Concluído)

- [x] Estrutura de layers (0-base)
- [x] Configuração Kubb (tipos e schemas da API)
- [x] Sistema de janelas (workspace do analista)
- [x] Componentes shadcn-vue base

## Fase 2: Autenticação (3-auth)

### Objetivo
Implementar autenticação segura com BFF pattern.

### Endpoints BFF

| Rota | Método | Função |
|------|--------|--------|
| `/api/auth/login` | POST | Login com email/senha |
| `/api/auth/logout` | POST | Logout (limpa cookies) |
| `/api/auth/refresh` | POST | Renova access token |
| `/api/auth/me` | GET | Dados do usuário logado |

### Componentes

- [ ] `AuthLoginForm.vue` - Formulário de login
- [ ] `AuthUserMenu.vue` - Menu do usuário (avatar, logout)

### Composables

- [ ] `useAuthStore.ts` - Estado de autenticação (Pinia)
- [ ] `useAuthApi.ts` - Service para endpoints auth

### Middleware

- [ ] `auth.ts` - Guard de rotas autenticadas

### Páginas

- [ ] `/login` - Página de login
- [ ] Redirect automático se não autenticado

---

## Fase 3: Busca de Clientes (5-busca)

### Objetivo
Implementar motor de busca para o analista encontrar clientes.

### Endpoints BFF

| Rota | Método | Função |
|------|--------|--------|
| `/api/busca/cpf/:cpf` | GET | Busca por CPF |
| `/api/busca/cns/:cns` | GET | Busca por CNS |
| `/api/busca/composite` | POST | Busca composta |
| `/api/busca/phonetic` | POST | Busca fonética |
| `/api/busca/tucuxi` | POST | Busca híbrida v2 |

### Componentes

- [ ] `BuscaForm.vue` - Formulário de busca unificado
- [ ] `BuscaResultados.vue` - Lista de resultados
- [ ] `BuscaClienteCard.vue` - Card de cliente nos resultados

### Composables

- [ ] `useBuscaStore.ts` - Estado de busca
- [ ] `useBuscaApi.ts` - Service para endpoints

### Páginas/Janelas

- [ ] Janela de busca no workspace (0-base)

---

## Fase 4: Gestão de Clientes (4-clientes)

### Objetivo
Visualizar, editar e gerenciar clientes.

### Endpoints BFF

| Rota | Método | Função |
|------|--------|--------|
| `/api/clientes/:uuid` | GET | Detalhes do cliente |
| `/api/clientes/:uuid` | PUT | Atualizar cliente |
| `/api/clientes/:uuid/cns` | GET | Lista CNS do cliente |
| `/api/clientes/:uuid/historico` | GET | Histórico de alterações |
| `/api/clientes/:uuid/review` | POST | Registrar revisão |

### Componentes

- [ ] `ClienteDetalhe.vue` - Visualização completa
- [ ] `ClienteForm.vue` - Formulário de edição
- [ ] `ClienteCNSList.vue` - Lista de CNS
- [ ] `ClienteHistorico.vue` - Timeline de alterações
- [ ] `ClienteReviewForm.vue` - Formulário de revisão

### Composables

- [ ] `useClientesStore.ts` - Estado de clientes
- [ ] `useClientesApi.ts` - Service para endpoints

### Páginas/Janelas

- [ ] Janela de detalhes do cliente
- [ ] Janela de histórico
- [ ] Janela de revisão

---

## Fase 5: Administração (6-admin)

### Objetivo
Área administrativa para gestão de usuários e métricas.

### Endpoints BFF

| Rota | Método | Função |
|------|--------|--------|
| `/api/admin/usuarios` | GET | Lista de usuários |
| `/api/admin/usuarios` | POST | Criar usuário |
| `/api/admin/usuarios/:id` | PUT | Atualizar usuário |
| `/api/admin/usuarios/:id/status` | PATCH | Ativar/desativar |
| `/api/admin/metricas` | GET | Métricas do sistema |

### Componentes

- [ ] `AdminUsuariosList.vue` - Lista de usuários
- [ ] `AdminUsuarioForm.vue` - Formulário CRUD
- [ ] `AdminMetricasDashboard.vue` - Dashboard de métricas

### Composables

- [ ] `useAdminStore.ts` - Estado de admin
- [ ] `useAdminApi.ts` - Service para endpoints

### Páginas

- [ ] `/admin` - Dashboard administrativo
- [ ] `/admin/usuarios` - Gestão de usuários

---

## Prioridades

```
┌─────────────────────────────────────────────────────────────┐
│                        CRÍTICO                               │
│  Fase 2: Auth - Sem isso, nada funciona                     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         ALTO                                 │
│  Fase 3: Busca - Core do trabalho do analista               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        MÉDIO                                 │
│  Fase 4: Clientes - Visualização e edição                   │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        BAIXO                                 │
│  Fase 5: Admin - Pode ser feito depois                      │
└─────────────────────────────────────────────────────────────┘
```

## Estimativa de Complexidade

| Fase | Layer | Complexidade | Dependências |
|------|-------|--------------|--------------|
| 2 | 3-auth | Média | Kubb, 0-base |
| 3 | 5-busca | Alta | 3-auth |
| 4 | 4-clientes | Alta | 3-auth, 5-busca |
| 5 | 6-admin | Média | 3-auth |

## Próximos Passos

1. **Agora**: Implementar `3-auth` (autenticação)
2. **Depois**: Implementar `5-busca` (motor de busca)
3. **Seguinte**: Implementar `4-clientes` (gestão)
4. **Futuro**: Implementar `6-admin` (administração)

## Tipos Kubb Relevantes por Fase

### Fase 2 (Auth)
```typescript
import type { LoginSchema, UsuarioLogadoSchema } from '~/generated/tucuxi/types'
import { loginSchemaSchema } from '~/generated/tucuxi/zod'
```

### Fase 3 (Busca)
```typescript
import type {
  CompositeSearchRequest,
  CompositeSearchResponse,
  TucuxiV2Request,
  TucuxiV2Response,
  PhoneticSearchRequest
} from '~/generated/tucuxi/types'
```

### Fase 4 (Clientes)
```typescript
import type {
  ClienteSchemaBaseGeral,
  ClienteDetalheSchema,
  ClienteCNSSchema,
  HistoricoClienteResponse,
  ReviewSchema
} from '~/generated/tucuxi/types'
```

### Fase 5 (Admin)
```typescript
import type {
  UsuarioSchemaList,
  UsuarioSchemaCreate,
  UsuarioSchemaUpdate
} from '~/generated/tucuxi/types'
```
