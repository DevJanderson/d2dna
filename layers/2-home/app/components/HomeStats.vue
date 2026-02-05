<script setup lang="ts">
/**
 * Seção de estatísticas/números
 * Layout limpo com divisórias verticais (estilo Anytype)
 */

const stats = [
  { value: '500M+', label: 'registros processados' },
  { value: '9+', label: 'parceiros' },
  { value: '99.9%', label: 'precisão' },
  { value: '4', label: 'setores atendidos' }
]
</script>

<template>
  <section aria-labelledby="stats-heading" class="my-16 md:my-24">
    <h2 id="stats-heading" class="sr-only">Estatísticas</h2>

    <div class="border-y border-border/40">
      <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/40">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="px-6 py-10 md:py-14 text-center"
        >
          <div class="text-4xl md:text-5xl font-bold text-foreground mb-2">
            {{ stat.value }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
