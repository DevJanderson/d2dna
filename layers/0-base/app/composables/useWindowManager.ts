/**
 * useWindowManager - Gerenciador de janelas estilo desktop
 * Controla múltiplas janelas, z-index, minimizar/maximizar/fechar
 */

import type { Component } from 'vue'
import type { WindowPosition, WindowSize } from '../types/window'

export interface WindowState {
  id: string
  title: string
  component?: Component
  props?: Record<string, unknown>
  position: WindowPosition
  size: WindowSize
  zIndex: number
  minimized: boolean
  maximized: boolean
  // Guarda posição/tamanho antes de maximizar para restaurar
  preMaximizeState?: {
    position: WindowPosition
    size: WindowSize
  }
}

export interface OpenWindowConfig {
  id?: string
  title: string
  component?: Component
  props?: Record<string, unknown>
  position?: WindowPosition
  size?: WindowSize
}

const BASE_Z_INDEX = 10
const Z_INDEX_INCREMENT = 1

export function useWindowManager() {
  // Estado reativo das janelas
  const windows = useState<WindowState[]>('window-manager-windows', () => [])
  const activeWindowId = useState<string | null>('window-manager-active', () => null)

  // Contador para z-index
  const maxZIndex = computed(() => {
    if (windows.value.length === 0) return BASE_Z_INDEX
    return Math.max(...windows.value.map(w => w.zIndex))
  })

  // Janela ativa
  const activeWindow = computed(() => {
    return windows.value.find(w => w.id === activeWindowId.value) || null
  })

  // Gerar ID único
  function generateId(): string {
    return `window-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }

  // Abrir nova janela
  function open(config: OpenWindowConfig): string {
    const id = config.id || generateId()

    // Verifica se janela com mesmo ID já existe
    const existing = windows.value.find(w => w.id === id)
    if (existing) {
      focus(id)
      return id
    }

    // Calcula posição inicial (cascade effect)
    const offset = windows.value.length * 30
    const defaultPosition = { x: 100 + offset, y: 50 + offset }
    const defaultSize = { width: 600, height: 400 }

    const newWindow: WindowState = {
      id,
      title: config.title,
      component: config.component,
      props: config.props || {},
      position: config.position || defaultPosition,
      size: config.size || defaultSize,
      zIndex: maxZIndex.value + Z_INDEX_INCREMENT,
      minimized: false,
      maximized: false
    }

    windows.value.push(newWindow)
    activeWindowId.value = id

    return id
  }

  // Fechar janela
  function close(id: string): void {
    const index = windows.value.findIndex(w => w.id === id)
    if (index !== -1) {
      windows.value.splice(index, 1)

      // Se era a janela ativa, ativar a próxima com maior z-index
      if (activeWindowId.value === id) {
        const remaining = windows.value.filter(w => !w.minimized)
        if (remaining.length > 0) {
          const topWindow = remaining.reduce((prev, curr) =>
            prev.zIndex > curr.zIndex ? prev : curr
          )
          activeWindowId.value = topWindow.id
        } else {
          activeWindowId.value = null
        }
      }
    }
  }

  // Focar janela (trazer para frente)
  function focus(id: string): void {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      window.zIndex = maxZIndex.value + Z_INDEX_INCREMENT
      window.minimized = false
      activeWindowId.value = id
    }
  }

  // Minimizar janela
  function minimize(id: string): void {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      window.minimized = true

      // Se era a janela ativa, ativar a próxima
      if (activeWindowId.value === id) {
        const remaining = windows.value.filter(w => !w.minimized && w.id !== id)
        if (remaining.length > 0) {
          const topWindow = remaining.reduce((prev, curr) =>
            prev.zIndex > curr.zIndex ? prev : curr
          )
          activeWindowId.value = topWindow.id
        } else {
          activeWindowId.value = null
        }
      }
    }
  }

  // Maximizar janela
  function maximize(id: string): void {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      if (!window.maximized) {
        // Guardar estado antes de maximizar
        window.preMaximizeState = {
          position: { ...window.position },
          size: { ...window.size }
        }
        window.maximized = true
        window.position = { x: 0, y: 0 }
        // Size será controlado pelo CSS (100% da área)
      }
      focus(id)
    }
  }

  // Restaurar janela (de maximizado para normal)
  function restore(id: string): void {
    const window = windows.value.find(w => w.id === id)
    if (window && window.maximized && window.preMaximizeState) {
      window.position = { ...window.preMaximizeState.position }
      window.size = { ...window.preMaximizeState.size }
      window.maximized = false
      window.preMaximizeState = undefined
    }
  }

  // Toggle maximizar/restaurar
  function toggleMaximize(id: string): void {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      if (window.maximized) {
        restore(id)
      } else {
        maximize(id)
      }
    }
  }

  // Atualizar posição da janela
  function updatePosition(id: string, position: WindowPosition): void {
    const window = windows.value.find(w => w.id === id)
    if (window && !window.maximized) {
      window.position = position
    }
  }

  // Atualizar tamanho da janela
  function updateSize(id: string, size: WindowSize): void {
    const window = windows.value.find(w => w.id === id)
    if (window && !window.maximized) {
      window.size = size
    }
  }

  // Atualizar título e props da janela
  function updateWindow(
    id: string,
    updates: { title?: string; props?: Record<string, unknown> }
  ): void {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      if (updates.title !== undefined) {
        window.title = updates.title
      }
      if (updates.props !== undefined) {
        window.props = { ...window.props, ...updates.props }
      }
    }
  }

  // Fechar todas as janelas
  function closeAll(): void {
    windows.value = []
    activeWindowId.value = null
  }

  // Minimizar todas as janelas
  function minimizeAll(): void {
    windows.value.forEach(w => {
      w.minimized = true
    })
    activeWindowId.value = null
  }

  // Janelas não minimizadas
  const visibleWindows = computed(() => {
    return windows.value.filter(w => !w.minimized)
  })

  // Janelas minimizadas
  const minimizedWindows = computed(() => {
    return windows.value.filter(w => w.minimized)
  })

  return {
    // Estado
    windows: readonly(windows),
    activeWindowId: readonly(activeWindowId),
    activeWindow,
    visibleWindows,
    minimizedWindows,

    // Ações
    open,
    close,
    focus,
    minimize,
    maximize,
    restore,
    toggleMaximize,
    updatePosition,
    updateSize,
    updateWindow,
    closeAll,
    minimizeAll
  }
}
