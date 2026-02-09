<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <DocsCallout type="tip" :title="title">
    <slot />
  </DocsCallout>
</template>
