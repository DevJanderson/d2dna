<script setup lang="ts">
/**
 * Footer da página inicial
 * Copyright, versão e seção de equipe
 */
import { useIntersectionObserver } from '@vueuse/core'

const footerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  footerRef,
  (entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.1 },
)
</script>

<template>
  <footer
    ref="footerRef"
    class="border-t border-border/40 transition-all duration-700 ease-out"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <!-- Equipe -->
    <div class="max-w-5xl mx-auto px-6 py-10 md:py-16">
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
