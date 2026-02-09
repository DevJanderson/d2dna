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
const Z_INDEX_NORMALIZE_THRESHOLD = 100
const STORAGE_KEY = 'tucuxi-window-state'
const SAVE_DEBOUNCE_MS = 500

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

      saveState()
    }
  }

  /** Normaliza z-indexes para evitar crescimento infinito */
  function normalizeZIndexes() {
    if (windows.value.length === 0) return
    const max = Math.max(...windows.value.map(w => w.zIndex))
    if (max <= BASE_Z_INDEX + Z_INDEX_NORMALIZE_THRESHOLD) return

    const sorted = [...windows.value].sort((a, b) => a.zIndex - b.zIndex)
    sorted.forEach((w, i) => {
      const win = windows.value.find(x => x.id === w.id)
      if (win) win.zIndex = BASE_Z_INDEX + (i + 1) * Z_INDEX_INCREMENT
    })
  }

  // Focar janela (trazer para frente)
  function focus(id: string): void {
    const window = windows.value.find(w => w.id === id)
    if (window) {
      window.zIndex = maxZIndex.value + Z_INDEX_INCREMENT
      window.minimized = false
      activeWindowId.value = id
      normalizeZIndexes()
      saveState()
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

      saveState()
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
      saveState()
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
      saveState()
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
      saveState()
    }
  }

  // Atualizar tamanho da janela
  function updateSize(id: string, size: WindowSize): void {
    const window = windows.value.find(w => w.id === id)
    if (window && !window.maximized) {
      window.size = size
      saveState()
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

  // ============ PERSISTÊNCIA ============

  let saveTimeout: ReturnType<typeof setTimeout> | null = null

  /** Salva geometria das janelas no localStorage (com debounce) */
  function saveState() {
    if (!import.meta.client) return

    if (saveTimeout) clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      const data = windows.value.map(w => ({
        id: w.id,
        title: w.title,
        position: w.position,
        size: w.size,
        minimized: w.minimized,
        maximized: w.maximized
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }, SAVE_DEBOUNCE_MS)
  }

  /** Restaura geometria das janelas existentes a partir do localStorage */
  function restoreState() {
    if (!import.meta.client) return

    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return

    try {
      const data = JSON.parse(raw) as Array<{
        id: string
        position: { x: number; y: number }
        size: { width: number; height: number }
        minimized: boolean
        maximized: boolean
      }>

      // Restaurar apenas geometria de janelas que ainda existem
      for (const saved of data) {
        const win = windows.value.find(w => w.id === saved.id)
        if (win) {
          win.position = saved.position
          win.size = saved.size
          win.minimized = saved.minimized
          win.maximized = saved.maximized
        }
      }
    } catch {
      /* ignore corrupt data */
    }
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
    minimizeAll,
    saveState,
    restoreState
  }
}
