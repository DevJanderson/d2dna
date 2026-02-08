import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Import component
const HomeHero = (await import('~/layers/2-home/app/components/HomeHero.vue')).default

describe('HomeHero', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  it('should render headline text', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('Registros duplicados custam milhões.')
    expect(wrapper.text()).toContain('Bioinformática resolve.')
  })

  it('should render subtitle text', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('O Tucuxi deduplica bases nacionais em horas')
  })

  it('should render "Como Funciona" anchor link', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    const link = wrapper.find('a[href="#how-it-works-heading"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('Como Funciona')
  })

  it('should show all terminal lines immediately when prefersReducedMotion is true', async () => {
    vi.useRealTimers()
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: true, isVisible: true }
    })
    await wrapper.vm.$nextTick()

    // First scenario lines should be displayed immediately (no typewriter)
    expect(wrapper.text()).toContain('$ tucuxi link --id 123.456.789-00')
    expect(wrapper.text()).toContain('Registro unificado')
  })

  it('should start typewriter animation when prefersReducedMotion is false', async () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: false, isVisible: true }
    })
    await wrapper.vm.$nextTick()

    // First line appears after first setTimeout (0 * 400 = 0ms)
    vi.advanceTimersByTime(1)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('$ tucuxi link --id 123.456.789-00')

    // More lines appear as time passes
    vi.advanceTimersByTime(2400)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Registro unificado')
  })

  it('should show blinking cursor', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.find('.terminal-cursor').exists()).toBe(true)
  })

  it('should render terminal header with version', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('tucuxi v2.0')
  })

  it('should apply opacity classes based on isVisible and prefersReducedMotion', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: false, isVisible: false }
    })

    // When not visible, should have opacity-0 class
    const heroEntrance = wrapper.find('.hero-entrance-delay-1')
    expect(heroEntrance.classes()).toContain('opacity-0')
  })

  it('should apply visible classes when isVisible is true', () => {
    const wrapper = mount(HomeHero, {
      props: { prefersReducedMotion: false, isVisible: true }
    })

    const heroEntrance = wrapper.find('.hero-entrance-delay-1')
    expect(heroEntrance.classes()).toContain('opacity-100')
    expect(heroEntrance.classes()).toContain('translate-y-0')
  })
})
