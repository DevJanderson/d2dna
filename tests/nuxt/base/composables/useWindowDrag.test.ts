import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Ref } from 'vue'
import { ref } from 'vue'
import { useWindowDrag } from '~/layers/0-base/app/composables/useWindowDrag'

function createMockWindowEl(parentWidth = 1200, parentHeight = 800) {
  const parentRect = {
    left: 0,
    top: 0,
    right: parentWidth,
    bottom: parentHeight,
    width: parentWidth,
    height: parentHeight,
    x: 0,
    y: 0,
    toJSON: () => ({})
  }

  return ref({
    parentElement: {
      getBoundingClientRect: () => parentRect
    }
  } as unknown as HTMLElement)
}

describe('useWindowDrag', () => {
  let position: Ref<{ x: number; y: number }>
  let size: Ref<{ width: number; height: number }>
  let windowEl: Ref<HTMLElement | null>

  beforeEach(() => {
    position = ref({ x: 100, y: 50 })
    size = ref({ width: 600, height: 400 })
    windowEl = createMockWindowEl()
  })

  describe('initial state', () => {
    it('should start not dragging', () => {
      const drag = useWindowDrag({ windowEl, position, size })
      expect(drag.isDragging.value).toBe(false)
    })

    it('should start with hasMovedPastThreshold false', () => {
      const drag = useWindowDrag({ windowEl, position, size })
      expect(drag.hasMovedPastThreshold.value).toBe(false)
    })
  })

  describe('getPositionLimits', () => {
    it('should calculate position limits based on container', () => {
      const drag = useWindowDrag({ windowEl, position, size })
      const parentRect = new DOMRect(0, 0, 1200, 800)
      const limits = drag.getPositionLimits(parentRect)

      // padding default = 8
      expect(limits.minX).toBe(8)
      expect(limits.minY).toBe(8)
      // maxX = max(8, 1200 - 600 - 8) = 592
      expect(limits.maxX).toBe(592)
      // maxY = max(8, 800 - 400 - 8) = 392
      expect(limits.maxY).toBe(392)
    })

    it('should use custom padding from config', () => {
      const drag = useWindowDrag({
        windowEl,
        position,
        size,
        config: { padding: 20 }
      })
      const parentRect = new DOMRect(0, 0, 1200, 800)
      const limits = drag.getPositionLimits(parentRect)

      expect(limits.minX).toBe(20)
      expect(limits.minY).toBe(20)
      expect(limits.maxX).toBe(580) // 1200 - 600 - 20
      expect(limits.maxY).toBe(380) // 800 - 400 - 20
    })

    it('should clamp maxX/maxY to padding when window is larger than container', () => {
      const bigSize = ref({ width: 1300, height: 900 })
      const drag = useWindowDrag({ windowEl, position, size: bigSize })
      const parentRect = new DOMRect(0, 0, 1200, 800)
      const limits = drag.getPositionLimits(parentRect)

      // max(8, 1200 - 1300 - 8) = max(8, -108) = 8
      expect(limits.maxX).toBe(8)
      expect(limits.maxY).toBe(8)
    })
  })

  describe('startDrag', () => {
    it('should set isDragging to true', () => {
      const drag = useWindowDrag({ windowEl, position, size })

      // Criar evento com target que nao e um botao
      const target = document.createElement('div')
      const event = {
        clientX: 200,
        clientY: 100,
        target,
        preventDefault: vi.fn(),
        stopPropagation: vi.fn()
      } as unknown as PointerEvent

      drag.startDrag(event)

      expect(drag.isDragging.value).toBe(true)

      drag.stopDrag()
    })

    it('should call onDragStart callback', () => {
      const onDragStart = vi.fn()
      const drag = useWindowDrag({ windowEl, position, size, onDragStart })

      const target = document.createElement('div')
      const event = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(event)

      expect(onDragStart).toHaveBeenCalled()

      drag.stopDrag()
    })

    it('should not start drag when disabled', () => {
      const drag = useWindowDrag({ windowEl, position, size, enabled: false })

      const target = document.createElement('div')
      const event = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(event)

      expect(drag.isDragging.value).toBe(false)
    })

    it('should not start drag when clicking a button', () => {
      const drag = useWindowDrag({ windowEl, position, size })

      const button = document.createElement('button')
      const event = {
        clientX: 200,
        clientY: 100,
        target: button
      } as unknown as PointerEvent

      drag.startDrag(event)

      expect(drag.isDragging.value).toBe(false)
    })

    it('should not start drag when clicking inside a button', () => {
      const drag = useWindowDrag({ windowEl, position, size })

      const button = document.createElement('button')
      const span = document.createElement('span')
      button.appendChild(span)

      const event = {
        clientX: 200,
        clientY: 100,
        target: span
      } as unknown as PointerEvent

      drag.startDrag(event)

      expect(drag.isDragging.value).toBe(false)
    })
  })

  describe('stopDrag', () => {
    it('should set isDragging to false', () => {
      const drag = useWindowDrag({ windowEl, position, size })

      const target = document.createElement('div')
      const event = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(event)
      expect(drag.isDragging.value).toBe(true)

      drag.stopDrag()
      expect(drag.isDragging.value).toBe(false)
    })

    it('should call onDragEnd callback with current position', () => {
      const onDragEnd = vi.fn()
      const drag = useWindowDrag({ windowEl, position, size, onDragEnd })

      const target = document.createElement('div')
      const event = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(event)
      drag.stopDrag()

      expect(onDragEnd).toHaveBeenCalledWith(position.value)
    })

    it('should not call onDragEnd if not dragging', () => {
      const onDragEnd = vi.fn()
      const drag = useWindowDrag({ windowEl, position, size, onDragEnd })

      drag.stopDrag()

      expect(onDragEnd).not.toHaveBeenCalled()
    })
  })

  describe('drag threshold', () => {
    it('should not move position until threshold is passed', () => {
      const drag = useWindowDrag({ windowEl, position, size })

      const target = document.createElement('div')
      const startEvent = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(startEvent)

      // Mover apenas 2px (threshold default = 5)
      const smallMove = new PointerEvent('pointermove', { clientX: 202, clientY: 101 })
      document.dispatchEvent(smallMove)

      expect(drag.hasMovedPastThreshold.value).toBe(false)
      // Posicao nao deve ter mudado
      expect(position.value).toEqual({ x: 100, y: 50 })

      drag.stopDrag()
    })

    it('should start moving after threshold is passed', () => {
      const drag = useWindowDrag({ windowEl, position, size })

      const target = document.createElement('div')
      const startEvent = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(startEvent)

      // Mover 10px (acima do threshold de 5)
      const bigMove = new PointerEvent('pointermove', { clientX: 210, clientY: 100 })
      document.dispatchEvent(bigMove)

      expect(drag.hasMovedPastThreshold.value).toBe(true)

      drag.stopDrag()
    })
  })

  describe('clampToContainer', () => {
    it('should clamp position that is out of bounds', () => {
      position.value = { x: -50, y: -20 }
      const drag = useWindowDrag({ windowEl, position, size })

      drag.clampToContainer()

      expect(position.value.x).toBe(8) // padding
      expect(position.value.y).toBe(8) // padding
    })

    it('should not change position if already within bounds', () => {
      position.value = { x: 100, y: 50 }
      const drag = useWindowDrag({ windowEl, position, size })

      drag.clampToContainer()

      expect(position.value).toEqual({ x: 100, y: 50 })
    })

    it('should clamp position that exceeds max bounds', () => {
      position.value = { x: 1000, y: 700 }
      const drag = useWindowDrag({ windowEl, position, size })

      drag.clampToContainer()

      // maxX = max(8, 1200 - 600 - 8) = 592
      // maxY = max(8, 800 - 400 - 8) = 392
      expect(position.value.x).toBe(592)
      expect(position.value.y).toBe(392)
    })
  })

  describe('enabled as ref', () => {
    it('should respect reactive enabled', () => {
      const enabled = ref(true)
      const drag = useWindowDrag({ windowEl, position, size, enabled })

      const target = document.createElement('div')
      const event = {
        clientX: 200,
        clientY: 100,
        target
      } as unknown as PointerEvent

      drag.startDrag(event)
      expect(drag.isDragging.value).toBe(true)
      drag.stopDrag()

      enabled.value = false
      drag.startDrag(event)
      expect(drag.isDragging.value).toBe(false)
    })
  })
})
