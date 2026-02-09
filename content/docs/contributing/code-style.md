---
title: Padrões de Código
description: Convenções de formatação, lint, commits e padrões de arquitetura usados no Tucuxi.
order: 2
---

# Padrões de Código

Este guia documenta as convenções de código, formatação e padrões de arquitetura adotados no projeto.

## Formatação (Prettier)

O projeto usa Prettier com a seguinte configuração:

| Opção           | Valor    |
| --------------- | -------- |
| `semi`          | `false`  |
| `singleQuote`   | `true`   |
| `printWidth`    | `100`    |
| `trailingComma` | `'none'` |

```bash
# Formatar todos os arquivos
npm run format

# Corrigir lint + formatar de uma vez
npm run quality:fix
```

## Lint (ESLint)

Regras principais:

| Regra                   | Configuração                                      |
| ----------------------- | ------------------------------------------------- |
| `no-console`            | `warn` — permite `console.warn` e `console.error` |
| `vue/html-self-closing` | `always` — inclusive para elementos HTML normais  |

```bash
# Verificar e corrigir lint
npm run lint:fix
```

## Commits

O projeto usa **Conventional Commits** em **português brasileiro** com as seguintes regras:

- **Subject em lower-case** — `feat(auth): adiciona login com google` (correto)
- **Máximo de 72 caracteres** no subject
- **Tipos comuns**: `feat`, `fix`, `refactor`, `style`, `chore`, `test`, `docs`
- **Escopo opcional**: nome da layer ou módulo entre parênteses

Exemplos:

```
feat(reviews): adiciona filtro por status na listagem
fix(auth): corrige refresh token expirado
refactor(base): extrai lógica de janelas para composable
style: aplica formatação prettier em todo o projeto
chore: atualiza dependências do nuxt
test(auth): adiciona testes para middleware de autenticação
docs: atualiza guia de contribuição
```

O **Commitlint** valida automaticamente suas mensagens de commit via git hooks (configurados pelo Husky).

## Fluxo Git

O projeto segue o padrão de branches:

```
feature/* → develop → staging → main
```

| Branch      | Uso                                      |
| ----------- | ---------------------------------------- |
| `feature/*` | Desenvolvimento de novas funcionalidades |
| `develop`   | Branch principal de trabalho             |
| `staging`   | Validação antes de produção              |
| `main`      | Produção                                 |

## Padrões de Arquitetura

### Service (API)

Services encapsulam chamadas HTTP usando `$fetch` e são funções simples (não composables):

```typescript
export function useExampleApi() {
  async function getAll() {
    return $fetch('/api/examples')
  }

  async function getById(id: string) {
    return $fetch(`/api/examples/${id}`)
  }

  async function create(data: CreateExampleDto) {
    return $fetch('/api/examples', { method: 'POST', body: data })
  }

  return { getAll, getById, create }
}
```

### Store (Composition API)

Stores usam Pinia com a Composition API (não a Options API):

```typescript
export const useExampleStore = defineStore('example', () => {
  const items = ref<Example[]>([])
  const loading = ref(false)
  const api = useExampleApi() // Instanciar no setup

  const isEmpty = computed(() => items.value.length === 0)

  async function fetchAll() {
    loading.value = true
    try {
      items.value = await api.getAll()
    } finally {
      loading.value = false
    }
  }

  return { items, loading, isEmpty, fetchAll }
})
```

### Data Fetching

| Método     | Quando usar                           | SSR |
| ---------- | ------------------------------------- | --- |
| `useFetch` | Carregamento inicial (páginas)        | Sim |
| `$fetch`   | Eventos do usuário (cliques, submits) | Nao |

Use `useFetch` em páginas para carregamento inicial com suporte a SSR. Use `$fetch` em handlers de eventos do usuário (cliques, submissões de formulário).

### Utils vs Composables

| Tipo            | Local                                   | Características                                     |
| --------------- | --------------------------------------- | --------------------------------------------------- |
| **Utils**       | `layers/0-base/app/utils/`              | Funções puras, sem estado Vue, sem `ref`/`computed` |
| **Composables** | `layers/{N}-{feature}/app/composables/` | Lógica reativa com `ref`, `computed`, `watch`       |

**Utils** são funções puras que não dependem do sistema de reatividade do Vue:

```typescript
// layers/0-base/app/utils/formatters.ts
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
```

**Composables** encapsulam lógica reativa e podem usar refs, computeds e watchers:

```typescript
// layers/{N}-{feature}/app/composables/useFeatureStore.ts
export const useFeatureStore = defineStore('feature', () => {
  const items = ref<Feature[]>([])
  const total = computed(() => items.value.length)
  return { items, total }
})
```

## Componentes

- Componentes em layers ficam direto em `app/components/` (sem subpastas), prefixados com o nome da feature
- Componentes shadcn-vue ficam em `layers/0-base/app/components/ui/` (auto-import)
- Para adicionar novos componentes shadcn-vue: `npx shadcn-vue@latest add <componente>`
