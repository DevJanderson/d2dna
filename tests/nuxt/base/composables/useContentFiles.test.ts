import { describe, it, expect, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Todos os mocks devem ser hoisted para funcionar com mockNuxtImport
const { mockUseAsyncData, mockQueryCollection } = vi.hoisted(() => {
  const mockQueryAll = vi.fn()
  const mockQueryCollection = vi.fn(() => ({
    all: mockQueryAll
  }))
  const mockUseAsyncData = vi.fn()
  return { mockUseAsyncData, mockQueryCollection, mockQueryAll }
})

mockNuxtImport('useAsyncData', () => mockUseAsyncData)
mockNuxtImport('queryCollection', () => mockQueryCollection)

const { useContentFiles } = await import('~/layers/0-base/app/composables/useContentFiles')

describe('useContentFiles', () => {
  describe('contentTree', () => {
    it('should return empty tree when no content', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref(null),
        status: ref('idle'),
        error: ref(null)
      })

      const { contentTree } = useContentFiles()
      expect(contentTree.value).toEqual({ files: [], folders: [] })
    })

    it('should place root-level files in tree.files', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref([
          { id: '1', title: 'About', path: '/about', stem: 'about' },
          { id: '2', title: 'Home', path: '/home', stem: 'home' }
        ]),
        status: ref('success'),
        error: ref(null)
      })

      const { contentTree } = useContentFiles()

      expect(contentTree.value.files).toHaveLength(2)
      expect(contentTree.value.folders).toHaveLength(0)
    })

    it('should organize files into folders', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref([
          {
            id: '1',
            title: 'Getting Started',
            path: '/docs/getting-started',
            stem: 'getting-started'
          },
          { id: '2', title: 'API Reference', path: '/docs/api-reference', stem: 'api-reference' },
          { id: '3', title: 'About', path: '/about', stem: 'about' }
        ]),
        status: ref('success'),
        error: ref(null)
      })

      const { contentTree } = useContentFiles()

      expect(contentTree.value.files).toHaveLength(1)
      expect(contentTree.value.files[0]!.title).toBe('About')

      expect(contentTree.value.folders).toHaveLength(1)
      expect(contentTree.value.folders[0]!.name).toBe('docs')
      expect(contentTree.value.folders[0]!.files).toHaveLength(2)
    })

    it('should sort files and folders alphabetically', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref([
          { id: '1', title: 'Zebra', path: '/zebra', stem: 'zebra' },
          { id: '2', title: 'Alpha', path: '/alpha', stem: 'alpha' },
          { id: '3', title: 'B Doc', path: '/docs-b/b-doc', stem: 'b-doc' },
          { id: '4', title: 'A Doc', path: '/docs-a/a-doc', stem: 'a-doc' }
        ]),
        status: ref('success'),
        error: ref(null)
      })

      const { contentTree } = useContentFiles()

      expect(contentTree.value.files[0]!.title).toBe('Alpha')
      expect(contentTree.value.files[1]!.title).toBe('Zebra')
      expect(contentTree.value.folders[0]!.name).toBe('docs-a')
      expect(contentTree.value.folders[1]!.name).toBe('docs-b')
    })

    it('should use fallback title when title is missing', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref([
          { id: '1', title: '', path: '/test', stem: 'test' },
          { id: '2', path: '/no-title', stem: '' }
        ]),
        status: ref('success'),
        error: ref(null)
      })

      const { contentTree } = useContentFiles()

      // Após ordenação alfabética: 'Sem título' < 'test'
      expect(contentTree.value.files[0]!.title).toBe('Sem título')
      expect(contentTree.value.files[1]!.title).toBe('test')
    })
  })

  describe('flatFiles', () => {
    it('should return empty array when no content', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref(null),
        status: ref('idle'),
        error: ref(null)
      })

      const { flatFiles } = useContentFiles()
      expect(flatFiles.value).toEqual([])
    })

    it('should return flat list of all files', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref([
          { id: '1', title: 'File 1', path: '/file-1', stem: 'file-1' },
          { id: '2', title: 'File 2', path: '/docs/file-2', stem: 'file-2' }
        ]),
        status: ref('success'),
        error: ref(null)
      })

      const { flatFiles } = useContentFiles()

      expect(flatFiles.value).toHaveLength(2)
      expect(flatFiles.value[0]!.id).toBe('1')
      expect(flatFiles.value[1]!.id).toBe('2')
    })

    it('should use path as id fallback', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref([{ title: 'No ID', path: '/no-id', stem: 'no-id' }]),
        status: ref('success'),
        error: ref(null)
      })

      const { flatFiles } = useContentFiles()
      expect(flatFiles.value[0]!.id).toBe('/no-id')
    })
  })

  describe('status and error', () => {
    it('should expose status from useAsyncData', () => {
      mockUseAsyncData.mockReturnValue({
        data: ref(null),
        status: ref('pending'),
        error: ref(null)
      })

      const { status } = useContentFiles()
      expect(status.value).toBe('pending')
    })

    it('should expose error from useAsyncData', () => {
      const mockError = new Error('Failed to load')
      mockUseAsyncData.mockReturnValue({
        data: ref(null),
        status: ref('error'),
        error: ref(mockError)
      })

      const { error } = useContentFiles()
      expect(error.value).toBe(mockError)
    })
  })
})
