<script setup lang="ts">
/**
 * Pagina inicial - Tucuxi
 * Design: MX (Machine Experience) + semi-brutalismo
 */
// Estado compartilhado para animações de entrada
const isVisible = ref(false)
const { prefersReducedMotion } = usePrefersReducedMotion()

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})

// SEO: meta tags e Open Graph
useSeoMeta({
  title: 'Tucuxi — Record Linkage com Bioinformática',
  description: 'Plataforma de Record Linkage que usa técnicas genômicas para integrar bases de dados com 98%+ de acurácia. 300M+ registros cruzados.',
  ogTitle: 'Tucuxi — Record Linkage com Bioinformática',
  ogDescription: 'Deduplique bases nacionais em horas, não meses. Algoritmo DNA-encoded com 98%+ de acurácia.',
  ogType: 'website',
  ogUrl: 'https://tucuxi.d2dna.com',
  ogImage: 'https://d2dna.com/wp-content/uploads/2024/04/og-tucuxi.png',
  twitterCard: 'summary_large_image'
})

// Structured data para SEO/AI
useHead({
  link: [{ rel: 'canonical', href: 'https://tucuxi.d2dna.com' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        '@id': 'https://tucuxi.d2dna.com',
        name: 'Tucuxi',
        url: 'https://tucuxi.d2dna.com',
        description: 'Plataforma de Record Linkage que usa técnicas genômicas para integrar bases de dados com 98%+ de acurácia',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        inLanguage: 'pt-BR',
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
    class="relative min-h-screen bg-background font-mono
           [--pattern-fg:oklch(0.59_0.19_241.02)]"
  >
    <!-- Faixas verticais hachuradas -->
    <div
      class="pointer-events-none fixed inset-y-0 left-1/2 z-5 hidden w-full max-w-340 -translate-x-1/2 transition-opacity duration-1000 ease-out md:block"
      :class="prefersReducedMotion || isVisible ? 'opacity-100' : 'opacity-0'"
      aria-hidden="true"
    >
      <div class="absolute inset-y-0 left-0 w-10 -translate-x-px border-x border-x-(--pattern-fg)/5 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed opacity-12" />
      <div class="absolute inset-y-0 right-0 w-10 translate-x-px border-x border-x-(--pattern-fg)/5 bg-[repeating-linear-gradient(315deg,var(--pattern-fg)_0,var(--pattern-fg)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed opacity-12" />
    </div>

    <!-- Conteúdo -->
    <HomeNavbar :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div
      class="h-px bg-(--pattern-fg)/7 transition-opacity duration-700 ease-out delay-100"
      :class="prefersReducedMotion || isVisible ? 'opacity-100' : 'opacity-0'"
    />
    <HomeHero :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div
      class="h-px bg-(--pattern-fg)/7 transition-opacity duration-700 ease-out delay-500"
      :class="prefersReducedMotion || isVisible ? 'opacity-100' : 'opacity-0'"
    />
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
