<script setup lang="ts">
/**
 * Pagina inicial - Tucuxi
 * Design: MX (Machine Experience) + semi-brutalismo
 */
const auth = useAuthStore()

onMounted(() => {
  auth.checkAuth()
})

// Estado compartilhado para animações de entrada
const isVisible = ref(false)
const prefersReducedMotion = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    prefersReducedMotion.value = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
  }

  requestAnimationFrame(() => {
    isVisible.value = true
  })
})

// Structured data para SEO/AI
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Tucuxi',
        description: 'Plataforma de Record Linkage que usa técnicas genômicas para integrar bases de dados com 98%+ de acurácia',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        provider: {
          '@type': 'Organization',
          name: 'D2DNA',
          url: 'https://d2dna.com'
        }
      })
    }
  ]
})
</script>

<template>
  <main
    class="relative min-h-screen bg-background font-mono scanlines
           [--pattern-fg:oklch(0.59_0.19_241.02)]"
  >
    <!-- Faixas verticais hachuradas -->
    <div
      class="pointer-events-none fixed inset-y-0 left-1/2 z-5 hidden w-full max-w-340 -translate-x-1/2 md:block"
      aria-hidden="true"
    >
      <div class="absolute inset-y-0 left-0 w-10 -translate-x-px border-x border-x-(--pattern-fg)/5 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed opacity-12" />
      <div class="absolute inset-y-0 right-0 w-10 translate-x-px border-x border-x-(--pattern-fg)/5 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed opacity-12" />
    </div>

    <!-- Conteúdo -->
    <HomeNavbar :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div class="h-px bg-(--pattern-fg)/7" />
    <HomeHero :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div class="h-px bg-(--pattern-fg)/7" />
    <HomeFeatures :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div class="h-px bg-(--pattern-fg)/7" />
    <HomeHowItWorks />
    <div class="h-px bg-(--pattern-fg)/7" />
    <LazyHomeStats />
    <div class="h-px bg-(--pattern-fg)/7" />
    <LazyHomePartners />
    <div class="h-px bg-(--pattern-fg)/7" />
    <LazyHomeTeam />
    <div class="h-px bg-(--pattern-fg)/7" />
    <HomeFooter />
  </main>
</template>
