<script setup lang="ts">
/**
 * Seção "Como Funciona" — pipeline de 4 etapas
 * Layout: timeline vertical com cards amplos
 * Animação com Intersection Observer (respeita prefers-reduced-motion)
 */
import { useIntersectionObserver } from '@vueuse/core'
import { CloudDownload, Dna, GitCompareArrows, UserCheck } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Step {
  number: string
  title: string
  description: string
  detail: string
  icon: Component
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Ingestão',
    description:
      'Conecte suas bases de dados — CSV, Excel ou API. O módulo Tucuxi-BW elimina duplicatas internas antes do cruzamento.',
    detail: 'Suporte a milhões de registros com uso mínimo de memória (0.4 GB)',
    icon: CloudDownload,
  },
  {
    number: '02',
    title: 'Codificação DNA',
    description:
      'Cada registro é convertido em uma sequência de nucleotídeos. Erros de digitação são tratados como mutações naturais de DNA.',
    detail: 'A codificação muda a cada execução, criptografando os dados automaticamente',
    icon: Dna,
  },
  {
    number: '03',
    title: 'Alinhamento + ML',
    description:
      'BLASTn alinha as sequências e Random Forest classifica os matches — tolerando variações de nome, data e grafia.',
    detail: '5.69x mais rápido que o estado da arte com 98%+ de acurácia',
    icon: GitCompareArrows,
  },
  {
    number: '04',
    title: 'Registro Único',
    description:
      'Um cadastro consolidado e rastreável. Casos na zona cinzenta vão para curadoria humana via Tucuxi-Tail.',
    detail: 'Score > 95% resolve automaticamente — só o incerto precisa de revisão',
    icon: UserCheck,
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  sectionRef,
  (entries) => {
    if (entries[0]?.isIntersecting) {
      isVisible.value = true
    }
  },
  { threshold: 0.15 },
)

const prefersReducedMotion = ref(false)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function stepDelay(index: number): string {
  if (prefersReducedMotion.value) return '0ms'
  return `${index * 150}ms`
}
</script>

<template>
  <section
    id="how-it-works"
    ref="sectionRef"
    aria-labelledby="how-it-works-heading"
    class="py-12 md:py-20 max-w-5xl mx-auto px-6"
  >
    <h2
      id="how-it-works-heading"
      class="text-2xl font-bold text-center mb-4 text-foreground transition-all duration-700 ease-out"
      :class="isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
    >
      Como Funciona
    </h2>
    <p
      class="text-center text-muted-foreground mb-12 text-sm max-w-xl mx-auto transition-all duration-700 ease-out delay-100"
      :class="isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
    >
      Bioinformática aplicada a record linkage. De dados fragmentados a um cadastro único em 4 etapas.
    </p>

    <ol class="how-steps">
      <li
        v-for="(step, index) in steps"
        :key="step.number"
        class="how-step"
        :class="{ 'how-step--visible': isVisible || prefersReducedMotion }"
        :style="{ transitionDelay: stepDelay(index) }"
      >
        <!-- Conector vertical -->
        <div v-if="index > 0" class="how-connector" aria-hidden="true">
          <div class="how-connector__line" />
        </div>

        <div class="how-card">
          <!-- Esquerda: número + ícone -->
          <div class="how-card__icon-col">
            <span class="how-card__number">{{ step.number }}</span>
            <div class="how-card__icon" aria-hidden="true">
              <component :is="step.icon" :size="28" :stroke-width="1.5" />
            </div>
          </div>

          <!-- Direita: texto -->
          <div class="how-card__content">
            <h3 class="how-card__title">
              {{ step.title }}
            </h3>
            <p class="how-card__description">
              {{ step.description }}
            </p>
            <p class="how-card__detail">
              {{ step.detail }}
            </p>
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.how-steps {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.how-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 540px;
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.how-step--visible {
  opacity: 1;
  transform: translateY(0);
}

/* ===== Conector ===== */
.how-connector {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 2.5rem;
  padding-left: 2rem;
}

.how-connector__line {
  width: 1px;
  height: 100%;
  background: repeating-linear-gradient(
    to bottom,
    var(--color-border) 0,
    var(--color-border) 4px,
    transparent 4px,
    transparent 8px
  );
  opacity: 0.6;
}

/* ===== Card ===== */
.how-card {
  display: flex;
  gap: 1.25rem;
  width: 100%;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background-color: var(--color-card);
  transition: border-color 200ms ease;
}

@media (hover: hover) {
  .how-card:hover {
    border-color: color-mix(in oklch, var(--color-foreground) 20%, transparent);
  }
}

/* ===== Ícone + número ===== */
.how-card__icon-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  padding-top: 0.125rem;
}

.how-card__number {
  font-family: var(--font-mono, monospace);
  font-size: 0.625rem;
  color: var(--color-muted-foreground);
  opacity: 0.5;
}

.how-card__icon {
  color: var(--color-muted-foreground);
}

/* ===== Conteúdo ===== */
.how-card__content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.how-card__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-foreground);
  line-height: 1.4;
}

.how-card__description {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
  line-height: 1.6;
}

.how-card__detail {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
  opacity: 0.7;
  line-height: 1.5;
}

/* ===== Responsivo ===== */
@media (min-width: 640px) {
  .how-card {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .how-connector {
    padding-left: 2.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .how-step {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
