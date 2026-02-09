<script setup lang="ts">
const props = defineProps<{
  title: string
  icon?: string
  href?: string
}>()

const tag = computed(() => (props.href ? resolveComponent('NuxtLink') : 'div'))
const linkProps = computed(() => (props.href ? { to: props.href } : {}))
</script>

<template>
  <component
    :is="tag"
    v-bind="linkProps"
    class="group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
  >
    <div class="flex items-start gap-3">
      <Icon v-if="icon" :name="icon" class="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
      <div>
        <h3 class="text-sm font-semibold text-foreground group-hover:text-primary">
          {{ title }}
        </h3>
        <div class="mt-1 text-sm text-muted-foreground">
          <slot />
        </div>
      </div>
    </div>
  </component>
</template>
