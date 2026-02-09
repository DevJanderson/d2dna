<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const { navigation } = useDocsNavigation()

const openGroups = ref<Record<string, boolean>>(
  Object.fromEntries(navigation.map(g => [g.title, true]))
)

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="space-y-1 py-4">
    <div v-for="group in navigation" :key="group.title" class="px-3">
      <Collapsible v-model:open="openGroups[group.title]">
        <CollapsibleTrigger
          class="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold text-foreground hover:bg-accent"
        >
          {{ group.title }}
          <ChevronRight
            class="h-4 w-4 text-muted-foreground transition-transform"
            :class="{ 'rotate-90': openGroups[group.title] }"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div class="ml-2 mt-1 space-y-0.5 pl-2">
            <NuxtLink
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="flex items-center rounded-md px-2 py-1.5 text-sm transition-colors"
              :class="
                isActive(item.path)
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              "
            >
              {{ item.title }}
            </NuxtLink>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </nav>
</template>
