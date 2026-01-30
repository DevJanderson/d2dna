<script setup lang="ts">
/**
 * Desktop - Área de trabalho com janelas gerenciadas
 * Renderiza todas as janelas do WindowManager
 *
 * Suporta:
 * - Navegação de arquivos via dropdown no título
 * - Abertura automática de janelas de conteúdo markdown
 * - Animações de entrada/saída de janelas
 *
 * Nota: Wallpaper é aplicado no layout (desktop.vue)
 * Nota: Não usar v-auto-animate aqui pois interfere com drag de janelas
 */

const windowManager = useWindowManager()

// Contador para posicionar janelas em cascata
const openedCount = ref(0)

/**
 * Abre uma janela com conteúdo markdown
 */
function openContentWindow(file: { id: string; title: string; path: string }) {
  // Calcula posição em cascata
  const offset = (openedCount.value % 5) * 30
  openedCount.value++

  // Cria ID único para a janela baseado no path
  const windowId = `content-${file.path.replace(/\//g, '-')}`

  // Verifica se a janela já está aberta
  const existingWindow = windowManager.windows.value.find(w => w.id === windowId)
  if (existingWindow) {
    windowManager.focus(windowId)
    return
  }

  // Abre nova janela com o conteúdo
  windowManager.open({
    id: windowId,
    title: file.title,
    position: { x: 120 + offset, y: 60 + offset },
    size: { width: 600, height: 450 },
    // Passa o path como metadado para o slot
    props: { contentPath: file.path }
  })
}
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <!-- Área de trabalho -->
    <div class="absolute inset-0">
      <!-- Slot para conteúdo de fundo (ícones de atalho, widgets, etc.) -->
      <slot name="background" />

      <!-- Janelas visíveis com animação de entrada/saída -->
      <TransitionGroup name="window">
        <AppWindow
          v-for="window in windowManager.visibleWindows.value"
          :key="window.id"
          :window-id="window.id"
          :title="window.title"
          :initial-x="window.position.x"
          :initial-y="window.position.y"
          :initial-width="window.size.width"
          :initial-height="window.size.height"
          :z-index="window.zIndex"
          :maximized="window.maximized"
          managed
          @file:select="openContentWindow"
        >
          <!-- Renderiza componente dinâmico se especificado -->
          <component :is="window.component" v-if="window.component" v-bind="window.props" />
          <!-- Se tem contentPath nas props, renderiza AppWindowContent -->
          <AppWindowContent
            v-else-if="window.props?.contentPath"
            :path="String(window.props.contentPath)"
          />
          <!-- Ou usa slot nomeado pelo ID da janela -->
          <slot v-else :name="window.id" :window="window" />
        </AppWindow>
      </TransitionGroup>
    </div>

    <!-- Slot para taskbar ou outros elementos fixos -->
    <slot name="taskbar" :minimized-windows="windowManager.minimizedWindows.value" />

    <!-- Slot padrão para conteúdo adicional -->
    <slot />
  </div>
</template>

<style>
/* Animação de entrada de janela */
.window-enter-active {
  animation: window-open 0.15s ease-out;
}

/* Animação de saída de janela */
.window-leave-active {
  animation: window-close 0.12s ease-in forwards;
}

@keyframes window-open {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes window-close {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.95);
  }
}
</style>
