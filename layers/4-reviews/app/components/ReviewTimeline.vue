<script setup lang="ts">
/**
 * ReviewTimeline - Timeline vertical de dados e histórico de um cliente
 * Mostra dados do cliente no topo + eventos de revisão em linha do tempo
 */
import type { ReviewSchema } from '../composables/types'
import { CheckCircle, XCircle, Pencil, Clock, RotateCcw } from 'lucide-vue-next'

interface Props {
  review: ReviewSchema
  history: ReviewSchema[]
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  revert: [id: number]
  action: []
}>()

function statusIcon(status?: string | null) {
  switch (status) {
    case 'aprovado':
      return CheckCircle
    case 'rejeitado':
      return XCircle
    case 'corrigido':
      return Pencil
    default:
      return Clock
  }
}
</script>

<template>
  <div class="flex h-full flex-col overflow-auto p-5">
    <!-- Dados do cliente -->
    <div class="mb-5">
      <h3 class="mb-3 font-mono text-xs font-semibold text-muted-foreground">&gt; dados_cliente_</h3>
      <div class="grid grid-cols-3 gap-x-5 gap-y-3">
        <div>
          <span class="font-mono text-xs text-muted-foreground">Nome</span>
          <p class="text-sm font-medium">{{ review.nome }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">Nascimento</span>
          <p class="font-mono text-sm">{{ formatDate(review.data_nascimento) }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">Sexo</span>
          <p class="text-sm">{{ review.sexo || '—' }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">CPF</span>
          <p class="font-mono text-sm">{{ review.cpf || '—' }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">CNS</span>
          <p class="font-mono text-sm">{{ review.cns || '—' }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">Nome da mãe</span>
          <p class="truncate text-sm">{{ review.nome_mae || '—' }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">Origem</span>
          <p class="font-mono text-sm">{{ review.id_origem || '—' }}</p>
        </div>
        <div>
          <span class="font-mono text-xs text-muted-foreground">Status</span>
          <p class="font-mono text-sm">{{ review.status || 'pendente' }}</p>
        </div>
      </div>

      <div v-if="review.obs_review" class="mt-3 rounded-md bg-muted/50 p-3">
        <span class="font-mono text-xs text-muted-foreground">Observação</span>
        <p class="mt-1 text-sm">{{ review.obs_review }}</p>
      </div>
    </div>

    <div class="my-3 h-px bg-border" />

    <!-- Timeline -->
    <div class="flex-1">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-mono text-xs font-semibold text-muted-foreground">&gt; timeline_</h3>
        <Button
          size="default"
          class="h-8 font-mono text-sm"
          @click="emit('action')"
        >
          Nova ação
        </Button>
      </div>

      <div v-if="isLoading" class="py-8 text-center font-mono text-sm text-muted-foreground">
        Carregando timeline...
      </div>

      <div
        v-else-if="history.length === 0"
        class="py-8 text-center font-mono text-sm text-muted-foreground"
      >
        Sem revisões anteriores para este cliente
      </div>

      <!-- Eventos da timeline -->
      <div v-else class="relative space-y-0">
        <div
          v-for="(item, index) in history"
          :key="item.id"
          class="relative flex gap-4 pb-6"
        >
          <!-- Linha vertical -->
          <div class="flex flex-col items-center">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              :class="statusColor(item.status)"
            >
              <component :is="statusIcon(item.status)" class="h-4 w-4" :stroke-width="2" />
            </div>
            <div
              v-if="index < history.length - 1"
              class="mt-1 w-0.5 flex-1"
              :class="statusLineColor(item.status)"
            />
          </div>

          <!-- Conteúdo do evento -->
          <div class="min-w-0 flex-1 pt-1">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="font-mono text-sm font-medium">
                  {{ item.status || 'pendente' }}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                class="h-7 w-7 shrink-0 p-0 text-muted-foreground hover:text-foreground"
                title="Reverter revisão"
                @click="emit('revert', item.id)"
              >
                <RotateCcw class="h-4 w-4" />
              </Button>
            </div>
            <p
              v-if="item.obs_review"
              class="mt-1 text-sm text-muted-foreground"
            >
              {{ item.obs_review }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
