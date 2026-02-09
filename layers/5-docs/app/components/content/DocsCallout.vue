<script setup lang="ts">
import { Lightbulb, Info, AlertTriangle, XCircle } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    type?: 'tip' | 'info' | 'warning' | 'danger'
    title?: string
  }>(),
  {
    type: 'info',
    title: undefined
  }
)

const config = computed(() => {
  const configs = {
    tip: {
      icon: Lightbulb,
      defaultTitle: 'Dica',
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/5',
      iconColor: 'text-emerald-500'
    },
    info: {
      icon: Info,
      defaultTitle: 'Info',
      border: 'border-blue-500/50',
      bg: 'bg-blue-500/5',
      iconColor: 'text-blue-500'
    },
    warning: {
      icon: AlertTriangle,
      defaultTitle: 'Atenção',
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/5',
      iconColor: 'text-amber-500'
    },
    danger: {
      icon: XCircle,
      defaultTitle: 'Perigo',
      border: 'border-red-500/50',
      bg: 'bg-red-500/5',
      iconColor: 'text-red-500'
    }
  }
  return configs[props.type]
})

const displayTitle = computed(() => props.title ?? config.value.defaultTitle)
</script>

<template>
  <div class="my-4 rounded-lg border-l-4 p-4" :class="[config.border, config.bg]" role="note">
    <div class="flex items-center gap-2 font-semibold">
      <component :is="config.icon" class="h-4 w-4 shrink-0" :class="config.iconColor" />
      <span class="text-sm">{{ displayTitle }}</span>
    </div>
    <div class="mt-2 text-sm [&>p]:m-0">
      <slot />
    </div>
  </div>
</template>
