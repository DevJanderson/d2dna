---
title: Instalação
description: Como configurar o ambiente de desenvolvimento do Tucuxi-Blast.
order: 1
---

# Instalação

Este guia cobre a configuração completa do ambiente de desenvolvimento do Tucuxi-Blast.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 20+** — recomendamos usar [nvm](https://github.com/nvm-sh/nvm) ou [fnm](https://github.com/Schniz/fnm) para gerenciar versões
- **npm** — incluído com o Node.js
- **Git** — para controle de versão

## Passo a passo

::docs-steps
::docs-step{title="Clonar repositório" step=1}

```bash
git clone https://github.com/D2DNA/tucuxi-webapp.git
cd tucuxi-webapp
```

O branch principal de desenvolvimento é o `develop`. Certifique-se de estar nele:

```bash
git checkout develop
```

::
::docs-step{title="Instalar dependências" step=2}

```bash
npm install
```

Isso instalará todas as dependências do projeto, incluindo as do Nuxt, shadcn-vue e ferramentas de desenvolvimento.
::
::docs-step{title="Configurar ambiente" step=3}
Crie o arquivo `.env` na raiz do projeto com as variáveis necessárias:

```bash
cp .env.example .env
```

Edite o `.env` com as credenciais do seu ambiente. As variáveis principais são:

```env
NUXT_API_EXTERNAL_BASE_URL=https://api.d2dna.com
NUXT_SITE_URL=https://tucuxi.d2dna.com
NUXT_SITE_INDEXABLE=true
```

Consulte o `.env.example` para a lista completa de variáveis.
::
::docs-step{title="Iniciar servidor" step=4}

```bash
npm run dev
```

O servidor estará disponível em [http://localhost:3000](http://localhost:3000).
::
::

::docs-info{title="Git Hooks"}
Após a instalação, execute `npm run setup` para configurar os git hooks com Husky e Commitlint. Isso garante que seus commits sigam o padrão Conventional Commits em português.
::

## Verificação

Para confirmar que tudo está funcionando, execute os seguintes comandos:

```bash
# Verificar tipos TypeScript
npm run typecheck

# Executar testes unitários
npm run test:run

# Verificar lint
npm run lint:fix
```

## Problemas comuns

### Porta 3000 já em uso

Se ao iniciar o servidor você receber erro de porta ocupada, verifique processos na porta:

```bash
lsof -i :3000
```

Encerre o processo anterior antes de iniciar um novo servidor.

### Erros de dependência

Se houver problemas após atualizar o branch, limpe o cache e reinstale:

```bash
rm -rf node_modules .nuxt
npm install
```
