<script setup lang="ts">
/**
 * Feature cards — grid 2x3 com ícones lucide
 */
import { Building2, Dna, Layers, Plug, Search, Target } from 'lucide-vue-next'
import type { Component } from 'vue'

defineProps<{
  prefersReducedMotion: boolean
  isVisible: boolean
}>()

interface Feature {
  title: string
  description: string
  icon: Component
}

const features: Feature[] = [
  {
    title: 'Busca em segundos',
    description:
      'Erros de digitação viram "mutações" de DNA. Trocas como N↔M, S↔Z e dígitos 1↔0 são tratadas automaticamente.',
    icon: Search
  },
  {
    title: 'Algoritmo DNA-encoded',
    description:
      'Nomes, datas e filiação são codificados em nucleotídeos (A,T,C,G) e alinhados via BLASTn com Machine Learning.',
    icon: Dna
  },
  {
    title: 'Múltiplos setores',
    description:
      'Saúde, educação, epidemiologia e seguros. A mesma plataforma resolve duplicatas em qualquer base.',
    icon: Building2
  },
  {
    title: 'Integração via API',
    description:
      'API REST para integrar o Tucuxi ao seu pipeline. Envie bases, receba matches — sem interface.',
    icon: Plug
  },
  {
    title: 'Alta acurácia (>98%)',
    description:
      'Cada match é validado por Random Forest. Menos de 2% de erro — auditado com gold standard manual.',
    icon: Target
  },
  {
    title: 'Processamento em lote',
    description:
      '300M+ registros cruzados em horas. Sem cluster, sem cloud — no seu próprio servidor.',
    icon: Layers
  }
]
</script>

<template>
  <div id="features" class="relative z-20">
    <div
      class="mx-auto max-w-7xl hero-entrance hero-entrance-delay-4"
      :class="[
        prefersReducedMotion
          ? 'opacity-100'
          : isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
      ]"
    >
      <div
        class="grid grid-cols-1 divide-y divide-border/40 sm:grid-cols-2 md:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <!-- Linha 1 -->
        <div
          v-for="feature in features.slice(0, 3)"
          :key="feature.title"
          class="px-6 py-8 md:px-8 md:py-10"
        >
          <component
            :is="feature.icon"
            :size="20"
            :stroke-width="1.5"
            class="mb-3 text-muted-foreground"
          />
          <h3 class="mb-2 text-lg font-bold text-foreground">
            {{ feature.title }}
          </h3>
          <p class="text-sm leading-relaxed text-muted-foreground">
            {{ feature.description }}
          </p>
        </div>
      </div>

      <div class="h-px bg-border/40" />

      <div
        class="grid grid-cols-1 divide-y divide-border/40 sm:grid-cols-2 md:grid-cols-3 sm:divide-x sm:divide-y-0"
      >
        <!-- Linha 2 -->
        <div
          v-for="feature in features.slice(3)"
          :key="feature.title"
          class="px-6 py-8 md:px-8 md:py-10"
        >
          <component
            :is="feature.icon"
            :size="20"
            :stroke-width="1.5"
            class="mb-3 text-muted-foreground"
          />
          <h3 class="mb-2 text-lg font-bold text-foreground">
            {{ feature.title }}
          </h3>
          <p class="text-sm leading-relaxed text-muted-foreground">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
