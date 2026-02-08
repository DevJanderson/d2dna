import { describe, it, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock useAuthStore
const { mockUseAuthStore } = vi.hoisted(() => ({
  mockUseAuthStore: vi.fn()
}))

mockNuxtImport('useAuthStore', () => mockUseAuthStore)

const WindowWelcome = await import(
  '~/layers/0-base/app/components/WindowWelcome.vue'
).then(m => m.default)

describe('WindowWelcome', () => {
  it('should display user first name when authenticated', async () => {
    mockUseAuthStore.mockReturnValue({
      user: { nome: 'João da Silva', email: 'joao@test.com' }
    })

    const wrapper = await mountSuspended(WindowWelcome)

    expect(wrapper.text()).toContain('Olá, João!')
  })

  it('should display "Usuário" when no user', async () => {
    mockUseAuthStore.mockReturnValue({
      user: null
    })

    const wrapper = await mountSuspended(WindowWelcome)

    expect(wrapper.text()).toContain('Olá, Usuário!')
  })

  it('should display system description', async () => {
    mockUseAuthStore.mockReturnValue({
      user: null
    })

    const wrapper = await mountSuspended(WindowWelcome)

    expect(wrapper.text()).toContain('Record Linkage e Gestão de Dados')
    expect(wrapper.text()).toContain('Tecnologia DNA')
  })

  it('should display ASCII art of tucuxi', async () => {
    mockUseAuthStore.mockReturnValue({
      user: null
    })

    const wrapper = await mountSuspended(WindowWelcome)

    const pre = wrapper.find('pre')
    expect(pre.exists()).toBe(true)
    expect(pre.text()).toContain('---u')
  })

  it('should display three features', async () => {
    mockUseAuthStore.mockReturnValue({
      user: null
    })

    const wrapper = await mountSuspended(WindowWelcome)

    expect(wrapper.text()).toContain('Identificar')
    expect(wrapper.text()).toContain('Unificar')
    expect(wrapper.text()).toContain('Qualificar')
  })

  it('should display D2DNA copyright', async () => {
    mockUseAuthStore.mockReturnValue({
      user: null
    })

    const wrapper = await mountSuspended(WindowWelcome)

    const currentYear = new Date().getFullYear().toString()
    expect(wrapper.text()).toContain('D2DNA')
    expect(wrapper.text()).toContain(currentYear)
  })

  it('should handle single-word name', async () => {
    mockUseAuthStore.mockReturnValue({
      user: { nome: 'Admin' }
    })

    const wrapper = await mountSuspended(WindowWelcome)

    expect(wrapper.text()).toContain('Olá, Admin!')
  })
})
