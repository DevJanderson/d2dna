# Layer 5-docs - CLAUDE.md

Site de documentação do Tucuxi. Layout inspirado no Claude Code docs (sidebar + conteúdo + TOC).

## Estrutura

```
layers/5-docs/
├── nuxt.config.ts
├── app/
│   ├── layouts/
│   │   └── docs.vue                  # Layout 3 colunas
│   ├── pages/
│   │   └── docs/
│   │       └── [...slug].vue         # Catch-all para MD
│   ├── components/
│   │   ├── DocsHeader.vue            # Header fixo
│   │   ├── DocsNav.vue               # Sidebar navegação
│   │   ├── DocsToc.vue               # Table of Contents
│   │   ├── DocsPageNav.vue           # Prev/Next
│   │   └── content/                  # Componentes MDC
│   │       ├── DocsCallout.vue
│   │       ├── DocsTip.vue
│   │       ├── DocsInfo.vue
│   │       ├── DocsWarning.vue
│   │       ├── DocsCardGroup.vue
│   │       ├── DocsCard.vue
│   │       ├── DocsTabs.vue
│   │       ├── DocsTab.vue
│   │       ├── DocsSteps.vue
│   │       └── DocsStep.vue
│   └── composables/
│       ├── useDocsNavigation.ts
│       └── useDocsToc.ts
```

## Conteúdo

Arquivos markdown em `content/docs/`. Usa Nuxt Content v3 com collection `docs`.

## Componentes MDC

Usáveis dentro de `.md` via sintaxe MDC:

```md
::docs-tip
Dica importante aqui.
::

::docs-card-group
::docs-card{title="Título" icon="lucide:book" href="/docs/intro"}
Descrição do card.
::
::
```

## Prioridade

```
5-docs > 4-reviews > 3-auth > 2-home > 0-base
```
