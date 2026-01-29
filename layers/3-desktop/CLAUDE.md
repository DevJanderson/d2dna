# Layer 3-desktop - CLAUDE.md

Sistema de janelas estilo desktop (Windows/macOS).

## Estrutura

```
layers/3-desktop/
├── nuxt.config.ts
└── app/
    ├── components/
    │   ├── AppWindow.vue           # Janela principal
    │   ├── AppWindowTitleBar.vue   # Barra de título
    │   ├── AppWindowContent.vue    # Renderiza markdown
    │   ├── AppWindowResizeHandles.vue
    │   ├── AppWindowSnapPreview.vue
    │   ├── Desktop.vue             # Container de janelas
    │   └── AppDock.vue             # Dock lateral
    ├── composables/
    │   ├── useWindowManager.ts     # Gerencia janelas
    │   ├── useWindowDrag.ts        # Arrastar
    │   ├── useWindowResize.ts      # Redimensionar
    │   ├── useWindowSnap.ts        # Snap nas bordas
    │   └── useContentFiles.ts      # Lista markdown
    ├── layouts/
    │   └── desktop.vue             # Layout com dock
    └── types/
        └── window.ts               # Tipos do sistema
```

## Uso

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
  props: { contentPath: '/docs/page' } // Para markdown
})
```

### Desktop com Slots

```vue
<template>
  <Desktop>
    <!-- Ícones de atalho -->
    <template #background>
      <div class="absolute right-6 top-6">...</div>
    </template>

    <!-- Conteúdo de janela por ID -->
    <template #my-window>
      <MyComponent />
    </template>

    <!-- Taskbar -->
    <template #taskbar="{ minimizedWindows }">
      <div v-for="win in minimizedWindows">...</div>
    </template>
  </Desktop>
</template>
```

## Dependências

- Layer 1-base: Componentes UI (Avatar, Tooltip, DropdownMenu, Separator)
- @nuxt/content: Renderização de markdown
- lucide-vue-next: Ícones
