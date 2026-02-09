/**
 * useWindowDrag - Composable para lógica de arrastar janelas
 * @module composables/useWindowDrag
 */

import type { Ref } from 'vue'
import type { WindowPosition, WindowSize, WindowContainerConfig } from '../types/window'
import { DEFAULT_WINDOW_CONFIG } from '../types/window'
import { getParentRect } from '../utils/dom'

export interface UseWindowDragOptions {
  /** Ref do elemento da janela */
  windowEl: Ref<HTMLElement | null>
  /** Posição atual da janela */
  position: Ref<WindowPosition>
  /** Tamanho atual da janela */
  size: Ref<WindowSize>
  /** Se o drag está habilitado */
  enabled?: Ref<boolean> | boolean
  /** Configuração do container */
  config?: Partial<WindowContainerConfig>
  /** Callback quando começar a arrastar */
  onDragStart?: () => void
  /** Callback durante o arrasto */
  onDrag?: (position: WindowPosition, mouseX: number, mouseY: number) => void
  /** Callback quando parar de arrastar */
  onDragEnd?: (position: WindowPosition) => void
}

export function useWindowDrag(options: UseWindowDragOptions) {
  const {
    windowEl,
    position,
    size,
    enabled = true,
    config: userConfig,
    onDragStart,
    onDrag,
    onDragEnd
  } = options

  const config = { ...DEFAULT_WINDOW_CONFIG, ...userConfig }

  // Estado interno
  const isDragging = ref(false)
  const dragOffset = ref<WindowPosition>({ x: 0, y: 0 })
  const dragStartMouse = ref<WindowPosition>({ x: 0, y: 0 })
  const hasMovedPastThreshold = ref(false)
  let rafId: number | null = null

  /** Verifica se o drag está habilitado */
  const isEnabled = computed(() => {
    return typeof enabled === 'boolean' ? enabled : enabled.value
  })

  /** Calcula os limites de posição */
  function getPositionLimits(parentRect: DOMRect) {
    return {
      minX: config.padding,
      minY: config.padding,
      maxX: Math.max(config.padding, parentRect.width - size.value.width - config.padding),
      maxY: Math.max(config.padding, parentRect.height - size.value.height - config.padding)
    }
  }

  /** Limita uma posição aos limites do container */
  function clampPosition(pos: WindowPosition, parentRect: DOMRect): WindowPosition {
    const limits = getPositionLimits(parentRect)
    return {
      x: Math.min(Math.max(limits.minX, pos.x), limits.maxX),
      y: Math.min(Math.max(limits.minY, pos.y), limits.maxY)
    }
  }

  /** Inicia o arrasto */
  function startDrag(event: PointerEvent) {
    if (!isEnabled.value) return

    // Não iniciar drag se clicar em botões
    if ((event.target as HTMLElement).closest('button')) return

    const parentRect = getParentRect(windowEl)
    if (!parentRect) return

    const offsetX = parentRect.left
    const offsetY = parentRect.top

    // Guardar posição inicial do mouse
    dragStartMouse.value = { x: event.clientX, y: event.clientY }
    hasMovedPastThreshold.value = false

    isDragging.value = true
    dragOffset.value = {
      x: event.clientX - offsetX - position.value.x,
      y: event.clientY - offsetY - position.value.y
    }

    onDragStart?.()

    document.addEventListener('pointermove', handleDrag)
    document.addEventListener('pointerup', stopDrag)
  }

  /** Processa o movimento durante o arrasto (envolvido em rAF) */
  function handleDrag(event: PointerEvent) {
    if (!isDragging.value) return

    // Verificar threshold antes do rAF (leitura leve, sem layout)
    if (!hasMovedPastThreshold.value) {
      const deltaX = Math.abs(event.clientX - dragStartMouse.value.x)
      const deltaY = Math.abs(event.clientY - dragStartMouse.value.y)

      if (deltaX <= config.dragThreshold && deltaY <= config.dragThreshold) {
        return
      }
      hasMovedPastThreshold.value = true
    }

    if (rafId !== null) cancelAnimationFrame(rafId)

    rafId = requestAnimationFrame(() => {
      rafId = null
      if (!isDragging.value) return

      const parentRect = getParentRect(windowEl)
      if (!parentRect) return

      const offsetX = parentRect.left
      const offsetY = parentRect.top

      // Calcular nova posição
      const rawPosition: WindowPosition = {
        x: event.clientX - offsetX - dragOffset.value.x,
        y: event.clientY - offsetY - dragOffset.value.y
      }

      // Limitar aos bounds do container
      const newPosition = clampPosition(rawPosition, parentRect)
      position.value = newPosition

      // Callback com posição do mouse para detecção de snap
      const mouseX = event.clientX - parentRect.left
      const mouseY = event.clientY - parentRect.top
      onDrag?.(newPosition, mouseX, mouseY)
    })
  }

  /** Para o arrasto */
  function stopDrag() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    if (isDragging.value) {
      isDragging.value = false
      onDragEnd?.(position.value)
    }

    document.removeEventListener('pointermove', handleDrag)
    document.removeEventListener('pointerup', stopDrag)
  }

  /** Atualiza o offset do drag (usado quando restaura do snap) */
  function updateDragOffset(event: PointerEvent) {
    const parentRect = getParentRect(windowEl)
    if (!parentRect) return

    dragOffset.value = {
      x: event.clientX - parentRect.left - position.value.x,
      y: event.clientY - parentRect.top - position.value.y
    }
  }

  /** Valida e ajusta a posição para caber no container */
  function clampToContainer() {
    const parentRect = getParentRect(windowEl)
    if (!parentRect) return

    const clampedPosition = clampPosition(position.value, parentRect)

    if (clampedPosition.x !== position.value.x || clampedPosition.y !== position.value.y) {
      position.value = clampedPosition
    }
  }

  // Cleanup
  onUnmounted(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    document.removeEventListener('pointermove', handleDrag)
    document.removeEventListener('pointerup', stopDrag)
  })

  return {
    // Estado
    isDragging: readonly(isDragging),
    hasMovedPastThreshold: readonly(hasMovedPastThreshold),

    // Ações
    startDrag,
    stopDrag,
    clampToContainer,
    updateDragOffset,

    // Utilitários
    getPositionLimits
  }
}
