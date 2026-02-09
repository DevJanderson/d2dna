import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const HomeFooter = (await import('~/layers/2-home/app/components/HomeFooter.vue')).default

describe('HomeFooter', () => {
  it('should render footer element', () => {
    const wrapper = mount(HomeFooter)

    expect(wrapper.find('footer').exists()).toBe(true)
  })

  it('should display current year copyright', () => {
    const wrapper = mount(HomeFooter)

    const currentYear = new Date().getFullYear().toString()
    expect(wrapper.text()).toContain(currentYear)
    expect(wrapper.text()).toContain('D2DNA')
  })

  it('should display version number', () => {
    const wrapper = mount(HomeFooter)

    expect(wrapper.text()).toContain('v1.0')
  })

  it('should have border-t class for top border', () => {
    const wrapper = mount(HomeFooter)

    expect(wrapper.find('footer').classes()).toContain('border-t')
  })
})
