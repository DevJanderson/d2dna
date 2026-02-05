<script setup lang="ts">
/**
 * Pagina inicial - Tucuxi-Blast
 * Design: MX (Machine Experience) + semi-brutalismo (inspirado Anytype.io)
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
        name: 'Tucuxi-Blast',
        description: 'Sistema de Record Linkage e Gestao de Dados',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        provider: {
          '@type': 'Organization',
          name: 'D2DNA'
        }
      })
    }
  ]
})
</script>

<template>
  <main class="min-h-screen bg-background font-mono scanlines">
    <HomeHero />

    <div class="max-w-7xl mx-auto">
      <HomeStats />
      <HomePartners />
    </div>

    <HomeFooter />
  </main>
</template>
