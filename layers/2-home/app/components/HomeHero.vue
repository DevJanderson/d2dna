<script setup lang="ts">
/**
 * Hero section — headline técnica + terminal interativo
 */

// Cenários do terminal
interface TerminalScenario {
  lines: string[]
}

const scenarios: TerminalScenario[] = [
  {
    lines: [
      '$ tucuxi link --id 123.456.789-00',
      '',
      '[info] Convertendo para sequência DNA...',
      '[info] 3 registros em 2 bases (score: 0.997)',
      '',
      '✓ Registro unificado',
    ],
  },
  {
    lines: [
      '$ tucuxi search "Joao da Cilva"',
      '',
      '[info] Busca fonética + DNA...',
      '[match] João da Silva Souza (score: 0.943)',
      '',
      '✓ 1 correspondência encontrada',
    ],
  },
  {
    lines: [
      '$ tucuxi scan --base completa',
      '',
      '[warn] 12.847 duplicatas detectadas',
      '[fix] Resolvendo com algoritmo DNA...',
      '',
      '✓ 12.847/12.847 resolvidas',
    ],
  },
]

// Estado do terminal
const terminalLines = ref<string[]>([])
const showCursor = ref(true)

// Controle de timeouts para limpeza
const timeoutIds: ReturnType<typeof setTimeout>[] = []

function safeTimeout(fn: () => void, delay: number) {
  const id = setTimeout(fn, delay)
  timeoutIds.push(id)
  return id
}

function clearAllTimeouts() {
  timeoutIds.forEach(clearTimeout)
  timeoutIds.length = 0
}

// Typewriter: exibe linhas uma a uma com delay
function typeScenario(scenarioIndex: number) {
  const scenario = scenarios[scenarioIndex % scenarios.length]!
  terminalLines.value = []

  scenario.lines.forEach((line, i) => {
    safeTimeout(() => {
      terminalLines.value = [...terminalLines.value, line]
    }, i * 400)
  })

  // Após todas as linhas + 3s de pausa, iniciar próximo cenário
  const totalTime = scenario.lines.length * 400 + 3000
  safeTimeout(() => {
    typeScenario(scenarioIndex + 1)
  }, totalTime)
}

const props = defineProps<{
  prefersReducedMotion: boolean
  isVisible: boolean
}>()

onMounted(() => {
  if (props.prefersReducedMotion) {
    terminalLines.value = scenarios[0]!.lines
  } else {
    typeScenario(0)
  }
})

onUnmounted(() => {
  clearAllTimeouts()
})
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Hero principal — duas colunas -->
    <div class="mx-auto max-w-7xl px-6 pt-16 pb-12 md:pt-24 md:pb-20">
      <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <!-- Esquerda: Headline técnica + CTA -->
        <div
          class="hero-entrance hero-entrance-delay-1"
          :class="[
            prefersReducedMotion
              ? 'opacity-100'
              : isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8',
          ]"
        >
          <h1
            class="font-sans text-3xl font-bold tracking-tight text-foreground leading-[1.15] sm:text-4xl lg:text-5xl"
          >
            Registros duplicados custam milhões.<br />
            <span class="text-sky-500 dark:text-sky-400">Bioinformática resolve.</span>
          </h1>
          <p
            class="mt-6 max-w-lg font-sans text-lg text-muted-foreground leading-relaxed"
          >
            O Tucuxi deduplica bases nacionais em horas — não meses.
          </p>
          <div
            class="mt-8 hero-entrance hero-entrance-delay-2"
            :class="[
              prefersReducedMotion
                ? 'opacity-100'
                : isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4',
            ]"
          >
            <a
              href="#how-it-works-heading"
              class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Como Funciona &darr;
            </a>
          </div>
        </div>

        <!-- Direita: Terminal interativo -->
        <div
          class="hero-entrance hero-entrance-delay-3"
          :class="[
            prefersReducedMotion
              ? 'opacity-100'
              : isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8',
          ]"
          aria-hidden="true"
        >
          <!-- Stack de terminais — efeito cards empilhados -->
          <div class="terminal-stack">
            <!-- Ghost: fundo (3ª camada) -->
            <div class="terminal-ghost terminal-ghost-bottom" />
            <!-- Ghost: meio (2ª camada) -->
            <div class="terminal-ghost terminal-ghost-middle" />

            <!-- Terminal principal (1ª camada, em flow) -->
            <div
              class="terminal-outer relative z-30 overflow-hidden rounded-2xl shadow-[0_20px_70px_-10px_rgba(0,0,0,0.5)]"
            >
              <!-- Inner content — margem revela o outer como "borda" -->
              <div class="relative z-1 m-0.75 rounded-[13px] bg-[#09090b]">
                <!-- Header do terminal -->
                <div
                  class="flex items-center gap-2 border-b border-white/8 px-4 py-3"
                >
                  <span class="h-2.5 w-2.5 rounded-full bg-zinc-700 group-hover:bg-red-500/80 transition-colors" />
                  <span class="h-2.5 w-2.5 rounded-full bg-zinc-700 group-hover:bg-yellow-500/80 transition-colors" />
                  <span class="h-2.5 w-2.5 rounded-full bg-zinc-700 group-hover:bg-green-500/80 transition-colors" />
                  <span class="ml-auto font-mono text-[11px] text-zinc-600">tucuxi v2.0</span>
                </div>

                <!-- Corpo do terminal -->
                <div class="min-h-55 px-5 py-4 font-mono text-[13px] leading-relaxed">
                  <div
                    v-for="(line, index) in terminalLines"
                    :key="`${index}-${line}`"
                    class="terminal-line"
                  >
                    <span v-if="line === ''" class="block h-3.5" />
                    <span
                      v-else-if="line.startsWith('$')"
                      class="text-zinc-300"
                    >{{ line }}</span>
                    <span
                      v-else-if="line.startsWith('✓')"
                      class="font-semibold text-emerald-400"
                    >{{ line }}</span>
                    <span
                      v-else-if="line.startsWith('[warn]')"
                      class="text-amber-400/90"
                    >{{ line }}</span>
                    <span
                      v-else-if="
                        line.startsWith('[fix]') ||
                        line.startsWith('[link]') ||
                        line.startsWith('[match]')
                      "
                      class="text-sky-400"
                    >{{ line }}</span>
                    <span v-else class="text-emerald-400/70">{{ line }}</span>
                  </div>
                  <!-- Cursor piscando -->
                  <span
                    v-if="showCursor"
                    class="terminal-cursor inline-block text-emerald-400"
                  >&#9610;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Animação de entrada */
.hero-entrance {
  transition:
    opacity 1s ease-out,
    transform 1s ease-out;
}

.hero-entrance-delay-1 {
  transition-delay: 200ms;
}

.hero-entrance-delay-2 {
  transition-delay: 400ms;
}

.hero-entrance-delay-3 {
  transition-delay: 600ms;
}

/* Stack container — padding-bottom acomoda os ghost cards */
.terminal-stack {
  position: relative;
  padding-bottom: 28px;
}

/* Ghost cards — janelas empilhadas atrás do terminal */
.terminal-ghost {
  position: absolute;
  left: 0;
  width: 100%;
  height: calc(100% - 28px);
  border-radius: 1rem;
  background: #18181b;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.terminal-ghost-middle {
  z-index: 20;
  top: 14px;
  transform: scale(0.95);
  opacity: 0.7;
}

.terminal-ghost-bottom {
  z-index: 10;
  top: 28px;
  transform: scale(0.90);
  opacity: 0.4;
}

/* Uiverse.io glow border — outer bg = cor da borda */
.terminal-outer {
  background: linear-gradient(
    135deg,
    rgb(14, 165, 233),
    rgb(14, 165, 233),
    rgb(16, 185, 129),
    rgb(14, 165, 233)
  );
}

/* Cursor piscando do terminal */
.terminal-cursor {
  animation: cursor-blink 1s step-end infinite;
}

@keyframes cursor-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* Respeita preferência do usuário por menos movimento */
@media (prefers-reduced-motion: reduce) {
  .hero-entrance {
    transition: none;
  }

  .terminal-cursor {
    animation: none;
  }
}
</style>
