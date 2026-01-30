/**
 * useWindowResize - Composable para lógica de redimensionar janelas
 * @module composables/useWindowResize
 */

import type { Ref } from 'vue'
import type {
  WindowPosition,
  WindowSize,
  WindowContainerConfig,
  WindowSizeLimits,
  ResizeDirection
} from '../types/window'
import { DEFAULT_WINDOW_CONFIG, DEFAULT_SIZE_LIMITS } from '../types/window'

export interface UseWindowResizeOptions {
  /** Ref do elemento da janela */
  windowEl: Ref<HTMLElement | null>
  /** Posição atual da janela */
  position: Ref<WindowPosition>
  /** Tamanho atual da janela */
  size: Ref<WindowSize>
  /** Se o resize está habilitado */
  enabled?: Ref<boolean> | boolean
  /** Limites de tamanho */
  sizeLimits?: Partial<WindowSizeLimits>
  /** Configuração do container */
  config?: Partial<WindowContainerConfig>
  /** Callback quando parar de redimensionar */
  onResizeEnd?: (size: WindowSize, position: WindowPosition) => void
}

interface ResizeStartState {
  x: number
  y: number
  width: number
  height: number
  posX: number
  posY: number
}

export function useWindowResize(options: UseWindowResizeOptions) {
  const {
    windowEl,
    position,
    size,
    enabled = true,
    sizeLimits: userSizeLimits,
    config: userConfig,
    onResizeEnd
  } = options

  const config = { ...DEFAULT_WINDOW_CONFIG, ...userConfig }
  const sizeLimits = { ...DEFAULT_SIZE_LIMITS, ...userSizeLimits }

  // Estado interno
  const isResizing = ref(false)
  const resizeDirection = ref<ResizeDirection>(null)
  const resizeStart = ref<ResizeStartState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    posX: 0,
    posY: 0
  })

  /** Verifica se o resize está habilitado */
  const isEnabled = computed(() => {
    return typeof enabled === 'boolean' ? enabled : enabled.value
  })

  /** Obtém o retângulo do container pai */
  function getParentRect(): DOMRect | null {
    const parent = windowEl.value?.parentElement
    return parent?.getBoundingClientRect() || null
  }

  /** Inicia o redimensionamento */
  function startResize(event: MouseEvent, direction: ResizeDirection) {
    if (!isEnabled.value || !direction) return

    event.preventDefault()
    event.stopPropagation()

    isResizing.value = true
    resizeDirection.value = direction
    resizeStart.value = {
      x: event.clientX,
      y: event.clientY,
      width: size.value.width,
      height: size.value.height,
      posX: position.value.x,
      posY: position.value.y
    }

    document.addEventListener('mousemove', handleResize)
    document.addEventListener('mouseup', stopResize)
  }

  /** Processa o redimensionamento */
  function handleResize(event: MouseEvent) {
    if (!isResizing.value || !resizeDirection.value) return

    const parentRect = getParentRect()
    if (!parentRect) return

    const deltaX = event.clientX - resizeStart.value.x
    const deltaY = event.clientY - resizeStart.value.y

    let newWidth = resizeStart.value.width
    let newHeight = resizeStart.value.height
    let newX = resizeStart.value.posX
    let newY = resizeStart.value.posY

    const dir = resizeDirection.value

    // Redimensionar pela direita (e, ne, se)
    if (dir.includes('e')) {
      newWidth = Math.max(sizeLimits.minWidth, resizeStart.value.width + deltaX)
      // Limitar ao container
      const maxWidth = parentRect.width - newX - config.padding
      newWidth = Math.min(newWidth, sizeLimits.maxWidth ?? maxWidth, maxWidth)
    }

    // Redimensionar pela esquerda (w, nw, sw)
    if (dir.includes('w')) {
      const potentialWidth = resizeStart.value.width - deltaX
      if (potentialWidth >= sizeLimits.minWidth) {
        newWidth = potentialWidth
        newX = resizeStart.value.posX + deltaX
        // Limitar ao container
        if (newX < config.padding) {
          newWidth -= config.padding - newX
          newX = config.padding
        }
      }
    }

    // Redimensionar por baixo (s, se, sw)
    if (dir.includes('s')) {
      newHeight = Math.max(sizeLimits.minHeight, resizeStart.value.height + deltaY)
      // Limitar ao container
      const maxHeight = parentRect.height - newY - config.padding
      newHeight = Math.min(newHeight, sizeLimits.maxHeight ?? maxHeight, maxHeight)
    }

    // Redimensionar por cima (n, ne, nw)
    if (dir === 'n' || dir === 'ne' || dir === 'nw') {
      const potentialHeight = resizeStart.value.height - deltaY
      if (potentialHeight >= sizeLimits.minHeight) {
        newHeight = potentialHeight
        newY = resizeStart.value.posY + deltaY
        // Limitar ao container
        if (newY < config.padding) {
          newHeight -= config.padding - newY
          newY = config.padding
        }
      }
    }

    // Aplicar novos valores
    size.value = { width: newWidth, height: newHeight }
    position.value = { x: newX, y: newY }
  }

  /** Para o redimensionamento */
  function stopResize() {
    if (isResizing.value) {
      isResizing.value = false
      const dir = resizeDirection.value
      resizeDirection.value = null

      if (dir) {
        onResizeEnd?.(size.value, position.value)
      }
    }

    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  }

  // Cleanup
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
  })

  return {
    // Estado
    isResizing: readonly(isResizing),
    resizeDirection: readonly(resizeDirection),

    // Ações
    startResize,
    stopResize
  }
}
