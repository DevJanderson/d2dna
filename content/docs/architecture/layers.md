---
title: Sistema de Layers
description: Como funciona a arquitetura layers-only do Tucuxi-Blast, com prioridades e estrutura de cada layer.
order: 2
---

# Sistema de Layers

O Tucuxi-Blast usa uma arquitetura **layers-only** do Nuxt 4. Não existe pasta `app/` na raiz — toda a aplicação vive dentro de `layers/`. Cada layer é um mini-app Nuxt com seu próprio `nuxt.config.ts`, componentes, composables, páginas e server routes.

## Ordem de Prioridade

As layers são numeradas por prioridade. Uma layer com número maior **sobrescreve** configurações e componentes de layers anteriores:

```
0-base < 2-home < 3-auth < 4-reviews < 5-docs
```

Essa ordem é definida no `nuxt.config.ts` raiz:

```typescript
extends: [
  './layers/0-base',
  './layers/2-home',
  './layers/3-auth',
  './layers/4-reviews',
  './layers/5-docs'
]
```

## Layers do Projeto

### 0-base — Fundação

Layer base com tudo que é compartilhado entre as demais:

- **Componentes UI**: shadcn-vue em `app/components/ui/`
- **Sistema de janelas**: Desktop, AppWindow, AppDock e composables `useWindow*`
- **CSS global**: Tailwind v4, temas, fontes, scanlines
- **Utils**: `getInitials()`, `formatDate()` e outros
- **Composables base**: `useCountUp()`, `useSectionVisibility()`

### 2-home — Página Inicial

Página inicial com o design MX (Machine Experience):

- ASCII art, cursor piscando, scanlines CRT
- Seções de parceiros e equipe
- Estatísticas com animação count-up

### 3-auth — Autenticação

Autenticação com padrão BFF (Backend for Frontend):

- Login, logout, refresh de token, "esqueci minha senha"
- Tokens em cookies httpOnly (nunca expostos ao client)
- Middleware de rotas protegidas
- Server utils reutilizáveis (`getAccessToken`, `authFetch`)

### 4-reviews — Curadoria de Dados

Sistema de revisão e curadoria de registros de clientes:

- Lista com filtros e paginação cursor
- Detalhe do cliente com histórico de reviews
- Ações: aprovar, rejeitar, corrigir, reverter
- Reutiliza `getAccessToken` e `getApiBaseUrl` do `3-auth`

### 5-docs — Documentação

Site de documentação (este que você está lendo):

- Layout 3 colunas (sidebar + conteúdo + TOC)
- Nuxt Content v3 com coleção `docs`
- Componentes MDC próprios (DocsCallout, DocsCardGroup, DocsTabs, etc.)

## Estrutura de uma Feature Layer

Cada nova feature segue esta estrutura padrão:

```
layers/{N}-{feature}/
├── nuxt.config.ts              # Obrigatório (pode ser vazio)
├── app/
│   ├── components/             # Prefixar: {Feature}Card.vue
│   ├── composables/
│   │   ├── types.ts            # Interfaces e re-exportação de tipos Kubb
│   │   ├── use{Feature}Api.ts  # Service ($fetch para /api/{feature}/*)
│   │   └── use{Feature}Store.ts # Pinia store (Composition API)
│   ├── pages/{feature}/        # Páginas da feature
│   └── middleware/              # Guards de rota (se necessário)
└── server/
    ├── api/{feature}/          # Endpoints BFF
    └── utils/                  # Helpers do server
```

### Convenções

- **Componentes**: Prefixar com o nome da feature (ex: `ReviewList.vue`, `AuthLoginForm.vue`)
- **Composables**: Seguir padrão `use{Feature}Api.ts` e `use{Feature}Store.ts`
- **Páginas**: Ficam em `app/pages/` seguindo a convenção de rotas do Nuxt
- **Server**: Endpoints BFF em `server/api/`, helpers em `server/utils/`

## Caminhos e Aliases

Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` **não funcionam** corretamente em layers.

```typescript
// Correto
shadcn: {
  componentDir: '~/layers/0-base/app/components/ui'
}

// Incorreto
shadcn: {
  componentDir: './app/components/ui'
}
```

::docs-warning{title="Renumeração de Layers"}
Ao renumerar layers (ex: adicionar uma nova entre 2 e 3), vários arquivos precisam ser atualizados: `nuxt.config.ts` raiz, `CLAUDE.md` de cada layer, testes que referenciam paths e `README.md`. Use Grep para buscar todas as referências antes de renumerar.
::

## Criando uma Nova Layer

1. Crie a pasta `layers/{N}-{feature}/` com a estrutura acima
2. Adicione um `nuxt.config.ts` (mínimo: `export default defineNuxtConfig({})`)
3. Registre a layer no `nuxt.config.ts` raiz, na posição correta de prioridade
4. Crie um `CLAUDE.md` documentando a estrutura e endpoints da layer
