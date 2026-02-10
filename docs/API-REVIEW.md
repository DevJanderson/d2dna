# Revisao da Spec OpenAPI — Tucuxi API v1.0.0

Ao integrar a spec atualizada no frontend (Kubb + Zod), identificamos alguns pontos que impactam a geracao automatica de tipos, validacao e documentacao. Segue o levantamento completo.

---

## 1. POSTs sem `requestBody` que recebem dados (13 endpoints)

Segundo a especificacao OpenAPI, **todo endpoint que recebe dados no body deve declarar `requestBody`**. Sem isso, ferramentas (Swagger UI, Kubb, Postman, clientes gerados) nao sabem o que enviar.

### Criticos (usados diretamente no frontend)

| Endpoint                              | Descricao     | O que recebe                            |
| ------------------------------------- | ------------- | --------------------------------------- |
| `POST /api/v1/usuarios/login`         | Login         | `email`, `password` (JSON)              |
| `POST /api/v1/usuarios/refresh-token` | Refresh token | `refresh_token` (esta como query param) |
| `POST /api/v1/usuarios/reset-password`| Reset senha   | `email` (esta como query param)         |

> **Nota:** O `LoginSchema` existia na spec anterior e foi removido. Isso quebrou a geracao automatica do schema Zod de validacao no BFF.

### Operacoes administrativas/internas

| Endpoint                                                   | Descricao                          |
| ---------------------------------------------------------- | ---------------------------------- |
| `POST /api/v1/review/reverter/{id_revisao}`                | Reverter revisao                   |
| `POST /api/v1/review/cns/definir-master-auto`              | Definir CNS principal (todos)      |
| `POST /api/v1/review/cns/definir-master/{uuid_cliente}`    | Definir CNS principal (cliente)    |
| `POST /api/v1/linkage/resolve-homonyms`                    | Resolver homonimos (501)           |
| `POST /api/v1/linkage/validation/cpf`                      | Validar CPF                        |
| `POST /api/v1/linkage/validation/cns`                      | Validar CNS                        |
| `POST /api/v1/metrics/fasta/reset-metrics`                 | Reset metricas                     |
| `POST /api/v1/v2/cache/clear`                              | Limpar cache                       |
| `POST /api/v1/v2/circuit-breaker/reset`                    | Reset circuit breakers             |
| `POST /api/v1/v2/circuit-breaker/{circuit_name}/reset`     | Reset circuit breaker especifico   |

---

## 2. Dados sensiveis passados como Query Params (antipadrao)

Alguns POSTs recebem dados via **query params** em vez de **requestBody**. Isso e um antipadrao porque:

- Query params ficam nos logs do servidor, historico do navegador e proxies
- Dados sensiveis (tokens, emails, senhas) nunca devem ir na URL
- Ferramentas de geracao de codigo tratam query params como filtros, nao como corpo da requisicao

| Endpoint                               | Param na query  | Deveria estar no body  |
| -------------------------------------- | --------------- | ---------------------- |
| `POST /api/v1/usuarios/refresh-token`  | `refresh_token` | Sim (dado sensivel)    |
| `POST /api/v1/usuarios/reset-password` | `email`         | Sim (dado pessoal)     |
| `POST /api/v1/linkage/validation/cpf`  | `cpf`           | Sim (dado sensivel/PII)|
| `POST /api/v1/linkage/validation/cns`  | `cns`           | Sim (dado sensivel/PII)|

---

## 3. Responses sem schema definido (39 endpoints)

**39 de 73 endpoints** retornam `"schema": {}` (vazio) na response 200/201. Sem o schema de resposta, o Kubb nao gera os tipos TypeScript de retorno, e o Swagger UI nao mostra exemplo de resposta.

### Endpoints de autenticacao (todos sem response schema)

- `POST /api/v1/usuarios/login` — deveria retornar `{ access_token, refresh_token, token_type }`
- `POST /api/v1/usuarios/refresh-token` — deveria retornar `{ access_token, ... }`
- `GET /api/v1/usuarios/verify-token` — deveria retornar status da verificacao
- `POST /api/v1/usuarios/reset-password` — deveria retornar confirmacao
- `POST /api/v1/usuarios/logout` — deveria retornar confirmacao
- `POST /api/v1/usuarios/change-password` — deveria retornar confirmacao
- `DELETE /api/v1/usuarios/{usuario_id}` — deveria retornar confirmacao

### Endpoints de clientes

- `POST /api/v1/clientes/` (201) — deveria retornar o cliente criado
- `GET /api/v1/clientes/` (200) — deveria retornar lista paginada

### Endpoints de review

- `GET /api/v1/review/estatisticas` — deveria retornar estatisticas
- `POST /api/v1/review/reverter/{id_revisao}` — deveria retornar revisao revertida
- `GET /api/v1/review/cns/analise-qualidade` — deveria retornar analise

### Endpoints de linkage

- `POST /api/v1/linkage/tucuxi` — deveria retornar resultado do match
- `POST /api/v1/linkage/batch` — deveria retornar resultados em lote
- `POST /api/v1/linkage/check-duplicates` — deveria retornar duplicatas encontradas
- `POST /api/v1/linkage/validation/cpf` — deveria retornar resultado da validacao
- `POST /api/v1/linkage/validation/cns` — deveria retornar resultado da validacao
- `POST /api/v1/linkage/explain` — deveria retornar explicacao

### Endpoints v2

- `GET /api/v1/v2/health` — deveria retornar status
- `GET /api/v1/v2/strategies` — deveria retornar estrategias
- `GET /api/v1/v2/cache/stats` — deveria retornar estatisticas

*(e mais 18 endpoints com o mesmo problema)*

---

## 4. Schemas removidos/renomeados

| Antes                | Agora                    | Observacao                                  |
| -------------------- | ------------------------ | ------------------------------------------- |
| `LoginSchema`        | *(removido)*             | Precisa voltar como `requestBody` do login  |
| `ClienteSchemaDelete`| `DeleteClienteResponse`  | OK, renomeacao valida                       |
| `ClienteSearchGeral` | *(removido)*             | OK, ja estava deprecado                     |

---

## 5. Schemas modificados

### `ChangePasswordRequest`

- `minLength` da senha: **6 → 8** (tanto senha atual quanto nova)

### `ClienteSchemaBaseGeral`

- Campo `cns`: era `string`, agora e `string[]` (array)
- Novo campo: **`cns_invalidos`** (`string[] | null`) — CNS invalidos removidos na validacao (auditoria)

### `ClienteSchemaUpdate`

- Campo `cns`: removeu opcao `string` avulsa, manteve so `array`
- Novo campo: **`cns_invalidos`** (`string[] | null`)

### `ClienteSearch`

- Campo `cns`: removeu opcao `string` avulsa, manteve so `array`
- Novo campo: **`cns_invalidos`** (`string[] | null`)
- Campo `data_nascimento`: adicionou `format: "date"`
- Descricoes: removeram acentuacao (normalizacao)

### `TucuxiV2Request`

- Campo `cns`: era `array | string`, agora e `array | null` (removeu string avulsa)
- Novo campo: **`cns_invalidos`** (`string[] | null`) — auditoria
- Descricoes: removeram acentuacao

### Novo schema: `DeleteClienteResponse`

- Campos: `message` (string) + `uuid_cliente` (uuid)
- Substitui o antigo `ClienteSchemaDelete` (mesma estrutura, nome diferente)

---

## Resumo dos numeros

| Metrica                              | Valor    |
| ------------------------------------ | -------- |
| Total de endpoints                   | 73       |
| Com `requestBody` definido           | 27 (37%) |
| POST/PUT/PATCH **sem** `requestBody` | 13 (18%) |
| Responses **sem** schema             | 39 (53%) |
| Query params com dados sensiveis     | 4        |

---

## Recomendacao

1. **Prioridade alta**: Adicionar `requestBody` nos 3 endpoints de auth (login, refresh, reset-password) + mover dados sensiveis de query params para body
2. **Prioridade media**: Definir response schemas dos endpoints que o frontend consome (clientes, review, linkage)
3. **Prioridade normal**: Completar responses dos endpoints internos/admin

Se o framework for **FastAPI**, a maioria desses schemas pode ser gerada automaticamente com Pydantic models nos parametros das rotas:

```python
# Antes (sem requestBody na spec)
@router.post("/login")
async def login(email: str = Query(...), password: str = Query(...)):

# Depois (com requestBody gerado automaticamente)
@router.post("/login")
async def login(credentials: LoginSchema):
```
