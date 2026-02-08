import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock @vueuse/core useIntersectionObserver
vi.mock('@vueuse/core', () => ({
  useIntersectionObserver: vi.fn((_target, callback) => {
    callback([{ isIntersecting: true }])
    return { stop: vi.fn() }
  })
}))

const HomePartners = (
  await import('~/layers/2-home/app/components/HomePartners.vue')
).default

describe('HomePartners', () => {
  it('should render section heading', () => {
    const wrapper = mount(HomePartners)

    expect(wrapper.text()).toContain('Quem Confia na D2DNA')
  })

  it('should render section subtitle', () => {
    const wrapper = mount(HomePartners)

    expect(wrapper.text()).toContain('hospitais de referência a universidades de ponta')
  })

  it('should render all 9 partner names', () => {
    const wrapper = mount(HomePartners)

    expect(wrapper.text()).toContain('Hospital Albert Einstein')
    expect(wrapper.text()).toContain('Vital Strategies')
    expect(wrapper.text()).toContain('FMT-HVD')
    expect(wrapper.text()).toContain('USP')
    expect(wrapper.text()).toContain('Pasteur Korea')
    expect(wrapper.text()).toContain('GetConnect')
    expect(wrapper.text()).toContain('Bioinfor USP')
    expect(wrapper.text()).toContain('Hospital Los Angeles')
    expect(wrapper.text()).toContain('Anila Plant')
  })

  it('should render 9 partner logo images (NuxtImg stubs)', () => {
    const wrapper = mount(HomePartners)

    const images = wrapper.findAll('img')
    expect(images).toHaveLength(9)
  })

  it('should have proper aria-labelledby attribute', () => {
    const wrapper = mount(HomePartners)

    const section = wrapper.find('section')
    expect(section.attributes('aria-labelledby')).toBe('partners-heading')
    expect(wrapper.find('#partners-heading').exists()).toBe(true)
  })

  it('should apply visible classes when intersection triggers', () => {
    const wrapper = mount(HomePartners)

    const section = wrapper.find('section')
    expect(section.classes()).toContain('opacity-100')
    expect(section.classes()).toContain('translate-y-0')
  })
})
