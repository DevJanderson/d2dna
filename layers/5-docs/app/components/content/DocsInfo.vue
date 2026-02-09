<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <DocsCallout type="info" :title="title">
    <slot />
  </DocsCallout>
</template>
