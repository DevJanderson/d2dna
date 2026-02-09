---
title: Início Rápido
description: Primeiros passos para desenvolver com o Tucuxi-Blast.
order: 2
---

# Início Rápido

Este guia apresenta a estrutura do projeto e os comandos essenciais para começar a contribuir.

## Estrutura de Layers

O Tucuxi usa uma arquitetura **layers-only** do Nuxt 4. Não existe pasta `app/` na raiz — tudo fica dentro de layers numeradas por prioridade:

| Layer       | Descrição                                                            |
| ----------- | -------------------------------------------------------------------- |
| `0-base`    | Fundação, componentes UI (shadcn-vue), sistema de janelas, utils     |
| `2-home`    | Página inicial com design MX, ASCII art, seção de parceiros e equipe |
| `3-auth`    | Autenticação via BFF com cookies httpOnly                            |
| `4-reviews` | Curadoria de dados — revisão de vinculações de registros             |
| `5-docs`    | Site de documentação (este que você está lendo)                      |

A ordem numérica define a prioridade: **número maior sobrescreve o menor**. Isso significa que `4-reviews` pode sobrescrever componentes ou configurações de `0-base`.

## Comandos Principais

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

### Qualidade de Código

```bash
# Corrigir lint + formatar código
npm run quality:fix

# Apenas lint
npm run lint:fix

# Apenas formatação (Prettier)
npm run format

# Verificar tipos TypeScript
npm run typecheck
```

### Testes

```bash
# Executar todos os testes (uma vez)
npm run test:run

# Executar teste específico
npm run test -- tests/unit/exemplo.test.ts

# Testes E2E com Playwright
npm run test:e2e

# Instalar browsers do Playwright (primeiro uso)
npm run test:e2e:install
```

O projeto possui dois ambientes de teste Vitest:

- **`tests/unit/`** — ambiente Node puro, ideal para funções puras e utils
- **`tests/nuxt/`** — ambiente Nuxt com happy-dom, para composables, stores e componentes

### Geração de API

```bash
# Gerar tipos e schemas a partir do OpenAPI
npm run api:generate
```

Os arquivos gerados ficam em `generated/` e incluem tipos TypeScript e schemas Zod usados no BFF e nos composables.

## Fluxo de Dados

O padrão de comunicação segue sempre a mesma direção:

```
UI (componente) → Composable/Store → Service ($fetch) → API Server (BFF)
```

Nunca acesse a API externa diretamente do cliente. Todo acesso passa pelo BFF (Backend for Frontend) que roda no servidor Nuxt.

## Fluxo Git

O projeto segue o padrão de branches:

```
feature/* → develop → staging → main
```

Commits usam **Conventional Commits em português** com subject em lower-case e no máximo 72 caracteres.

::docs-tip
Acesse [localhost:3000/docs](/docs) durante o desenvolvimento para consultar esta documentação localmente.
::

## Próximos Passos

Agora que você conhece a estrutura básica, explore:

- **[Arquitetura](/docs/architecture/overview)** — entenda o fluxo BFF, a organização das layers e os padrões de código
- **[Record Linkage](/docs/features/record-linkage)** — conheça o algoritmo de vinculação de registros
- **[Contribuindo](/docs/contributing)** — guia de contribuição com padrões e boas práticas
