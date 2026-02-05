<script setup lang="ts">
/**
 * AppWindowResizeHandles - Handles invisíveis para redimensionar janelas
 * Posiciona elementos clicáveis nas bordas e cantos da janela
 */
import type { ResizeDirection } from '../types/window'

const emit = defineEmits<{
  resize: [event: MouseEvent, direction: ResizeDirection]
}>()

/** Inicia o resize na direção especificada */
function handleResize(event: MouseEvent, direction: ResizeDirection) {
  emit('resize', event, direction)
}
</script>

<template>
  <div class="pointer-events-none absolute inset-0">
    <!-- Bordas (6px de área clicável) -->

    <!-- Norte (topo) -->
    <div
      class="pointer-events-auto absolute -top-0.5 left-4 right-4 h-1.5 cursor-n-resize"
      @mousedown="e => handleResize(e, 'n')"
    />

    <!-- Sul (baixo) -->
    <div
      class="pointer-events-auto absolute -bottom-0.5 left-4 right-4 h-1.5 cursor-s-resize"
      @mousedown="e => handleResize(e, 's')"
    />

    <!-- Oeste (esquerda) -->
    <div
      class="pointer-events-auto absolute -left-0.5 bottom-4 top-4 w-1.5 cursor-w-resize"
      @mousedown="e => handleResize(e, 'w')"
    />

    <!-- Leste (direita) -->
    <div
      class="pointer-events-auto absolute -right-0.5 bottom-4 top-4 w-1.5 cursor-e-resize"
      @mousedown="e => handleResize(e, 'e')"
    />

    <!-- Cantos (16px de área clicável para facilitar) -->

    <!-- Noroeste (topo esquerdo) -->
    <div
      class="pointer-events-auto absolute -left-0.5 -top-0.5 h-4 w-4 cursor-nw-resize"
      @mousedown="e => handleResize(e, 'nw')"
    />

    <!-- Nordeste (topo direito) -->
    <div
      class="pointer-events-auto absolute -right-0.5 -top-0.5 h-4 w-4 cursor-ne-resize"
      @mousedown="e => handleResize(e, 'ne')"
    />

    <!-- Sudoeste (baixo esquerdo) -->
    <div
      class="pointer-events-auto absolute -bottom-0.5 -left-0.5 h-4 w-4 cursor-sw-resize"
      @mousedown="e => handleResize(e, 'sw')"
    />

    <!-- Sudeste (baixo direito) -->
    <div
      class="pointer-events-auto absolute -bottom-0.5 -right-0.5 h-4 w-4 cursor-se-resize"
      @mousedown="e => handleResize(e, 'se')"
    />
  </div>
</template>
