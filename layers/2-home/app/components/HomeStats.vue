<script setup lang="ts">
/**
 * Seção de estatísticas em Bento Grid com animação count-up
 * Cards de tamanhos variados com ASCII decorativo e parágrafo de contexto
 * Respeita prefers-reduced-motion: exibe valores finais sem animação
 */
import { useIntersectionObserver } from '@vueuse/core'

interface Stat {
  value: number
  suffix: string
  label: string
  context: string
  ascii: string
  span: string
  decimals?: number
  prefix?: string
}

const stats: Stat[] = [
  {
    value: 300,
    suffix: 'M+',
    label: 'registros cruzados e validados',
    context:
      'CadÚnico, SUS e bases estaduais reunidos. O maior teste de record linkage já publicado no Brasil.',
    ascii: '▁▂▃▅▇',
    span: 'md:col-span-2',
  },
  {
    value: 5.69,
    suffix: 'x',
    label: 'mais rápido que o padrão do mercado',
    decimals: 2,
    context:
      'Benchmarkado contra o Febrl, referência mundial. Mesma máquina, mesma base — quase 6x mais veloz.',
    ascii: '›››››',
    span: '',
  },
  {
    value: 98,
    suffix: '%',
    label: 'de acurácia nos vínculos',
    prefix: '>',
    context:
      'Cada match é validado por machine learning. Menos de 2% de erro — auditado com gold standard manual.',
    ascii: '████████░░',
    span: '',
  },
  {
    value: 23,
    suffix: 'h',
    label: 'para cruzar uma base nacional inteira',
    context:
      '200 mil pessoas encontradas em 300 milhões de registros — em menos de um dia, num servidor comum. Sem cluster, sem cloud.',
    ascii: '⏱ 23:00',
    span: 'md:col-span-2',
  },
]

const DURATION = 1500

const sectionRef = ref<HTMLElement | null>(null)
const hasAnimated = ref(false)
const displayValues = ref<string[]>(stats.map(() => '0'))

function easeOut(t: number): number {
  return 1 - (1 - t) ** 3
}

function formatValue(current: number, stat: Stat): string {
  if (stat.decimals && stat.decimals > 0) {
    return current.toFixed(stat.decimals)
  }
  return Math.round(current).toString()
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function showFinalValues() {
  displayValues.value = stats.map((stat) => formatValue(stat.value, stat))
}

let animationFrameId: number | null = null

function startCountUp() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  if (prefersReducedMotion()) {
    showFinalValues()
    return
  }

  const startTime = performance.now()

  function animate(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / DURATION, 1)
    const eased = easeOut(progress)

    displayValues.value = stats.map((stat) => {
      const current = eased * stat.value
      return formatValue(current, stat)
    })

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate)
    } else {
      animationFrameId = null
    }
  }

  animationFrameId = requestAnimationFrame(animate)
}

const { stop } = useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    if (entry?.isIntersecting && !hasAnimated.value) {
      startCountUp()
      stop()
    }
  },
  { threshold: 0.2 },
)

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <section
    ref="sectionRef"
    aria-labelledby="stats-heading"
    class="py-12 md:py-20 max-w-5xl mx-auto px-6"
  >
    <h2 id="stats-heading" class="sr-only">Estatísticas</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        v-for="(stat, index) in stats"
        :key="stat.label"
        class="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 md:p-8 transition-all duration-500 ease-out"
        :class="[
          stat.span,
          hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        ]"
        :style="{
          transitionDelay:
            hasAnimated || prefersReducedMotion() ? '0ms' : `${index * 150}ms`,
        }"
      >
        <!-- ASCII decorativo -->
        <span
          class="absolute top-4 right-4 font-mono text-xl text-muted-foreground/30 select-none"
          aria-hidden="true"
        >
          {{ stat.ascii }}
        </span>

        <!-- Número animado -->
        <div class="text-4xl md:text-5xl font-bold text-foreground mb-1">
          {{ stat.prefix }}{{ displayValues[index] }}{{ stat.suffix }}
        </div>

        <!-- Label -->
        <div class="text-sm font-medium text-foreground/80 mb-3">
          {{ stat.label }}
        </div>

        <!-- Contexto -->
        <p class="text-xs text-muted-foreground leading-relaxed">
          {{ stat.context }}
        </p>
      </div>
    </div>
  </section>
</template>
