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
  <section aria-labelledby="partners-heading" class="my-12 md:my-16">
    <h2 id="partners-heading" class="sr-only">Parceiros</h2>

    <!-- Header estilo terminal -->
    <pre class="text-xs text-muted-foreground/50 select-none mb-6 text-center" aria-hidden="true">┌──────────────────────────────────────────────────────────────┐</pre>

    <p class="text-xs text-muted-foreground mb-8 text-center">&gt; parceiros</p>

    <!-- Grid de logos -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 px-4">
      <div
        v-for="partner in partners"
        :key="partner.name"
        class="group flex items-center justify-center p-8 bg-white dark:bg-muted/20 rounded-sm border border-border/30 hover:border-primary/50 transition-colors"
      >
        <img
          :src="partner.logo"
          :alt="partner.name"
          class="h-20 md:h-28 w-auto object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
        />
      </div>
    </div>

    <!-- Footer ASCII -->
    <pre class="text-xs text-muted-foreground/50 select-none mt-8 text-center" aria-hidden="true">└──────────────────────────────────────────────────────────────┘</pre>
  </section>
</template>
