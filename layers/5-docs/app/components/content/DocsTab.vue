<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const activeTab = inject<Ref<string>>('docs-tabs-active', ref(''))

const isActive = computed(() => activeTab.value === props.name)
</script>

<template>
  <div v-show="isActive">
    <slot />
  </div>
</template>
