/**
 * useContentFiles - Lista arquivos de conteúdo disponíveis
 *
 * Busca todos os arquivos markdown da coleção 'content'
 * e organiza em estrutura de árvore de pastas/arquivos
 */

export interface ContentFile {
  /** ID único do arquivo */
  id: string
  /** Título do documento */
  title: string
  /** Caminho do arquivo (ex: /docs/getting-started) */
  path: string
  /** Nome do arquivo sem extensão */
  stem: string
  /** Descrição do documento */
  description?: string
}

export interface ContentFolder {
  /** Nome da pasta */
  name: string
  /** Caminho da pasta */
  path: string
  /** Arquivos dentro da pasta */
  files: ContentFile[]
  /** Subpastas */
  folders: ContentFolder[]
}

export interface ContentTree {
  /** Arquivos na raiz */
  files: ContentFile[]
  /** Pastas */
  folders: ContentFolder[]
}

export function useContentFiles() {
  // Busca todos os arquivos de conteúdo
  const {
    data: allContent,
    status,
    error
  } = useAsyncData('content-files-list', () => queryCollection('content').all())

  // Organiza em estrutura de árvore
  const contentTree = computed<ContentTree>(() => {
    if (!allContent.value) {
      return { files: [], folders: [] }
    }

    const tree: ContentTree = { files: [], folders: [] }
    const folderMap = new Map<string, ContentFolder>()

    for (const item of allContent.value) {
      const file: ContentFile = {
        id: item.id || item.path,
        title: item.title || item.stem || 'Sem título',
        path: item.path,
        stem: item.stem || '',
        description: item.description
      }

      // Verifica se está em uma pasta
      const pathParts = item.path.split('/').filter(Boolean)

      if (pathParts.length === 0) {
        // Arquivo na raiz (path = "/")
        tree.files.push(file)
      } else if (pathParts.length === 1) {
        // Arquivo na raiz com nome (ex: /about)
        tree.files.push(file)
      } else {
        // Arquivo em pasta (ex: /docs/getting-started)
        const folderPath = '/' + pathParts.slice(0, -1).join('/')
        const folderName = pathParts[pathParts.length - 2] ?? 'unknown'

        let folder = folderMap.get(folderPath)
        if (!folder) {
          folder = {
            name: folderName,
            path: folderPath,
            files: [],
            folders: []
          }
          folderMap.set(folderPath, folder)
          tree.folders.push(folder)
        }

        folder.files.push(file)
      }
    }

    // Ordena arquivos e pastas alfabeticamente
    tree.files.sort((a, b) => a.title.localeCompare(b.title))
    tree.folders.sort((a, b) => a.name.localeCompare(b.name))
    for (const folder of tree.folders) {
      folder.files.sort((a, b) => a.title.localeCompare(b.title))
    }

    return tree
  })

  // Lista plana de todos os arquivos
  const flatFiles = computed<ContentFile[]>(() => {
    if (!allContent.value) return []

    return allContent.value.map(item => ({
      id: item.id || item.path,
      title: item.title || item.stem || 'Sem título',
      path: item.path,
      stem: item.stem || '',
      description: item.description
    }))
  })

  return {
    /** Árvore de conteúdo organizada */
    contentTree,
    /** Lista plana de todos os arquivos */
    flatFiles,
    /** Status do carregamento */
    status,
    /** Erro se houver */
    error
  }
}
