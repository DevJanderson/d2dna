---
title: Documentação Tucuxi
description: Documentação completa do Tucuxi-Blast — sistema de Record Linkage baseado em DNA-encoded approach para vinculação de registros médicos.
order: 1
---

# Documentação Tucuxi

O **Tucuxi-Blast** é um sistema de Record Linkage desenvolvido a partir da pesquisa acadêmica da USP. Ele utiliza uma abordagem baseada em codificação DNA (_DNA-encoded approach_) para vincular registros médicos de diferentes fontes de dados, identificando duplicatas e unificando cadastros de pacientes de forma precisa e escalável.

O nome é uma referência ao boto-cinza (_Sotalia fluviatilis_), conhecido como tucuxi, reforçando a identidade brasileira do projeto.

## Por que Tucuxi?

Sistemas de saúde frequentemente possuem múltiplas bases de dados com registros fragmentados de um mesmo paciente. O Tucuxi resolve esse problema aplicando algoritmos fonéticos, comparação probabilística e revisão humana assistida para garantir vinculações de alta qualidade.

## Navegação

::docs-card-group
::docs-card{title="Instalação" icon="lucide:download" href="/docs/getting-started/installation"}
Configure o ambiente de desenvolvimento.
::
::docs-card{title="Início Rápido" icon="lucide:rocket" href="/docs/getting-started/quick-start"}
Primeiros passos com o Tucuxi.
::
::docs-card{title="Arquitetura" icon="lucide:layout" href="/docs/architecture/overview"}
Entenda a estrutura do projeto.
::
::docs-card{title="Funcionalidades" icon="lucide:zap" href="/docs/features/record-linkage"}
Explore as features do sistema.
::
::

## Stack Tecnológica

| Tecnologia              | Uso                                       |
| ----------------------- | ----------------------------------------- |
| **Nuxt 4**              | Framework fullstack com SSR               |
| **Nuxt Layers**         | Arquitetura modular por domínio           |
| **Tailwind CSS v4**     | Estilização com design tokens em CSS      |
| **shadcn-vue**          | Componentes UI acessíveis                 |
| **Pinia**               | Gerenciamento de estado                   |
| **Kubb**                | Geração de tipos e schemas da API OpenAPI |
| **Vitest + Playwright** | Testes unitários, de integração e E2E     |
