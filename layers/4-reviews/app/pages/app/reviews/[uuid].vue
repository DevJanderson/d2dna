<script setup lang="ts">
/**
 * Página de detalhe do cliente para revisão
 * Dados completos + histórico + ações (aprovar/rejeitar/corrigir)
 */
import type { ReviewCreateSchema } from '~/layers/4-reviews/app/composables/types'
import { ArrowLeft } from 'lucide-vue-next'

definePageMeta({
  layout: 'desktop',
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const reviewStore = useReviewStore()

const uuid = computed(() => route.params.uuid as string)

useHead({
  title: computed(() => {
    const name = reviewStore.selectedReview?.nome
    return name ? `Review ${name} - Tucuxi` : `Review #${uuid.value} - Tucuxi`
  })
})

// Se não tem review selecionado, busca pela API
onMounted(async () => {
  if (!reviewStore.selectedReview || reviewStore.selectedReview.uuid_cliente !== uuid.value) {
    const response = await useReviewApi().list({ uuid_cliente: uuid.value, limit: 1 })
    if (response.data.length > 0) {
      reviewStore.selectReview(response.data[0]!)
    }
  }
  await reviewStore.fetchHistory(uuid.value)
})

const review = computed(() => reviewStore.selectedReview)

async function handleSubmitReview(data: ReviewCreateSchema) {
  const success = await reviewStore.submitReview(data)
  if (success) {
    router.push('/app/reviews')
  }
}

async function handleRevert(id: number) {
  await reviewStore.revertReview(id)
  await reviewStore.fetchHistory(uuid.value)
}
</script>

<template>
  <div class="ml-20 h-full overflow-auto p-8">
    <div class="mx-auto flex max-w-7xl flex-col gap-5">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="default" class="font-mono text-sm" @click="router.push('/app/reviews')">
          <ArrowLeft class="mr-1.5 h-4 w-4" />
          Voltar
        </Button>
        <h1 class="font-mono text-xl font-semibold">
          &gt; review: {{ review?.nome || '...' }}_
        </h1>
      </div>

      <div v-if="!review" class="py-10 text-center font-mono text-sm text-muted-foreground">
        Carregando dados do cliente...
      </div>

      <template v-else>
        <div class="grid grid-cols-[1fr_320px] gap-5">
          <!-- Dados do cliente -->
          <div class="space-y-5">
            <div class="rounded-lg border bg-card p-5">
              <h2 class="mb-4 font-mono text-sm font-semibold text-muted-foreground">
                &gt; dados_cliente_
              </h2>

              <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <span class="font-mono text-xs text-muted-foreground">Nome</span>
                  <p class="text-sm font-medium">{{ review.nome }}</p>
                </div>
                <div>
                  <span class="font-mono text-xs text-muted-foreground">Nascimento</span>
                  <p class="font-mono text-sm">{{ formatDate(review.data_nascimento) }}</p>
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
                  <span class="font-mono text-xs text-muted-foreground">Sexo</span>
                  <p class="text-sm">{{ review.sexo || '—' }}</p>
                </div>
                <div>
                  <span class="font-mono text-xs text-muted-foreground">Nome da mãe</span>
                  <p class="text-sm">{{ review.nome_mae || '—' }}</p>
                </div>
                <div>
                  <span class="font-mono text-xs text-muted-foreground">Origem</span>
                  <p class="font-mono text-sm">{{ review.id_origem || '—' }}</p>
                </div>
                <div>
                  <span class="font-mono text-xs text-muted-foreground">Status atual</span>
                  <p class="font-mono text-sm">{{ review.status || 'pendente' }}</p>
                </div>
              </div>
            </div>

            <!-- Histórico -->
            <div class="rounded-lg border bg-card p-5">
              <ReviewHistory
                :history="reviewStore.history"
                :is-loading="reviewStore.isLoadingHistory"
                @revert="handleRevert"
              />
            </div>
          </div>

          <!-- Ações (sidebar direita) -->
          <div class="rounded-lg border bg-card p-5">
            <h2 class="mb-4 font-mono text-sm font-semibold text-muted-foreground">
              &gt; ação_
            </h2>
            <ReviewActions
              :uuid-cliente="review.uuid_cliente"
              :is-loading="reviewStore.isLoadingAction"
              @submit="handleSubmitReview"
            />
          </div>
        </div>
      </template>

      <div v-if="reviewStore.error" class="font-mono text-sm text-destructive">
        [ERRO] {{ reviewStore.error }}
      </div>
    </div>
  </div>
</template>
