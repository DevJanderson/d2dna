<script setup lang="ts">
/**
 * Seção de parceiros
 * Lista de parceiros/clientes com logos otimizados via NuxtImg
 */
import { useIntersectionObserver } from '@vueuse/core'

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  sectionRef,
  (entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.1 },
)

const partners = [
  { name: 'Hospital Albert Einstein', logo: 'https://d2dna.com/wp-content/uploads/2024/04/albert-einstein.png' },
  { name: 'Vital Strategies', logo: 'https://d2dna.com/wp-content/uploads/2024/04/vital-strategies.png' },
  { name: 'FMT-HVD', logo: 'https://d2dna.com/wp-content/uploads/2024/04/FMT-HVD.png' },
  { name: 'USP', logo: 'https://d2dna.com/wp-content/uploads/2024/04/sao-paulo.png' },
  { name: 'Pasteur Korea', logo: 'https://d2dna.com/wp-content/uploads/2024/04/pasteur-korea.png' },
  { name: 'GetConnect', logo: 'https://d2dna.com/wp-content/uploads/2024/04/getconnect.png' },
  { name: 'Bioinfor USP', logo: 'https://d2dna.com/wp-content/uploads/2024/04/bioinfor-usp.png' },
  { name: 'Hospital Los Angeles', logo: 'https://d2dna.com/wp-content/uploads/2024/04/hospital-los-angeles.png' },
  { name: 'Anila Plant', logo: 'https://d2dna.com/wp-content/uploads/2024/04/anila-plant.png' }
]
</script>

<template>
  <section
    ref="sectionRef"
    aria-labelledby="partners-heading"
    class="py-12 md:py-20 transition-all duration-700 ease-out"
    :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <h2 id="partners-heading" class="text-2xl font-bold text-foreground mb-4 text-center">Quem Confia na D2DNA</h2>
    <p class="text-center text-muted-foreground mb-8 text-sm">De hospitais de referência a universidades de ponta — nossa tecnologia opera onde erro não é opção.</p>

    <!-- Grid de logos — 3x3 perfeito -->
    <div id="partners" class="grid grid-cols-2 gap-px bg-border/20 border border-border/20 max-w-4xl mx-auto md:grid-cols-3">
      <div
        v-for="partner in partners"
        :key="partner.name"
        class="group flex flex-col items-center justify-center gap-3 p-6 md:p-8 bg-background hover:bg-muted/20 transition-colors"
      >
        <NuxtImg
          :src="partner.logo"
          :alt="partner.name"
          loading="lazy"
          format="webp"
          quality="80"
          width="120"
          height="96"
          class="h-16 md:h-24 w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
        <span class="text-xs text-muted-foreground/40 group-hover:text-muted-foreground/70 font-mono transition-colors duration-300 text-center leading-tight">
          {{ partner.name }}
        </span>
      </div>
    </div>
  </section>
</template>
