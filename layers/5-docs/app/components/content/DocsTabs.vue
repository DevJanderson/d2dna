<script setup lang="ts">
const props = defineProps<{
  items: string[]
}>()

const activeTab = ref(props.items[0] ?? '')

provide('docs-tabs-active', activeTab)
</script>

<template>
  <div class="my-6">
    <div class="flex gap-1 border-b border-border">
      <button
        v-for="item in items"
        :key="item"
        class="border-b-2 px-3 py-1.5 text-sm font-medium transition-colors"
        :class="
          activeTab === item
            ? 'border-primary text-foreground'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        "
        @click="activeTab = item"
      >
        {{ item }}
      </button>
    </div>
    <div class="pt-4">
      <slot />
    </div>
  </div>
</template>
