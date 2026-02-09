<script setup lang="ts">
/**
 * ReviewCardList - Lista de cards de clientes para curadoria
 * Card selecionável com nome, dados do cliente e status
 */
import type { ReviewSchema, PaginationMeta } from '../composables/types'
import { User } from 'lucide-vue-next'

interface Props {
  reviews: ReviewSchema[]
  pagination: PaginationMeta
  selectedId?: number | null
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  selectedId: null,
  isLoading: false
})

const emit = defineEmits<{
  select: [review: ReviewSchema]
  'next-page': []
  'prev-page': []
}>()
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- Cards -->
    <div class="flex-1 space-y-2.5 overflow-auto p-4">
      <div v-if="isLoading" class="py-10 text-center font-mono text-sm text-muted-foreground">
        Carregando...
      </div>

      <div
        v-else-if="reviews.length === 0"
        class="py-10 text-center font-mono text-sm text-muted-foreground"
      >
        Nenhum cliente encontrado
      </div>

      <button
        v-for="review in reviews"
        v-else
        :key="review.id"
        class="flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors"
        :class="selectedId === review.id
          ? 'border-primary bg-primary/5'
          : 'hover:bg-muted/50'"
        @click="emit('select', review)"
      >
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <User class="h-5 w-5 text-muted-foreground" :stroke-width="1.75" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <p class="truncate text-sm font-medium">{{ review.nome }}</p>
            <span
              class="shrink-0 rounded-full px-2.5 py-1 font-mono text-xs font-medium"
              :class="statusColor(review.status)"
            >
              {{ statusLabel(review.status) }}
            </span>
          </div>
          <div class="mt-1 flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span>{{ formatDate(review.data_nascimento) }}</span>
            <span v-if="review.sexo">{{ review.sexo }}</span>
            <span v-if="review.cpf">CPF {{ review.cpf }}</span>
            <span v-else-if="review.cns">CNS {{ review.cns }}</span>
            <span v-if="review.id_origem">org:{{ review.id_origem }}</span>
          </div>
          <p
            v-if="review.obs_review"
            class="mt-1.5 truncate text-xs text-muted-foreground/70"
          >
            {{ review.obs_review }}
          </p>
        </div>
      </button>
    </div>

    <!-- Paginação -->
    <div class="flex items-center justify-between border-t px-4 py-3">
      <Button
        variant="ghost"
        size="default"
        :disabled="!pagination.has_previous || isLoading"
        class="font-mono text-sm"
        @click="emit('prev-page')"
      >
        &lt; Anterior
      </Button>
      <Button
        variant="ghost"
        size="default"
        :disabled="!pagination.has_next || isLoading"
        class="font-mono text-sm"
        @click="emit('next-page')"
      >
        Próximo &gt;
      </Button>
    </div>
  </div>
</template>
