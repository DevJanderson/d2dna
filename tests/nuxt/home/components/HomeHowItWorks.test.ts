import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock @vueuse/core useIntersectionObserver
vi.mock('@vueuse/core', () => ({
  useIntersectionObserver: vi.fn((_target, callback) => {
    // Simulate immediate intersection
    callback([{ isIntersecting: true }])
    return { stop: vi.fn() }
  })
}))

const HomeHowItWorks = (
  await import('~/layers/2-home/app/components/HomeHowItWorks.vue')
).default

describe('HomeHowItWorks', () => {
  it('should render section heading', () => {
    const wrapper = mount(HomeHowItWorks)

    expect(wrapper.text()).toContain('Como Funciona')
  })

  it('should render section subtitle', () => {
    const wrapper = mount(HomeHowItWorks)

    expect(wrapper.text()).toContain('Bioinformática aplicada a record linkage')
  })

  it('should render all 4 steps', () => {
    const wrapper = mount(HomeHowItWorks)

    const steps = wrapper.findAll('.how-card')
    expect(steps).toHaveLength(4)
  })

  it('should render step numbers', () => {
    const wrapper = mount(HomeHowItWorks)

    expect(wrapper.text()).toContain('01')
    expect(wrapper.text()).toContain('02')
    expect(wrapper.text()).toContain('03')
    expect(wrapper.text()).toContain('04')
  })

  it('should render step titles', () => {
    const wrapper = mount(HomeHowItWorks)

    expect(wrapper.text()).toContain('Ingestão')
    expect(wrapper.text()).toContain('Codificação DNA')
    expect(wrapper.text()).toContain('Alinhamento + ML')
    expect(wrapper.text()).toContain('Registro Único')
  })

  it('should render step descriptions', () => {
    const wrapper = mount(HomeHowItWorks)

    expect(wrapper.text()).toContain('Conecte suas bases de dados')
    expect(wrapper.text()).toContain('convertido em uma sequência de nucleotídeos')
    expect(wrapper.text()).toContain('BLASTn alinha as sequências')
    expect(wrapper.text()).toContain('cadastro consolidado e rastreável')
  })

  it('should render step details', () => {
    const wrapper = mount(HomeHowItWorks)

    expect(wrapper.text()).toContain('0.4 GB')
    expect(wrapper.text()).toContain('criptografando os dados')
    expect(wrapper.text()).toContain('5.69x mais rápido')
    expect(wrapper.text()).toContain('Score > 95%')
  })

  it('should have proper aria-labelledby on section', () => {
    const wrapper = mount(HomeHowItWorks)

    const section = wrapper.find('section')
    expect(section.attributes('aria-labelledby')).toBe('how-it-works-heading')
    expect(wrapper.find('#how-it-works-heading').exists()).toBe(true)
  })

  it('should render connectors between steps (not before first)', () => {
    const wrapper = mount(HomeHowItWorks)

    const connectors = wrapper.findAll('.how-connector')
    // 3 connectors (between steps 1-2, 2-3, 3-4, not before step 1)
    expect(connectors).toHaveLength(3)
  })

  it('should add visible class when intersection observer triggers', () => {
    const wrapper = mount(HomeHowItWorks)

    const steps = wrapper.findAll('.how-step')
    steps.forEach((step) => {
      expect(step.classes()).toContain('how-step--visible')
    })
  })
})
