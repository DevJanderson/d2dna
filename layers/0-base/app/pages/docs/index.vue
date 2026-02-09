<script setup lang="ts">
/**
 * Página de documentação
 * Renderiza conteúdo Markdown da pasta content/docs/
 */
import { ArrowLeft } from 'lucide-vue-next'

useHead({ title: 'Documentação - Tucuxi' })

const { data: page } = await useAsyncData('docs-index', () => {
  return queryCollection('content').path('/docs').first()
})
</script>

<template>
  <div class="min-h-screen p-6 max-w-4xl mx-auto">
    <nav class="mb-8 flex items-center gap-4">
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft class="h-4 w-4" />
        Voltar
      </NuxtLink>
      <span class="font-mono text-lg font-bold tracking-wider text-foreground">
        TUCUXI<span class="cursor-blink">_</span>
      </span>
    </nav>
    <div v-if="page" class="prose prose-neutral dark:prose-invert max-w-none">
      <ContentRenderer :value="page" />
    </div>
    <div v-else class="text-center py-12">
      <h1 class="text-2xl font-bold">Página não encontrada</h1>
      <p class="text-muted-foreground mt-2">O documento solicitado não existe.</p>
    </div>
  </div>
</template>
