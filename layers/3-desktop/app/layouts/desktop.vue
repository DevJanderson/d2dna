<script setup lang="ts">
/**
 * Layout Desktop
 * Layout para área autenticada com dock sidebar
 */
</script>

<template>
  <div class="relative h-screen bg-muted">
    <!-- Container flexbox -->
    <div class="relative z-10 flex h-full">
      <!-- Dock Sidebar -->
      <AppDock />

      <!-- Conteúdo principal -->
      <main class="relative flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
