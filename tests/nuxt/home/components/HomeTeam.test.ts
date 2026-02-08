import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock @vueuse/core useIntersectionObserver
vi.mock('@vueuse/core', () => ({
  useIntersectionObserver: vi.fn((_target, callback) => {
    callback([{ isIntersecting: true }])
    return { stop: vi.fn() }
  })
}))

const HomeTeam = (await import('~/layers/2-home/app/components/HomeTeam.vue')).default

describe('HomeTeam', () => {
  it('should render section heading', () => {
    const wrapper = mount(HomeTeam)

    expect(wrapper.text()).toContain('Quem Está por Trás')
  })

  it('should render section subtitle', () => {
    const wrapper = mount(HomeTeam)

    expect(wrapper.text()).toContain('Quem fez ciência, constrói a tecnologia.')
  })

  it('should render all 6 team members', () => {
    const wrapper = mount(HomeTeam)

    expect(wrapper.text()).toContain('Dr. Deney Araújo')
    expect(wrapper.text()).toContain('Dr. Helder Nakaya')
    expect(wrapper.text()).toContain('Dr. Jorge Kalil')
    expect(wrapper.text()).toContain('Dra. Joana Azevedo')
    expect(wrapper.text()).toContain('Willian Caldas')
    expect(wrapper.text()).toContain('Janderson Lira')
  })

  it('should render team member roles', () => {
    const wrapper = mount(HomeTeam)

    expect(wrapper.text()).toContain('CEO & Dev')
    expect(wrapper.text()).toContain('CSO')
    expect(wrapper.text()).toContain('Consultor Sênior')
    expect(wrapper.text()).toContain('Bioinformata')
    expect(wrapper.text()).toContain('Backend & Data Engineer')
    expect(wrapper.text()).toContain('Frontend & DevOps')
  })

  it('should apply visible classes when intersection triggers', () => {
    const wrapper = mount(HomeTeam)

    const container = wrapper.find('div')
    expect(container.classes()).toContain('opacity-100')
  })
})
