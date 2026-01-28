# Layer 4-landing - CLAUDE.md

Layer da página inicial (landing page) do projeto.

## Estrutura

```
layers/4-landing/
├── nuxt.config.ts              # Configuração da layer
└── app/
    └── pages/
        └── index.vue           # Página inicial (/)
```

## Responsabilidades

Esta layer contém apenas a página inicial do projeto. É a layer com maior prioridade, podendo sobrescrever qualquer componente ou página de layers anteriores.

## Página Inicial

A página `index.vue` é renderizada na rota `/` e serve como ponto de entrada do projeto.

```vue
<template>
  <div class="min-h-screen flex items-center justify-center">
    <h1>Landing Page</h1>
  </div>
</template>
```

## Customização

Para customizar a landing page:

1. Edite `app/pages/index.vue`
2. Adicione componentes específicos em `app/components/` se necessário
3. Use os componentes de `1-base` (Button, Card, etc.)

## Prioridade

```
0-core < 1-base < 2-example < 4-landing
```

Esta layer tem a **maior prioridade** (4) e sobrescreve todas as outras layers.
