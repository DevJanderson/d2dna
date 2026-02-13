# Proximos Passos — Usuarios e Clientes

**Data:** 2025-02-10
**Contexto:** Verificacao de viabilidade para implementar gestao de usuarios e consumo de clientes via API D2DNA.
**Dependencias:** `docs/API-REVIEW.md` (workarounds frontend) e `docs/API-REVIEW-D2DNA.md` (issues reportados a equipe API)

---

## Status da API D2DNA

Nenhum dos issues reportados em `API-REVIEW-D2DNA.md` foi corrigido:
- 4 dados sensiveis em query params (refresh_token, email, cpf, cns)
- 13 POSTs sem requestBody
- 39/73 endpoints com response schema vazio (`{}`)
- LoginSchema removido

**Decisao:** Seguir com workarounds no frontend. Nao bloqueia o trabalho.

---

## 1. Gestao de Usuarios

### BFF ja implementado (layer 3-auth)

| BFF Endpoint | API Externa | Status |
| --- | --- | --- |
| `POST /api/auth/login` | `POST /usuarios/login` | OK (tipo manual) |
| `POST /api/auth/logout` | `POST /usuarios/logout` | OK |
| `POST /api/auth/refresh` | `POST /usuarios/refresh-token` | OK (query param mitigado) |
| `GET /api/auth/me` | `GET /usuarios/logado` | OK |
| `POST /api/auth/forgot-password` | `POST /usuarios/reset-password` | OK |
| `GET /api/usuarios` | `GET /usuarios/` | OK (tipos Kubb) |
| `POST /api/usuarios/signup` | `POST /usuarios/signup` | OK (tipos Kubb) |
| `POST /api/usuarios/change-password` | `POST /usuarios/change-password` | OK (tipos Kubb) |
| `PUT /api/usuarios/[id]` | `PUT /usuarios/{usuario_id}` | OK (tipos Kubb) |

### BFF a implementar

| BFF Endpoint | API Externa | Tipos Kubb | Notas |
| --- | --- | --- | --- |
| `GET /api/usuarios/[id]` | `GET /usuarios/{usuario_id}` | OK (`UsuarioSchemaDetalhes`) | |
| `DELETE /api/usuarios/[id]` | `DELETE /usuarios/{usuario_id}` | resp `any` | Tipo manual simples |
| `PATCH /api/usuarios/[id]/status` | `PATCH /usuarios/{usuario_id}/status` | OK (`UsuarioStatusUpdate`) | Ativar/desativar |
| `POST /api/usuarios/[id]/foto-perfil` | `POST /usuarios/{usuario_id}/foto-perfil` | OK (multipart) | Upload de imagem |
| `DELETE /api/usuarios/[id]/foto-perfil` | `DELETE /usuarios/{usuario_id}/foto-perfil` | resp `any` | Tipo manual simples |
| `POST /api/usuarios/[id]/change-password` | `POST /usuarios/{usuario_id}/change-password` | OK | Admin reset |

### Tipos Kubb disponiveis

- `UsuarioSchemaCreate` — cadastro
- `UsuarioSchemaDetalhes` — perfil completo
- `UsuarioSchemaList` — item da lista
- `UsuarioSchemaUpdate` — edicao
- `UsuariosPaginadosCursorSchema` — lista paginada (cursor)
- `UsuarioStatusUpdate` — ativar/desativar
- `BodyUploadFotoPerfilApiV1UsuariosUsuarioIdFotoPerfilPost` — upload foto

---

## 2. Clientes (CRUD)

### BFF a implementar (nenhum existe ainda)

| BFF Endpoint | API Externa | Tipos Kubb | Notas |
| --- | --- | --- | --- |
| `GET /api/clientes` | `GET /clientes/` | resp `any` | **Precisa tipo manual** (lista paginada) |
| `POST /api/clientes` | `POST /clientes/` | req OK, resp `any` | **Precisa tipo manual** (cliente criado) |
| `GET /api/clientes/[uuid]` | `GET /clientes/{uuid_cliente}` | OK | |
| `PUT /api/clientes/[uuid]` | `PUT /clientes/{uuid_cliente}` | OK | |
| `DELETE /api/clientes/[uuid]` | `DELETE /clientes/{uuid_cliente}` | OK (`DeleteClienteResponse`) | |
| `GET /api/clientes/[uuid]/cns` | `GET /clientes/{uuid_cliente}/cns` | OK (`ClienteCNSSchema`) | |
| `POST /api/clientes/[uuid]/cns` | `POST /clientes/{uuid_cliente}/cns` | OK | |
| `GET /api/clientes/[uuid]/detalhes` | `GET /clientes/{uuid_cliente}/detalhes` | OK (`ClienteDetalheSchema`) | |
| `POST /api/clientes/[uuid]/detalhes` | `POST /clientes/{uuid_cliente}/detalhes` | OK | |
| `PUT /api/clientes/[uuid]/detalhes/[id]` | `PUT /clientes/{uuid_cliente}/detalhes/{detalhe_id}` | OK | |

### Historico de clientes

| BFF Endpoint | API Externa | Tipos Kubb |
| --- | --- | --- |
| `GET /api/historico-cliente/[uuid]` | `GET /historico-cliente/{uuid_cliente}` | resp `any` |
| `POST /api/historico-cliente` | `POST /historico-cliente/` | OK |
| `DELETE /api/historico-cliente/[id]` | `DELETE /historico-cliente/{registro_historico_id}` | resp `any` |

### Tipos Kubb disponiveis

- `ClienteSchemaBaseGeral` — dados base (inclui `cns: string[]`)
- `ClienteSchemaUpdate` — edicao
- `ClienteSearch` — busca (query params)
- `ClienteCNSSchema` — CNS do cliente
- `ClienteDetalheSchema` — detalhes adicionais
- `DeleteClienteResponse` — resposta de exclusao

### Tipos manuais necessarios

```typescript
// Sugestao: layers/{N}-clientes/app/composables/types.ts

// Resposta paginada de clientes (GET /clientes/)
interface ClientesPaginadosResponse {
  items: ClienteSchemaBaseGeral[]
  next_cursor: string | null
  total?: number
}

// Resposta de criacao (POST /clientes/)
// Provavelmente retorna o cliente criado — validar com dados reais
type CreateClienteResponse = ClienteSchemaBaseGeral
```

---

## 3. Pendencias do API-REVIEW.md

| Item | Descricao | Acao |
| --- | --- | --- |
| A1 | `layers/3-auth/CLAUDE.md` referencia `loginSchemaSchema` do Kubb (removido) | Atualizar linha ~103 para referenciar schema manual em `types.ts` |
| A2 | 3 componentes renderizam `cns` como string | Corrigir para tratar `string[]` |

### A2 — Arquivos a corrigir

```
layers/4-reviews/app/components/ReviewTimeline.vue:73    → review.cns || '—'
layers/4-reviews/app/components/ReviewCardList.vue:69    → review.cns
layers/4-reviews/app/pages/reviews/[uuid].vue:98         → review.cns || '—'
```

Sugestao: criar util `formatCns(cns: string[] | string | null): string` em `reviewFormatters.ts`.

---

## 4. Arquitetura sugerida

### Nova layer para clientes

```
layers/{N}-clientes/
├── nuxt.config.ts
├── app/
│   ├── components/
│   │   ├── ClienteList.vue
│   │   ├── ClienteCard.vue
│   │   ├── ClienteForm.vue
│   │   └── ClienteDetail.vue
│   ├── composables/
│   │   ├── types.ts              ← tipos manuais (paginacao)
│   │   ├── useClienteApi.ts      ← service ($fetch → BFF)
│   │   └── useClienteStore.ts    ← Pinia store
│   └── pages/
│       └── app/
│           ├── clientes/
│           │   └── index.vue     ← lista
│           └── clientes/
│               └── [uuid].vue    ← detalhe
└── server/
    ├── api/clientes/             ← BFF endpoints
    │   ├── index.get.ts
    │   ├── index.post.ts
    │   ├── [uuid].get.ts
    │   ├── [uuid].put.ts
    │   ├── [uuid].delete.ts
    │   └── ...
    └── utils/
        └── cliente-api.ts        ← reutiliza authFetch do 3-auth
```

### Pattern BFF (reutilizar)

```typescript
// server/utils/cliente-api.ts
import { getAccessToken, getApiBaseUrl } from '~/layers/3-auth/server/utils/auth-api'

export async function clienteFetch<T>(event: H3Event, endpoint: string, options = {}) {
  const token = getAccessToken(event)
  const baseUrl = getApiBaseUrl()
  return $fetch<T>(`${baseUrl}/api/v1/clientes${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...options.headers }
  })
}
```

---

## 5. Ordem de execucao sugerida

1. Corrigir A1 (CLAUDE.md do 3-auth) e A2 (`cns` como array) — rapido
2. Criar layer de clientes com BFF basico (GET lista + GET individual)
3. Expandir gestao de usuarios (endpoints faltantes no BFF)
4. Implementar CRUD completo de clientes
5. Historico de clientes
