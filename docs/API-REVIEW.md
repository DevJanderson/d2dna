# Revisao da Spec OpenAPI — Tucuxi API v1.0.0

**Status:** Verificado contra `openapi/tucuxi-api.json` e codigo gerado pelo Kubb
**Data:** 2025-02-10

Este documento esta dividido em duas partes:

- **Parte A** — O que precisamos resolver no Tucuxi (workarounds internos)
- **Parte B** — O que a API D2DNA precisa corrigir (report para o backend externo)

---

# Parte A — Tucuxi (workarounds internos)

Tarefas que precisamos resolver no nosso lado por causa de limitacoes na spec da API externa.

## A1. LoginSchema removido da spec (ja resolvido)

O `LoginSchema` foi removido da spec OpenAPI. O Kubb nao gera mais o schema Zod de validacao.

**Workaround aplicado:** Schema criado manualmente em `layers/3-auth/app/composables/types.ts`:

```typescript
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

> Nota: o `minLength` ja esta em 8 (alinhado com o novo `ChangePasswordRequest`).

**Pendencia:** Atualizar o `CLAUDE.md` da layer `3-auth` que ainda referencia `loginSchemaSchema` do Kubb como se existisse.

## A2. Campo `cns` mudou de `string` para `string[]`

A API agora retorna `cns` como array de strings (`string[] | null`) em vez de string unica. Componentes que exibem CNS precisam ser revisados:

| Arquivo | Uso atual | Acao |
| --- | --- | --- |
| `ReviewTimeline.vue:73` | `review.cns \|\| '—'` | Verificar se renderiza array corretamente |
| `ReviewCardList.vue:69` | `review.cns` (exibe direto) | Pode precisar de `.join(', ')` ou exibir lista |
| `ReviewFilters.vue:60` | Input texto para filtro CNS | OK — filtro envia string, API aceita |
| `reviews/[uuid].vue:98` | `review.cns \|\| '—'` | Verificar se renderiza array corretamente |

**Acao:** Testar com dados reais da API. Se a API ja retornava array antes e so a spec que mudou, pode estar OK. Se o dado realmente mudou, ajustar os componentes.

## A3. Novo campo `cns_invalidos` (nao usado)

A API adicionou `cns_invalidos` (`string[] | null`) em varios schemas (BaseGeral, Update, Search, TucuxiV2Request). O campo contem CNS invalidos removidos na validacao (auditoria).

**Acao:** Decidir se exibimos essa informacao na UI de reviews. Nao e bloqueante — o campo e opcional e nao quebra nada.

## A4. Refresh token enviado como query param

O BFF envia `refresh_token` como query param porque e assim que a API espera:

```typescript
// layers/3-auth/server/api/auth/refresh.post.ts
const response = await $fetch(`${getApiBaseUrl()}/api/v1/usuarios/refresh-token`, {
  method: 'POST',
  query: { refresh_token: refreshToken }
})
```

**Risco mitigado:** A chamada e server-to-server (BFF → API), nao sai do browser. O token nao aparece na URL do usuario, mas pode aparecer em logs do servidor Nuxt e da API.

**Acao:** Quando a API D2DNA mover o `refresh_token` para requestBody, atualizar de `query` para `body` nesse arquivo.

## A5. Tipos `any` nos endpoints consumidos

O Kubb gera `type Response = any` para 39 endpoints. Os que consumimos no frontend nao tem tipagem automatica.

**Workaround atual:** Usamos tipos manuais onde necessario (ex: `LoginResponse` em `login.post.ts`).

**Acao futura:** Quando a API D2DNA adicionar `response_model`, regenerar com `npm run api:generate` e remover tipos manuais.

## A6. `minLength` da senha mudou de 6 para 8

O `ChangePasswordRequest` agora exige `minLength: 8` para `active_password` e `new_password`.

**Workaround atual:** O `loginSchema` manual ja usa `min(8)`.

**Acao:** Verificar se existe form de troca de senha no frontend. Se sim, garantir que a validacao client-side use `min(8)`.

---

## Resumo Tucuxi

| Item | Status | Prioridade |
| --- | --- | --- |
| A1. LoginSchema manual | Feito | — |
| A2. `cns` como array | Testar com dados reais | Media |
| A3. Campo `cns_invalidos` | Decidir se exibe na UI | Baixa |
| A4. Refresh token query param | Mitigado (server-to-server) | Aguardar API |
| A5. Tipos `any` | Workaround parcial | Aguardar API |
| A6. minLength 8 | Login OK, verificar troca de senha | Media |

---
---

# Parte B — API D2DNA (report para o backend externo)

Issues identificadas na spec OpenAPI que precisam ser corrigidas no backend FastAPI.

## B1. Dados sensiveis em Query Params (4 endpoints) — LGPD

Estes POSTs recebem dados via **query params** em vez de **requestBody**. Query params ficam em logs do servidor, historico do navegador e proxies.

| Endpoint | Param na query | Tipo de dado | Risco |
| --- | --- | --- | --- |
| `POST /api/v1/usuarios/refresh-token` | `refresh_token` | Token de sessao | **Critico** — permite hijack de sessao via logs |
| `POST /api/v1/usuarios/reset-password` | `email` | Dado pessoal (PII) | **Alto** — exposicao de email em logs |
| `POST /api/v1/linkage/validation/cpf` | `cpf` | Dado sensivel (LGPD) | **Critico** — CPF em URL viola LGPD |
| `POST /api/v1/linkage/validation/cns` | `cns` | Dado de saude (LGPD) | **Critico** — CNS em URL viola LGPD |

**Correcao sugerida:**

```python
# ANTES — dados sensiveis na URL
@router.post("/refresh-token")
async def refresh_token(refresh_token: str = Query(...)):

# DEPOIS — dados no body (seguro)
class RefreshTokenRequest(BaseModel):
    refresh_token: str

@router.post("/refresh-token")
async def refresh_token(body: RefreshTokenRequest):
```

## B2. POSTs sem `requestBody` (13 endpoints)

Todo endpoint que recebe dados no body deve declarar `requestBody` na spec OpenAPI. Sem isso, ferramentas como Swagger UI, Kubb e Postman nao sabem o que enviar. O Kubb nao gera tipos de request para esses endpoints.

### Criticos (usados diretamente no frontend)

| Endpoint | O que recebe | Parametros na spec |
| --- | --- | --- |
| `POST /api/v1/usuarios/login` | `email`, `password` (JSON) | **Nenhum** (nem query, nem body) |
| `POST /api/v1/usuarios/refresh-token` | `refresh_token` | query param (deveria ser body) |
| `POST /api/v1/usuarios/reset-password` | `email` | query param (deveria ser body) |

> **Nota:** O `LoginSchema` existia na spec anterior e foi removido. Precisamos que volte como `requestBody` do endpoint de login.

### Operacoes administrativas/internas

| Endpoint | Parametros na spec |
| --- | --- |
| `POST /api/v1/review/reverter/{id_revisao}` | path: `id_revisao` (integer) |
| `POST /api/v1/review/cns/definir-master-auto` | **Nenhum** |
| `POST /api/v1/review/cns/definir-master/{uuid_cliente}` | path: `uuid_cliente` (uuid) |
| `POST /api/v1/linkage/resolve-homonyms` | **Nenhum** (retorna 501) |
| `POST /api/v1/linkage/validation/cpf` | query: `cpf` (deveria ser body) |
| `POST /api/v1/linkage/validation/cns` | query: `cns` (deveria ser body) |
| `POST /api/v1/metrics/fasta/reset-metrics` | **Nenhum** |
| `POST /api/v1/v2/cache/clear` | **Nenhum** |
| `POST /api/v1/v2/circuit-breaker/reset` | **Nenhum** |
| `POST /api/v1/v2/circuit-breaker/{circuit_name}/reset` | path: `circuit_name` (string) |

## B3. Responses sem schema definido (39 de 73 endpoints)

**39 de 73 endpoints (53%)** retornam `"schema": {}` na response 200/201/204. Isso impede a geracao automatica de tipos TypeScript e schemas de validacao no frontend.

### Usuarios (10 endpoints)

| Metodo | Endpoint | Status |
| --- | --- | --- |
| POST | `/api/v1/usuarios/login` | 200 |
| POST | `/api/v1/usuarios/refresh-token` | 200 |
| GET | `/api/v1/usuarios/verify-token` | 200 |
| POST | `/api/v1/usuarios/reset-password` | 200 |
| POST | `/api/v1/usuarios/logout` | 200 |
| POST | `/api/v1/usuarios/change-password` | 200 |
| DELETE | `/api/v1/usuarios/{usuario_id}` | 200 |
| POST | `/api/v1/usuarios/{usuario_id}/change-password` | 200 |
| DELETE | `/api/v1/usuarios/{usuario_id}/foto-perfil` | 200 |
| POST | `/api/v1/usuarios/{usuario_id}/foto-perfil` | 200 |

### Clientes (3 endpoints)

| Metodo | Endpoint | Status |
| --- | --- | --- |
| POST | `/api/v1/clientes/` | 201 |
| GET | `/api/v1/clientes/` | 200 |
| PUT | `/api/v1/clientes/{uuid_cliente}/detalhes/{detalhe_id}` | 200 |

### Historico de Clientes (2 endpoints)

| Metodo | Endpoint | Status |
| --- | --- | --- |
| GET | `/api/v1/historico-cliente/{uuid_cliente}` | 200 |
| DELETE | `/api/v1/historico-cliente/{registro_historico_id}` | 204 |

### Linkage (12 endpoints)

| Metodo | Endpoint | Status |
| --- | --- | --- |
| POST | `/api/v1/linkage/tucuxi` | 200 |
| POST | `/api/v1/linkage/batch` | 200 |
| POST | `/api/v1/linkage/check-duplicates` | 200 |
| POST | `/api/v1/linkage/explain` | 200 |
| GET | `/api/v1/linkage/deterministic/cliente/{uuid_cliente}/cns` | 200 |
| GET | `/api/v1/linkage/statistics/field-quality` | 200 |
| GET | `/api/v1/linkage/metrics` | 200 |
| GET | `/api/v1/linkage/strategies` | 200 |
| POST | `/api/v1/linkage/deterministic/multi-cns` | 200 |
| POST | `/api/v1/linkage/validation/batch` | 200 |
| POST | `/api/v1/linkage/validation/cns` | 200 |
| POST | `/api/v1/linkage/validation/cpf` | 200 |

### Review & Qualidade de Dados (5 endpoints)

| Metodo | Endpoint | Status |
| --- | --- | --- |
| POST | `/api/v1/review/cns/definir-master-auto` | 200 |
| POST | `/api/v1/review/cns/definir-master/{uuid_cliente}` | 200 |
| GET | `/api/v1/review/estatisticas` | 200 |
| POST | `/api/v1/review/reverter/{id_revisao}` | 200 |
| GET | `/api/v1/review/cns/analise-qualidade` | 200 |

### Tucuxi v2 (7 endpoints)

| Metodo | Endpoint | Status |
| --- | --- | --- |
| GET | `/api/v1/v2/cache/stats` | 200 |
| GET | `/api/v1/v2/circuit-breaker/stats` | 200 |
| POST | `/api/v1/v2/cache/clear` | 200 |
| GET | `/api/v1/v2/health` | 200 |
| GET | `/api/v1/v2/strategies` | 200 |
| POST | `/api/v1/v2/circuit-breaker/reset` | 200 |
| POST | `/api/v1/v2/circuit-breaker/{circuit_name}/reset` | 200 |

**Correcao sugerida (FastAPI):**

```python
# ANTES — response sem schema (gera "schema": {} no OpenAPI)
@router.post("/login")
async def login(...):
    return {"access_token": token, "refresh_token": refresh}

# DEPOIS — response com schema (gera tipos automaticamente)
@router.post("/login", response_model=TokenResponse)
async def login(...) -> TokenResponse:
    return TokenResponse(access_token=token, refresh_token=refresh)
```

## B4. Schemas removidos

| Antes | Agora | Acao necessaria |
| --- | --- | --- |
| `LoginSchema` | *(removido)* | Restaurar como `requestBody` do endpoint de login |
| `ClienteSchemaDelete` | `DeleteClienteResponse` | OK — renomeacao valida |
| `ClienteSearchGeral` | *(removido)* | OK — unificado com `ClienteSearch` |

## B5. Schemas modificados (informativo)

Mudancas que ja foram absorvidas pelo frontend via regeneracao do Kubb. Listadas aqui para registro.

| Schema | Mudanca |
| --- | --- |
| `ChangePasswordRequest` | `minLength` da senha: 6 → **8** |
| `ClienteSchemaBaseGeral` | `cns`: `string` → `string[]`, novo campo `cns_invalidos` |
| `ClienteSchemaUpdate` | `cns`: removeu `string` avulsa, manteve `string[]`, novo campo `cns_invalidos` |
| `ClienteSearch` | `cns`: `string[]` only, novo campo `cns_invalidos`, `data_nascimento` com `format: "date"` |
| `TucuxiV2Request` | `cns`: `array \| null` (removeu string), novo campo `cns_invalidos` |
| *(novo)* `DeleteClienteResponse` | `message` + `uuid_cliente` (substitui `ClienteSchemaDelete`) |

---

## Resumo numerico

| Metrica | Valor |
| --- | --- |
| Total de endpoints | 73 |
| Com `requestBody` definido | 60 (82%) |
| POST/PUT/PATCH **sem** `requestBody` | **13 (18%)** |
| Responses **sem** schema | **39 (53%)** |
| Query params com dados sensiveis | **4** |

## Plano de acao sugerido para API D2DNA

### Prioridade 1 — Seguranca (LGPD)

Mover dados sensiveis de query params para requestBody:

| Endpoint | Param | Acao |
| --- | --- | --- |
| `POST /usuarios/refresh-token` | `refresh_token` | Criar `RefreshTokenRequest` model |
| `POST /usuarios/reset-password` | `email` | Criar `ResetPasswordRequest` model |
| `POST /linkage/validation/cpf` | `cpf` | Criar `ValidateCpfRequest` model |
| `POST /linkage/validation/cns` | `cns` | Criar `ValidateCnsRequest` model |

### Prioridade 2 — Autenticacao

Restaurar schemas dos endpoints de auth:

| Endpoint | Acao |
| --- | --- |
| `POST /usuarios/login` | Adicionar `requestBody` (LoginSchema) + `response_model` (TokenResponse) |
| `POST /usuarios/refresh-token` | Adicionar `response_model` (TokenResponse) |
| `GET /usuarios/verify-token` | Adicionar `response_model` |
| `POST /usuarios/change-password` | Adicionar `response_model` |

### Prioridade 3 — Endpoints consumidos pelo frontend

Adicionar `response_model` nos endpoints que o frontend consome:

- `POST /api/v1/clientes/` (201) — retornar cliente criado
- `GET /api/v1/clientes/` (200) — retornar lista paginada
- `GET /api/v1/review/estatisticas` (200) — retornar estatisticas
- `POST /api/v1/linkage/tucuxi` (200) — retornar resultado do match

### Prioridade 4 — Completar spec

Adicionar `response_model` nos 25 endpoints restantes (admin/internos).
