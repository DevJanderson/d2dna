import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useWindowResize } from '~/layers/0-base/app/composables/useWindowResize'

/** Aguarda o próximo requestAnimationFrame */
function waitForRaf(): Promise<void> {
  return new Promise(resolve => requestAnimationFrame(() => resolve()))
}

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

describe('useWindowResize', () => {
  let position: ReturnType<typeof ref<{ x: number; y: number }>>
  let size: ReturnType<typeof ref<{ width: number; height: number }>>
  let windowEl: ReturnType<typeof createMockWindowEl>

  beforeEach(() => {
    position = ref({ x: 100, y: 50 })
    size = ref({ width: 600, height: 400 })
    windowEl = createMockWindowEl()
  })

  describe('initial state', () => {
    it('should start not resizing', () => {
      const resize = useWindowResize({ windowEl, position, size })
      expect(resize.isResizing.value).toBe(false)
    })

    it('should start with null resize direction', () => {
      const resize = useWindowResize({ windowEl, position, size })
      expect(resize.resizeDirection.value).toBeNull()
    })
  })

  describe('startResize', () => {
    it('should set isResizing to true', () => {
      const resize = useWindowResize({ windowEl, position, size })
      const event = new PointerEvent('pointerdown', { clientX: 700, clientY: 450 })

      resize.startResize(event, 'e')

      expect(resize.isResizing.value).toBe(true)
      expect(resize.resizeDirection.value).toBe('e')

      resize.stopResize()
    })

    it('should not start resize when disabled', () => {
      const resize = useWindowResize({
        windowEl,
        position,
        size,
        enabled: false
      })
      const event = new PointerEvent('pointerdown', { clientX: 700, clientY: 450 })

      resize.startResize(event, 'e')

      expect(resize.isResizing.value).toBe(false)
    })

    it('should not start resize with null direction', () => {
      const resize = useWindowResize({ windowEl, position, size })
      const event = new PointerEvent('pointerdown', { clientX: 700, clientY: 450 })

      resize.startResize(event, null)

      expect(resize.isResizing.value).toBe(false)
    })
  })

  describe('stopResize', () => {
    it('should set isResizing to false', () => {
      const resize = useWindowResize({ windowEl, position, size })
      const event = new PointerEvent('pointerdown', { clientX: 700, clientY: 450 })

      resize.startResize(event, 'e')
      expect(resize.isResizing.value).toBe(true)

      resize.stopResize()
      expect(resize.isResizing.value).toBe(false)
      expect(resize.resizeDirection.value).toBeNull()
    })

    it('should call onResizeEnd callback', () => {
      const onResizeEnd = vi.fn()
      const resize = useWindowResize({ windowEl, position, size, onResizeEnd })
      const event = new PointerEvent('pointerdown', { clientX: 700, clientY: 450 })

      resize.startResize(event, 'e')
      resize.stopResize()

      expect(onResizeEnd).toHaveBeenCalledWith(
        expect.objectContaining({ width: expect.any(Number), height: expect.any(Number) }),
        expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
      )
    })
  })

  describe('resize via mousemove', () => {
    it('should resize east (right edge)', async () => {
      const resize = useWindowResize({ windowEl, position, size })

      // Start resize from right edge
      const startEvent = new PointerEvent('pointerdown', { clientX: 700, clientY: 250 })
      resize.startResize(startEvent, 'e')

      // Simulate mouse move (drag right by 100px)
      const moveEvent = new PointerEvent('pointermove', { clientX: 800, clientY: 250 })
      document.dispatchEvent(moveEvent)
      await waitForRaf()

      expect(size.value.width).toBe(700) // 600 + 100
      expect(position.value.x).toBe(100) // unchanged

      resize.stopResize()
    })

    it('should resize south (bottom edge)', async () => {
      const resize = useWindowResize({ windowEl, position, size })

      const startEvent = new PointerEvent('pointerdown', { clientX: 400, clientY: 450 })
      resize.startResize(startEvent, 's')

      const moveEvent = new PointerEvent('pointermove', { clientX: 400, clientY: 550 })
      document.dispatchEvent(moveEvent)
      await waitForRaf()

      expect(size.value.height).toBe(500) // 400 + 100
      expect(position.value.y).toBe(50) // unchanged

      resize.stopResize()
    })

    it('should respect minimum size limits', async () => {
      const resize = useWindowResize({
        windowEl,
        position,
        size,
        sizeLimits: { minWidth: 200, minHeight: 150 }
      })

      const startEvent = new PointerEvent('pointerdown', { clientX: 700, clientY: 250 })
      resize.startResize(startEvent, 'e')

      // Try to shrink below minimum
      const moveEvent = new PointerEvent('pointermove', { clientX: 100, clientY: 250 })
      document.dispatchEvent(moveEvent)
      await waitForRaf()

      expect(size.value.width).toBeGreaterThanOrEqual(200)

      resize.stopResize()
    })

    it('should resize west (left edge) and adjust position', async () => {
      const resize = useWindowResize({ windowEl, position, size })

      const startEvent = new PointerEvent('pointerdown', { clientX: 100, clientY: 250 })
      resize.startResize(startEvent, 'w')

      // Move left by 50px
      const moveEvent = new PointerEvent('pointermove', { clientX: 50, clientY: 250 })
      document.dispatchEvent(moveEvent)
      await waitForRaf()

      expect(size.value.width).toBe(650) // 600 + 50
      expect(position.value.x).toBe(50) // 100 - 50

      resize.stopResize()
    })
  })

  describe('enabled as ref', () => {
    it('should respect reactive enabled', () => {
      const enabled = ref(true)
      const resize = useWindowResize({ windowEl, position, size, enabled })

      const event = new PointerEvent('pointerdown', { clientX: 700, clientY: 450 })
      resize.startResize(event, 'e')
      expect(resize.isResizing.value).toBe(true)
      resize.stopResize()

      enabled.value = false
      resize.startResize(event, 'e')
      expect(resize.isResizing.value).toBe(false)
    })
  })
})
