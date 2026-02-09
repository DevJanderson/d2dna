<script setup lang="ts">
defineProps<{
  title: string
  step?: number
}>()
</script>

<template>
  <div class="relative flex gap-4 pb-8 last:pb-0">
    <!-- Linha vertical -->
    <div class="flex flex-col items-center">
      <div
        class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary"
      >
        {{ step }}
      </div>
      <div class="w-px flex-1 bg-border" />
    </div>
    <!-- Conteúdo -->
    <div class="flex-1 pb-2 pt-0.5">
      <h4 class="text-sm font-semibold text-foreground">{{ title }}</h4>
      <div class="mt-2 text-sm text-muted-foreground">
        <slot />
      </div>
    </div>
  </div>
</template>
