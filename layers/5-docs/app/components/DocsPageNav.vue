<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { prevPage, nextPage } = useDocsNavigation()
</script>

<template>
  <nav class="mt-12 flex items-center justify-between border-t border-border pt-6">
    <NuxtLink
      v-if="prevPage"
      :to="prevPage.path"
      class="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeft class="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
      <div class="text-right">
        <span class="block text-xs text-muted-foreground">Anterior</span>
        <span class="font-medium text-foreground">{{ prevPage.title }}</span>
      </div>
    </NuxtLink>
    <div v-else />

    <NuxtLink
      v-if="nextPage"
      :to="nextPage.path"
      class="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <div>
        <span class="block text-xs text-muted-foreground">Próximo</span>
        <span class="font-medium text-foreground">{{ nextPage.title }}</span>
      </div>
      <ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </NuxtLink>
    <div v-else />
  </nav>
</template>
