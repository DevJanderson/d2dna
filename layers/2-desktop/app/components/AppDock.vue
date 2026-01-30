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
  LayoutDashboard,
  Users,
  Settings,
  Search,
  Bell,
  LogOut,
  ExternalLink,
  Pin,
  Trash2,
  Power,
  GitCompare,
  Upload,
  Home,
  UserCog
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
const authStore = useAuthStore()

/** Dados do usuário logado */
const user = computed(() => authStore.user)

/** Iniciais do nome do usuário (ex: "João Silva" → "JS") */
const userInitials = computed(() => {
  if (!user.value?.nome) return '??'
  const names = user.value.nome.trim().split(' ').filter(n => n.length > 0)
  if (names.length === 0) return '??'
  const first = names[0] ?? ''
  const last = names[names.length - 1] ?? ''
  if (names.length === 1) return first.substring(0, 2).toUpperCase()
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase()
})

/** Nome para exibição */
const userName = computed(() => user.value?.nome || 'Usuário')

/** Função/cargo do usuário */
const userRole = computed(() => user.value?.funcao || 'Analista')

/**
 * Abre uma janela do usuário (perfil ou configurações)
 * Navega para /app se não estiver lá
 */
function openUserWindow(config: WindowConfig) {
  if (route.path !== '/app') {
    router.push('/app')
  }
  const existing = windowManager.windows.value.find(w => w.id === config.id)
  if (existing) {
    windowManager.focus(config.id)
  } else {
    windowManager.open(config)
  }
}

/** Abre janela de perfil do usuário */
function openProfile() {
  openUserWindow({
    id: 'user-profile',
    title: 'Meu Perfil',
    position: { x: 150, y: 80 },
    size: { width: 450, height: 500 }
  })
}

/** Abre janela de configurações */
function openSettings() {
  openUserWindow({
    id: 'user-settings',
    title: 'Configurações',
    position: { x: 200, y: 100 },
    size: { width: 500, height: 450 }
  })
}

/** Usuário é admin? */
const isAdmin = computed(() => authStore.isAdmin)

/** Abre janela de gerenciamento de usuários (admin) */
function openUserManagement() {
  openUserWindow({
    id: 'user-management',
    title: 'Gerenciar Usuários',
    position: { x: 100, y: 50 },
    size: { width: 700, height: 550 }
  })
}

/** Itens do menu de navegação principal */
const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: Home,
    type: 'route',
    href: '/'
  },
  {
    id: 'review',
    label: 'Revisão de Matches',
    icon: GitCompare,
    type: 'window',
    windowConfig: {
      id: 'review-queue',
      title: 'Fila de Revisão',
      position: { x: 20, y: 20 },
      size: { width: 350, height: 500 }
    },
    // Janelas relacionadas: fila + comparador
    relatedWindowIds: ['review-queue', 'match-viewer']
  },
  {
    id: 'search',
    label: 'Buscar Paciente',
    icon: Users,
    type: 'window',
    windowConfig: {
      id: 'patient-search',
      title: 'Buscar Paciente',
      position: { x: 100, y: 50 },
      size: { width: 500, height: 400 }
    },
    relatedWindowIds: ['patient-search']
  },
  {
    id: 'batch',
    label: 'Importação em Lote',
    icon: Upload,
    type: 'window',
    windowConfig: {
      id: 'batch-import',
      title: 'Importação em Lote',
      position: { x: 150, y: 80 },
      size: { width: 600, height: 450 }
    },
    relatedWindowIds: ['batch-import']
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    type: 'route',
    href: '/dashboard'
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
    - h-screen: altura total da tela
    - flex items-center justify-center: centraliza a dock verticalmente
  -->
  <div class="flex h-screen w-20 items-center justify-center py-4">

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

      <!-- ========== SEÇÃO 1: AVATAR DO USUÁRIO ========== -->
      <TooltipProvider :delay-duration="0">
        <Tooltip>
          <TooltipTrigger as-child>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <!--
                  Botão do avatar
                  - rounded-lg: bordas 8px
                  - hover:scale-105: aumenta 5% no hover
                -->
                <button
                  class="group relative mb-1 overflow-hidden rounded-lg transition-transform focus:outline-none"
                >
                  <!--
                    Avatar (shadcn-vue)
                    - AvatarImage: foto do usuário se disponível
                    - AvatarFallback: iniciais do nome quando não há foto
                  -->
                  <Avatar class="h-10 w-10 rounded-lg">
                    <AvatarImage
                      v-if="user?.foto_perfil"
                      :src="user.foto_perfil"
                      :alt="userName"
                    />
                    <AvatarFallback
                      class="rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                    >
                      {{ userInitials }}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <!-- Menu dropdown do usuário (abre à direita) -->
              <DropdownMenuContent side="right" align="start" class="w-56">
                <!-- Cabeçalho com dados do usuário -->
                <div class="px-2 py-1.5">
                  <p class="text-sm font-medium">{{ userName }}</p>
                  <p class="text-xs text-muted-foreground">{{ userRole }}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="openProfile">
                  <Users class="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem @click="openSettings">
                  <Settings class="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <!-- Opção de admin -->
                <DropdownMenuItem v-if="isAdmin" @click="openUserManagement">
                  <UserCog class="mr-2 h-4 w-4" />
                  Gerenciar Usuários
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <!-- text-destructive: vermelho para ação perigosa -->
                <DropdownMenuItem class="text-destructive" @click="authStore.logout()">
                  <LogOut class="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{{ userName }}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Separador (linha horizontal) -->
      <div class="my-1 h-px w-6 bg-sidebar-border" />

      <!-- ========== SEÇÃO 2: NAVEGAÇÃO PRINCIPAL ========== -->
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

      <!-- ========== SEÇÃO 3: AÇÕES RÁPIDAS ========== -->
      <!--
        Botões menores e mais sutis
        - h-9 w-9: 36x36px (menor que nav)
        - rounded-lg: bordas 8px
        - text-muted-foreground: cor apagada
      -->
      <div class="flex flex-col items-center gap-1">
        <TooltipProvider :delay-duration="0">

          <!-- Busca -->
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:scale-105 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Search class="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Buscar</p>
            </TooltipContent>
          </Tooltip>

          <!-- Notificações -->
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-105 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Bell class="h-4 w-4" />
                <!--
                  Badge de notificação
                  - Ponto vermelho no canto superior direito
                  - bg-destructive: cor vermelha do tema
                -->
                <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>

          <!-- Sair -->
          <Tooltip>
            <TooltipTrigger as-child>
              <!-- hover:text-destructive: fica vermelho no hover -->
              <button
                class="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:scale-105 hover:bg-sidebar-accent hover:text-destructive"
              >
                <Power class="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Sair</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>
      </div>
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
