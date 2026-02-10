# API Review — Workarounds Tucuxi

**Data:** 2025-02-10
**Contexto:** Mudancas na spec OpenAPI da API D2DNA que impactam o frontend.
**Report externo:** Ver `API-REVIEW-D2DNA.md` para o report enviado ao time da API.

---

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

## Resumo

| Item | Status | Prioridade |
| --- | --- | --- |
| A1. LoginSchema manual | Feito | — |
| A2. `cns` como array | Testar com dados reais | Media |
| A3. Campo `cns_invalidos` | Decidir se exibe na UI | Baixa |
| A4. Refresh token query param | Mitigado (server-to-server) | Aguardar API |
| A5. Tipos `any` | Workaround parcial | Aguardar API |
| A6. minLength 8 | Login OK, verificar troca de senha | Media |
