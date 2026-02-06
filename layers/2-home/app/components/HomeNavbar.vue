<script setup lang="ts">
/**
 * Navbar da home — inspirada no Recraft
 * Logo ASCII à esquerda + links centrais + botão auth à direita
 */
const auth = useAuthStore()

defineProps<{
  prefersReducedMotion: boolean
  isVisible: boolean
}>()

const navLinks = [
  { label: 'Produto', href: '#features' },
  { label: 'Como funciona', href: '#how-it-works' },
  { label: 'Equipe', href: '#team' }
]

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header
    class="sticky top-0 z-20 bg-background hero-entrance max-md:bg-background/95 max-md:shadow-[0_0.125em_0.5em_0_rgba(117,117,117,0.1)] max-md:backdrop-blur-sm max-md:dark:shadow-[0_0.125em_0.5em_0_rgba(0,0,0,0.25)]"
    :class="[
      prefersReducedMotion
        ? 'opacity-100'
        : isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4',
    ]"
  >
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-5 py-2 md:px-6 md:py-3">
      <!-- Logo ASCII -->
      <pre
        class="select-none font-mono text-[3.5px] leading-none text-foreground/80 sm:text-[4.3px]"
      >████████╗██╗   ██╗ ██████╗██╗   ██╗██╗  ██╗██╗
╚══██╔══╝██║   ██║██╔════╝██║   ██║╚██╗██╔╝██║
   ██║   ██║   ██║██║     ██║   ██║ ╚███╔╝ ██║
   ██║   ██║   ██║██║     ██║   ██║ ██╔██╗ ██║
   ██║   ╚██████╔╝╚██████╗╚██████╔╝██╔╝ ██╗██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝</pre>

      <!-- Links centrais (desktop) -->
      <div class="hidden items-center gap-8 md:flex">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="text-sm text-foreground/60 transition-colors hover:text-foreground"
          @click.prevent="scrollTo(link.href)"
        >
          {{ link.label }}
        </a>
      </div>

      <!-- Botões à direita -->
      <div class="flex items-center gap-3">
        <NuxtLink v-if="auth.isAuthenticated" to="/app">
          <Button
            size="sm"
            class="bg-foreground px-5 text-xs text-background hover:bg-foreground/90"
          >
            Workspace
          </Button>
        </NuxtLink>
        <template v-else>
          <NuxtLink to="/login">
            <span
              class="hidden text-sm text-foreground/60 transition-colors hover:text-foreground sm:inline"
            >
              Entrar
            </span>
          </NuxtLink>
          <NuxtLink to="/login">
            <Button
              size="sm"
              class="bg-foreground px-5 text-xs text-background hover:bg-foreground/90"
            >
              Começar agora
            </Button>
          </NuxtLink>
        </template>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.hero-entrance {
  transition:
    opacity 1s ease-out,
    transform 1s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .hero-entrance {
    transition: none;
  }
}
</style>
