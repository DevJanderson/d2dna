<script setup lang="ts">
/**
 * AppDock - Sidebar estilo dock macOS
 * Componente de navegação principal com indicadores de janelas abertas
 */
import type { FunctionalComponent } from 'vue'
import {
  LayoutDashboard,
  Users,
  FileText,
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
  Home
} from 'lucide-vue-next'

interface NavItem {
  id: string
  label: string
  icon: FunctionalComponent
  href: string
  color?: string
  /** IDs de janelas relacionadas a este item */
  windowIds?: string[]
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: Home,
    href: '/',
    color: 'bg-chart-5'
  },
  {
    id: 'review',
    label: 'Revisão de Matches',
    icon: GitCompare,
    href: '/app',
    color: 'bg-chart-1',
    windowIds: ['review-queue', 'match-viewer']
  },
  {
    id: 'search',
    label: 'Buscar Paciente',
    icon: Users,
    href: '/app',
    color: 'bg-chart-2'
  },
  {
    id: 'batch',
    label: 'Importação em Lote',
    icon: Upload,
    href: '/app',
    color: 'bg-chart-4'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/app',
    color: 'bg-chart-3'
  }
]

const route = useRoute()
const windowManager = useWindowManager()

function isActive(href: string) {
  return route.path.startsWith(href)
}

/** Verifica se há janelas abertas relacionadas a este item */
function hasOpenWindows(item: NavItem): boolean {
  if (!item.windowIds?.length) return false
  return item.windowIds.some(id =>
    windowManager.windows.value.some(w => w.id === id && !w.minimized)
  )
}
</script>

<template>
  <!-- Container para centralizar a dock -->
  <div class="flex h-screen w-24 items-center justify-center py-4">
    <!-- Dock flutuante com glassmorphism -->
    <aside
      class="flex flex-col items-center gap-1 rounded-3xl border border-sidebar-border bg-sidebar/80 p-3 shadow-xl backdrop-blur-xl"
    >
      <!-- Avatar do usuário -->
      <TooltipProvider :delay-duration="0">
        <Tooltip>
          <TooltipTrigger as-child>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <button
                  class="group relative mb-1 overflow-hidden rounded-2xl transition-transform hover:scale-105 focus:outline-none"
                >
                  <Avatar class="h-11 w-11 rounded-2xl">
                    <AvatarImage src="" alt="User" />
                    <AvatarFallback
                      class="rounded-2xl bg-primary text-primary-foreground text-lg font-semibold"
                    >
                      JS
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" class="w-48">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Users class="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings class="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem class="text-destructive">
                  <LogOut class="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Minha conta</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Separador -->
      <div class="my-1 h-px w-8 bg-sidebar-border" />

      <!-- Navegação principal com magnification -->
      <nav class="group/nav flex flex-col items-center gap-2">
        <TooltipProvider :delay-duration="0">
          <template v-for="item in navItems" :key="item.id">
            <Tooltip>
              <TooltipTrigger as-child>
                <DropdownMenu>
                  <DropdownMenuTrigger as-child>
                    <NuxtLink
                      :to="item.href"
                      class="relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 hover:scale-110 hover:z-10"
                      :class="[
                        isActive(item.href)
                          ? `${item.color} text-white shadow-lg`
                          : 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm hover:bg-sidebar-accent/80'
                      ]"
                      @contextmenu.prevent
                    >
                      <component :is="item.icon" class="h-5 w-5" />
                      <!-- Indicador de janela aberta -->
                      <span
                        v-if="hasOpenWindows(item)"
                        class="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current opacity-70"
                      />
                    </NuxtLink>
                  </DropdownMenuTrigger>
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
      <div class="my-1 h-px w-8 bg-sidebar-border" />

      <!-- Ações inferiores (estilo mais sutil) -->
      <div class="flex flex-col items-center gap-2">
        <TooltipProvider :delay-duration="0">
          <!-- Busca -->
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-105 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Search class="h-5 w-5" />
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
                <Bell class="h-5 w-5" />
                <!-- Badge de notificação -->
                <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Notificações</p>
            </TooltipContent>
          </Tooltip>

          <!-- Logout -->
          <Tooltip>
            <TooltipTrigger as-child>
              <button
                class="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-105 hover:bg-sidebar-accent hover:text-destructive"
              >
                <Power class="h-5 w-5" />
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
