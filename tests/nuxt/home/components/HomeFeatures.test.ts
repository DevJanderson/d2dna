import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const HomeFeatures = (await import('~/layers/2-home/app/components/HomeFeatures.vue')).default

describe('HomeFeatures', () => {
  it('should render all three feature cards', () => {
    const wrapper = mount(HomeFeatures, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    const cards = wrapper.findAll('h3')
    expect(cards).toHaveLength(3)
  })

  it('should render feature titles', () => {
    const wrapper = mount(HomeFeatures, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('Busca em segundos')
    expect(wrapper.text()).toContain('Algoritmo DNA-encoded')
    expect(wrapper.text()).toContain('Múltiplos setores')
  })

  it('should render feature descriptions', () => {
    const wrapper = mount(HomeFeatures, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('mutações')
    expect(wrapper.text()).toContain('nucleotídeos')
    expect(wrapper.text()).toContain('Saúde, educação')
  })

  it('should apply opacity-0 when not visible and no reduced motion', () => {
    const wrapper = mount(HomeFeatures, {
      props: { prefersReducedMotion: false, isVisible: false }
    })

    const container = wrapper.find('.hero-entrance-delay-4')
    expect(container.classes()).toContain('opacity-0')
  })

  it('should apply opacity-100 when visible', () => {
    const wrapper = mount(HomeFeatures, {
      props: { prefersReducedMotion: false, isVisible: true }
    })

    const container = wrapper.find('.hero-entrance-delay-4')
    expect(container.classes()).toContain('opacity-100')
    expect(container.classes()).toContain('translate-y-0')
  })

  it('should apply opacity-100 when prefersReducedMotion even if not visible', () => {
    const wrapper = mount(HomeFeatures, {
      props: { prefersReducedMotion: true, isVisible: false }
    })

    const container = wrapper.find('.hero-entrance-delay-4')
    expect(container.classes()).toContain('opacity-100')
  })
})
