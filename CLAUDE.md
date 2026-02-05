# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Sempre responda em Português Brasileiro (pt-BR).

## Git

- Não incluir `Co-Authored-By` nos commits
- Mensagens de commit em português (Conventional Commits)
- Branch principal de trabalho: `develop`
- Fluxo: `feature/*` → `develop` → `staging` → `main`

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

## Arquitetura

Nuxt 4 + shadcn-vue + Tailwind CSS v4 + **Nuxt Layers**.

**Tudo é layer** - não existe pasta `app/` na raiz. Arquitetura layers-only.

## Design System

Estilo **MX (Machine Experience)** - design para humanos e máquinas:

- **Fontes**: Space Grotesk (sans) + Space Mono (mono)
- **ASCII Art**: Logos, bordas, separadores
- **Efeitos**: Cursor piscando, scanlines (CRT)
- **Espaçamento**: 8pt Grid System
- **Cores**: Por contexto/profissão (verde=dev, azul=ciência, etc.)

### Estrutura Principal

```
layers/                 # TUDO fica aqui (inclusive server/)
  0-base/               # Fundação + UI: app.vue, CSS, shadcn-vue, utils
  1-desktop/            # Sistema de janelas estilo desktop (Windows/macOS)
  2-home/               # Página inicial (design MX, ASCII art)
  3-auth/               # Autenticação (BFF, cookies httpOnly)
generated/              # Código gerado pelo Kubb (tipos, schemas)
tests/                  # unit/, integration/, e2e/
```

> **Server dentro das layers:** Cada layer pode conter seu próprio `server/` com endpoints específicos.

> Use hífen (`-`) no nome das layers, não ponto. Layers em `~/layers` são auto-registradas.

**Caminhos em layers:** Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` não funcionam.

### Ordem de Prioridade (Layers)

```
3-auth > 2-home > 1-desktop > 0-base
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

| Método | Quando usar | SSR |
|--------|-------------|-----|
| `useFetch` | Carregamento inicial (páginas) | Sim |
| `$fetch` | Eventos do usuário (cliques) | Não |

### Utils vs Composables

- **Utils** (`layers/0-base/app/utils/`): Funções puras, sem estado Vue
- **Composables** (`layers/{N}-{feature}/app/composables/`): Lógica com `ref`, `computed`

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

Ver [docs/KUBB.md](docs/KUBB.md) para implementação completa.

## Documentação por Diretório

Cada diretório principal tem seu próprio `CLAUDE.md` com instruções específicas:

| Documento | Conteúdo |
|-----------|----------|
| [layers/0-base/CLAUDE.md](layers/0-base/CLAUDE.md) | Fundação, UI, shadcn-vue, utils |
| [layers/1-desktop/CLAUDE.md](layers/1-desktop/CLAUDE.md) | Sistema de janelas (useWindowManager) |
| [layers/2-home/CLAUDE.md](layers/2-home/CLAUDE.md) | Página inicial (design MX) |
| [layers/3-auth/CLAUDE.md](layers/3-auth/CLAUDE.md) | Autenticação (BFF, cookies) |
| [tests/CLAUDE.md](tests/CLAUDE.md) | Vitest, Playwright, mocking |
