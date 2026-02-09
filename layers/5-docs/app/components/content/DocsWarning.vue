<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <DocsCallout type="warning" :title="title">
    <slot />
  </DocsCallout>
</template>
