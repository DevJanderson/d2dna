<script setup lang="ts">
/**
 * ReviewActions - Botões de ação para curadoria
 * Aprovar, rejeitar ou corrigir um registro de cliente
 */
import type { ReviewCreateSchema } from '../composables/types'
import { ReviewCreateSchemaStatusEnum } from '../composables/types'
import { Check, X, Pencil } from 'lucide-vue-next'

interface Props {
  uuidCliente: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const emit = defineEmits<{
  submit: [data: ReviewCreateSchema]
}>()

const observacao = ref('')

function handleAction(status: ReviewCreateSchemaStatusEnum) {
  const acao =
    status === ReviewCreateSchemaStatusEnum.aprovado
      ? 'aprovação'
      : status === ReviewCreateSchemaStatusEnum.rejeitado
        ? 'rejeição'
        : 'correção'

  emit('submit', {
    uuid_cliente: props.uuidCliente,
    acao,
    status,
    observacao: observacao.value || null
  })

  observacao.value = ''
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <label class="mb-1.5 block font-mono text-sm text-muted-foreground">&gt; observação:</label>
      <textarea
        v-model="observacao"
        placeholder="Observação sobre a revisão..."
        class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :disabled="isLoading"
      />
    </div>

    <div class="flex gap-2.5">
      <Button
        size="default"
        class="flex-1 bg-green-600 font-mono text-sm hover:bg-green-700"
        :disabled="isLoading"
        @click="handleAction(ReviewCreateSchemaStatusEnum.aprovado)"
      >
        <Check class="mr-1.5 h-4 w-4" />
        Aprovar
      </Button>

      <Button
        size="default"
        variant="destructive"
        class="flex-1 font-mono text-sm"
        :disabled="isLoading"
        @click="handleAction(ReviewCreateSchemaStatusEnum.rejeitado)"
      >
        <X class="mr-1.5 h-4 w-4" />
        Rejeitar
      </Button>

      <Button
        size="default"
        variant="outline"
        class="flex-1 font-mono text-sm text-yellow-600 hover:text-yellow-700"
        :disabled="isLoading"
        @click="handleAction(ReviewCreateSchemaStatusEnum.corrigido)"
      >
        <Pencil class="mr-1.5 h-4 w-4" />
        Corrigir
      </Button>
    </div>
  </div>
</template>
