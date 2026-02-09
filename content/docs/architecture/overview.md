---
title: Visão Geral da Arquitetura
description: Visão geral da arquitetura do Tucuxi-Blast, incluindo stack, fluxo de dados e módulos principais.
order: 1
---

# Visão Geral da Arquitetura

O Tucuxi-Blast é um sistema de Record Linkage e Gestão de Dados construído com **Nuxt 4** e uma arquitetura **layers-only**. Não existe pasta `app/` na raiz do projeto — toda a aplicação é organizada em layers dentro de `layers/`.

## Stack Tecnológico

| Tecnologia       | Função                                  |
| ---------------- | --------------------------------------- |
| **Nuxt 4**       | Framework full-stack (SSR + API routes) |
| **shadcn-vue**   | Componentes UI acessíveis e estiláveis  |
| **Tailwind v4**  | Estilização (configuração via CSS puro) |
| **Pinia**        | Gerenciamento de estado                 |
| **Nuxt Content** | Documentação em Markdown (MDC)          |
| **VeeValidate**  | Validação de formulários                |
| **Kubb**         | Geração de tipos e schemas da API (Zod) |

::docs-info
O Tailwind CSS v4 **não usa `tailwind.config.js`**. Toda a configuração de temas, fontes e variáveis fica em CSS puro, no arquivo `layers/0-base/app/assets/css/main.css`.
::

## Fluxo de Dados

O fluxo de dados segue uma direção clara, do usuário até a API externa:

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
2. **Store**: Pinia gerencia estado reativo (listas, filtros, usuário logado)
3. **Service**: Composables `useXxxApi()` fazem `$fetch` para as rotas do BFF (`/api/*`)
4. **BFF**: Server routes do Nuxt adicionam tokens e fazem proxy para a API externa
5. **API Externa**: Backend em `api.d2dna.com` processa a requisição

## Módulos Principais

```typescript
modules: [
  '@nuxt/eslint', // Linting integrado
  'shadcn-nuxt', // Componentes UI
  '@pinia/nuxt', // State management
  '@vee-validate/nuxt', // Validação de formulários
  '@nuxt/image', // Otimização de imagens
  '@nuxt/icon', // Ícones (Lucide, etc.)
  '@nuxtjs/color-mode', // Dark/light mode
  'nuxt-security', // Headers de segurança, CSP, rate limiter
  '@nuxt/content' // Documentação em Markdown
]
```

## Data Fetching

| Método     | Quando usar                    | SSR |
| ---------- | ------------------------------ | --- |
| `useFetch` | Carregamento inicial (páginas) | Sim |
| `$fetch`   | Eventos do usuário (cliques)   | Não |

Use `useFetch` para dados que precisam estar disponíveis no primeiro render (SEO, SSR). Use `$fetch` para interações do usuário como submissão de formulários, ações de botões e chamadas após o carregamento da página.

## Utils vs Composables

- **Utils** (`layers/0-base/app/utils/`): Funções puras, sem estado Vue. Exemplos: `getInitials()`, `formatDate()`
- **Composables** (`layers/{N}-{feature}/app/composables/`): Lógica com `ref`, `computed`, ciclo de vida Vue. Exemplos: `useAuthStore()`, `useCountUp()`

## Design System

O projeto segue o estilo **MX (Machine Experience)**, um design para humanos e máquinas:

- **Fontes**: Space Grotesk (sans) + Space Mono (mono)
- **Grid**: Sistema de 8pt (48-64px entre seções, 32px interno, 24px entre elementos)
- **Efeitos**: Cursor piscando, scanlines CRT, ASCII art
- **Cores**: Por contexto/profissão (verde = dev, azul = ciência, etc.)
