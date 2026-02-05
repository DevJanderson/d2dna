import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'

// Mock useAuthStore
const mockLogin = vi.fn()
const mockStore = {
  isLoading: false,
  error: null as string | null,
  login: mockLogin
}

vi.mock('~/layers/3-auth/app/composables/useAuthStore', () => ({
  useAuthStore: () => mockStore
}))

// Import component after mocking
const AuthLoginForm = (
  await import('~/layers/3-auth/app/components/AuthLoginForm.vue')
).default

describe('AuthLoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockStore.isLoading = false
    mockStore.error = null
  })

  it('should render email and password inputs', () => {
    const wrapper = mount(AuthLoginForm)

    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('should render submit button', () => {
    const wrapper = mount(AuthLoginForm)

    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('AUTENTICAR')
  })

  it('should call login on form submit', async () => {
    mockLogin.mockResolvedValue(true)

    const wrapper = mount(AuthLoginForm)

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
  })

  it('should emit success event on successful login', async () => {
    mockLogin.mockResolvedValue(true)

    const wrapper = mount(AuthLoginForm)

    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted('success')).toBeTruthy()
  })

  it('should not emit success on failed login', async () => {
    mockLogin.mockResolvedValue(false)

    const wrapper = mount(AuthLoginForm)

    await wrapper.find('input[type="email"]').setValue('bad@example.com')
    await wrapper.find('input[type="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(wrapper.emitted('success')).toBeFalsy()
  })

  it('should display error message when present', async () => {
    mockStore.error = 'Credenciais inválidas'

    const wrapper = mount(AuthLoginForm)

    expect(wrapper.text()).toContain('Credenciais inválidas')
  })

  it('should show loading state on button', async () => {
    mockStore.isLoading = true

    const wrapper = mount(AuthLoginForm)

    expect(wrapper.find('button[type="submit"]').text()).toContain('AUTENTICANDO')
    expect(
      wrapper.find('button[type="submit"]').attributes('disabled')
    ).toBeDefined()
  })

  it('should disable inputs while loading', async () => {
    mockStore.isLoading = true

    const wrapper = mount(AuthLoginForm)

    expect(
      wrapper.find('input[type="email"]').attributes('disabled')
    ).toBeDefined()
    expect(
      wrapper.find('input[type="password"]').attributes('disabled')
    ).toBeDefined()
  })

  it('should toggle password visibility', async () => {
    const wrapper = mount(AuthLoginForm)

    const passwordInput = wrapper.find('input#password')
    const toggleButton = wrapper.find('button[type="button"]')

    expect(passwordInput.attributes('type')).toBe('password')

    await toggleButton.trigger('click')

    expect(wrapper.find('input#password').attributes('type')).toBe('text')

    await toggleButton.trigger('click')

    expect(wrapper.find('input#password').attributes('type')).toBe('password')
  })
})
