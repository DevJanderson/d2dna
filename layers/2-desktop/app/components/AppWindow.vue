<script setup lang="ts">
/**
 * AppWindow - Janela estilo desktop (Windows/macOS)
 *
 * Componente principal do sistema de janelas com suporte a:
 * - Arrastar (drag)
 * - Redimensionar (resize)
 * - Snap nas bordas (metade da tela)
 * - Minimizar, maximizar, fechar
 * - Integração com WindowManager
 */
import type { ResizeDirection, WindowContainerConfig } from '../types/window'
import { DEFAULT_WINDOW_CONFIG, DEFAULT_SIZE_LIMITS } from '../types/window'

// ============ PROPS ============

interface Props {
  /** ID único da janela (necessário para integração com WindowManager) */
  windowId?: string
  /** Título exibido na barra de título (centralizado) */
  title?: string
  /** Caminho do arquivo (exibido no menu do título) */
  filePath?: string
  /** Mostrar botões de controle (minimizar, maximizar, fechar) */
  showControls?: boolean
  /** Mostrar ícone de documento à esquerda */
  showIcon?: boolean
  /** Mostrar dropdown no ícone */
  showIconDropdown?: boolean
  /** Mostrar dropdown no título */
  showTitleDropdown?: boolean
  /** Permitir arrastar a janela */
  draggable?: boolean
  /** Permitir redimensionar a janela */
  resizable?: boolean
  /** Largura mínima em pixels */
  minWidth?: number
  /** Altura mínima em pixels */
  minHeight?: number
  /** Posição X inicial */
  initialX?: number
  /** Posição Y inicial */
  initialY?: number
  /** Largura inicial */
  initialWidth?: number
  /** Altura inicial */
  initialHeight?: number
  /** Z-index da janela */
  zIndex?: number
  /** Se a janela está maximizada */
  maximized?: boolean
  /** Se usa WindowManager para gerenciamento de estado */
  managed?: boolean
  /** Padding do container (espaço de respiro) */
  containerPadding?: number
  /** Tamanho da zona de snap nas bordas */
  snapZoneSize?: number
}

const props = withDefaults(defineProps<Props>(), {
  windowId: '',
  title: '',
  filePath: '',
  showControls: true,
  showIcon: true,
  showIconDropdown: true,
  showTitleDropdown: true,
  draggable: true,
  resizable: true,
  minWidth: DEFAULT_SIZE_LIMITS.minWidth,
  minHeight: DEFAULT_SIZE_LIMITS.minHeight,
  initialX: 0,
  initialY: 0,
  initialWidth: 600,
  initialHeight: 400,
  zIndex: 10,
  maximized: false,
  managed: false,
  containerPadding: DEFAULT_WINDOW_CONFIG.padding,
  snapZoneSize: DEFAULT_WINDOW_CONFIG.snapZone
})

// ============ EMITS ============

const emit = defineEmits<{
  /** Emitido quando o botão fechar é clicado */
  close: []
  /** Emitido quando o botão minimizar é clicado */
  minimize: []
  /** Emitido quando o botão maximizar é clicado */
  maximize: []
  /** Emitido quando a janela recebe foco */
  focus: []
  /** Quando um arquivo é selecionado no navegador */
  'file:select': [file: { id: string; title: string; path: string }]
  /** Emitido quando a posição muda */
  'update:position': [position: { x: number; y: number }]
  /** Emitido quando o tamanho muda */
  'update:size': [size: { width: number; height: number }]
}>()

// ============ CONFIGURAÇÃO ============

const containerConfig: WindowContainerConfig = {
  padding: props.containerPadding,
  snapZone: props.snapZoneSize,
  dragThreshold: DEFAULT_WINDOW_CONFIG.dragThreshold
}

// ============ WINDOW MANAGER ============

const windowManager = props.managed ? useWindowManager() : null

// ============ ESTADO ============

const windowEl = ref<HTMLElement | null>(null)
const position = ref({ x: props.initialX, y: props.initialY })
const size = ref({ width: props.initialWidth, height: props.initialHeight })

// ============ COMPOSABLES ============

// Snap
const snap = useWindowSnap({
  windowEl,
  position,
  size,
  config: containerConfig,
  onSnap: (_zone, state) => {
    emit('update:position', state.position)
    emit('update:size', state.size)
    syncWithWindowManager()
  },
  onRestore: () => {
    syncWithWindowManager()
  }
})

// Drag
const drag = useWindowDrag({
  windowEl,
  position,
  size,
  enabled: computed(() => props.draggable && !props.maximized),
  config: containerConfig,
  onDragStart: () => {
    // Nada especial no início
  },
  onDrag: (_pos, mouseX) => {
    // Só detectar snap se não estiver em snap
    if (!snap.isSnapped.value) {
      snap.updateSnapZone(mouseX)
    }
  },
  onDragEnd: finalPosition => {
    // Tentar aplicar snap
    if (snap.tryApplySnap()) {
      return
    }

    // Sem snap, apenas atualizar posição
    emit('update:position', finalPosition)
    if (windowManager && props.windowId) {
      windowManager.updatePosition(props.windowId, finalPosition)
    }
  }
})

// Resize
const resize = useWindowResize({
  windowEl,
  position,
  size,
  enabled: computed(() => props.resizable && !props.maximized && !snap.isSnapped.value),
  sizeLimits: { minWidth: props.minWidth, minHeight: props.minHeight },
  config: containerConfig,
  onResizeEnd: (newSize, newPosition) => {
    emit('update:size', newSize)
    emit('update:position', newPosition)
    syncWithWindowManager()
  }
})

// ============ COMPUTED ============

/** Se a janela está ativa (focada) */
const isActive = computed(() => {
  if (!windowManager || !props.windowId) return true
  return windowManager.activeWindowId.value === props.windowId
})

/** Parent element para Teleport do preview de snap */
const parentEl = computed(() => windowEl.value?.parentElement || null)

/** Estilo inline da janela */
const windowStyle = computed(() => {
  if (props.maximized) {
    return {
      position: 'absolute' as const,
      left: `${containerConfig.padding}px`,
      top: `${containerConfig.padding}px`,
      width: `calc(100% - ${containerConfig.padding * 2}px)`,
      height: `calc(100% - ${containerConfig.padding * 2}px)`,
      zIndex: props.zIndex
    }
  }

  return {
    position: 'absolute' as const,
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
    zIndex: props.zIndex
  }
})

// ============ MÉTODOS ============

/** Sincroniza estado com WindowManager */
function syncWithWindowManager() {
  if (!windowManager || !props.windowId) return

  windowManager.updatePosition(props.windowId, position.value)
  windowManager.updateSize(props.windowId, size.value)
}

/** Handler de foco na janela */
function handleFocus() {
  emit('focus')
  if (windowManager && props.windowId) {
    windowManager.focus(props.windowId)
  }
}

/** Handler de minimizar */
function handleMinimize() {
  emit('minimize')
  if (windowManager && props.windowId) {
    windowManager.minimize(props.windowId)
  }
}

/** Handler de maximizar/restaurar */
function handleMaximize() {
  emit('maximize')
  if (windowManager && props.windowId) {
    windowManager.toggleMaximize(props.windowId)
  }
}

/** Handler de fechar */
function handleClose() {
  emit('close')
  if (windowManager && props.windowId) {
    windowManager.close(props.windowId)
  }
}

/** Handler de início de drag na barra de título */
function handleTitleBarMouseDown(event: MouseEvent) {
  // Se estiver em snap, verificar se deve restaurar
  if (snap.isSnapped.value && snap.preSnapState.value) {
    // Registrar o início do drag
    drag.startDrag(event)

    // Configurar para restaurar quando mover além do threshold
    const originalOnDrag = drag.hasMovedPastThreshold

    const unwatch = watch(originalOnDrag, moved => {
      if (moved && snap.isSnapped.value) {
        snap.restoreFromSnap(event)
        drag.updateDragOffset(event)
        unwatch()
      }
    })

    return
  }

  drag.startDrag(event)
}

/** Handler de resize */
function handleResize(event: MouseEvent, direction: ResizeDirection) {
  resize.startResize(event, direction)
}

/** Handler de seleção de arquivo no dropdown */
function handleFileSelect(file: { id: string; title: string; path: string }) {
  // Se é uma janela gerenciada com conteúdo, atualiza o conteúdo interno
  if (windowManager && props.windowId) {
    const currentWindow = windowManager.windows.value.find(w => w.id === props.windowId)
    if (currentWindow?.props?.contentPath !== undefined) {
      // Atualiza título e path do conteúdo na mesma janela
      windowManager.updateWindow(props.windowId, {
        title: file.title,
        props: { contentPath: file.path }
      })
      return
    }
  }

  // Caso contrário, propaga o evento para abrir nova janela
  emit('file:select', file)
}

// ============ WATCHERS ============

// Sincronizar com props quando mudam (para janelas gerenciadas)
watch(
  () => props.initialX,
  x => {
    if (!drag.isDragging.value) {
      position.value.x = x
      nextTick(() => drag.clampToContainer())
    }
  }
)

watch(
  () => props.initialY,
  y => {
    if (!drag.isDragging.value) {
      position.value.y = y
      nextTick(() => drag.clampToContainer())
    }
  }
)

// ============ LIFECYCLE ============

onMounted(() => {
  nextTick(() => drag.clampToContainer())
  window.addEventListener('resize', () => drag.clampToContainer())
})

onUnmounted(() => {
  window.removeEventListener('resize', () => drag.clampToContainer())
})
</script>

<template>
  <div
    ref="windowEl"
    class="flex flex-col overflow-hidden rounded-xl border bg-card shadow-lg transition-shadow"
    :class="[
      isActive ? 'border-border shadow-xl' : 'border-border/50 shadow-md',
      { 'rounded-none': maximized }
    ]"
    :style="windowStyle"
    @mousedown="handleFocus"
  >
    <!-- Barra de título -->
    <AppWindowTitleBar
      :title="title"
      :file-path="filePath"
      :show-controls="showControls"
      :show-icon="showIcon"
      :show-icon-dropdown="showIconDropdown"
      :show-title-dropdown="showTitleDropdown"
      :draggable="draggable"
      :is-dragging="drag.isDragging.value"
      :is-maximized="maximized"
      @mousedown="handleTitleBarMouseDown"
      @minimize="handleMinimize"
      @maximize="handleMaximize"
      @close="handleClose"
      @file:select="handleFileSelect"
    >
      <template v-if="$slots['title-icon']" #icon>
        <slot name="title-icon" />
      </template>
    </AppWindowTitleBar>

    <!-- Conteúdo da janela -->
    <div class="flex-1 overflow-auto bg-card p-4">
      <slot />
    </div>

    <!-- Handles de resize -->
    <AppWindowResizeHandles
      v-if="resizable && !maximized && !snap.isSnapped.value"
      @resize="handleResize"
    />
  </div>

  <!-- Preview de snap -->
  <Teleport v-if="snap.snapPreviewStyle.value && parentEl" :to="parentEl">
    <AppWindowSnapPreview :style="snap.snapPreviewStyle.value" :z-index="zIndex - 1" />
  </Teleport>
</template>
