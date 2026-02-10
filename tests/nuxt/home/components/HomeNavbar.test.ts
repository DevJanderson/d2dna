import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock useAuthStore
const mockStore = {
  isAuthenticated: false,
  user: null as { id: number; nome: string; email: string } | null,
  isLoading: false,
  error: null,
  login: vi.fn(),
  logout: vi.fn(),
  checkAuth: vi.fn()
}

vi.mock('~/layers/3-auth/app/composables/useAuthStore', () => ({
  useAuthStore: () => mockStore
}))

const HomeNavbar = (await import('~/layers/2-home/app/components/HomeNavbar.vue')).default

describe('HomeNavbar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.isAuthenticated = false
    mockStore.user = null
  })

  it('should render ASCII logo', () => {
    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.find('pre').exists()).toBe(true)
    // ASCII art logo uses Unicode blocks, not plain text "TUCUXI"
    expect(wrapper.find('pre').text()).toContain('████████')
  })

  it('should render navigation links', () => {
    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('Produto')
    expect(wrapper.text()).toContain('Como funciona')
    expect(wrapper.text()).toContain('Equipe')
  })

  it('should render "Começar agora" button when not authenticated', () => {
    mockStore.isAuthenticated = false

    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('Começar agora')
  })

  it('should render "Workspace" button when authenticated', () => {
    mockStore.isAuthenticated = true

    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    expect(wrapper.text()).toContain('Workspace')
  })

  it('should have 3 nav links with correct hrefs', () => {
    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    const links = wrapper.findAll('a[href^="#"]')
    expect(links).toHaveLength(3)
    expect(links[0]!.attributes('href')).toBe('#features')
    expect(links[1]!.attributes('href')).toBe('#how-it-works')
    expect(links[2]!.attributes('href')).toBe('#team')
  })

  it('should apply opacity-0 when not visible and no reduced motion', () => {
    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: false, isVisible: false }
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('opacity-0')
  })

  it('should apply opacity-100 when visible', () => {
    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: false, isVisible: true }
    })

    const header = wrapper.find('header')
    expect(header.classes()).toContain('opacity-100')
  })

  it('should be sticky at the top', () => {
    const wrapper = mount(HomeNavbar, {
      props: { prefersReducedMotion: true, isVisible: true }
    })

    const stickyContainer = wrapper.find('.sticky')
    expect(stickyContainer.exists()).toBe(true)
  })
})
