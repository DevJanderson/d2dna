<script setup lang="ts">
/**
 * Card de membro da equipe
 * Layout centrado com avatar, nome e cargo
 */

interface Props {
  name: string
  role: string
  image: string
  color: 'green' | 'blue' | 'amber' | 'fuchsia' | 'indigo' | 'orange'
}

defineProps<Props>()

const colorClasses = {
  green: 'ring-green-300 dark:ring-green-700',
  blue: 'ring-blue-300 dark:ring-blue-700',
  amber: 'ring-amber-300 dark:ring-amber-700',
  fuchsia: 'ring-fuchsia-300 dark:ring-fuchsia-700',
  indigo: 'ring-indigo-300 dark:ring-indigo-700',
  orange: 'ring-orange-300 dark:ring-orange-700'
}
</script>

<template>
  <div class="group flex flex-col items-center text-center py-8">
    <!-- Avatar -->
    <div
      class="w-20 h-20 rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background mb-4 transition-shadow duration-300 group-hover:ring-4"
      :class="colorClasses[color]"
    >
      <NuxtImg
        :src="image"
        :alt="`Foto de ${name}, ${role}`"
        loading="lazy"
        format="webp"
        quality="80"
        width="80"
        height="80"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Info -->
    <p class="text-sm font-bold text-foreground mb-0.5">{{ name }}</p>
    <p class="text-xs text-muted-foreground">{{ role }}</p>
  </div>
</template>
