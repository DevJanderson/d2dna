import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useWindowSnap } from '~/layers/0-base/app/composables/useWindowSnap'

// Mock do parentElement com getBoundingClientRect
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

describe('useWindowSnap', () => {
  let position: ReturnType<typeof ref<{ x: number; y: number }>>
  let size: ReturnType<typeof ref<{ width: number; height: number }>>
  let windowEl: ReturnType<typeof createMockWindowEl>

  beforeEach(() => {
    position = ref({ x: 100, y: 50 })
    size = ref({ width: 600, height: 400 })
    windowEl = createMockWindowEl()
  })

  describe('detectSnapZone', () => {
    it('should detect left snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(10, 400, 1200, 800)).toBe('left')
    })

    it('should detect right snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(1190, 400, 1200, 800)).toBe('right')
    })

    it('should detect top snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(600, 5, 1200, 800)).toBe('top')
    })

    it('should detect top-left snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(5, 5, 1200, 800)).toBe('top-left')
    })

    it('should detect top-right snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(1195, 5, 1200, 800)).toBe('top-right')
    })

    it('should detect bottom-left snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(5, 795, 1200, 800)).toBe('bottom-left')
    })

    it('should detect bottom-right snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(1195, 795, 1200, 800)).toBe('bottom-right')
    })

    it('should return null when not in snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      expect(snap.detectSnapZone(600, 400, 1200, 800)).toBeNull()
    })

    it('should respect custom config snapZone', () => {
      const snap = useWindowSnap({
        windowEl,
        position,
        size,
        config: { snapZone: 50 }
      })
      expect(snap.detectSnapZone(40, 400, 1200, 800)).toBe('left')
      expect(snap.detectSnapZone(1170, 400, 1200, 800)).toBe('right')
    })
  })

  describe('updateSnapZone', () => {
    it('should update snapZone based on mouse position', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.updateSnapZone(5, 400)
      expect(snap.snapZone.value).toBe('left')

      snap.updateSnapZone(1195, 400)
      expect(snap.snapZone.value).toBe('right')

      snap.updateSnapZone(600, 400)
      expect(snap.snapZone.value).toBeNull()
    })
  })

  describe('clearSnapZone', () => {
    it('should set snapZone to null', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.updateSnapZone(5, 400)
      expect(snap.snapZone.value).toBe('left')

      snap.clearSnapZone()
      expect(snap.snapZone.value).toBeNull()
    })
  })

  describe('calculateSnapDimensions', () => {
    it('should calculate left snap dimensions', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      const parentRect = new DOMRect(0, 0, 1200, 800)
      const result = snap.calculateSnapDimensions('left', parentRect)

      // width = floor((1200 - 8*3) / 2) = floor(1176/2) = 588
      // height = 800 - 8*2 = 784
      expect(result.position.x).toBe(8) // padding
      expect(result.position.y).toBe(8) // padding
      expect(result.size.width).toBe(588)
      expect(result.size.height).toBe(784)
    })

    it('should calculate right snap dimensions', () => {
      const snap = useWindowSnap({ windowEl, position, size })
      const parentRect = new DOMRect(0, 0, 1200, 800)
      const result = snap.calculateSnapDimensions('right', parentRect)

      // snapX = 1200 - 588 - 8 = 604
      expect(result.position.x).toBe(604)
      expect(result.position.y).toBe(8)
      expect(result.size.width).toBe(588)
      expect(result.size.height).toBe(784)
    })
  })

  describe('applySnap', () => {
    it('should snap window to left', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.applySnap('left')

      expect(snap.isSnapped.value).toBe(true)
      expect(position.value.x).toBe(8)
      expect(position.value.y).toBe(8)
    })

    it('should snap window to right', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.applySnap('right')

      expect(snap.isSnapped.value).toBe(true)
      expect(position.value.x).toBeGreaterThan(500) // right side
    })

    it('should save pre-snap state', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.applySnap('left')

      expect(snap.preSnapState.value).toBeDefined()
      expect(snap.preSnapState.value!.position).toEqual({ x: 100, y: 50 })
      expect(snap.preSnapState.value!.size).toEqual({ width: 600, height: 400 })
    })

    it('should call onSnap callback', () => {
      const onSnap = vi.fn()
      const snap = useWindowSnap({ windowEl, position, size, onSnap })

      snap.applySnap('left')

      expect(onSnap).toHaveBeenCalledWith(
        'left',
        expect.objectContaining({
          position: expect.any(Object),
          size: expect.any(Object)
        })
      )
    })

    it('should not overwrite pre-snap state if already snapped', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.applySnap('left')
      const savedState = snap.preSnapState.value

      // Snap to right (already snapped)
      snap.applySnap('right')

      // Pre-snap state should be the original state, not the left-snapped state
      expect(snap.preSnapState.value).toEqual(savedState)
    })
  })

  describe('tryApplySnap', () => {
    it('should apply snap when in snap zone and return true', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.updateSnapZone(5, 400) // left zone
      const result = snap.tryApplySnap()

      expect(result).toBe(true)
      expect(snap.isSnapped.value).toBe(true)
    })

    it('should return false when not in snap zone', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.updateSnapZone(600, 400) // no zone
      const result = snap.tryApplySnap()

      expect(result).toBe(false)
      expect(snap.isSnapped.value).toBe(false)
    })

    it('should clear snap zone after applying', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      snap.updateSnapZone(5, 400)
      snap.tryApplySnap()

      expect(snap.snapZone.value).toBeNull()
    })
  })

  describe('initial state', () => {
    it('should start with no snap', () => {
      const snap = useWindowSnap({ windowEl, position, size })

      expect(snap.snapZone.value).toBeNull()
      expect(snap.isSnapped.value).toBe(false)
      expect(snap.preSnapState.value).toBeNull()
    })
  })
})
