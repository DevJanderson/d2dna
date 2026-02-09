import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

// Mock getInitials (auto-imported from layers/0-base/app/utils/formatters.ts)
vi.stubGlobal('getInitials', (name: string) =>
  name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
)

// Mock useAuthStore
const mockLogout = vi.fn()
const mockStore = {
  isAuthenticated: true,
  user: {
    id: 1,
    nome: 'Test User',
    email: 'test@example.com',
    foto_perfil: null as string | null
  },
  logout: mockLogout
}

vi.mock('~/layers/3-auth/app/composables/useAuthStore', () => ({
  useAuthStore: () => mockStore
}))

// Import component after mocking
const AuthUserMenu = (await import('~/layers/3-auth/app/components/AuthUserMenu.vue')).default

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
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/photo.jpg')
  })

  it('should render trigger button when authenticated', () => {
    const wrapper = mount(AuthUserMenu)

    expect(wrapper.find('button').exists()).toBe(true)
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
