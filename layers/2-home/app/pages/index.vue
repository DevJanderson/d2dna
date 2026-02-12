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
  description:
    'Plataforma de Record Linkage que usa técnicas genômicas para integrar bases de dados com 98%+ de acurácia. 300M+ registros cruzados.',
  ogTitle: 'Tucuxi — Record Linkage com Bioinformática',
  ogDescription:
    'Deduplique bases nacionais em horas, não meses. Algoritmo DNA-encoded com 98%+ de acurácia.',
  ogImage: 'https://d2dna.com/wp-content/uploads/2024/04/og-tucuxi.png',
  twitterCard: 'summary_large_image'
})

// Structured data para SEO/AI (schema.org via @nuxtjs/seo)
useSchemaOrg([
  defineWebPage({ name: 'Tucuxi — Record Linkage com Bioinformática' }),
  {
    '@type': 'WebApplication',
    'name': 'Tucuxi',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Web',
    'inLanguage': 'pt-BR'
  }
])
</script>

<template>
  <main
    class="relative min-h-screen bg-background font-sans"
  >
    <!-- Faixas verticais hachuradas -->
    <div
      class="pointer-events-none fixed inset-y-0 left-1/2 z-5 hidden w-full max-w-370 -translate-x-1/2 transition-opacity duration-1000 ease-out md:block"
      :class="prefersReducedMotion || isVisible ? 'opacity-100' : 'opacity-0'"
      aria-hidden="true"
    >
      <div
        class="absolute inset-y-0 left-0 w-10 -translate-x-px border-x border-foreground/5 bg-[repeating-linear-gradient(315deg,var(--foreground)_0,var(--foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed opacity-12"
      />
      <div
        class="absolute inset-y-0 right-0 w-10 translate-x-px border-x border-foreground/5 bg-[repeating-linear-gradient(315deg,var(--foreground)_0,var(--foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] bg-fixed opacity-12"
      />
    </div>

    <!-- Conteúdo -->
    <HomeNavbar :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div
      class="h-px bg-foreground/15 transition-opacity duration-700 ease-out delay-100"
      :class="prefersReducedMotion || isVisible ? 'opacity-100' : 'opacity-0'"
    />
    <HomeHero :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div
      class="h-px bg-foreground/15 transition-opacity duration-700 ease-out delay-500"
      :class="prefersReducedMotion || isVisible ? 'opacity-100' : 'opacity-0'"
    />
    <HomeSocialProof :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div class="h-px bg-foreground/15" />
    <LazyHomeStats />
    <div class="h-px bg-foreground/15" />
    <HomeFeatures :prefers-reduced-motion="prefersReducedMotion" :is-visible="isVisible" />
    <div class="h-px bg-foreground/15" />
    <HomeHowItWorks />
    <div class="h-px bg-foreground/15" />
    <LazyHomeSecurity />
    <div class="h-px bg-foreground/15" />
    <LazyHomeTeam />
    <div class="h-px bg-foreground/15" />
    <LazyHomeCTA />
    <div class="h-px bg-foreground/15" />
    <HomeFooter />
  </main>
</template>
