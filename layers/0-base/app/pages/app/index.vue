<script setup lang="ts">
/**
 * Workspace Principal - Área de trabalho do analista
 * Interface multi-janelas para revisão de matches
 */
definePageMeta({
  layout: 'desktop'
})

const windowManager = useWindowManager()

// Abre janelas padrão do workspace ao montar
onMounted(() => {
  // Janela de boas-vindas / fila de revisão
  windowManager.open({
    id: 'review-queue',
    title: 'Fila de Revisão',
    position: { x: 20, y: 20 },
    size: { width: 350, height: 500 }
  })

  // Janela do comparador de matches
  windowManager.open({
    id: 'match-viewer',
    title: 'Comparador de Matches',
    position: { x: 390, y: 20 },
    size: { width: 700, height: 500 }
  })
})

// Dados mock para demonstração
const pendingMatches = ref([
  { id: 1, score: 92, nameA: 'JOSÉ DA SILVA', nameB: 'JOSE SILVA', status: 'pending' },
  { id: 2, score: 87, nameA: 'MARIA SANTOS', nameB: 'MARIA DOS SANTOS', status: 'pending' },
  { id: 3, score: 78, nameA: 'JOÃO OLIVEIRA', nameB: 'JOAO OLIVEIRA FILHO', status: 'pending' },
  { id: 4, score: 81, nameA: 'ANA COSTA', nameB: 'ANA MARIA COSTA', status: 'pending' }
])

const selectedMatch = ref(pendingMatches.value[0])

function selectMatch(match: typeof pendingMatches.value[0]) {
  selectedMatch.value = match
  windowManager.focus('match-viewer')
}

function approveMatch() {
  if (!selectedMatch.value) return
  const index = pendingMatches.value.findIndex(m => m.id === selectedMatch.value?.id)
  if (index !== -1) {
    pendingMatches.value.splice(index, 1)
    selectedMatch.value = pendingMatches.value[0] ?? undefined
  }
}

function rejectMatch() {
  if (!selectedMatch.value) return
  const index = pendingMatches.value.findIndex(m => m.id === selectedMatch.value?.id)
  if (index !== -1) {
    pendingMatches.value.splice(index, 1)
    selectedMatch.value = pendingMatches.value[0] ?? undefined
  }
}

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600 dark:text-green-400'
  if (score >= 80) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-orange-600 dark:text-orange-400'
}
</script>

<template>
  <Desktop>
    <!-- Fila de Revisão -->
    <template #review-queue>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-muted-foreground">
            {{ pendingMatches.length }} pendentes
          </span>
          <Button variant="outline" size="sm">
            Filtrar
          </Button>
        </div>

        <div class="space-y-2">
          <button
            v-for="match in pendingMatches"
            :key="match.id"
            class="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted"
            :class="{ 'border-primary bg-primary/5': selectedMatch?.id === match.id }"
            @click="selectMatch(match)"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-sm">Match #{{ match.id }}</span>
              <span class="text-sm font-bold" :class="getScoreColor(match.score)">
                {{ match.score }}%
              </span>
            </div>
            <div class="mt-1 text-xs text-muted-foreground">
              {{ match.nameA }} ↔ {{ match.nameB }}
            </div>
          </button>
        </div>

        <div v-if="pendingMatches.length === 0" class="py-8 text-center text-muted-foreground">
          <p class="text-sm">Nenhum match pendente</p>
          <p class="text-xs mt-1">Bom trabalho!</p>
        </div>
      </div>
    </template>

    <!-- Comparador de Matches -->
    <template #match-viewer>
      <div v-if="selectedMatch" class="h-full flex flex-col">
        <!-- Header do match -->
        <div class="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 class="font-semibold">Match #{{ selectedMatch.id }}</h3>
            <p class="text-sm text-muted-foreground">
              Score: <span :class="getScoreColor(selectedMatch.score)" class="font-bold">{{ selectedMatch.score }}%</span>
            </p>
          </div>
          <div class="flex gap-2">
            <Button variant="outline" size="sm" @click="rejectMatch">
              Rejeitar
            </Button>
            <Button size="sm" @click="approveMatch">
              Aprovar
            </Button>
          </div>
        </div>

        <!-- Comparação lado a lado -->
        <div class="flex-1 grid grid-cols-2 gap-4 py-4">
          <!-- Registro A -->
          <div class="rounded-lg border p-4">
            <div class="text-xs font-medium text-muted-foreground mb-3">REGISTRO A</div>
            <div class="space-y-3">
              <div>
                <label class="text-xs text-muted-foreground">Nome</label>
                <p class="font-medium">{{ selectedMatch.nameA }}</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">CPF</label>
                <p class="font-medium">123.456.789-00</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">Data Nascimento</label>
                <p class="font-medium">15/03/1975</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">Nome da Mãe</label>
                <p class="font-medium">MARIA DA SILVA</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">CNS</label>
                <p class="font-medium">123456789012345</p>
              </div>
            </div>
          </div>

          <!-- Registro B -->
          <div class="rounded-lg border p-4">
            <div class="text-xs font-medium text-muted-foreground mb-3">REGISTRO B</div>
            <div class="space-y-3">
              <div>
                <label class="text-xs text-muted-foreground">Nome</label>
                <p class="font-medium">{{ selectedMatch.nameB }}</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">CPF</label>
                <p class="font-medium text-muted-foreground italic">(vazio)</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">Data Nascimento</label>
                <p class="font-medium">00/03/1975</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">Nome da Mãe</label>
                <p class="font-medium">MARIA SILVA</p>
              </div>
              <div>
                <label class="text-xs text-muted-foreground">CNS</label>
                <p class="font-medium">987654321098765</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Motivo do match -->
        <div class="pt-4 border-t">
          <p class="text-xs text-muted-foreground">
            <strong>Motivo do match:</strong> Nome similar (fonético) + Mês de nascimento + Nome da mãe similar
          </p>
        </div>
      </div>

      <div v-else class="h-full flex items-center justify-center text-muted-foreground">
        <p>Selecione um match na fila para visualizar</p>
      </div>
    </template>
  </Desktop>
</template>
