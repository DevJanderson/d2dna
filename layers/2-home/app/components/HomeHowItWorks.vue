<script setup lang="ts">
/**
 * Seção "Como Funciona" — pipeline de 4 etapas em accordion
 * Estilo terminal/MX com números mono e ícones
 */
import { CloudDownload, Dna, GitCompareArrows, UserCheck } from 'lucide-vue-next'
import type { Component } from 'vue'

interface Step {
  id: string
  number: string
  title: string
  description: string
  detail: string
  icon: Component
}

const steps: Step[] = [
  {
    id: 'step-1',
    number: '01',
    title: 'Ingestão',
    description:
      'Conecte suas bases de dados — CSV, Excel ou API. O módulo Tucuxi-BW elimina duplicatas internas antes do cruzamento.',
    detail: 'Suporte a milhões de registros com uso mínimo de memória (0.4 GB)',
    icon: CloudDownload
  },
  {
    id: 'step-2',
    number: '02',
    title: 'Codificação DNA',
    description:
      'Cada registro é convertido em uma sequência de nucleotídeos. Erros de digitação são tratados como mutações naturais de DNA.',
    detail: 'A codificação muda a cada execução, criptografando os dados automaticamente',
    icon: Dna
  },
  {
    id: 'step-3',
    number: '03',
    title: 'Alinhamento + ML',
    description:
      'BLASTn alinha as sequências e Random Forest classifica os matches — tolerando variações de nome, data e grafia.',
    detail: '5.69x mais rápido que o estado da arte com 98%+ de acurácia',
    icon: GitCompareArrows
  },
  {
    id: 'step-4',
    number: '04',
    title: 'Registro Único',
    description:
      'Um cadastro consolidado e rastreável. Casos na zona cinzenta vão para curadoria humana via Tucuxi-Tail.',
    detail: 'Score > 95% resolve automaticamente — só o incerto precisa de revisão',
    icon: UserCheck
  }
]

const { sectionRef, isVisible } = useSectionVisibility()
const { prefersReducedMotion } = usePrefersReducedMotion()
</script>

<template>
  <section
    id="how-it-works"
    ref="sectionRef"
    aria-labelledby="how-it-works-heading"
    class="w-full max-w-7xl mx-auto px-6 py-12 md:py-20"
  >
    <h2
      id="how-it-works-heading"
      class="mb-4 text-center font-mono text-3xl font-bold text-foreground transition-all duration-700 ease-out"
      :class="
        isVisible || prefersReducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      "
    >
      Como Funciona
    </h2>
    <p
      class="mx-auto mb-12 max-w-xl text-center text-base text-muted-foreground transition-all duration-700 ease-out delay-100"
      :class="
        isVisible || prefersReducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      "
    >
      Bioinformática aplicada a record linkage. De dados fragmentados a um cadastro único em 4
      etapas.
    </p>

    <div
      class="mx-auto max-w-2xl transition-all duration-700 ease-out delay-200"
      :class="
        isVisible || prefersReducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-6'
      "
    >
      <Accordion type="single" collapsible default-value="step-1">
        <AccordionItem
          v-for="step in steps"
          :key="step.id"
          :value="step.id"
          class="border-border/40"
        >
          <AccordionTrigger class="gap-3 py-5 hover:no-underline">
            <div class="flex items-center gap-3">
              <span
                class="font-mono text-xs text-muted-foreground/50 tabular-nums"
                aria-hidden="true"
              >
                {{ step.number }}
              </span>
              <component
                :is="step.icon"
                :size="18"
                :stroke-width="1.5"
                class="shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span class="text-left text-base font-bold text-foreground">{{ step.title }}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div class="pb-2 pl-17">
              <p class="text-base leading-relaxed text-muted-foreground">
                {{ step.description }}
              </p>
              <p class="mt-2 font-mono text-sm text-muted-foreground/70">
                {{ step.detail }}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </section>
</template>
