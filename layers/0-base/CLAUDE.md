# Layer 0-base - CLAUDE.md

Fundação + UI da aplicação. Contém arquivos globais do Nuxt, componentes shadcn-vue, utils, tipos compartilhados e o sistema de janelas (Desktop/AppWindow).

## Estrutura

```
layers/0-base/
├── nuxt.config.ts              # CSS global + alias #shared
├── app/
│   ├── app.vue                 # Root component
│   ├── error.vue               # Página de erro (404, 500)
│   ├── assets/css/
│   │   └── main.css            # Tailwind CSS + variáveis de tema + estilos MX
│   ├── components/
│   │   ├── ui/                 # shadcn-vue (auto-import)
│   │   ├── common/             # Componentes compartilhados
│   │   ├── Desktop.vue         # Container de janelas
│   │   ├── AppWindow.vue       # Janela principal
│   │   ├── AppWindowTitleBar.vue
│   │   ├── AppWindowContent.vue
│   │   ├── AppWindowResizeHandles.vue
│   │   ├── AppWindowSnapPreview.vue
│   │   └── AppDock.vue         # Dock lateral
│   ├── composables/
│   │   ├── useWindowManager.ts # Gerencia janelas (Pinia store)
│   │   ├── useWindowDrag.ts    # Arrastar janelas
│   │   ├── useWindowResize.ts  # Redimensionar janelas
│   │   ├── useWindowSnap.ts    # Snap nas bordas
│   │   └── useContentFiles.ts  # Lista markdown
│   ├── layouts/
│   │   ├── default.vue         # Layout padrão
│   │   └── desktop.vue         # Layout com dock (sistema de janelas)
│   ├── pages/                  # Páginas internas (app/, docs/)
│   ├── types/
│   │   └── window.ts           # Tipos do sistema de janelas
│   └── utils/
│       └── utils.ts            # cn() para classes
├── server/
│   └── api/
│       └── health.get.ts       # GET /api/health
└── shared/
    └── types/                  # Tipos compartilhados (app + server)
```

## Responsabilidades

| Item                                           | Descrição                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| `app.vue`                                      | Root component com `<NuxtLayout>` e `<NuxtPage>`                 |
| `error.vue`                                    | Página de erro global                                            |
| `main.css`                                     | Tailwind v4, variáveis CSS, estilos MX (scanlines, cursor-blink) |
| `components/ui/`                               | Componentes shadcn-vue (primitivos de UI)                        |
| `components/common/`                           | Componentes globais reutilizáveis                                |
| `Desktop.vue`, `AppWindow*.vue`, `AppDock.vue` | Sistema de janelas                                               |
| `layouts/default.vue`                          | Layout padrão da aplicação                                       |
| `layouts/desktop.vue`                          | Layout com dock para workspace                                   |
| `composables/useWindow*.ts`                    | Lógica de janelas (drag, resize, snap)                           |
| `types/window.ts`                              | Tipos do sistema de janelas                                      |
| `utils/`                                       | Funções utilitárias (cn, formatters)                             |
| `shared/types/`                                | Tipos TypeScript compartilhados                                  |

## Design MX (Machine Experience)

Estilos globais do design MX ficam nesta layer (CSS, fontes). Componentes da home foram movidos para `layers/2-home/`.

### z-index para scanlines

O efeito scanlines usa `z-index: 10`. Para elementos ficarem **acima** do efeito (sem as linhas), adicione `relative z-20`:

```vue
<div class="relative z-20 bg-white ...">
  <!-- Conteúdo sem scanlines por cima -->
</div>
```

### Espaçamento (8pt Grid)

- Entre seções: 48-64px (Tailwind 12-16)
- Dentro de seções: 32px (Tailwind 8)
- Entre elementos: 24px (Tailwind 6)

## Adicionar Componentes shadcn-vue

```bash
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
```

Os componentes são instalados automaticamente em `app/components/ui/`.

## Customização

- **Tema**: Edite as variáveis CSS em `main.css` (`:root` e `.dark`)
- **Layout**: Sobrescreva `layouts/default.vue` em uma layer de maior prioridade

## Sistema de Janelas

O sistema de janelas (Desktop, AppWindow, AppDock) é infraestrutura disponível para qualquer layer.

### Layout Desktop

```vue
<script setup>
definePageMeta({
  layout: 'desktop'
})
</script>
```

### Abrir Janela

```typescript
const windowManager = useWindowManager()

windowManager.open({
  id: 'my-window',
  title: 'Título',
  position: { x: 100, y: 50 },
  size: { width: 600, height: 400 },
  props: { contentPath: '/docs/page' }
})
```

### Desktop com Slots

```vue
<template>
  <Desktop>
    <template #background>
      <div class="absolute right-6 top-6">...</div>
    </template>
    <template #my-window>
      <MyComponent />
    </template>
  </Desktop>
</template>
```

## Prioridade

Esta é a layer com **menor prioridade** (0). Todas as outras layers podem sobrescrever seus arquivos.

```
0-base < 2-home < 3-auth
```
