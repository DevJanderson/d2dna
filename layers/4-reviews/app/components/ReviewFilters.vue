<script setup lang="ts">
/**
 * ReviewFilters - Filtros para busca de clientes em revisão
 * Layout horizontal: nome, CPF, CNS, nascimento, botões
 */

const emit = defineEmits<{
  filter: [
    params: {
      nome?: string | null
      cpf?: string | null
      cns?: string | null
      data_nascimento?: string | null
    }
  ]
  clear: []
}>()

const nome = ref('')
const cpf = ref('')
const cns = ref('')
const dataNascimento = ref('')

function handleSubmit() {
  emit('filter', {
    nome: nome.value || null,
    cpf: cpf.value || null,
    cns: cns.value || null,
    data_nascimento: dataNascimento.value || null
  })
}

function handleClear() {
  nome.value = ''
  cpf.value = ''
  cns.value = ''
  dataNascimento.value = ''
  emit('clear')
}

const hasFilters = computed(() => {
  return nome.value || cpf.value || cns.value || dataNascimento.value
})
</script>

<template>
  <form class="flex items-end gap-4" @submit.prevent="handleSubmit">
    <div class="min-w-0 flex-1">
      <label class="mb-1.5 block font-mono text-xs text-muted-foreground">&gt; nome:</label>
      <Input v-model="nome" placeholder="Buscar por nome..." class="h-9 font-mono text-sm" />
    </div>

    <div class="w-40">
      <label class="mb-1.5 block font-mono text-xs text-muted-foreground">&gt; cpf:</label>
      <Input v-model="cpf" placeholder="000.000.000-00" class="h-9 font-mono text-sm" />
    </div>

    <div class="w-36">
      <label class="mb-1.5 block font-mono text-xs text-muted-foreground">&gt; cns:</label>
      <Input v-model="cns" placeholder="CNS" class="h-9 font-mono text-sm" />
    </div>

    <div class="w-40">
      <label class="mb-1.5 block font-mono text-xs text-muted-foreground">&gt; nascimento:</label>
      <Input v-model="dataNascimento" type="date" class="h-9 font-mono text-sm" />
    </div>

    <Button type="submit" size="default" class="h-9 font-mono text-sm"> Filtrar </Button>
    <Button
      v-if="hasFilters"
      type="button"
      variant="outline"
      size="default"
      class="h-9 font-mono text-sm"
      @click="handleClear"
    >
      Limpar
    </Button>
  </form>
</template>
