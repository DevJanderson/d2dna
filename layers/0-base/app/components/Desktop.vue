<script setup lang="ts">
/**
 * Desktop - Área de trabalho com janelas gerenciadas
 * Renderiza todas as janelas do WindowManager
 *
 * Suporta:
 * - Navegação de arquivos via dropdown no título
 * - Abertura automática de janelas de conteúdo markdown
 * - Animações de entrada/saída com Motion Vue (AnimatePresence)
 *
 * Nota: Wallpaper é aplicado no layout (desktop.vue)
 * Nota: Não usar v-auto-animate aqui pois interfere com drag de janelas
 */
import { Motion, AnimatePresence } from 'motion-v'

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
      <AnimatePresence>
        <Motion
          v-for="window in windowManager.visibleWindows.value"
          :key="window.id"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :exit="{ opacity: 0, scale: 0.95 }"
          :transition="{ duration: 0.15 }"
          as-child
        >
          <AppWindow
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
        </Motion>
      </AnimatePresence>
    </div>

    <!-- Slot para taskbar ou outros elementos fixos -->
    <slot name="taskbar" :minimized-windows="windowManager.minimizedWindows.value" />

    <!-- Slot padrão para conteúdo adicional -->
    <slot />
  </div>
</template>
