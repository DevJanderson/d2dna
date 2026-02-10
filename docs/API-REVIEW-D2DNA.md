# Revisao da Spec OpenAPI — Tucuxi API v1.0.0

**Data:** 2025-02-10
**Origem:** Integracao frontend (Kubb + Zod)
**Status:** Verificado contra `openapi/tucuxi-api.json` e codigo gerado

Ao integrar a spec atualizada no frontend, identificamos problemas que impactam a geracao automatica de tipos, validacao e documentacao. Todos os itens abaixo foram verificados contra a spec e o codigo gerado pelo Kubb.

---

## 1. Dados sensiveis em Query Params (4 endpoints) — LGPD

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

---

## 2. POSTs sem `requestBody` (13 endpoints)

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

---

## 3. Responses sem schema definido (39 de 73 endpoints)

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

---

## 4. Schemas removidos

| Antes | Agora | Acao necessaria |
| --- | --- | --- |
| `LoginSchema` | *(removido)* | Restaurar como `requestBody` do endpoint de login |
| `ClienteSchemaDelete` | `DeleteClienteResponse` | OK — renomeacao valida |
| `ClienteSearchGeral` | *(removido)* | OK — unificado com `ClienteSearch` |

## 5. Schemas modificados (informativo)

Mudancas que ja foram absorvidas pelo frontend. Listadas aqui para registro.

| Schema | Mudanca |
| --- | --- |
| `ChangePasswordRequest` | `minLength` da senha: 6 → **8** |
| `ClienteSchemaBaseGeral` | `cns`: `string` → `string[]`, novo campo `cns_invalidos` |
| `ClienteSchemaUpdate` | `cns`: removeu `string` avulsa, manteve `string[]`, novo campo `cns_invalidos` |
| `ClienteSearch` | `cns`: `string[]` only, novo campo `cns_invalidos`, `data_nascimento` com `format: "date"` |
| `TucuxiV2Request` | `cns`: `array \| null` (removeu string), novo campo `cns_invalidos` |
| *(novo)* `DeleteClienteResponse` | `message` + `uuid_cliente` (substitui `ClienteSchemaDelete`) |

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
