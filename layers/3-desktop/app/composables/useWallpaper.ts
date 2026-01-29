/**
 * useWallpaper - Composable para gerenciar wallpaper do desktop
 * @module composables/useWallpaper
 *
 * Persistência via localStorage
 * Suporta: cores sólidas, gradientes, patterns e imagens
 */

export interface WallpaperStyle {
  background?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
}

export interface Wallpaper {
  id: string
  name: string
  type: 'solid' | 'gradient' | 'pattern' | 'image'
  /** CSS styles para o wallpaper */
  style: WallpaperStyle
  thumbnail?: string // Preview pequeno (URL para imagens)
}

// Wallpapers padrão
export const DEFAULT_WALLPAPERS: Wallpaper[] = [
  // Padrão (primeiro item é o default)
  {
    id: 'pattern-dots-light',
    name: 'Pontos Claro',
    type: 'pattern',
    style: {
      background: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px), #f8fafc',
      backgroundSize: '20px 20px'
    }
  },

  // Cores sólidas
  {
    id: 'solid-dark',
    name: 'Escuro',
    type: 'solid',
    style: { backgroundColor: 'hsl(var(--background))' }
  },
  {
    id: 'solid-slate',
    name: 'Ardósia',
    type: 'solid',
    style: { backgroundColor: '#1e293b' }
  },
  {
    id: 'solid-zinc',
    name: 'Zinco',
    type: 'solid',
    style: { backgroundColor: '#18181b' }
  },
  {
    id: 'solid-neutral',
    name: 'Neutro',
    type: 'solid',
    style: { backgroundColor: '#171717' }
  },

  // Gradientes (cores alinhadas com saúde/dados)
  {
    id: 'gradient-ocean',
    name: 'Oceano',
    type: 'gradient',
    style: { background: 'linear-gradient(135deg, #1a365d 0%, #2b6cb0 50%, #4299e1 100%)' }
  },
  {
    id: 'gradient-forest',
    name: 'Floresta',
    type: 'gradient',
    style: { background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)' }
  },
  {
    id: 'gradient-midnight',
    name: 'Meia-noite',
    type: 'gradient',
    style: { background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }
  },

  // Patterns (CSS puro)
  {
    id: 'pattern-dots',
    name: 'Pontos',
    type: 'pattern',
    style: {
      background: 'radial-gradient(circle, #374151 1px, transparent 1px), #0f172a',
      backgroundSize: '20px 20px'
    }
  },
  {
    id: 'pattern-grid',
    name: 'Grade',
    type: 'pattern',
    style: {
      background:
        'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px), #0f172a',
      backgroundSize: '40px 40px'
    }
  },
  {
    id: 'pattern-diagonal',
    name: 'Diagonal',
    type: 'pattern',
    style: {
      background:
        'repeating-linear-gradient(45deg, #1e293b, #1e293b 1px, #0f172a 1px, #0f172a 10px)'
    }
  },

  // Patterns Claros (Light theme)
  {
    id: 'pattern-grid-light',
    name: 'Grade Clara',
    type: 'pattern',
    style: {
      background:
        'linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, #e2e8f0 1px, transparent 1px), #f8fafc',
      backgroundSize: '40px 40px'
    }
  },
  {
    id: 'pattern-diagonal-light',
    name: 'Diagonal Clara',
    type: 'pattern',
    style: {
      background:
        'repeating-linear-gradient(45deg, #e2e8f0, #e2e8f0 1px, #f8fafc 1px, #f8fafc 10px)'
    }
  },

  // Imagens (Unsplash - gratuitas para uso)
  {
    id: 'image-mountains',
    name: 'Montanhas',
    type: 'image',
    style: {
      backgroundImage:
        'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60'
  },
  {
    id: 'image-aurora-sky',
    name: 'Aurora Boreal',
    type: 'image',
    style: {
      backgroundImage:
        'url(https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=60'
  },
  {
    id: 'image-night-sky',
    name: 'Céu Noturno',
    type: 'image',
    style: {
      backgroundImage:
        'url(https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    },
    thumbnail: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=60'
  }
]

// Chave para localStorage
const STORAGE_KEY = 'desktop-wallpaper'

// Estado global (singleton)
const currentWallpaper = ref<Wallpaper>(DEFAULT_WALLPAPERS[0]!)
const customWallpapers = ref<Wallpaper[]>([])
const isInitialized = ref(false)

// Carregar do localStorage imediatamente no cliente (evita flash)
function initFromStorage() {
  if (import.meta.server || isInitialized.value) return

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const data = JSON.parse(stored)
      const found =
        [...DEFAULT_WALLPAPERS, ...customWallpapers.value].find(w => w.id === data.id) || data
      currentWallpaper.value = found
    }
  } catch {
    // Ignorar erros
  }
  isInitialized.value = true
}

// Inicializar imediatamente se no cliente
if (import.meta.client) {
  initFromStorage()
}

export function useWallpaper() {
  // Garantir inicialização no primeiro uso
  if (!isInitialized.value) {
    initFromStorage()
  }

  /** Salva preferência no localStorage */
  function saveToStorage() {
    if (import.meta.server) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWallpaper.value))
    } catch {
      // Ignorar erros de storage
    }
  }

  /** Define o wallpaper atual */
  function setWallpaper(wallpaper: Wallpaper) {
    currentWallpaper.value = wallpaper
    saveToStorage()
  }

  /** Define wallpaper por ID */
  function setWallpaperById(id: string) {
    const wallpaper = [...DEFAULT_WALLPAPERS, ...customWallpapers.value].find(w => w.id === id)
    if (wallpaper) {
      setWallpaper(wallpaper)
    }
  }

  /** Adiciona wallpaper customizado (imagem) */
  function addCustomWallpaper(name: string, imageUrl: string): Wallpaper {
    const wallpaper: Wallpaper = {
      id: `custom-${Date.now()}`,
      name,
      type: 'image',
      style: {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      },
      thumbnail: imageUrl
    }
    customWallpapers.value.push(wallpaper)
    return wallpaper
  }

  /** Remove wallpaper customizado */
  function removeCustomWallpaper(id: string) {
    const index = customWallpapers.value.findIndex(w => w.id === id)
    if (index !== -1) {
      customWallpapers.value.splice(index, 1)
      // Se era o atual, volta pro padrão
      if (currentWallpaper.value.id === id) {
        setWallpaper(DEFAULT_WALLPAPERS[0]!)
      }
    }
  }

  /** Computed: todos os wallpapers disponíveis */
  const allWallpapers = computed(() => [...DEFAULT_WALLPAPERS, ...customWallpapers.value])

  /** Computed: estilo CSS do wallpaper */
  const wallpaperStyle = computed(() => currentWallpaper.value.style)

  return {
    // Estado (computed para garantir reatividade sem permitir modificação direta)
    currentWallpaper: computed(() => currentWallpaper.value),
    customWallpapers: computed(() => customWallpapers.value),
    allWallpapers,
    wallpaperStyle,

    // Ações
    setWallpaper,
    setWallpaperById,
    addCustomWallpaper,
    removeCustomWallpaper
  }
}
