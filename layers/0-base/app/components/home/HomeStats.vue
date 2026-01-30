<script setup lang="ts">
/**
 * Seção de estatísticas/números
 * Exibe métricas de impacto no estilo terminal
 */

const stats = [
  { value: '500M+', label: 'registros processados', icon: '█████████░' },
  { value: '9+', label: 'parceiros', icon: '◈ ◈ ◈ ◈ ◈ ◈ ◈ ◈ ◈' },
  { value: '99.9%', label: 'precisao', icon: '▓▓▓▓▓▓▓▓▓▓' },
  { value: '4', label: 'setores atendidos', icon: '◆ ◆ ◆ ◆' }
]
</script>

<template>
  <section aria-labelledby="stats-heading" class="my-12 md:my-16">
    <h2 id="stats-heading" class="sr-only">Estatisticas</h2>

    <!-- Borda ASCII superior -->
    <pre class="text-xs text-muted-foreground/50 select-none mb-4 text-center" aria-hidden="true">┌──────────────────────────────────────────────────────────────┐</pre>

    <p class="text-xs text-muted-foreground mb-8 text-center">&gt; numeros</p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 px-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="text-center space-y-4"
      >
        <!-- Indicador ASCII -->
        <div class="text-xs text-primary/50 font-mono" aria-hidden="true">
          {{ stat.icon }}
        </div>

        <!-- Valor -->
        <div class="text-4xl md:text-5xl font-bold text-foreground">
          {{ stat.value }}
        </div>

        <!-- Label -->
        <div class="text-sm text-muted-foreground">
          &gt; {{ stat.label }}
        </div>
      </div>
    </div>

    <!-- Borda ASCII inferior -->
    <pre class="text-xs text-muted-foreground/50 select-none mt-8 text-center" aria-hidden="true">└──────────────────────────────────────────────────────────────┘</pre>
  </section>
</template>
