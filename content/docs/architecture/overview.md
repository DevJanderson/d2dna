---
title: Visao Geral da Arquitetura
description: Visao geral da arquitetura do Tucuxi-Blast, incluindo stack, fluxo de dados e modulos principais.
order: 1
---

# Visao Geral da Arquitetura

O Tucuxi-Blast e um sistema de Record Linkage e Gestao de Dados construido com **Nuxt 4** e uma arquitetura **layers-only**. Nao existe pasta `app/` na raiz do projeto — toda a aplicacao e organizada em layers dentro de `layers/`.

## Stack Tecnologico

| Tecnologia       | Funcao                                  |
| ---------------- | --------------------------------------- |
| **Nuxt 4**       | Framework full-stack (SSR + API routes) |
| **shadcn-vue**   | Componentes UI acessiveis e estilaveis  |
| **Tailwind v4**  | Estilizacao (configuracao via CSS puro) |
| **Pinia**        | Gerenciamento de estado                 |
| **Nuxt Content** | Documentacao em Markdown (MDC)          |
| **VeeValidate**  | Validacao de formularios                |
| **Kubb**         | Geracao de tipos e schemas da API (Zod) |

::docs-info
O Tailwind CSS v4 **nao usa `tailwind.config.js`**. Toda a configuracao de temas, fontes e variaveis fica em CSS puro, no arquivo `layers/0-base/app/assets/css/main.css`.
::

## Fluxo de Dados

O fluxo de dados segue uma direcao clara, do usuario ate a API externa:

```
UI (Componente Vue)
  |
  v
Composable / Store (Pinia)
  |
  v
Service (useXxxApi → $fetch)
  |
  v
Nuxt Server (BFF)
  |
  v
API Externa (api.d2dna.com)
```

### Detalhamento

1. **UI**: Componentes Vue interagem com stores e composables via auto-import
2. **Store**: Pinia gerencia estado reativo (listas, filtros, usuario logado)
3. **Service**: Composables `useXxxApi()` fazem `$fetch` para as rotas do BFF (`/api/*`)
4. **BFF**: Server routes do Nuxt adicionam tokens e fazem proxy para a API externa
5. **API Externa**: Backend em `api.d2dna.com` processa a requisicao

## Modulos Principais

```typescript
modules: [
  '@nuxt/eslint', // Linting integrado
  'shadcn-nuxt', // Componentes UI
  '@pinia/nuxt', // State management
  '@vee-validate/nuxt', // Validacao de formularios
  '@nuxt/image', // Otimizacao de imagens
  '@nuxt/icon', // Icones (Lucide, etc.)
  '@nuxtjs/color-mode', // Dark/light mode
  'nuxt-security', // Headers de seguranca, CSP, rate limiter
  '@nuxt/content' // Documentacao em Markdown
]
```

## Data Fetching

| Metodo     | Quando usar                    | SSR |
| ---------- | ------------------------------ | --- |
| `useFetch` | Carregamento inicial (paginas) | Sim |
| `$fetch`   | Eventos do usuario (cliques)   | Nao |

Use `useFetch` para dados que precisam estar disponiveis no primeiro render (SEO, SSR). Use `$fetch` para interacoes do usuario como submissao de formularios, acoes de botoes e chamadas apos o carregamento da pagina.

## Utils vs Composables

- **Utils** (`layers/0-base/app/utils/`): Funcoes puras, sem estado Vue. Exemplos: `getInitials()`, `formatDate()`
- **Composables** (`layers/{N}-{feature}/app/composables/`): Logica com `ref`, `computed`, ciclo de vida Vue. Exemplos: `useAuthStore()`, `useCountUp()`

## Design System

O projeto segue o estilo **MX (Machine Experience)**, um design para humanos e maquinas:

- **Fontes**: Space Grotesk (sans) + Space Mono (mono)
- **Grid**: Sistema de 8pt (48-64px entre secoes, 32px interno, 24px entre elementos)
- **Efeitos**: Cursor piscando, scanlines CRT, ASCII art
- **Cores**: Por contexto/profissao (verde = dev, azul = ciencia, etc.)
