<script setup lang="ts">
/**
 * Pagina inicial - Tucuxi-Blast
 * Design: MX (Machine Experience) + ASCII Art
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
    <article class="max-w-4xl mx-auto px-6 py-16 md:py-20">
      <HomeHeader />
      <HomeSeparator />
      <HomeDescription />
      <HomeSeparator />
      <HomeStatus />
      <HomeStats />
      <HomePartners />
    </article>

    <HomeFooter />
  </main>
</template>
