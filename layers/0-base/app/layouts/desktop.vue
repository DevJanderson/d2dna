<script setup lang="ts">
/**
 * Layout Desktop
 * Layout para área autenticada com navbar e dock sidebar
 */
</script>

<template>
  <div class="relative h-screen bg-muted pt-2">
    <!-- Navbar superior -->
    <DesktopNavbar />

    <!-- Container flexbox -->
    <div class="relative z-20 flex h-[calc(100vh-56px)]">
      <!-- Dock Sidebar -->
      <AppDock />

      <!-- Conteúdo principal -->
      <main class="relative flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
