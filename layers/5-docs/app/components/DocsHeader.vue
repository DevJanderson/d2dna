<script setup lang="ts">
import { Search, Github, Menu, Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()
const emit = defineEmits<{
  toggleSidebar: []
}>()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <header
    class="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
    <div class="flex items-center gap-4">
      <button
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
        @click="emit('toggleSidebar')"
      >
        <Menu class="h-5 w-5" />
      </button>

      <NuxtLink to="/docs" class="flex items-center gap-2">
        <span class="font-mono text-lg font-bold tracking-wider text-foreground">
          TUCUXI<span class="cursor-blink">_</span>
        </span>
        <Badge variant="secondary" class="text-[10px] uppercase tracking-widest">docs</Badge>
      </NuxtLink>
    </div>

    <div class="hidden md:block">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar na documentação..."
          class="h-8 w-64 rounded-md border border-border bg-muted/50 pl-9 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <kbd
          class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-muted px-1.5 font-mono text-xs text-muted-foreground"
        >
          /
        </kbd>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <NuxtLink
        to="https://github.com/D2DNA"
        target="_blank"
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <Github class="h-4 w-4" />
      </NuxtLink>

      <button
        class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        @click="toggleTheme"
      >
        <Sun v-if="colorMode.value === 'dark'" class="h-4 w-4" />
        <Moon v-else class="h-4 w-4" />
      </button>

    </div>
    </div>
  </header>
</template>
