<script setup lang="ts">
/**
 * ReviewStatsBar - Cards de estatísticas de revisão
 * Total, Pendentes, Aprovados, Rejeitados, Taxa de aprovação
 */
import type { ReviewStats } from '../composables/types'
import { BarChart3, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-vue-next'

interface Props {
  stats: ReviewStats | null
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

interface PadParts {
  zeros: string
  value: string
}

function padParts(n: number, len = 4): PadParts {
  const str = String(n)
  const padLen = Math.max(0, len - str.length)
  return { zeros: '0'.repeat(padLen), value: str }
}

function rateParts(s: ReviewStats): PadParts {
  const revisados = s.aprovados + s.rejeitados + s.corrigidos
  if (revisados === 0) return { zeros: '——.—', value: '%' }
  const rate = ((s.aprovados / revisados) * 100).toFixed(1)
  return { zeros: '', value: `${rate}%` }
}

const cards = computed(() => {
  return [
    {
      label: 'Total',
      icon: BarChart3,
      color: 'text-foreground',
      bgColor: 'bg-muted',
      value: (s: ReviewStats) => padParts(s.total)
    },
    {
      label: 'Pendentes',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
      value: (s: ReviewStats) => padParts(s.pendentes)
    },
    {
      label: 'Aprovados',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      value: (s: ReviewStats) => padParts(s.aprovados)
    },
    {
      label: 'Rejeitados',
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-500/10',
      value: (s: ReviewStats) => padParts(s.rejeitados)
    },
    {
      label: 'Taxa aprov.',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      value: (s: ReviewStats) => rateParts(s)
    }
  ]
})
</script>

<template>
  <div class="grid grid-cols-5 gap-4">
    <div v-for="card in cards" :key="card.label" class="rounded-lg border bg-card p-4">
      <div v-if="isLoading" class="animate-pulse space-y-3">
        <div class="h-4 w-20 rounded bg-muted" />
        <div class="h-7 w-14 rounded bg-muted" />
      </div>

      <template v-else>
        <div class="flex items-center gap-2">
          <div class="rounded-md p-1.5" :class="card.bgColor">
            <component :is="card.icon" class="h-4 w-4" :class="card.color" :stroke-width="2" />
          </div>
          <span class="font-mono text-xs text-muted-foreground">{{ card.label }}</span>
        </div>
        <p class="mt-2 font-mono text-xl font-semibold">
          <template v-if="!stats">
            <span class="opacity-20">0000</span>
          </template>
          <template v-else>
            <span class="opacity-20">{{ card.value(stats).zeros }}</span
            ><span :class="card.color">{{ card.value(stats).value }}</span>
          </template>
        </p>
      </template>
    </div>
  </div>
</template>
