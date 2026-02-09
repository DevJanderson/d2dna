# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Sempre responda em Português Brasileiro (pt-BR).

## Git

- Não incluir `Co-Authored-By` nos commits
- Mensagens de commit em português (Conventional Commits)
- Branch principal de trabalho: `develop`
- Fluxo: `feature/*` → `develop` → `staging` → `main`
- Commitlint: `subject-case: lower-case`, max 72 chars no subject, `body-max-line-length: 100`

## Comandos

```bash
# Setup (primeiro uso)
npm install
npm run setup        # Configura git hooks (Husky + Commitlint)

# Desenvolvimento
npm run dev          # Servidor dev http://localhost:3000
npm run build        # Build produção

# Qualidade de código
npm run lint:fix     # Corrigir ESLint
npm run format       # Formatar com Prettier
npm run typecheck    # Verificar tipos
npm run quality:fix  # Corrigir lint + formatar

# Testes (Vitest - dois projetos: unit + nuxt)
npm run test:run           # Vitest (uma execução)
npm run test -- path/to/file.test.ts  # Executar teste específico
npm run test:e2e           # Playwright E2E
npm run test:e2e:install   # Instala browsers (primeiro uso)

# API (Kubb)
npm run api:generate       # Gera tipos e schemas do OpenAPI → generated/
```

### Projetos Vitest

O `vitest.config.ts` define dois projetos com ambientes diferentes:

- **`tests/unit/`**: Ambiente Node puro (rápido) — funções puras, utils
- **`tests/nuxt/`**: Ambiente Nuxt com happy-dom (mais lento) — composables, stores, componentes
- **`tests/e2e/`**: Playwright (separado, não passa pelo Vitest)

## Antes de iniciar o servidor

Sempre verificar se já há servidor rodando na porta 3000 antes de iniciar um novo:

```bash
lsof -i :3000  # Se retornar algo, matar o processo primeiro
```

Isso evita múltiplos servidores rodando em background, que podem travar o computador.

## Componentes shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes ficam em `layers/0-base/app/components/ui/` (auto-import).

## Formatação

Prettier: `semi: false`, `singleQuote: true`, `printWidth: 100`, `trailingComma: 'none'`.

ESLint: `no-console: warn` (permite `warn`/`error`), `vue/html-self-closing: always` (inclusive HTML normal).

## Arquitetura

Nuxt 4 + shadcn-vue + Tailwind CSS v4 + **Nuxt Layers**.

**Tudo é layer** - não existe pasta `app/` na raiz. Arquitetura layers-only.

## Tailwind CSS v4

Tailwind v4 **não usa `tailwind.config.js`** — toda configuração fica em CSS puro:

- Config principal: `layers/0-base/app/assets/css/main.css`
- Temas, fontes e variáveis via `@theme` e `:root` no CSS
- Plugin via Vite: `@tailwindcss/vite` (configurado em `nuxt.config.ts`)

## Design System

Estilo **MX (Machine Experience)** - design para humanos e máquinas:

- **Fontes**: Space Grotesk (sans) + Space Mono (mono)
- **ASCII Art**: Logos, bordas, separadores
- **Efeitos**: Cursor piscando, scanlines (CRT) — scanlines usam `z-index: 10`, elementos acima precisam de `z-20+`
- **Espaçamento**: 8pt Grid System (48-64px entre seções, 32px interno, 24px entre elementos)
- **Cores**: Por contexto/profissão (verde=dev, azul=ciência, etc.)

### Estrutura Principal

```
layers/                 # TUDO fica aqui (inclusive server/)
  0-base/               # Fundação + UI + sistema de janelas (Desktop, AppWindow, Dock)
  2-home/               # Página inicial (design MX, ASCII art)
  3-auth/               # Autenticação (BFF, cookies httpOnly)
  4-reviews/            # Curadoria de dados (review de clientes)
  5-docs/               # Site de documentação
content/docs/           # Conteúdo markdown (Nuxt Content v3, collection definida em content.config.ts)
generated/              # Código gerado pelo Kubb (tipos, schemas)
tests/                  # unit/, integration/, e2e/
```

> **Server dentro das layers:** Cada layer pode conter seu próprio `server/` com endpoints específicos.

> Use hífen (`-`) no nome das layers, não ponto. Layers em `~/layers` são auto-registradas.

**Caminhos em layers:** Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` não funcionam.

### Ordem de Prioridade (Layers)

```
5-docs > 4-reviews > 3-auth > 2-home > 0-base
```

Número maior = maior prioridade = sobrescreve layers anteriores.

### Fluxo de Dados

```
UI → Composable/Store → Service → API
```

### Estrutura de uma Feature Layer

```
layers/{N}-{feature}/
├── nuxt.config.ts              # Obrigatório (pode ser vazio)
├── app/
│   ├── components/             # Prefixar: {Feature}Card.vue
│   ├── composables/
│   │   ├── types.ts            # Interfaces
│   │   ├── use{Feature}Api.ts  # Service ($fetch)
│   │   └── use{Feature}Store.ts # Pinia store
│   └── pages/{feature}/
└── server/api/{feature}/       # CRUD endpoints
```

## Padrões de Código

### Service (API)

```typescript
export function useExampleApi() {
  async function getAll() {
    return $fetch('/api/examples')
  }
  return { getAll }
}
```

### Store (Composition API)

```typescript
export const useExampleStore = defineStore('example', () => {
  const items = ref<Example[]>([])
  const api = useExampleApi() // Instanciar no setup

  async function fetchAll() {
    items.value = await api.getAll()
  }

  return { items, fetchAll }
})
```

### Data Fetching

| Método     | Quando usar                    | SSR |
| ---------- | ------------------------------ | --- |
| `useFetch` | Carregamento inicial (páginas) | Sim |
| `$fetch`   | Eventos do usuário (cliques)   | Não |

### Utils vs Composables

- **Utils** (`layers/0-base/app/utils/`): Funções puras, sem estado Vue
- **Composables** (`layers/{N}-{feature}/app/composables/`): Lógica com `ref`, `computed`

## Testes — Mocking de Auto-Imports

`vi.stubGlobal()` **NÃO funciona** para auto-imports do Nuxt (`navigateTo`, `useRoute`, etc.) em testes com ambiente `nuxt`. Auto-imports são resolvidos na compilação. Usar `mockNuxtImport`:

```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
const { mockNavigateTo } = vi.hoisted(() => ({ mockNavigateTo: vi.fn() }))
mockNuxtImport('navigateTo', () => mockNavigateTo)
```

`vi.stubGlobal` funciona para utils auto-importados de layers (ex: `getInitials`).

## Segurança

Módulos `nuxt-security` e `nuxt-csurf` já configurados.

```typescript
// Tokens em cookies httpOnly (nunca localStorage)
setCookie(event, 'token', value, { httpOnly: true, secure: true, sameSite: 'strict' })

// SEMPRE validar no servidor com Zod
const result = schema.safeParse(body)
if (!result.success) throw createError({ statusCode: 400 })
```

## Integração com APIs Externas (Kubb)

Para integrar com APIs externas, usar o padrão **Kubb + BFF**:

```bash
npm run api:generate    # Gera tipos e schemas do OpenAPI
```

- **Tipos Kubb**: usar em composables e server
- **Schemas Zod**: usar para validação no BFF
- **Cliente HTTP**: NÃO usar (usar $fetch via BFF)

Conteúdo gerado fica em `generated/` (não editar manualmente, warnings de lint nessa pasta são esperados).

## Documentação

### Por diretório (CLAUDE.md)

Cada diretório principal tem seu próprio `CLAUDE.md` com instruções específicas:

| Documento                                          | Conteúdo                                            |
| -------------------------------------------------- | --------------------------------------------------- |
| [layers/0-base/CLAUDE.md](layers/0-base/CLAUDE.md)       | Fundação, UI, shadcn-vue, utils, sistema de janelas |
| [layers/2-home/CLAUDE.md](layers/2-home/CLAUDE.md)       | Página inicial (design MX)                          |
| [layers/3-auth/CLAUDE.md](layers/3-auth/CLAUDE.md)       | Autenticação (BFF, cookies)                         |
| [layers/4-reviews/CLAUDE.md](layers/4-reviews/CLAUDE.md) | Curadoria de dados (review de clientes)             |
| [layers/5-docs/CLAUDE.md](layers/5-docs/CLAUDE.md)       | Site de documentação                                |
| [tests/CLAUDE.md](tests/CLAUDE.md)                       | Vitest, Playwright, mocking                         |

### Técnica (docs/)

| Documento                                | Conteúdo                               |
| ---------------------------------------- | -------------------------------------- |
| [docs/SECURITY.md](docs/SECURITY.md)    | nuxt-security, CSP, rate limiter, CSRF |
| [docs/PRD.md](docs/PRD.md)              | Product Requirements Document          |
