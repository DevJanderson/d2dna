<script setup lang="ts">
/**
 * AppWindowSnapPreview - Preview visual da zona de snap
 * Mostra onde a janela será posicionada ao soltar na borda
 */
import type { CSSProperties } from 'vue'

interface Props {
  /** Estilo inline do preview (posição e tamanho) */
  style: CSSProperties | null
  /** Z-index do preview (deve ser menor que a janela) */
  zIndex?: number
}

const props = withDefaults(defineProps<Props>(), {
  zIndex: 9
})

const previewStyle = computed(() => {
  if (!props.style) return null
  return {
    ...props.style,
    zIndex: props.zIndex
  }
})
</script>

<template>
  <div
    v-if="previewStyle"
    class="rounded-xl border-2 border-dashed border-primary/50 bg-primary/10 transition-all duration-150"
    :style="previewStyle"
  />
</template>
