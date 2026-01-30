<script setup lang="ts">
/**
 * Card de membro da equipe
 * Exibe foto com blob SVG e informações
 */

interface Props {
  name: string
  role: string
  image: string
  color: 'green' | 'blue' | 'amber' | 'fuchsia' | 'indigo' | 'orange'
}

defineProps<Props>()

// Classes dinâmicas por cor
const colorClasses = {
  green: {
    blob: 'text-green-200 dark:text-green-900/50',
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300'
  },
  blue: {
    blob: 'text-blue-200 dark:text-blue-900/50',
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-700 dark:text-blue-300'
  },
  amber: {
    blob: 'text-amber-200 dark:text-amber-900/50',
    bg: 'bg-amber-100 dark:bg-amber-900',
    text: 'text-amber-700 dark:text-amber-300'
  },
  fuchsia: {
    blob: 'text-fuchsia-200 dark:text-fuchsia-900/50',
    bg: 'bg-fuchsia-100 dark:bg-fuchsia-900',
    text: 'text-fuchsia-700 dark:text-fuchsia-300'
  },
  indigo: {
    blob: 'text-indigo-200 dark:text-indigo-900/50',
    bg: 'bg-indigo-100 dark:bg-indigo-900',
    text: 'text-indigo-700 dark:text-indigo-300'
  },
  orange: {
    blob: 'text-orange-200 dark:text-orange-900/50',
    bg: 'bg-orange-100 dark:bg-orange-900',
    text: 'text-orange-700 dark:text-orange-300'
  }
}
</script>

<template>
  <div class="relative z-20 h-44">
    <!-- Blob SVG -->
    <svg
      class="absolute top-0 left-0 w-48 h-40"
      :class="colorClasses[color].blob"
      viewBox="0 0 288 199"
      fill="currentColor"
    >
      <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
    </svg>

    <!-- Avatar -->
    <div
      class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg"
      :class="colorClasses[color].bg"
    >
      <img :src="image" :alt="name" class="w-full h-full object-cover" />
    </div>

    <!-- Info -->
    <div class="absolute top-8 left-36 text-left">
      <p class="text-lg font-bold" :class="colorClasses[color].text">
        {{ name }}
      </p>
      <p class="text-sm text-muted-foreground">{{ role }}</p>
    </div>
  </div>
</template>
