<script setup lang="ts">
/**
 * Pagina inicial - Tucuxi
 * Design: MX (Machine Experience) + semi-brutalismo
 */
const auth = useAuthStore()

onMounted(() => {
  auth.checkAuth()
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
        description: 'Plataforma de Record Linkage que usa técnicas genômicas para integrar bases de dados com 95%+ de precisão',
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
  <main class="min-h-screen bg-background font-mono scanlines">
    <HomeHero />
    <HomeHowItWorks />
    <LazyHomeStats />
    <LazyHomePartners />
    <HomeFooter />
  </main>
</template>
