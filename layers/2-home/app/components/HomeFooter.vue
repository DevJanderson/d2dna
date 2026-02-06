<script setup lang="ts">
/**
 * Footer da página inicial — copyright
 */
</script>

<template>
  <footer class="border-t border-border/40">
    <div class="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
      <p class="text-xs text-muted-foreground/60 font-mono">
        &copy; {{ new Date().getFullYear() }} D2DNA
      </p>
      <p class="text-xs text-muted-foreground/40 font-mono">
        v1.0
      </p>
    </div>
  </footer>
</template>
