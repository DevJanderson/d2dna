<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

const auth = useAuthStore()

async function handleLogout() {
  await auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <DropdownMenu v-if="auth.isAuthenticated">
    <DropdownMenuTrigger as-child>
      <button type="button" class="rounded-full p-1 hover:bg-accent focus:outline-none">
        <div
          v-if="auth.user?.foto_perfil"
          class="h-8 w-8 overflow-hidden rounded-full"
        >
          <img
            :src="auth.user.foto_perfil"
            :alt="auth.user.nome"
            class="h-full w-full object-cover"
          />
        </div>
        <div
          v-else
          class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground"
        >
          {{ getInitials(auth.user?.nome || 'U') }}
        </div>
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-56">
      <div class="px-2 py-1.5">
        <p class="text-sm font-medium">{{ auth.user?.nome }}</p>
        <p class="text-xs text-muted-foreground">{{ auth.user?.email }}</p>
      </div>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive" @click="handleLogout">
        <LogOut class="mr-2 h-4 w-4" />
        Sair
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
