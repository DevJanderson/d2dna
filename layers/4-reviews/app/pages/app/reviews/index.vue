<script setup lang="ts">
/**
 * Página de listagem de clientes para revisão
 * Stats + filtros + split view (cards | timeline)
 */
import type { ReviewSchema } from '~/layers/4-reviews/app/composables/types'
import { FileText } from 'lucide-vue-next'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth'
})

const router = useRouter()
const reviewStore = useReviewStore()
const windowManager = useWindowManager()

function openRelatorio() {
  const w = 700
  const h = 500
  windowManager.open({
    id: 'review-relatorio',
    title: 'Documentação',
    component: resolveComponent('ReviewRelatorio'),
    position: { x: Math.round((window.innerWidth - w) / 2), y: Math.round((window.innerHeight - h) / 2) },
    size: { width: w, height: h }
  })
}

onMounted(async () => {
  await Promise.all([reviewStore.fetchReviews(), reviewStore.fetchStats()])
})

function handleFilter(params: {
  nome?: string | null
  cpf?: string | null
  cns?: string | null
  data_nascimento?: string | null
}) {
  reviewStore.setFilters(params)
}

function handleClearFilters() {
  reviewStore.clearFilters()
}

function handleSelect(review: ReviewSchema) {
  reviewStore.selectReview(review)
  reviewStore.fetchHistory(review.uuid_cliente)
}

async function handleRevert(id: number) {
  await reviewStore.revertReview(id)
  if (reviewStore.selectedReview) {
    await reviewStore.fetchHistory(reviewStore.selectedReview.uuid_cliente)
  }
}

function handleAction() {
  if (reviewStore.selectedReview) {
    router.push(`/app/reviews/${reviewStore.selectedReview.uuid_cliente}`)
  }
}
</script>

<template>
  <div class="ml-20 h-full overflow-auto p-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-5">
      <div class="flex items-center justify-between">
        <h1 class="font-mono text-xl font-semibold">&gt; reviews_</h1>
        <button
          class="font-mono text-xl font-semibold opacity-70 transition-opacity hover:opacity-100"
          @click="openRelatorio"
        >
          Documentação <FileText class="inline h-5 w-5" :stroke-width="2" />
        </button>
      </div>

      <!-- Estatísticas -->
      <ReviewStatsBar :stats="reviewStore.stats" :is-loading="reviewStore.isLoadingReviews" />

      <!-- Filtros -->
      <div class="rounded-lg border bg-card p-4">
        <ReviewFilters @filter="handleFilter" @clear="handleClearFilters" />
      </div>

      <!-- Split: Cards + Timeline -->
      <div class="grid min-h-[520px] grid-cols-[400px_1fr] gap-5">
        <!-- Cards (esquerda) -->
        <div class="rounded-lg border bg-card">
          <ReviewCardList
            :reviews="reviewStore.reviews"
            :pagination="reviewStore.pagination"
            :selected-id="reviewStore.selectedReview?.id ?? null"
            :is-loading="reviewStore.isLoadingReviews"
            @select="handleSelect"
            @next-page="reviewStore.nextPage()"
            @prev-page="reviewStore.prevPage()"
          />
        </div>

        <!-- Timeline (direita) -->
        <div class="rounded-lg border bg-card">
          <div
            v-if="!reviewStore.selectedReview"
            class="flex h-full items-center justify-center"
          >
            <p class="font-mono text-sm text-muted-foreground">
              Selecione um cliente para ver a timeline
            </p>
          </div>

          <ReviewTimeline
            v-else
            :review="reviewStore.selectedReview"
            :history="reviewStore.history"
            :is-loading="reviewStore.isLoadingHistory"
            @revert="handleRevert"
            @action="handleAction"
          />
        </div>
      </div>

      <div v-if="reviewStore.error" class="font-mono text-sm text-destructive">
        [ERRO] {{ reviewStore.error }}
      </div>
    </div>
  </div>
</template>
