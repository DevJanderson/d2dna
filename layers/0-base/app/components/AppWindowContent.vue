<script setup lang="ts">
/**
 * AppWindowContent - Renderiza conteúdo markdown dentro de uma janela
 *
 * Usa @nuxt/content v3 para carregar e renderizar arquivos .md
 *
 * @example
 * ```vue
 * <AppWindowContent path="/docs/getting-started" />
 * ```
 */

interface Props {
  /** Caminho do conteúdo (sem extensão .md) */
  path: string
}

const props = defineProps<Props>()

// Buscar conteúdo usando a API do Nuxt Content v3
const { data: content, status } = await useAsyncData(`content-${props.path}`, () =>
  queryCollection('content').path(props.path).first()
)
</script>

<template>
  <div class="app-window-content">
    <!-- Loading state -->
    <div v-if="status === 'pending'" class="flex items-center justify-center h-32">
      <div class="flex items-center gap-2 text-muted-foreground">
        <div
          class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
        <span>Carregando...</span>
      </div>
    </div>

    <!-- Content -->
    <article v-else-if="content" class="prose prose-sm dark:prose-invert max-w-none">
      <ContentRenderer :value="content" />
    </article>

    <!-- Not found -->
    <div v-else class="text-center py-8 text-muted-foreground">
      <p>Conteúdo não encontrado</p>
      <p class="text-xs mt-1">{{ path }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para o conteúdo markdown */
.app-window-content :deep(.prose) {
  --tw-prose-body: hsl(var(--foreground));
  --tw-prose-headings: hsl(var(--foreground));
  --tw-prose-links: hsl(var(--primary));
  --tw-prose-code: hsl(var(--foreground));
  --tw-prose-pre-bg: hsl(var(--muted));
}

.app-window-content :deep(h1) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.app-window-content :deep(h2) {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.app-window-content :deep(h3) {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.app-window-content :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.625;
}

.app-window-content :deep(ul),
.app-window-content :deep(ol) {
  margin-bottom: 0.75rem;
  padding-left: 1.25rem;
}

.app-window-content :deep(li) {
  margin-bottom: 0.25rem;
}

.app-window-content :deep(code) {
  background-color: hsl(var(--muted));
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.app-window-content :deep(pre) {
  background-color: hsl(var(--muted));
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.app-window-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
}

.app-window-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.app-window-content :deep(th),
.app-window-content :deep(td) {
  border: 1px solid hsl(var(--border));
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.app-window-content :deep(th) {
  background-color: hsl(var(--muted));
  font-weight: 500;
}

.app-window-content :deep(a) {
  color: hsl(var(--primary));
}

.app-window-content :deep(a:hover) {
  text-decoration: underline;
}

.app-window-content :deep(blockquote) {
  border-left: 4px solid hsl(var(--primary) / 0.5);
  padding-left: 1rem;
  font-style: italic;
  color: hsl(var(--muted-foreground));
}
</style>
