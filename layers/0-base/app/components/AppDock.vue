<script setup lang="ts">
/**
 * AppDock - Sidebar de navegação estilo dock
 *
 * Tipos de navegação:
 * - route: navega para uma rota (ex: /app/reviews)
 * - action: executa uma função (ex: logout)
 *
 * Estados visuais:
 * - ROTA ATIVA: background primary (estamos nessa rota)
 * - DESABILITADO: opacidade reduzida (feature futura)
 * - INATIVO: background muted
 */
import type { FunctionalComponent } from 'vue'
import { GitCompare, Link, FileBarChart, Settings, Bell } from 'lucide-vue-next'

/** Interface para itens de navegação */
interface NavItem {
  id: string
  label: string
  icon: FunctionalComponent
  type: 'route' | 'action'
  /** Para type: 'route' - rota de destino */
  href?: string
  /** Para type: 'action' - função a executar */
  action?: () => void
  /** Item desabilitado (feature futura) */
  disabled?: boolean
}

const route = useRoute()
const router = useRouter()

/** Itens do menu de navegação — cada um representa uma layer */
const navItems: NavItem[] = [
  {
    id: 'reviews',
    label: 'Reviews',
    icon: GitCompare,
    type: 'route',
    href: '/app/reviews'
  },
  {
    id: 'linkage',
    label: 'Linkage (em breve)',
    icon: Link,
    type: 'route',
    href: '/app/linkage',
    disabled: true
  },
  {
    id: 'reports',
    label: 'Relatórios (em breve)',
    icon: FileBarChart,
    type: 'route',
    href: '/app/reports',
    disabled: true
  },
  {
    id: 'settings',
    label: 'Configurações (em breve)',
    icon: Settings,
    type: 'route',
    href: '/app/settings',
    disabled: true
  }
]

/**
 * Lida com clique no item de navegação
 * - route: navega para a rota
 * - action: executa a função
 */
function handleNavClick(item: NavItem) {
  if (item.disabled) return

  switch (item.type) {
    case 'route':
      if (item.href) {
        router.push(item.href)
      }
      break

    case 'action':
      item.action?.()
      break
  }
}

/** Rota atual (reativo) */
const currentPath = computed(() => route.path)

/** Retorna se o item está ativo (rota atual corresponde) */
function isActive(item: NavItem): boolean {
  if (item.disabled || !item.href) return false
  if (item.href === '/') return currentPath.value === '/'
  return currentPath.value.startsWith(item.href)
}
</script>

<template>
  <!--
    Container externo
    - w-20: largura fixa 80px
    - h-full: altura total do container pai
    - flex items-center justify-center: centraliza a dock verticalmente
  -->
  <div class="absolute left-0 top-0 z-30 flex h-full w-20 items-center justify-center py-4">

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
      <nav class="flex flex-col items-center gap-1.5">
        <TooltipProvider :delay-duration="0">
          <template v-for="item in navItems" :key="item.id">
            <Tooltip>
              <TooltipTrigger as-child>
                <button
                  class="dock-nav-icon relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150 focus:outline-none"
                  :class="{ 'opacity-40 cursor-not-allowed': item.disabled }"
                  :data-active="isActive(item)"
                  :disabled="item.disabled"
                  @click="handleNavClick(item)"
                >
                  <component
                    :is="item.icon"
                    class="h-5 w-5"
                    :stroke-width="1.75"
                  />
                </button>
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
              class="relative flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Bell class="h-5 w-5" :stroke-width="1.75" />
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
/* Estado ATIVO */
.dock-nav-icon[data-active="true"] {
  background-color: var(--primary);
  color: var(--primary-foreground);
}

.dock-nav-icon[data-active="true"]:hover {
  background-color: var(--primary);
  opacity: 0.85;
}

/* Estado INATIVO */
.dock-nav-icon[data-active="false"] {
  background-color: var(--muted);
  color: var(--muted-foreground);
}

.dock-nav-icon[data-active="false"]:hover {
  background-color: var(--border);
  color: var(--foreground);
}
</style>
