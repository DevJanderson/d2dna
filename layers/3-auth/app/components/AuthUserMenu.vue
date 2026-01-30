<script setup lang="ts">
const auth = useAuthStore()

const isOpen = ref(false)

async function handleLogout() {
  await auth.logout()
  navigateTo('/login')
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div v-if="auth.isAuthenticated" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-full p-1 hover:bg-accent"
      @click="isOpen = !isOpen"
    >
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

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 top-full z-50 mt-2 w-56 rounded-md border bg-popover p-1 shadow-md"
    >
      <div class="px-2 py-1.5">
        <p class="text-sm font-medium">{{ auth.user?.nome }}</p>
        <p class="text-xs text-muted-foreground">{{ auth.user?.email }}</p>
      </div>

      <div class="my-1 h-px bg-border" />

      <button
        type="button"
        class="flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
        @click="handleLogout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="mr-2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
        Sair
      </button>
    </div>

    <!-- Backdrop para fechar o menu -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-40"
      @click="isOpen = false"
    />
  </div>
</template>
