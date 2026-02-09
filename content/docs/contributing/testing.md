---
title: Testes
description: Como escrever e executar testes no Tucuxi — Vitest para unit/nuxt e Playwright para E2E.
order: 3
---

# Testes

O Tucuxi usa **Vitest** para testes unitários e de integração, e **Playwright** para testes end-to-end.

## Projetos Vitest

O `vitest.config.ts` define dois projetos com ambientes diferentes:

| Projeto  | Diretório     | Ambiente         | Uso                                                  |
| -------- | ------------- | ---------------- | ---------------------------------------------------- |
| **unit** | `tests/unit/` | Node puro        | Funções puras, utils, lógica sem dependência do Nuxt |
| **nuxt** | `tests/nuxt/` | Nuxt + happy-dom | Composables, stores, componentes Vue                 |

A separação permite que testes simples rodem de forma rápida (Node puro), enquanto testes que dependem do ecossistema Nuxt (auto-imports, plugins, runtime config) usam um ambiente mais completo.

## Comandos

```bash
# Executar todos os testes (uma vez)
npm run test:run

# Executar teste específico
npm run test -- tests/unit/exemplo.test.ts

# Executar testes em modo watch
npm run test

# Testes E2E com Playwright
npm run test:e2e

# Instalar browsers do Playwright (primeiro uso)
npm run test:e2e:install
```

## Testes Unitários (`tests/unit/`)

Para funções puras e utils que não dependem do Nuxt:

```typescript
// tests/unit/formatters.test.ts
import { describe, it, expect } from 'vitest'
import { getInitials } from '~/layers/0-base/app/utils/formatters'

describe('getInitials', () => {
  it('retorna as iniciais de um nome completo', () => {
    expect(getInitials('José Deney')).toBe('JD')
  })

  it('limita a 2 caracteres', () => {
    expect(getInitials('Ana Maria Silva')).toBe('AM')
  })
})
```

## Testes Nuxt (`tests/nuxt/`)

Para composables, stores e componentes que dependem do ecossistema Nuxt:

```typescript
// tests/nuxt/auth/useAuth.test.ts
import { describe, it, expect } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const { mockNavigateTo } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn()
}))

mockNuxtImport('navigateTo', () => mockNavigateTo)

describe('useAuth', () => {
  it('redireciona para login quando não autenticado', async () => {
    // teste aqui
    expect(mockNavigateTo).toHaveBeenCalledWith('/login')
  })
})
```

## Testes E2E (`tests/e2e/`)

Testes end-to-end usam Playwright e rodam separadamente do Vitest:

```bash
# Instalar browsers (primeiro uso)
npm run test:e2e:install

# Executar testes E2E
npm run test:e2e
```

## Mocking de Auto-Imports

O Nuxt resolve auto-imports em tempo de compilação, o que significa que funções como `navigateTo`, `useRoute`, `useFetch` e outras **não estão disponíveis via `globalThis`** no ambiente de teste.

::docs-warning
**Não use `vi.stubGlobal()`** para mockar auto-imports do Nuxt (como `navigateTo`, `useRoute`, `definePageMeta`, etc.) em testes com ambiente `nuxt`. O `vi.stubGlobal()` modifica `globalThis`, mas auto-imports do Nuxt são resolvidos na compilação e não usam `globalThis`. O mock simplesmente não terá efeito.
::

### Abordagem correta: `mockNuxtImport`

Use `mockNuxtImport` do `@nuxt/test-utils/runtime` combinado com `vi.hoisted()`:

```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// vi.hoisted() garante que o mock é criado antes de qualquer import
const { mockNavigateTo, mockUseRoute } = vi.hoisted(() => ({
  mockNavigateTo: vi.fn(),
  mockUseRoute: vi.fn(() => ({ params: { id: '123' } }))
}))

// mockNuxtImport substitui o auto-import em tempo de compilação
mockNuxtImport('navigateTo', () => mockNavigateTo)
mockNuxtImport('useRoute', () => mockUseRoute)
```

### Quando `vi.stubGlobal` funciona

O `vi.stubGlobal` **ainda funciona** para utils auto-importados de layers (como `getInitials` de `0-base/app/utils/`), pois estes são registrados de forma diferente dos auto-imports core do Nuxt.

## Estrutura de Arquivos de Teste

Organize os testes espelhando a estrutura das layers:

```
tests/
├── unit/
│   ├── formatters.test.ts        # testa utils de 0-base
│   └── reviewFormatters.test.ts  # testa utils de 4-reviews
├── nuxt/
│   ├── auth/
│   │   └── useAuth.test.ts       # testa composables de 3-auth
│   └── reviews/
│       └── useReviewStore.test.ts # testa store de 4-reviews
└── e2e/
    └── auth.spec.ts              # fluxo completo de login
```
