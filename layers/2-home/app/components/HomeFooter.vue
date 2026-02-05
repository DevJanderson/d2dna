<script setup lang="ts">
/**
 * Footer da página inicial
 * Copyright, versão e seção de equipe
 */
</script>

<template>
  <footer class="border-t border-border/40">
    <!-- Equipe -->
    <div class="max-w-5xl mx-auto px-6 py-16 md:py-24">
      <HomeTeam />
    </div>

    <!-- Copyright -->
    <div class="border-t border-border/40">
      <div class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <p class="text-xs text-muted-foreground/60 font-mono">
          &copy; {{ new Date().getFullYear() }} D2DNA
        </p>
        <p class="text-xs text-muted-foreground/40 font-mono">
          v1.0
        </p>
      </div>
    </div>
  </footer>
</template>
