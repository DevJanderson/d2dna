<script setup lang="ts">
/**
 * Layout Desktop
 * Layout para área autenticada com dock sidebar
 * Wallpaper aplicado no nível do layout para cobrir toda a tela
 */
const { wallpaperStyle } = useWallpaper()
</script>

<template>
  <div class="relative h-screen">
    <!-- Wallpaper de fundo (cobre toda a tela) -->
    <div class="absolute inset-0 transition-all duration-500" :style="wallpaperStyle" />

    <!-- Container flexbox sobre o wallpaper -->
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
