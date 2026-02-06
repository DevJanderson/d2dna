<script setup lang="ts">
/**
 * Seção "Como Funciona" — pipeline de 4 etapas
 * Animação com Intersection Observer (respeita prefers-reduced-motion)
 */
import { useIntersectionObserver } from '@vueuse/core'
import { CloudDownload, Fingerprint, Merge, CircleCheckBig } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Step {
  number: string
  title: string
  description: string
  icon: Component
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Ingestão',
    description: 'Conectamos suas bases — CSV, Excel ou API. O Tucuxi-BW limpa duplicatas internas antes do linkage.',
    icon: CloudDownload,
  },
  {
    number: '02',
    title: 'Conversão DNA',
    description: 'Cada registro vira uma sequência de nucleotídeos via roda de códons — que muda a cada execução, criptografando os dados.',
    icon: Fingerprint,
  },
  {
    number: '03',
    title: 'Linkage',
    description: 'BLASTn alinha as sequências e Random Forest classifica os matches com 98%+ de acurácia.',
    icon: Merge,
  },
  {
    number: '04',
    title: 'Registro Único',
    description: 'Um cadastro consolidado e rastreável. Casos na zona cinzenta vão para curadoria humana via Tucuxi-Tail.',
    icon: CircleCheckBig,
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
  { threshold: 0.2 },
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
    ref="sectionRef"
    aria-labelledby="how-it-works-heading"
    class="my-10 md:my-16 max-w-7xl mx-auto px-6"
  >
    <h2
      id="how-it-works-heading"
      class="text-2xl font-bold text-center mb-12 text-foreground transition-all duration-700 ease-out"
      :class="isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
    >
      Como Funciona
    </h2>

    <ol class="how-steps">
      <li
        v-for="(step, index) in steps"
        :key="step.number"
        class="how-step"
        :class="{
          'how-step--visible': isVisible || prefersReducedMotion,
        }"
        :style="{ transitionDelay: stepDelay(index) }"
      >
        <!-- Conector vertical (mobile) / horizontal (desktop) -->
        <div
          v-if="index > 0"
          class="how-connector"
          aria-hidden="true"
        />

        <div class="how-card">
          <span class="font-mono text-xs text-muted-foreground/60">
            {{ step.number }}
          </span>

          <!-- Ícone Lucide -->
          <div class="how-icon" aria-hidden="true">
            <component :is="step.icon" :size="36" :stroke-width="1.5" />
          </div>

          <h3 class="text-base font-bold text-foreground">
            {{ step.title }}
          </h3>

          <p class="text-sm text-muted-foreground leading-relaxed">
            {{ step.description }}
          </p>
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
  opacity: 0;
  transform: translateY(16px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.how-step--visible {
  opacity: 1;
  transform: translateY(0);
}

.how-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  max-width: 220px;
}

.how-icon {
  color: var(--color-sky-500, #0ea5e9);
}

.how-connector {
  width: 1px;
  height: 2rem;
  border-left: 2px dashed var(--color-border-40, hsl(0 0% 50% / 0.4));
  margin: 0.25rem 0;
}

@media (min-width: 768px) {
  .how-steps {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }

  .how-step {
    flex-direction: row;
    align-items: flex-start;
    transform: translateY(16px);
  }

  .how-step--visible {
    transform: translateY(0);
  }

  .how-connector {
    width: 3rem;
    height: auto;
    border-left: none;
    border-top: 2px dashed var(--color-border-40, hsl(0 0% 50% / 0.4));
    margin: 0;
    align-self: center;
    margin-top: 1.5rem;
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
