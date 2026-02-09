---
title: Guia de Desenvolvimento
description: Como configurar o ambiente, criar feature layers e trabalhar no dia a dia com o Tucuxi.
order: 1
---

# Guia de Desenvolvimento

Este guia cobre o fluxo de trabalho diário para desenvolvimento no Tucuxi-Webapp.

## Pré-requisitos

- **Node.js 20+** — recomendamos usar [nvm](https://github.com/nvm-sh/nvm) ou [fnm](https://github.com/Schniz/fnm)
- **npm** — incluído com o Node.js

## Setup Inicial

::docs-steps
::docs-step{title="Instalar dependências" step=1}

```bash
npm install
```

::
::docs-step{title="Configurar git hooks" step=2}

```bash
npm run setup
```

Isso configura o **Husky** (git hooks) e o **Commitlint** para garantir que seus commits sigam o padrão Conventional Commits em português.
::
::docs-step{title="Configurar variáveis de ambiente" step=3}

```bash
cp .env.example .env
```

Edite o `.env` com as credenciais do seu ambiente. Consulte o `.env.example` para a lista completa de variáveis.
::
::

## Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).

::docs-tip
Antes de iniciar o servidor, verifique se a porta 3000 está livre para evitar múltiplos servidores rodando em background (o que pode travar o computador):

```bash
lsof -i :3000
```

Se retornar algum processo, encerre-o antes de iniciar um novo servidor.
::

## Comandos Úteis

| Comando                | Descrição                        |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Servidor dev na porta 3000       |
| `npm run build`        | Build de produção                |
| `npm run lint:fix`     | Corrigir ESLint                  |
| `npm run format`       | Formatar com Prettier            |
| `npm run typecheck`    | Verificar tipos TypeScript       |
| `npm run quality:fix`  | Corrigir lint + formatar         |
| `npm run test:run`     | Executar testes (uma vez)        |
| `npm run api:generate` | Gerar tipos e schemas do OpenAPI |

## Criando uma Nova Feature Layer

O Tucuxi usa uma arquitetura **layers-only** do Nuxt 4. Toda nova funcionalidade deve ser criada como uma layer dentro de `layers/`.

### Nomenclatura

As layers são numeradas por prioridade (número maior = maior prioridade = sobrescreve layers anteriores):

```
0-base < 2-home < 3-auth < 4-reviews < 5-docs
```

Use **hífen** (`-`) no nome das layers, nunca ponto.

### Estrutura de uma Feature Layer

```
layers/{N}-{feature}/
├── nuxt.config.ts              # Obrigatório (pode ser vazio)
├── app/
│   ├── components/             # Prefixar: {Feature}Card.vue
│   ├── composables/
│   │   ├── types.ts            # Interfaces e tipos
│   │   ├── use{Feature}Api.ts  # Service ($fetch para BFF)
│   │   └── use{Feature}Store.ts # Pinia store (Composition API)
│   └── pages/{feature}/
│       └── index.vue           # Página principal
└── server/api/{feature}/       # Endpoints BFF (CRUD)
```

### Passo a passo

::docs-steps
::docs-step{title="Criar a estrutura" step=1}
Crie o diretório da layer com a estrutura acima. O `nuxt.config.ts` é obrigatório, mesmo que vazio:

```typescript
// layers/{N}-{feature}/nuxt.config.ts
export default defineNuxtConfig({})
```

::
::docs-step{title="Criar o service" step=2}
O service encapsula as chamadas HTTP via `$fetch`:

```typescript
// layers/{N}-{feature}/app/composables/use{Feature}Api.ts
export function useFeatureApi() {
  async function getAll() {
    return $fetch('/api/feature')
  }

  async function getById(id: string) {
    return $fetch(`/api/feature/${id}`)
  }

  return { getAll, getById }
}
```

::
::docs-step{title="Criar a store" step=3}
A store usa Pinia com a Composition API:

```typescript
// layers/{N}-{feature}/app/composables/use{Feature}Store.ts
export const useFeatureStore = defineStore('feature', () => {
  const items = ref<Feature[]>([])
  const api = useFeatureApi()

  async function fetchAll() {
    items.value = await api.getAll()
  }

  return { items, fetchAll }
})
```

::
::docs-step{title="Criar endpoints BFF" step=4}
Os endpoints do servidor ficam em `server/api/{feature}/`:

```typescript
// layers/{N}-{feature}/server/api/feature/index.get.ts
export default defineEventHandler(async event => {
  // Lógica do endpoint
})
```

::
::

### Caminhos em Layers

Use `~/layers/...` (alias da raiz) para referenciar arquivos no `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` **não funcionam**.

## Fluxo de Dados

O padrão de comunicação segue sempre a mesma direção:

```
UI (componente) → Composable/Store → Service ($fetch) → API Server (BFF)
```

Nunca acesse a API externa diretamente do cliente. Todo acesso passa pelo BFF (Backend for Frontend) que roda no servidor Nuxt.
