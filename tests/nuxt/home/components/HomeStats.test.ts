import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock @vueuse/core useIntersectionObserver to simulate visibility
const mockStop = vi.fn()
let intersectionCallback: Function

vi.mock('@vueuse/core', () => ({
  useIntersectionObserver: vi.fn((_target, callback) => {
    intersectionCallback = callback
    return { stop: mockStop }
  })
}))

const HomeStats = (await import('~/layers/2-home/app/components/HomeStats.vue')).default

describe('HomeStats', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  it('should render stats section with sr-only heading', () => {
    const wrapper = mount(HomeStats)

    const heading = wrapper.find('#stats-heading')
    expect(heading.exists()).toBe(true)
    expect(heading.text()).toBe('Estatísticas')
    expect(heading.classes()).toContain('sr-only')
  })

  it('should render all 4 stat cards', () => {
    const wrapper = mount(HomeStats)

    // 4 stats rendered
    const cards = wrapper.findAll('.rounded-2xl')
    expect(cards).toHaveLength(4)
  })

  it('should display stat labels', () => {
    const wrapper = mount(HomeStats)

    expect(wrapper.text()).toContain('registros cruzados e validados')
    expect(wrapper.text()).toContain('mais rápido que o padrão do mercado')
    expect(wrapper.text()).toContain('de acurácia nos vínculos')
    expect(wrapper.text()).toContain('para cruzar uma base nacional inteira')
  })

  it('should display stat context paragraphs', () => {
    const wrapper = mount(HomeStats)

    expect(wrapper.text()).toContain('CadÚnico, SUS e bases estaduais')
    expect(wrapper.text()).toContain('Benchmarkado contra o Febrl')
    expect(wrapper.text()).toContain('machine learning')
    expect(wrapper.text()).toContain('servidor comum')
  })

  it('should display ASCII decorations', () => {
    const wrapper = mount(HomeStats)

    expect(wrapper.text()).toContain('▁▂▃▅▇')
    expect(wrapper.text()).toContain('›››››')
    expect(wrapper.text()).toContain('████████░░')
  })

  it('should display stat suffixes', () => {
    const wrapper = mount(HomeStats)

    expect(wrapper.text()).toContain('M+')
    expect(wrapper.text()).toContain('x')
    expect(wrapper.text()).toContain('%')
    expect(wrapper.text()).toContain('h')
  })

  it('should start with display values at 0', () => {
    const wrapper = mount(HomeStats)

    // Before intersection, values should be 0
    const text = wrapper.text()
    // The display shows "0M+" for the first stat before animation
    expect(text).toContain('0')
  })

  it('should have proper aria-labelledby attribute', () => {
    const wrapper = mount(HomeStats)

    const section = wrapper.find('section')
    expect(section.attributes('aria-labelledby')).toBe('stats-heading')
  })

  it('should show final values after intersection and animation completes', async () => {
    const wrapper = mount(HomeStats)

    // Trigger intersection
    intersectionCallback([{ isIntersecting: true }])
    await wrapper.vm.$nextTick()

    // Advance timers past the animation duration (1500ms + buffer)
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('300')
    expect(wrapper.text()).toContain('5.69')
    expect(wrapper.text()).toContain('98')
    expect(wrapper.text()).toContain('23')
  })

  it('should call stop after intersection triggers', async () => {
    mount(HomeStats)

    intersectionCallback([{ isIntersecting: true }])

    expect(mockStop).toHaveBeenCalled()
  })
})
