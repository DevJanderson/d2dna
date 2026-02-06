<script setup lang="ts">
/**
 * DesktopNavbar - Barra de navegação superior do workspace
 * Exibe "TUCUXI" com cursor piscando, busca ao lado e grupo de ações à direita
 */
import { Search, Home, Menu, Settings, Users, UserCog, LogOut } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.nome) return '??'
  const names = user.value.nome.trim().split(' ').filter((n) => n.length > 0)
  if (names.length === 0) return '??'
  const first = names[0] ?? ''
  const last = names[names.length - 1] ?? ''
  if (names.length === 1) return first.substring(0, 2).toUpperCase()
  return ((first[0] ?? '') + (last[0] ?? '')).toUpperCase()
})

const userName = computed(() => user.value?.nome || 'Usuário')
const userRole = computed(() => user.value?.funcao || 'Analista')
const isAdmin = computed(() => authStore.isAdmin)
</script>

<template>
  <nav class="relative z-20 flex h-12 items-center justify-between px-6">
    <!-- Esquerda: Logo + Busca -->
    <div class="flex items-center gap-6">
      <span class="font-mono text-2xl font-bold tracking-wider text-foreground">
        TUCUXI<span class="cursor-blink">_</span>
      </span>

      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar..."
          class="h-8 w-56 rounded-md border border-border bg-background/80 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <kbd
          class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground"
        >
          /
        </kbd>
      </div>
    </div>

    <!-- Direita: Links + Grupo de ações -->
    <div class="flex items-center gap-4">
      <!-- Links de navegação -->
      <NuxtLink
        to="https://github.com/D2DNA"
        target="_blank"
        class="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        GitHub
      </NuxtLink>
      <NuxtLink
        to="/docs"
        class="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
      >
        Docs
      </NuxtLink>

      <!-- Grupo de ações (estilo pill) -->
      <div
        class="flex items-center gap-1 rounded-full border border-border bg-background/80 p-1"
      >
      <!-- Menu -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Menu class="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-48">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="router.push('/app')">
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem @click="router.push('/docs')">
            Documentação
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Home -->
      <button
        class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        @click="router.push('/app')"
      >
        <Home class="h-4 w-4" />
      </button>

      <!-- Avatar do usuário (dropdown) -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="rounded-full focus:outline-none">
            <Avatar class="h-8 w-8">
              <AvatarImage
                v-if="user?.foto_perfil"
                :src="user.foto_perfil"
                :alt="userName"
              />
              <AvatarFallback
                class="bg-primary text-primary-foreground text-xs font-semibold"
              >
                {{ userInitials }}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-56">
          <div class="px-2 py-1.5">
            <p class="text-sm font-medium">{{ userName }}</p>
            <p class="text-xs text-muted-foreground">{{ userRole }}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Users class="mr-2 h-4 w-4" />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings class="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuItem v-if="isAdmin">
            <UserCog class="mr-2 h-4 w-4" />
            Gerenciar Usuários
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive" @click="authStore.logout()">
            <LogOut class="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
  </nav>
</template>
