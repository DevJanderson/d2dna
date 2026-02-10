import { describe, it, expect, beforeEach } from 'vitest'

describe('useWindowManager', () => {
  beforeEach(() => {
    // Limpar estado entre testes - useWindowManager usa useState internamente
    const wm = useWindowManager()
    wm.closeAll()
  })

  describe('initial state', () => {
    it('should start with no windows', () => {
      const wm = useWindowManager()
      expect(wm.windows.value).toEqual([])
    })

    it('should have no active window initially', () => {
      const wm = useWindowManager()
      expect(wm.activeWindowId.value).toBeNull()
      expect(wm.activeWindow.value).toBeNull()
    })

    it('should have empty visible and minimized lists', () => {
      const wm = useWindowManager()
      expect(wm.visibleWindows.value).toEqual([])
      expect(wm.minimizedWindows.value).toEqual([])
    })
  })

  describe('open', () => {
    it('should open a window with provided config', () => {
      const wm = useWindowManager()
      const id = wm.open({ title: 'Test Window' })

      expect(wm.windows.value).toHaveLength(1)
      expect(wm.windows.value[0]!.title).toBe('Test Window')
      expect(id).toBeTruthy()
    })

    it('should use provided id when given', () => {
      const wm = useWindowManager()
      const id = wm.open({ id: 'my-window', title: 'Test' })

      expect(id).toBe('my-window')
      expect(wm.windows.value[0]!.id).toBe('my-window')
    })

    it('should set opened window as active', () => {
      const wm = useWindowManager()
      const id = wm.open({ title: 'Test' })

      expect(wm.activeWindowId.value).toBe(id)
      expect(wm.activeWindow.value?.title).toBe('Test')
    })

    it('should apply default position and size', () => {
      const wm = useWindowManager()
      wm.open({ title: 'Test' })

      const win = wm.windows.value[0]!
      expect(win.position).toEqual({ x: 100, y: 50 })
      expect(win.size).toEqual({ width: 600, height: 400 })
    })

    it('should apply custom position and size', () => {
      const wm = useWindowManager()
      wm.open({
        title: 'Test',
        position: { x: 200, y: 100 },
        size: { width: 800, height: 600 }
      })

      const win = wm.windows.value[0]!
      expect(win.position).toEqual({ x: 200, y: 100 })
      expect(win.size).toEqual({ width: 800, height: 600 })
    })

    it('should cascade position for multiple windows', () => {
      const wm = useWindowManager()
      wm.open({ title: 'Win 1' })
      wm.open({ title: 'Win 2' })

      const win1 = wm.windows.value[0]!
      const win2 = wm.windows.value[1]!
      expect(win2.position.x).toBeGreaterThan(win1.position.x)
      expect(win2.position.y).toBeGreaterThan(win1.position.y)
    })

    it('should focus existing window if id already exists', () => {
      const wm = useWindowManager()
      wm.open({ id: 'unique', title: 'First' })
      wm.open({ id: 'other', title: 'Other' })

      // Tentar abrir com mesmo id
      const id = wm.open({ id: 'unique', title: 'Duplicate' })

      expect(id).toBe('unique')
      expect(wm.windows.value).toHaveLength(2)
      expect(wm.activeWindowId.value).toBe('unique')
    })

    it('should start not minimized or maximized', () => {
      const wm = useWindowManager()
      wm.open({ title: 'Test' })

      const win = wm.windows.value[0]!
      expect(win.minimized).toBe(false)
      expect(win.maximized).toBe(false)
    })
  })

  describe('close', () => {
    it('should remove a window by id', () => {
      const wm = useWindowManager()
      const id = wm.open({ title: 'To Close' })

      wm.close(id)

      expect(wm.windows.value).toHaveLength(0)
    })

    it('should activate next top window after closing active', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })
      wm.open({ id: 'win-2', title: 'Win 2' })

      // win-2 is active (last opened)
      expect(wm.activeWindowId.value).toBe('win-2')

      wm.close('win-2')

      expect(wm.activeWindowId.value).toBe('win-1')
    })

    it('should set active to null when closing last window', () => {
      const wm = useWindowManager()
      const id = wm.open({ title: 'Only One' })

      wm.close(id)

      expect(wm.activeWindowId.value).toBeNull()
    })

    it('should not crash when closing non-existent window', () => {
      const wm = useWindowManager()
      wm.close('non-existent')
      expect(wm.windows.value).toHaveLength(0)
    })
  })

  describe('focus', () => {
    it('should set window as active', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })
      wm.open({ id: 'win-2', title: 'Win 2' })

      wm.focus('win-1')

      expect(wm.activeWindowId.value).toBe('win-1')
    })

    it('should increase z-index of focused window', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })
      wm.open({ id: 'win-2', title: 'Win 2' })

      const zBefore = wm.windows.value.find(w => w.id === 'win-1')!.zIndex

      wm.focus('win-1')

      const zAfter = wm.windows.value.find(w => w.id === 'win-1')!.zIndex
      expect(zAfter).toBeGreaterThan(zBefore)
    })

    it('should un-minimize window when focused', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })
      wm.minimize('win-1')

      expect(wm.windows.value[0]!.minimized).toBe(true)

      wm.focus('win-1')

      expect(wm.windows.value[0]!.minimized).toBe(false)
    })
  })

  describe('minimize', () => {
    it('should set minimized to true', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.minimize('win-1')

      expect(wm.windows.value[0]!.minimized).toBe(true)
    })

    it('should activate next window after minimizing active', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })
      wm.open({ id: 'win-2', title: 'Win 2' })

      wm.minimize('win-2')

      expect(wm.activeWindowId.value).toBe('win-1')
    })

    it('should set active to null when all windows minimized', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.minimize('win-1')

      expect(wm.activeWindowId.value).toBeNull()
    })

    it('should move window to minimizedWindows list', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.minimize('win-1')

      expect(wm.minimizedWindows.value).toHaveLength(1)
      expect(wm.visibleWindows.value).toHaveLength(0)
    })
  })

  describe('maximize', () => {
    it('should set maximized to true', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.maximize('win-1')

      expect(wm.windows.value[0]!.maximized).toBe(true)
    })

    it('should save pre-maximize state', () => {
      const wm = useWindowManager()
      wm.open({
        id: 'win-1',
        title: 'Win 1',
        position: { x: 100, y: 50 },
        size: { width: 600, height: 400 }
      })

      wm.maximize('win-1')

      const win = wm.windows.value[0]!
      expect(win.preMaximizeState).toBeDefined()
      expect(win.preMaximizeState!.position).toEqual({ x: 100, y: 50 })
      expect(win.preMaximizeState!.size).toEqual({ width: 600, height: 400 })
    })

    it('should set position to 0,0 when maximized', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.maximize('win-1')

      expect(wm.windows.value[0]!.position).toEqual({ x: 0, y: 0 })
    })
  })

  describe('restore', () => {
    it('should restore position and size from pre-maximize state', () => {
      const wm = useWindowManager()
      wm.open({
        id: 'win-1',
        title: 'Win 1',
        position: { x: 100, y: 50 },
        size: { width: 600, height: 400 }
      })

      wm.maximize('win-1')
      wm.restore('win-1')

      const win = wm.windows.value[0]!
      expect(win.maximized).toBe(false)
      expect(win.position).toEqual({ x: 100, y: 50 })
      expect(win.size).toEqual({ width: 600, height: 400 })
      expect(win.preMaximizeState).toBeUndefined()
    })

    it('should do nothing if window is not maximized', () => {
      const wm = useWindowManager()
      wm.open({
        id: 'win-1',
        title: 'Win 1',
        position: { x: 100, y: 50 }
      })

      wm.restore('win-1')

      expect(wm.windows.value[0]!.position).toEqual({ x: 100, y: 50 })
    })
  })

  describe('toggleMaximize', () => {
    it('should maximize if not maximized', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.toggleMaximize('win-1')

      expect(wm.windows.value[0]!.maximized).toBe(true)
    })

    it('should restore if maximized', () => {
      const wm = useWindowManager()
      wm.open({
        id: 'win-1',
        title: 'Win 1',
        position: { x: 100, y: 50 }
      })

      wm.toggleMaximize('win-1') // maximize
      wm.toggleMaximize('win-1') // restore

      expect(wm.windows.value[0]!.maximized).toBe(false)
      expect(wm.windows.value[0]!.position).toEqual({ x: 100, y: 50 })
    })
  })

  describe('updatePosition', () => {
    it('should update window position', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.updatePosition('win-1', { x: 300, y: 200 })

      expect(wm.windows.value[0]!.position).toEqual({ x: 300, y: 200 })
    })

    it('should not update position when maximized', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.maximize('win-1')
      wm.updatePosition('win-1', { x: 300, y: 200 })

      expect(wm.windows.value[0]!.position).toEqual({ x: 0, y: 0 })
    })
  })

  describe('updateSize', () => {
    it('should update window size', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Win 1' })

      wm.updateSize('win-1', { width: 800, height: 600 })

      expect(wm.windows.value[0]!.size).toEqual({ width: 800, height: 600 })
    })

    it('should not update size when maximized', () => {
      const wm = useWindowManager()
      wm.open({
        id: 'win-1',
        title: 'Win 1',
        size: { width: 600, height: 400 }
      })

      wm.maximize('win-1')
      wm.updateSize('win-1', { width: 800, height: 600 })

      // Size does not change when maximized
      const win = wm.windows.value[0]!
      expect(win.preMaximizeState!.size).toEqual({ width: 600, height: 400 })
    })
  })

  describe('updateWindow', () => {
    it('should update title', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Old Title' })

      wm.updateWindow('win-1', { title: 'New Title' })

      expect(wm.windows.value[0]!.title).toBe('New Title')
    })

    it('should merge props', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Test', props: { foo: 'bar' } })

      wm.updateWindow('win-1', { props: { baz: 'qux' } })

      expect(wm.windows.value[0]!.props).toEqual({ foo: 'bar', baz: 'qux' })
    })
  })

  describe('closeAll', () => {
    it('should remove all windows', () => {
      const wm = useWindowManager()
      wm.open({ title: 'Win 1' })
      wm.open({ title: 'Win 2' })
      wm.open({ title: 'Win 3' })

      wm.closeAll()

      expect(wm.windows.value).toHaveLength(0)
      expect(wm.activeWindowId.value).toBeNull()
    })
  })

  describe('minimizeAll', () => {
    it('should minimize all windows', () => {
      const wm = useWindowManager()
      wm.open({ title: 'Win 1' })
      wm.open({ title: 'Win 2' })

      wm.minimizeAll()

      expect(wm.windows.value.every(w => w.minimized)).toBe(true)
      expect(wm.activeWindowId.value).toBeNull()
      expect(wm.visibleWindows.value).toHaveLength(0)
      expect(wm.minimizedWindows.value).toHaveLength(2)
    })
  })

  describe('computed properties', () => {
    it('visibleWindows should exclude minimized', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Visible' })
      wm.open({ id: 'win-2', title: 'Minimized' })
      wm.minimize('win-2')

      expect(wm.visibleWindows.value).toHaveLength(1)
      expect(wm.visibleWindows.value[0]!.id).toBe('win-1')
    })

    it('minimizedWindows should only include minimized', () => {
      const wm = useWindowManager()
      wm.open({ id: 'win-1', title: 'Visible' })
      wm.open({ id: 'win-2', title: 'Minimized' })
      wm.minimize('win-2')

      expect(wm.minimizedWindows.value).toHaveLength(1)
      expect(wm.minimizedWindows.value[0]!.id).toBe('win-2')
    })
  })
})
