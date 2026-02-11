<script setup lang="ts">
/**
 * Strip de logos de parceiros com scroll infinito (LogoLoop)
 * Exibido logo abaixo do hero para social proof imediato
 */
import type { LogoItemImage } from './LogoLoop.vue'

defineProps<{
  prefersReducedMotion: boolean
  isVisible: boolean
}>()

const logos: LogoItemImage[] = [
  {
    src: 'https://d2dna.com/wp-content/uploads/2024/04/albert-einstein.png',
    alt: 'Hospital Albert Einstein'
  },
  {
    src: 'https://d2dna.com/wp-content/uploads/2024/04/vital-strategies.png',
    alt: 'Vital Strategies'
  },
  { src: 'https://d2dna.com/wp-content/uploads/2024/04/FMT-HVD.png', alt: 'FMT-HVD' },
  { src: 'https://d2dna.com/wp-content/uploads/2024/04/sao-paulo.png', alt: 'USP' },
  {
    src: 'https://d2dna.com/wp-content/uploads/2024/04/pasteur-korea.png',
    alt: 'Pasteur Korea'
  },
  { src: 'https://d2dna.com/wp-content/uploads/2024/04/getconnect.png', alt: 'GetConnect' },
  {
    src: 'https://d2dna.com/wp-content/uploads/2024/04/bioinfor-usp.png',
    alt: 'Bioinfor USP'
  },
  {
    src: 'https://d2dna.com/wp-content/uploads/2024/04/hospital-los-angeles.png',
    alt: 'Hospital Los Angeles'
  },
  { src: 'https://d2dna.com/wp-content/uploads/2024/04/anila-plant.png', alt: 'Anila Plant' }
]
</script>

<template>
  <section
    class="relative z-20 py-8 md:py-12 hero-entrance hero-entrance-delay-4"
    :class="[
      prefersReducedMotion
        ? 'opacity-100'
        : isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
    ]"
  >
    <p
      class="mb-8 text-center font-mono text-xs tracking-widest text-muted-foreground/50 uppercase"
    >
      Utilizado por instituições de referência
    </p>

    <div class="mx-auto max-w-7xl">
      <LogoLoop
        :logos="logos"
        :speed="30"
        direction="left"
        :logo-height="80"
        :gap="48"
        :pause-on-hover="true"
        :fade-out="true"
        aria-label="Logos de parceiros e clientes"
      />
    </div>
  </section>
</template>
