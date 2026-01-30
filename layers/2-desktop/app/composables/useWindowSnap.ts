/**
 * useWindowSnap - Composable para lógica de snap de janelas nas bordas
 * @module composables/useWindowSnap
 */

import type { Ref } from 'vue'
import type {
  WindowPosition,
  WindowSize,
  WindowGeometry,
  WindowContainerConfig,
  SnapZone
} from '../types/window'
import { DEFAULT_WINDOW_CONFIG } from '../types/window'

export interface UseWindowSnapOptions {
  /** Ref do elemento da janela */
  windowEl: Ref<HTMLElement | null>
  /** Posição atual da janela */
  position: Ref<WindowPosition>
  /** Tamanho atual da janela */
  size: Ref<WindowSize>
  /** Configuração do container */
  config?: Partial<WindowContainerConfig>
  /** Callback quando aplicar snap */
  onSnap?: (zone: SnapZone, state: WindowGeometry) => void
  /** Callback quando restaurar do snap */
  onRestore?: (state: WindowGeometry) => void
}

export function useWindowSnap(options: UseWindowSnapOptions) {
  const { windowEl, position, size, config: userConfig, onSnap, onRestore } = options

  const config = { ...DEFAULT_WINDOW_CONFIG, ...userConfig }

  // Estado do snap
  const snapZone = ref<SnapZone>(null)
  const isSnapped = ref(false)
  const preSnapState = ref<WindowGeometry | null>(null)

  /** Obtém o retângulo do container pai */
  function getParentRect(): DOMRect | null {
    const parent = windowEl.value?.parentElement
    return parent?.getBoundingClientRect() || null
  }

  /** Detecta zona de snap baseado na posição do mouse */
  function detectSnapZone(mouseX: number, containerWidth: number): SnapZone {
    if (mouseX <= config.snapZone) {
      return 'left'
    } else if (mouseX >= containerWidth - config.snapZone) {
      return 'right'
    }
    return null
  }

  /** Atualiza a zona de snap durante o arrasto */
  function updateSnapZone(mouseX: number) {
    const parentRect = getParentRect()
    if (!parentRect) {
      snapZone.value = null
      return
    }

    snapZone.value = detectSnapZone(mouseX, parentRect.width)
  }

  /** Limpa a zona de snap */
  function clearSnapZone() {
    snapZone.value = null
  }

  /** Calcula as dimensões do snap */
  function calculateSnapDimensions(zone: 'left' | 'right', parentRect: DOMRect): WindowGeometry {
    const snapWidth = Math.floor((parentRect.width - config.padding * 3) / 2)
    const snapHeight = parentRect.height - config.padding * 2

    const snapX = zone === 'left' ? config.padding : parentRect.width - snapWidth - config.padding

    return {
      position: { x: snapX, y: config.padding },
      size: { width: snapWidth, height: snapHeight }
    }
  }

  /** Aplica o snap para a zona especificada */
  function applySnap(zone: 'left' | 'right') {
    const parentRect = getParentRect()
    if (!parentRect) return

    // Guardar estado antes do snap para poder restaurar
    if (!isSnapped.value) {
      preSnapState.value = {
        position: { ...position.value },
        size: { ...size.value }
      }
    }

    // Calcular e aplicar novas dimensões
    const snapState = calculateSnapDimensions(zone, parentRect)
    position.value = snapState.position
    size.value = snapState.size
    isSnapped.value = true

    onSnap?.(zone, snapState)
  }

  /** Tenta aplicar snap se estiver em uma zona de snap */
  function tryApplySnap(): boolean {
    if (snapZone.value) {
      applySnap(snapZone.value)
      snapZone.value = null
      return true
    }
    return false
  }

  /** Restaura do snap para o estado anterior */
  function restoreFromSnap(event: MouseEvent): boolean {
    if (!isSnapped.value || !preSnapState.value) {
      return false
    }

    const parentRect = getParentRect()
    if (!parentRect) return false

    // Calcular posição do mouse relativa à janela antes de restaurar
    const mouseXInWindow = event.clientX - parentRect.left - position.value.x
    const widthRatio = mouseXInWindow / size.value.width

    // Restaurar tamanho
    const restoredState = { ...preSnapState.value }
    size.value = { ...restoredState.size }
    isSnapped.value = false

    // Ajustar posição para que o mouse fique na mesma proporção horizontal
    const newX = event.clientX - parentRect.left - size.value.width * widthRatio
    position.value.x = Math.max(config.padding, newX)

    preSnapState.value = null

    onRestore?.(restoredState)
    return true
  }

  /** Calcula o estilo do preview de snap */
  const snapPreviewStyle = computed(() => {
    if (!snapZone.value || !windowEl.value) return null

    const parentRect = getParentRect()
    if (!parentRect) return null

    const snapState = calculateSnapDimensions(snapZone.value, parentRect)

    return {
      position: 'absolute' as const,
      left: `${snapState.position.x}px`,
      top: `${snapState.position.y}px`,
      width: `${snapState.size.width}px`,
      height: `${snapState.size.height}px`
    }
  })

  return {
    // Estado
    snapZone: readonly(snapZone),
    isSnapped: readonly(isSnapped),
    preSnapState: readonly(preSnapState),
    snapPreviewStyle,

    // Ações
    updateSnapZone,
    clearSnapZone,
    applySnap,
    tryApplySnap,
    restoreFromSnap,
    detectSnapZone,

    // Utilitários
    calculateSnapDimensions
  }
}
