<script setup lang="ts">
/**
 * AppDock - Sidebar de navegação estilo dock (modelo HÍBRIDO)
 *
 * Tipos de navegação:
 * - route: navega para uma rota (ex: /, /dashboard)
 * - window: abre/foca uma janela no workspace
 * - action: executa uma função (ex: logout)
 *
 * Estados visuais:
 * - ROTA ATIVA: background cinza (estamos nessa rota)
 * - JANELA ABERTA: bolinha no canto (tem janela não minimizada)
 * - INATIVO: background primary (escuro)
 */
import type { FunctionalComponent } from 'vue'
import {
  GitCompare,
  Link,
  FileBarChart,
  Settings,
  Bell,
  ExternalLink,
  Pin,
  Trash2
} from 'lucide-vue-next'

/** Configuração para abrir uma janela */
interface WindowConfig {
  id: string
  title: string
  position?: { x: number; y: number }
  size?: { width: number; height: number }
}

/** Interface para itens de navegação (modelo híbrido) */
interface NavItem {
  id: string
  label: string
  icon: FunctionalComponent
  type: 'route' | 'window' | 'action'
  /** Para type: 'route' - rota de destino */
  href?: string
  /** Para type: 'window' - configuração da janela principal */
  windowConfig?: WindowConfig
  /** IDs de janelas relacionadas (para indicador de ativo/aberta) */
  relatedWindowIds?: string[]
  /** Para type: 'action' - função a executar */
  action?: () => void
}

const route = useRoute()
const router = useRouter()
const windowManager = useWindowManager()

/** Itens do menu de navegação — cada um representa uma layer */
const navItems: NavItem[] = [
  {
    id: 'reviews',
    label: 'Reviews',
    icon: GitCompare,
    type: 'window',
    windowConfig: {
      id: 'reviews',
      title: 'Reviews',
      position: { x: 20, y: 20 },
      size: { width: 350, height: 500 }
    },
    relatedWindowIds: ['reviews', 'match-viewer']
  },
  {
    id: 'linkage',
    label: 'Linkage',
    icon: Link,
    type: 'window',
    windowConfig: {
      id: 'linkage',
      title: 'Linkage',
      position: { x: 100, y: 50 },
      size: { width: 500, height: 400 }
    },
    relatedWindowIds: ['linkage']
  },
  {
    id: 'reports',
    label: 'Relatórios',
    icon: FileBarChart,
    type: 'window',
    windowConfig: {
      id: 'reports',
      title: 'Relatórios',
      position: { x: 150, y: 80 },
      size: { width: 600, height: 450 }
    },
    relatedWindowIds: ['reports']
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    type: 'window',
    windowConfig: {
      id: 'settings',
      title: 'Configurações',
      position: { x: 200, y: 100 },
      size: { width: 500, height: 450 }
    },
    relatedWindowIds: ['settings']
  }
]

/**
 * Lida com clique no item de navegação
 * - route: navega para a rota
 * - window: abre ou foca a janela (navega para /app se não estiver lá)
 * - action: executa a função
 */
function handleNavClick(item: NavItem) {
  switch (item.type) {
    case 'route':
      if (item.href) {
        router.push(item.href)
      }
      break

    case 'window':
      if (item.windowConfig) {
        // Se não estiver no workspace, navega primeiro
        if (route.path !== '/app') {
          router.push('/app')
        }
        // Verifica se a janela já existe
        const existing = windowManager.windows.value.find(
          w => w.id === item.windowConfig!.id
        )
        if (existing) {
          // Foca a janela existente
          windowManager.focus(item.windowConfig.id)
        } else {
          // Abre nova janela
          windowManager.open(item.windowConfig)
        }
      }
      break

    case 'action':
      item.action?.()
      break
  }
}

/** Rota atual (reativo) */
const currentPath = computed(() => route.path)

/** ID da janela ativa (reativo) */
const activeWindowId = computed(() => windowManager.activeWindowId.value)

/**
 * Calcula estado ativo para cada item (reativo)
 *
 * Lógica:
 * - route: ativo quando na rota exata
 * - window: ativo quando ALGUMA janela relacionada está em FOCO
 * - action: nunca ativo
 */
const activeStates = computed(() => {
  const states: Record<string, boolean> = {}

  for (const item of navItems) {
    let result = false

    switch (item.type) {
      case 'route':
        if (!item.href) {
          result = false
        } else if (item.href === '/') {
          result = currentPath.value === '/'
        } else {
          result = currentPath.value.startsWith(item.href)
        }
        break

      case 'window':
        // Ativo se ALGUMA janela relacionada está em FOCO
        if (item.relatedWindowIds?.length) {
          result = item.relatedWindowIds.includes(activeWindowId.value ?? '')
        } else if (item.windowConfig) {
          result = activeWindowId.value === item.windowConfig.id
        }
        break

      case 'action':
        result = false
        break
    }

    states[item.id] = result
  }

  return states
})

/** Retorna se o item está ativo */
function isActive(item: NavItem): boolean {
  return activeStates.value[item.id] ?? false
}

/**
 * Verifica se há janela aberta para este item
 * Usa relatedWindowIds se disponível, senão usa windowConfig.id
 */
function hasOpenWindow(item: NavItem): boolean {
  if (item.type !== 'window') return false

  const windowIds = item.relatedWindowIds?.length
    ? item.relatedWindowIds
    : item.windowConfig
      ? [item.windowConfig.id]
      : []

  if (!windowIds.length) return false

  return windowIds.some(id =>
    windowManager.windows.value.some(w => w.id === id && !w.minimized)
  )
}
</script>

<template>
  <!--
    Container externo
    - w-20: largura fixa 80px
    - h-full: altura total do container pai
    - flex items-center justify-center: centraliza a dock verticalmente
  -->
  <div class="flex h-full w-20 items-center justify-center py-4">

    <!--
      Dock (aside)
      - rounded-2xl: bordas arredondadas 16px
      - border border-sidebar-border: borda do tema sidebar
      - bg-sidebar/80: fundo sidebar com 80% opacidade
      - backdrop-blur-xl: efeito glassmorphism
      - shadow-xl: sombra
      - p-2 gap-1: espaçamento interno compacto
    -->
    <aside
      class="flex flex-col items-center gap-1 rounded-2xl border border-sidebar-border bg-sidebar/80 p-2 shadow-xl backdrop-blur-xl"
    >

      <!-- ========== NAVEGAÇÃO PRINCIPAL ========== -->
      <nav class="group/nav flex flex-col items-center gap-2">
        <TooltipProvider :delay-duration="0">
          <template v-for="item in navItems" :key="item.id">
            <Tooltip>
              <TooltipTrigger as-child>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <!--
                      Botão de navegação (modelo híbrido)
                      - h-10 w-10: tamanho 40x40px
                      - rounded-lg: bordas 8px

                      Estados de cor (via data-active):
                      - ATIVO: bg-primary (destaque)
                      - INATIVO: bg-gray-200 (sutil)
                    -->
                    <button
                      class="dock-nav-icon relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 hover:scale-90 hover:z-10 focus:outline-none"
                      :data-active="isActive(item)"
                      @click="handleNavClick(item)"
                      @contextmenu.prevent
                    >
                      <!-- Ícone (Lucide) -->
                      <component :is="item.icon" class="h-4 w-4" />

                      <!--
                        Indicador de janela aberta (só para type: 'window')
                        - Ponto no canto superior direito
                        - Verde para contrastar com qualquer fundo
                      -->
                      <span
                        v-if="hasOpenWindow(item)"
                        class="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <!-- Menu de contexto (clique direito) -->
                  <DropdownMenuContent side="right" align="start" class="w-48">
                    <DropdownMenuLabel>{{ item.label }}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ExternalLink class="mr-2 h-4 w-4" />
                      Abrir em nova aba
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pin class="mr-2 h-4 w-4" />
                      Fixar no dock
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive">
                      <Trash2 class="mr-2 h-4 w-4" />
                      Remover do dock
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{{ item.label }}</p>
              </TooltipContent>
            </Tooltip>
          </template>
        </TooltipProvider>
      </nav>

      <!-- Separador -->
      <div class="my-1 h-px w-6 bg-sidebar-border" />

      <!-- Notificações -->
      <TooltipProvider :delay-duration="0">
        <Tooltip>
          <TooltipTrigger as-child>
            <button
              class="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-105 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Bell class="h-4 w-4" />
              <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Notificações</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </aside>
  </div>
</template>

<style scoped>
/* Ícones de navegação da dock */

/* Estado ATIVO - preto (destaque) */
.dock-nav-icon[data-active="true"] {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.dock-nav-icon[data-active="true"]:hover {
  background-color: var(--primary);
  opacity: 0.9;
}

/* Estado INATIVO - cinza (sutil) */
.dock-nav-icon[data-active="false"] {
  background-color: #e5e7eb; /* gray-200 */
  color: var(--foreground);
}

.dock-nav-icon[data-active="false"]:hover {
  background-color: #d1d5db; /* gray-300 */
}
</style>
