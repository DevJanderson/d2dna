<script setup lang="ts">
/**
 * ReviewHistory - Histórico de reviews de um cliente
 * Lista de revisões anteriores com opção de reverter
 */
import type { ReviewSchema } from '../composables/types'
import { RotateCcw } from 'lucide-vue-next'

interface Props {
  history: ReviewSchema[]
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  revert: [id: number]
}>()

function statusClass(status?: string | null): string {
  switch (status) {
    case 'aprovado':
      return 'text-green-500'
    case 'rejeitado':
      return 'text-red-500'
    case 'corrigido':
      return 'text-yellow-500'
    default:
      return 'text-muted-foreground'
  }
}
</script>

<template>
  <div class="space-y-3">
    <h3 class="font-mono text-sm font-semibold text-muted-foreground">&gt; histórico_</h3>

    <div v-if="isLoading" class="py-6 text-center font-mono text-sm text-muted-foreground">
      Carregando histórico...
    </div>

    <div
      v-else-if="history.length === 0"
      class="py-6 text-center font-mono text-sm text-muted-foreground"
    >
      Sem revisões anteriores
    </div>

    <div v-else class="max-h-[260px] space-y-2 overflow-auto">
      <div
        v-for="item in history"
        :key="item.id"
        class="flex items-start justify-between rounded-lg border px-3 py-2.5"
      >
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm font-medium" :class="statusClass(item.status)">
              {{ item.status || 'pendente' }}
            </span>
          </div>
          <p v-if="item.obs_review" class="mt-1 truncate text-sm text-muted-foreground">
            {{ item.obs_review }}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          class="ml-2 h-7 w-7 shrink-0 p-0"
          title="Reverter revisão"
          :disabled="isLoading"
          @click="emit('revert', item.id)"
        >
          <RotateCcw class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
