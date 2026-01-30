<script setup lang="ts">
/**
 * Layout Desktop
 * Layout para área autenticada com dock sidebar
 * Inclui logo D2DNA no topo esquerdo
 */
</script>

<template>
  <div class="scanlines relative h-screen bg-muted">
    <!-- Logo D2DNA - Topo Esquerdo -->
    <div class="absolute top-4 left-24 z-10 select-none pointer-events-none">
      <pre class="text-[10px] text-primary/40 leading-tight font-mono" aria-hidden="true">█████▄   ██████╗    █████▄   ███╗   ██╗  █████╗
██   ██  ╚════██╗   ██   ██  ████╗  ██║ ██╔══██╗
██   ██   █████╔╝   ██   ██  ██╔██╗ ██║ ███████║
██   ██  ██╔═══╝    ██   ██  ██║╚██╗██║ ██╔══██║
█████▀   ███████╗   █████▀   ██║ ╚████║ ██║  ██║
╚════╝   ╚══════╝   ╚════╝   ╚═╝  ╚═══╝ ╚═╝  ╚═╝</pre>
    </div>

    <!-- Container flexbox -->
    <div class="relative z-20 flex h-full">
      <!-- Dock Sidebar -->
      <AppDock />

      <!-- Conteúdo principal -->
      <main class="relative flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>
