<script setup lang="ts">
/**
 * ReviewList - Tabela de clientes para curadoria
 * Exibe lista paginada com cursor-based pagination
 */
import type { ReviewSchema, PaginationMeta } from '../composables/types'

interface Props {
  reviews: ReviewSchema[]
  pagination: PaginationMeta
  isLoading?: boolean
}

withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  select: [review: ReviewSchema]
  'next-page': []
  'prev-page': []
}>()

function formatDate(date?: string | null): string {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('pt-BR')
}

function formatCpf(cpf?: string | null): string {
  if (!cpf) return '—'
  return cpf
}

function statusLabel(status?: string | null): string {
  if (!status) return 'pendente'
  return status
}

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
  <div class="flex h-full flex-col">
    <!-- Tabela -->
    <div class="flex-1 overflow-auto">
      <table class="w-full text-xs">
        <thead class="sticky top-0 bg-background">
          <tr class="border-b font-mono text-muted-foreground">
            <th class="px-2 py-1.5 text-left">Nome</th>
            <th class="px-2 py-1.5 text-left">Nasc.</th>
            <th class="px-2 py-1.5 text-left">CPF</th>
            <th class="px-2 py-1.5 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoading" class="border-b">
            <td colspan="4" class="px-2 py-4 text-center font-mono text-muted-foreground">
              Carregando...
            </td>
          </tr>
          <tr v-else-if="reviews.length === 0" class="border-b">
            <td colspan="4" class="px-2 py-4 text-center font-mono text-muted-foreground">
              Nenhum cliente encontrado
            </td>
          </tr>
          <tr
            v-for="review in reviews"
            v-else
            :key="review.id"
            class="cursor-pointer border-b transition-colors hover:bg-muted/50"
            @click="emit('select', review)"
          >
            <td class="max-w-[120px] truncate px-2 py-1.5">{{ review.nome }}</td>
            <td class="whitespace-nowrap px-2 py-1.5 font-mono">
              {{ formatDate(review.data_nascimento) }}
            </td>
            <td class="whitespace-nowrap px-2 py-1.5 font-mono">
              {{ formatCpf(review.cpf) }}
            </td>
            <td class="px-2 py-1.5 font-mono" :class="statusClass(review.status)">
              {{ statusLabel(review.status) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div class="flex items-center justify-between border-t px-2 py-2">
      <Button
        variant="ghost"
        size="sm"
        :disabled="!pagination.has_previous || isLoading"
        class="font-mono text-xs"
        @click="emit('prev-page')"
      >
        &lt; Anterior
      </Button>
      <Button
        variant="ghost"
        size="sm"
        :disabled="!pagination.has_next || isLoading"
        class="font-mono text-xs"
        @click="emit('next-page')"
      >
        Próximo &gt;
      </Button>
    </div>
  </div>
</template>
