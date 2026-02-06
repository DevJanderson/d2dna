<script setup lang="ts">
/**
 * Seção de estatísticas com animação count-up
 * Números animam de 0 ao valor final quando a seção entra no viewport
 * Respeita prefers-reduced-motion: exibe valores finais sem animação
 */
import { useIntersectionObserver } from '@vueuse/core'

interface Stat {
  value: number
  suffix: string
  label: string
  decimals?: number
  prefix?: string
}

const stats: Stat[] = [
  { value: 500, suffix: 'M+', label: 'registros processados' },
  { value: 15, suffix: '+', label: 'anos de pesquisa' },
  { value: 4, suffix: '', label: 'setores atendidos' },
  { value: 1, suffix: '%', label: 'taxa de falsos positivos', prefix: '<' },
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
    class="my-10 md:my-16 transition-all duration-700 ease-out"
    :class="hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <h2 id="stats-heading" class="sr-only">Estatísticas</h2>

    <div class="border-y border-border/40">
      <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="px-6 py-10 md:py-14 text-center"
        >
          <div class="text-4xl md:text-5xl font-bold text-foreground mb-2">
            {{ stat.prefix }}{{ displayValues[index] }}{{ stat.suffix }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
