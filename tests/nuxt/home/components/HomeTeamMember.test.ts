import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

const HomeTeamMember = (await import('~/layers/2-home/app/components/HomeTeamMember.vue')).default

describe('HomeTeamMember', () => {
  const defaultProps = {
    name: 'Dr. Deney Araújo',
    role: 'CEO & Dev',
    image: 'https://example.com/photo.png',
    color: 'green' as const
  }

  it('should render member name', () => {
    const wrapper = mount(HomeTeamMember, { props: defaultProps })

    expect(wrapper.text()).toContain('Dr. Deney Araújo')
  })

  it('should render member role', () => {
    const wrapper = mount(HomeTeamMember, { props: defaultProps })

    expect(wrapper.text()).toContain('CEO & Dev')
  })

  it('should render avatar image with correct src and alt', () => {
    const wrapper = mount(HomeTeamMember, { props: defaultProps })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/photo.png')
    expect(img.attributes('alt')).toBe('Foto de Dr. Deney Araújo, CEO & Dev')
  })

  it('should apply correct ring color class for green', () => {
    const wrapper = mount(HomeTeamMember, { props: defaultProps })

    const avatar = wrapper.find('.ring-2')
    expect(avatar.classes()).toContain('ring-green-300')
  })

  it('should apply correct ring color class for blue', () => {
    const wrapper = mount(HomeTeamMember, {
      props: { ...defaultProps, color: 'blue' as const }
    })

    const avatar = wrapper.find('.ring-2')
    expect(avatar.classes()).toContain('ring-blue-300')
  })

  it('should apply correct ring color class for amber', () => {
    const wrapper = mount(HomeTeamMember, {
      props: { ...defaultProps, color: 'amber' as const }
    })

    const avatar = wrapper.find('.ring-2')
    expect(avatar.classes()).toContain('ring-amber-300')
  })

  it('should apply correct ring color class for fuchsia', () => {
    const wrapper = mount(HomeTeamMember, {
      props: { ...defaultProps, color: 'fuchsia' as const }
    })

    const avatar = wrapper.find('.ring-2')
    expect(avatar.classes()).toContain('ring-fuchsia-300')
  })

  it('should apply correct ring color class for indigo', () => {
    const wrapper = mount(HomeTeamMember, {
      props: { ...defaultProps, color: 'indigo' as const }
    })

    const avatar = wrapper.find('.ring-2')
    expect(avatar.classes()).toContain('ring-indigo-300')
  })

  it('should apply correct ring color class for orange', () => {
    const wrapper = mount(HomeTeamMember, {
      props: { ...defaultProps, color: 'orange' as const }
    })

    const avatar = wrapper.find('.ring-2')
    expect(avatar.classes()).toContain('ring-orange-300')
  })
})
