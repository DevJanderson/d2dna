import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

// Mock navigateTo
const mockNavigateTo = vi.fn()
vi.stubGlobal('navigateTo', mockNavigateTo)

// Mock useAuthStore
const mockLogout = vi.fn()
const mockStore = {
  isAuthenticated: true,
  user: {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com',
    foto_perfil: null
  },
  logout: mockLogout
}

vi.mock('~/layers/3-auth/app/composables/useAuthStore', () => ({
  useAuthStore: () => mockStore
}))

// Import component after mocking
const AuthUserMenu = (
  await import('~/layers/3-auth/app/components/AuthUserMenu.vue')
).default

describe('AuthUserMenu', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockStore.isAuthenticated = true
    mockStore.user = {
      id: 1,
      nome: 'Test User',
      email: 'test@example.com',
      foto_perfil: null
    }
  })

  it('should not render when not authenticated', () => {
    mockStore.isAuthenticated = false

    const wrapper = mount(AuthUserMenu)

    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('should render user initials when no photo', () => {
    const wrapper = mount(AuthUserMenu)

    expect(wrapper.text()).toContain('TU') // Test User -> TU
  })

  it('should render user photo when available', () => {
    mockStore.user.foto_perfil = 'https://example.com/photo.jpg'

    const wrapper = mount(AuthUserMenu)

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe(
      'https://example.com/photo.jpg'
    )
  })

  it('should toggle dropdown on click', async () => {
    const wrapper = mount(AuthUserMenu)

    expect(wrapper.find('.absolute').exists()).toBe(false)

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.absolute').exists()).toBe(true)

    await wrapper.find('.fixed').trigger('click') // Click backdrop

    expect(wrapper.find('.absolute').exists()).toBe(false)
  })

  it('should display user info in dropdown', async () => {
    const wrapper = mount(AuthUserMenu)

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('Test User')
    expect(wrapper.text()).toContain('test@example.com')
  })

  it('should call logout on logout button click', async () => {
    mockLogout.mockResolvedValue(undefined)

    const wrapper = mount(AuthUserMenu)

    await wrapper.find('button').trigger('click')

    // Find the button that contains "Sair"
    const buttons = wrapper.findAll('button[type="button"]')
    const logoutButton = buttons.find((b) => b.text().includes('Sair'))
    await logoutButton?.trigger('click')
    await flushPromises()

    expect(mockLogout).toHaveBeenCalled()
  })

  it('should generate correct initials for single name', () => {
    mockStore.user.nome = 'Admin'

    const wrapper = mount(AuthUserMenu)

    expect(wrapper.text()).toContain('A')
  })

  it('should generate correct initials for multiple names', () => {
    mockStore.user.nome = 'João da Silva Santos'

    const wrapper = mount(AuthUserMenu)

    // getInitials takes first letter of first two words: João -> J, da -> D
    expect(wrapper.text()).toContain('JD')
  })
})
