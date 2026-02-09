<script setup lang="ts">
/**
 * Feature cards — 3 colunas com divisórias
 */
defineProps<{
  prefersReducedMotion: boolean
  isVisible: boolean
}>()

const features = [
  {
    title: 'Busca em segundos',
    description:
      'Erros de digitação viram "mutações" de DNA. Trocas como N↔M, S↔Z e dígitos 1↔0 são tratadas automaticamente — sem preprocessamento manual.',
  },
  {
    title: 'Algoritmo DNA-encoded',
    description:
      'Nomes, datas e filiação são codificados em nucleotídeos (A,T,C,G) e alinhados via BLASTn. Machine Learning classifica os matches com 98.68% de acurácia.',
  },
  {
    title: 'Múltiplos setores',
    description:
      'Saúde, educação, epidemiologia e seguros. A mesma plataforma resolve duplicatas em qualquer base.',
  },
]
</script>

<template>
  <div id="features">
    <div
      class="mx-auto max-w-7xl hero-entrance hero-entrance-delay-4"
      :class="[
        prefersReducedMotion
          ? 'opacity-100'
          : isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4',
      ]"
    >
      <div
        class="grid grid-cols-1 divide-y divide-border/40 md:grid-cols-3 md:divide-x md:divide-y-0"
      >
        <div
          v-for="feature in features"
          :key="feature.title"
          class="px-6 py-8 md:px-8 md:py-10"
        >
          <h3 class="mb-2 text-lg font-bold text-foreground">
            {{ feature.title }}
          </h3>
          <p class="text-base leading-relaxed text-muted-foreground">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
