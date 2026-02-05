<script setup lang="ts">
/**
 * Seção de parceiros
 * Lista de parceiros/clientes com logos
 */

const partners = [
  { name: 'Albert Einstein', logo: 'https://d2dna.com/wp-content/uploads/2024/04/albert-einstein.png' },
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
  <section aria-labelledby="partners-heading" class="my-16 md:my-24">
    <h2 id="partners-heading" class="sr-only">Parceiros</h2>

    <p class="text-xs font-mono text-muted-foreground/60 mb-10 text-center uppercase tracking-widest">Parceiros</p>

    <!-- Grid de logos -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-px bg-border/30">
      <div
        v-for="partner in partners"
        :key="partner.name"
        class="relative z-20 group flex items-center justify-center p-8 md:p-10 bg-background hover:bg-muted/30 transition-colors"
      >
        <img
          :src="partner.logo"
          :alt="partner.name"
          class="h-16 md:h-24 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
      </div>
    </div>
  </section>
</template>
