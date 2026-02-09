<script setup lang="ts">
/**
 * Workspace Principal - Área de trabalho do analista
 * Conteúdo de fundo do Desktop (visível quando não há janelas)
 */
definePageMeta({
  layout: 'desktop',
  middleware: 'auth'
})

useHead({ title: 'Workspace - Tucuxi' })

const windowManager = useWindowManager()
const hasWindows = computed(() => windowManager.visibleWindows.value.length > 0)
</script>

<template>
  <AppDashboard v-if="!hasWindows" />
</template>
