<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: number
}

defineProps<{
  links: TocLink[]
  activeId: string
}>()
</script>

<template>
  <div v-if="links.length" class="space-y-2">
    <p class="text-sm font-semibold text-foreground">Nesta página</p>
    <nav class="space-y-0.5">
      <a
        v-for="link in links"
        :key="link.id"
        :href="`#${link.id}`"
        class="block text-sm transition-colors"
        :class="[
          link.depth === 3 ? 'pl-4' : '',
          activeId === link.id
            ? 'font-medium text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        ]"
      >
        {{ link.text }}
      </a>
    </nav>
  </div>
</template>
