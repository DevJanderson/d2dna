<script setup lang="ts">
/**
 * Footer da página inicial
 * Copyright, versão e seção de equipe
 */
</script>

<template>
  <footer class="max-w-4xl mx-auto px-6 pt-12 md:pt-16 pb-16 md:pb-20">
    <!-- Copyright e versão -->
    <div class="text-sm text-muted-foreground space-y-1 mb-12">
      <p><span class="text-muted-foreground/50">&gt;</span> copyright: {{ new Date().getFullYear() }} D2DNA</p>
      <p><span class="text-muted-foreground/50">&gt;</span> version: 1.0</p>
    </div>

    <!-- Equipe -->
    <HomeTeam />
  </footer>
</template>
