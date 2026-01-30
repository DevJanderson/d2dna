<script setup lang="ts">
/**
 * Página de documentação
 * Renderiza conteúdo Markdown da pasta content/docs/
 */
const { data: page } = await useAsyncData('docs-index', () => {
  return queryCollection('content').path('/docs').first()
})
</script>

<template>
  <div class="min-h-screen p-6 max-w-4xl mx-auto">
    <div v-if="page" class="prose prose-neutral dark:prose-invert max-w-none">
      <ContentRenderer :value="page" />
    </div>
    <div v-else class="text-center py-12">
      <h1 class="text-2xl font-bold">Página não encontrada</h1>
      <p class="text-muted-foreground mt-2">O documento solicitado não existe.</p>
    </div>
  </div>
</template>
