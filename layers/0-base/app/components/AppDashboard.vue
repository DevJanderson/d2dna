<script setup lang="ts">
/**
 * AppDashboard - Dashboard de boas-vindas quando não há janelas abertas
 * Mostra stats e cards das 4 ferramentas do ecossistema Tucuxi
 */

interface Stat {
  value: number
  suffix: string
  label: string
  ascii: string
  decimals?: number
  prefix?: string
}

const stats: Stat[] = [
  {
    value: 300,
    suffix: 'M+',
    label: 'registros cruzados',
    ascii: '▁▂▃▅▇'
  },
  {
    value: 5.69,
    suffix: 'x',
    label: 'mais rápido',
    decimals: 2,
    ascii: '›››››'
  },
  {
    value: 98,
    suffix: '%',
    label: 'acurácia',
    prefix: '>',
    ascii: '████████░░'
  },
  {
    value: 0.4,
    suffix: 'GB',
    label: 'de RAM',
    decimals: 1,
    ascii: '◂▸'
  }
]

const DURATION = 1500
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

function showFinalValues() {
  displayValues.value = stats.map(stat => formatValue(stat.value, stat))
}

let animationFrameId: number | null = null

const { prefersReducedMotion } = usePrefersReducedMotion()

onMounted(() => {
  if (prefersReducedMotion.value) {
    showFinalValues()
    hasAnimated.value = true
    return
  }

  const startTime = performance.now()
  hasAnimated.value = true

  function animate(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / DURATION, 1)
    const eased = easeOut(progress)

    displayValues.value = stats.map(stat => {
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
})

onUnmounted(() => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }
})

const tools = [
  {
    id: 'blast',
    title: 'Tucuxi-BLAST',
    description: 'Record linkage probabilístico via codificação DNA + BLAST + ML',
    ascii: [
      ' QUERY:',
      ' A T G C C A T G A C T G',
      ' | | | |   | | | | | | |',
      ' A T G C . A T G A C T G',
      ' SUBJECT:',
      '',
      ' Score: 95.2%  Gaps: 1',
      ' ═══════════════════════',
      ' E-value: 3e-42',
      ' Identity: 11/12 (91.6%)',
      '',
      ' [MATCH] ──▶ Random Forest'
    ]
  },
  {
    id: 'bw',
    title: 'Tucuxi-BW',
    description: 'Deduplicação de registros dentro de um mesmo banco de dados',
    ascii: [
      ' IN:  2.450.000 registros',
      ' ┌───────────────────────┐',
      ' │ JOSÉ DA SILVA    1975 │',
      ' │ JOSE D. SILVA    1975 │',
      ' │ JOSÉ SILVA       1975 │',
      ' └───────────────────────┘',
      '            │',
      '       ┌────▼────┐',
      '       │ VSEARCH │',
      '       └────┬────┘',
      '            │',
      ' OUT: 1.203.000 únicos'
    ]
  },
  {
    id: 'tail',
    title: 'Tucuxi-Tail',
    description: 'Curadoria manual visual dos resultados de linkage',
    ascii: [
      ' ┌─ CURADORIA ─────────┐',
      ' │ #  PAR       SCORE  │',
      ' │─────────────────────│',
      ' │ 1  A ↔ B     95%  ✓ │',
      ' │ 2  C ↔ D     87%  ✓ │',
      ' │▸3  E ↔ F     72%  ? │',
      ' │ 4  G ↔ H     61%  ? │',
      ' │ 5  I ↔ J     34%  ✗ │',
      ' ├─────────────────────┤',
      ' │ [APROVAR]  [REJEITAR│',
      ' └─────────────────────┘',
      '  ✓ 340   ? 28   ✗ 12'
    ]
  },
  {
    id: 'curumim',
    title: 'Tucuxi-Curumim',
    description: 'Gerador de bancos de dados simulados com nomes brasileiros',
    ascii: [
      ' $ curumim --size 300M',
      '',
      ' NOME         DN       MÃE',
      ' ──────────── ──────── ────────',
      ' JOÃO SILVA   12/03/80 MARIA',
      ' ANA COSTA    05/11/92 LUCIA',
      ' PEDRO SOUZA  28/07/75 ROSA',
      ' CARLA DIAS   14/09/88 JULIA',
      ' ···',
      '',
      ' ████████████████░░░░ 82%',
      ' 300.000.000 registros OK'
    ]
  }
]
</script>

<template>
  <div class="flex h-full flex-col p-8">
    <div class="flex flex-1 flex-col justify-center">
      <div class="mx-auto w-full max-w-5xl space-y-10">
        <!-- Headline -->
        <div class="text-center">
          <p class="text-sm text-muted-foreground">
            Tecnologia DNA aplicada a record linkage de grandes bases de dados
          </p>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            class="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-5 transition-all duration-500 ease-out"
            :class="hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
            :style="{ transitionDelay: hasAnimated ? '0ms' : `${index * 150}ms` }"
          >
            <span
              class="absolute top-3 right-3 font-mono text-lg text-muted-foreground/20 select-none"
              aria-hidden="true"
            >
              {{ stat.ascii }}
            </span>
            <div class="text-3xl font-bold text-foreground mb-0.5">
              {{ stat.prefix }}{{ displayValues[index] }}{{ stat.suffix }}
            </div>
            <div class="text-xs text-muted-foreground">
              {{ stat.label }}
            </div>
          </div>
        </div>

        <!-- Tool cards -->
        <TooltipProvider :delay-duration="300">
          <div class="grid grid-cols-2 gap-6 xl:grid-cols-4">
            <Tooltip v-for="tool in tools" :key="tool.id">
              <TooltipTrigger as-child>
                <div
                  class="flex h-full cursor-default flex-col overflow-hidden rounded-xl border bg-card shadow-sm"
                >
                  <!-- Área visual com ASCII art -->
                  <div
                    class="flex h-48 shrink-0 items-center justify-center overflow-hidden rounded-t-xl border-b bg-background"
                  >
                    <pre
                      class="select-none font-mono text-[10px] leading-[1.4] text-primary/50"
                    ><template v-for="(line, i) in tool.ascii" :key="i">{{ line }}
</template></pre>
                  </div>

                  <!-- Conteúdo -->
                  <div class="flex h-full flex-col gap-1 px-5 py-4">
                    <h3 class="font-mono text-sm font-semibold">
                      {{ tool.title }}
                    </h3>
                    <p class="text-xs text-muted-foreground">
                      {{ tool.description }}
                    </p>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Em construção</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>

    <!-- Rodapé fixo no bottom -->
    <p class="text-center text-xs text-muted-foreground/50 pt-4">
      D2DNA &copy; {{ new Date().getFullYear() }} &mdash; Tecnologia DNA para record linkage
    </p>
  </div>
</template>
