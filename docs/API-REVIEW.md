# Revisao da Spec OpenAPI — Tucuxi API v1.0.0

**Status:** Verificado contra `openapi/tucuxi-api.json` e codigo gerado pelo Kubb
**Data:** 2025-02-10
**Origem:** Integracao frontend (Kubb + Zod)

Ao integrar a spec atualizada no frontend, identificamos problemas que impactam a geracao automatica de tipos, validacao e documentacao. Todos os itens abaixo foram **verificados contra a spec e o codigo gerado**.

---

## 1. POSTs sem `requestBody` (13 endpoints)

Segundo a especificacao OpenAPI, **todo endpoint que recebe dados no body deve declarar `requestBody`**. Sem isso, ferramentas como Swagger UI, Kubb, Postman e clientes gerados nao sabem o que enviar.

O Kubb gera `MutationRequest` apenas quando `requestBody` existe. Nos 13 endpoints abaixo, nenhum `MutationRequest` foi gerado.

### Criticos (usados diretamente no frontend)

| Endpoint | O que recebe | Parametros na spec |
| --- | --- | --- |
| `POST /api/v1/usuarios/login` | `email`, `password` (JSON) | **Nenhum** (nem query, nem body) |
| `POST /api/v1/usuarios/refresh-token` | `refresh_token` | query param (deveria ser body) |
| `POST /api/v1/usuarios/reset-password` | `email` | query param (deveria ser body) |

> **Impacto direto:** O `LoginSchema` existia na spec anterior e foi removido. Isso quebrou a geracao automatica do schema Zod de validacao no BFF. Tivemos que criar o schema manualmente em `layers/3-auth/app/composables/types.ts`.

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

---

## 2. Dados sensiveis em Query Params (4 endpoints)

Estes POSTs recebem dados via **query params** em vez de **requestBody**. Isso e um problema de seguranca e conformidade LGPD:

- Query params ficam em **logs do servidor**, historico do navegador e proxies
- Dados sensiveis (tokens, emails, CPF, CNS) **nunca devem trafegar na URL**
- Ferramentas de geracao de codigo tratam query params como filtros, nao como corpo

| Endpoint | Param na query | Tipo de dado | Risco |
| --- | --- | --- | --- |
| `POST /api/v1/usuarios/refresh-token` | `refresh_token` | Token de sessao | **Critico** — permite hijack de sessao via logs |
| `POST /api/v1/usuarios/reset-password` | `email` | Dado pessoal (PII) | **Alto** — exposicao de email em logs |
| `POST /api/v1/linkage/validation/cpf` | `cpf` | Dado sensivel (LGPD) | **Critico** — CPF em URL viola LGPD |
| `POST /api/v1/linkage/validation/cns` | `cns` | Dado de saude (LGPD) | **Critico** — CNS em URL viola LGPD |

### Correcao sugerida (FastAPI)

```python
# ANTES — dados sensiveis na URL
@router.post("/refresh-token")
async def refresh_token(refresh_token: str = Query(...)):

# DEPOIS — dados no body (seguro)
@router.post("/refresh-token")
async def refresh_token(body: RefreshTokenRequest):
```

---

## 3. Responses sem schema definido (39 de 73 endpoints)

**39 de 73 endpoints (53%)** retornam `"schema": {}` na response 200/201/204. O Kubb gera `type Response = any` e `z.any()` para esses endpoints, eliminando tipagem e validacao.

### Usuarios (10 endpoints sem schema de resposta)

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

### Correcao sugerida (FastAPI)

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

---

## 4. Schemas removidos/renomeados

| Antes | Agora | Status |
| --- | --- | --- |
| `LoginSchema` | *(removido)* | **Precisa voltar** como `requestBody` do login |
| `ClienteSchemaDelete` | `DeleteClienteResponse` | OK — renomeacao valida (`message` + `uuid_cliente`) |
| `ClienteSearchGeral` | *(removido)* | OK — unificado com `ClienteSearch` |

---

## 5. Schemas modificados

### `ChangePasswordRequest`

- `minLength` da senha: **6 → 8** (tanto `active_password` quanto `new_password`)
- **Acao no frontend:** atualizar validacao nos forms de troca de senha

### `ClienteSchemaBaseGeral`

- Campo `cns`: era `string`, agora e **`string[] | null`** (array)
- Novo campo: **`cns_invalidos`** (`string[] | null`) — CNS invalidos removidos na validacao

### `ClienteSchemaUpdate`

- Campo `cns`: removeu opcao `string` avulsa, manteve so **`string[] | null`**
- Novo campo: **`cns_invalidos`** (`string[] | null`)

### `ClienteSearch`

- Campo `cns`: removeu opcao `string` avulsa, manteve so **`string[] | null`**
- Novo campo: **`cns_invalidos`** (`string[] | null`)
- Campo `data_nascimento`: adicionou `format: "date"` (YYYY-MM-DD)
- Descricoes: removeram acentuacao (normalizacao)

### `TucuxiV2Request`

- Campo `cns`: era `array | string`, agora e **`array | null`** (removeu string avulsa)
- Novo campo: **`cns_invalidos`** (`string[] | null`) — auditoria
- Descricoes: removeram acentuacao

### Novo schema: `DeleteClienteResponse`

- Campos: `message` (string, required) + `uuid_cliente` (uuid, required)
- Substitui o antigo `ClienteSchemaDelete`

---

## Resumo

| Metrica | Valor |
| --- | --- |
| Total de endpoints | 73 |
| Com `requestBody` definido | 60 (82%) |
| POST/PUT/PATCH **sem** `requestBody` | **13 (18%)** |
| Responses **sem** schema | **39 (53%)** |
| Query params com dados sensiveis | **4** |

---

## Plano de acao sugerido

### Prioridade 1 — Seguranca (LGPD)

Mover dados sensiveis de query params para requestBody:

| Endpoint | Param | Acao |
| --- | --- | --- |
| `POST /usuarios/refresh-token` | `refresh_token` | Criar `RefreshTokenRequest` model |
| `POST /usuarios/reset-password` | `email` | Criar `ResetPasswordRequest` model |
| `POST /linkage/validation/cpf` | `cpf` | Criar `ValidateCpfRequest` model |
| `POST /linkage/validation/cns` | `cns` | Criar `ValidateCnsRequest` model |

### Prioridade 2 — Autenticacao

Restaurar schemas dos endpoints de auth usados pelo frontend:

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
