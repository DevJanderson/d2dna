/**
 * Tipos relacionados ao sistema de janelas desktop
 * @module types/window
 */

/** Posição de uma janela no container */
export interface WindowPosition {
  x: number
  y: number
}

/** Tamanho de uma janela */
export interface WindowSize {
  width: number
  height: number
}

/** Geometria de uma janela (posição + tamanho) - usado para pre-snap state */
export interface WindowGeometry {
  position: WindowPosition
  size: WindowSize
}

/** Zonas de snap disponíveis */
export type SnapZone = 'left' | 'right' | null

/** Direções de redimensionamento */
export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null

/** Configuração do container de janelas */
export interface WindowContainerConfig {
  /** Padding interno do container (espaço de respiro) */
  padding: number
  /** Tamanho da zona de snap nas bordas */
  snapZone: number
  /** Distância mínima para considerar um arrasto */
  dragThreshold: number
}

/** Configuração padrão do container */
export const DEFAULT_WINDOW_CONFIG: WindowContainerConfig = {
  padding: 8,
  snapZone: 20,
  dragThreshold: 5
}

/** Limites de tamanho de uma janela */
export interface WindowSizeLimits {
  minWidth: number
  minHeight: number
  maxWidth?: number
  maxHeight?: number
}

/** Limites padrão de tamanho */
export const DEFAULT_SIZE_LIMITS: WindowSizeLimits = {
  minWidth: 200,
  minHeight: 150
}
