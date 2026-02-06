<script setup lang="ts">
/**
 * AppWindowTitleBar - Barra de título de janela estilo PostHog/macOS
 *
 * Layout:
 * - Esquerda: Ícone com dropdown menu (ações: IA, favoritos, fechar)
 * - Centro: Título com dropdown menu (navegação de arquivos)
 * - Direita: Botões de controle (minimizar, maximizar, fechar)
 */
import { Minus, Square, Copy, X, ChevronDown, FileText, File, FolderClosed } from 'lucide-vue-next'

interface Props {
  /** Título exibido na barra (centralizado) */
  title?: string
  /** Caminho do arquivo (exibido no menu do título) */
  filePath?: string
  /** Mostrar botões de controle */
  showControls?: boolean
  /** Mostrar ícone de documento à esquerda */
  showIcon?: boolean
  /** Mostrar dropdown no ícone */
  showIconDropdown?: boolean
  /** Mostrar dropdown no título */
  showTitleDropdown?: boolean
  /** Se o drag está habilitado (afeta cursor) */
  draggable?: boolean
  /** Se está arrastando (afeta cursor) */
  isDragging?: boolean
  /** Se a janela está maximizada (afeta ícone e cursor) */
  isMaximized?: boolean
}

withDefaults(defineProps<Props>(), {
  title: '',
  filePath: '',
  showControls: true,
  showIcon: false,
  showIconDropdown: false,
  showTitleDropdown: false,
  draggable: true,
  isDragging: false,
  isMaximized: false
})

const emit = defineEmits<{
  minimize: []
  maximize: []
  close: []
  /** Quando um arquivo é selecionado no navegador */
  'file:select': [file: { id: string; title: string; path: string }]
  /** Quando clica em "Pergunte à IA" */
  'ai:chat': []
  /** Quando clica em "Adicionar aos favoritos" */
  favorite: []
}>()

// Busca arquivos de conteúdo disponíveis
const { contentTree, status: contentStatus } = useContentFiles()

// Seleciona um arquivo
function selectFile(file: { id: string; title: string; path: string }) {
  emit('file:select', file)
}
</script>

<template>
  <div
    class="relative flex h-9 shrink-0 items-center border-b border-border bg-muted/50 select-none"
    :class="{
      'cursor-grab': draggable && !isDragging && !isMaximized,
      'cursor-grabbing': isDragging
    }"
  >
    <!-- Esquerda: Ícone com dropdown menu (navegador de arquivos) -->
    <div class="flex items-center pl-3">
      <slot name="icon">
        <!-- Menu do ícone - ações da janela (estilo PostHog) -->
        <DropdownMenu v-if="showIcon && showIconDropdown">
          <DropdownMenuTrigger as-child>
            <button
              type="button"
              class="flex items-center gap-0.5 rounded px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted"
              @click.stop
            >
              <FileText class="h-4 w-4" />
              <ChevronDown class="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" class="w-64">
            <!-- Pergunte à IA com submenu -->
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>Pergunte à IA sobre esta página.</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent class="w-52">
                  <DropdownMenuItem @click="emit('ai:chat')">
                    <span>Novo chat de IA</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <!-- Adicionar aos favoritos -->
            <DropdownMenuItem @click="emit('favorite')">
              <span>Adicionar aos favoritos</span>
            </DropdownMenuItem>

            <!-- Fechar -->
            <DropdownMenuItem @click="emit('close')">
              <span class="flex-1">Fechar</span>
              <div class="flex items-center gap-1">
                <kbd
                  class="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >Shift</kbd
                >
                <kbd
                  class="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >W</kbd
                >
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Ícone simples sem dropdown -->
        <button
          v-else-if="showIcon"
          type="button"
          class="flex items-center gap-0.5 rounded px-1.5 py-1 text-muted-foreground transition-colors hover:bg-muted"
          @click.stop
        >
          <FileText class="h-4 w-4" />
        </button>
      </slot>
    </div>

    <!-- Centro: Título com dropdown menu de navegação de arquivos -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <!-- Menu do título - navegação de arquivos -->
      <DropdownMenu v-if="title && showTitleDropdown">
        <DropdownMenuTrigger as-child>
          <button
            type="button"
            class="flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-foreground transition-colors pointer-events-auto hover:bg-muted"
            @click.stop
          >
            <span class="truncate">{{ title }}</span>
            <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" class="w-56">
          <!-- Loading state -->
          <div
            v-if="contentStatus === 'pending'"
            class="flex items-center justify-center py-4 text-sm text-muted-foreground"
          >
            <div
              class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2"
            />
            Carregando...
          </div>

          <!-- Arquivos e pastas -->
          <template v-else>
            <!-- Arquivos na raiz -->
            <DropdownMenuItem
              v-for="file in contentTree.files"
              :key="file.id"
              @click="selectFile(file)"
            >
              <File class="mr-2 h-4 w-4 text-muted-foreground" />
              <span class="truncate">{{ file.title }}</span>
            </DropdownMenuItem>

            <!-- Pastas com submenus -->
            <DropdownMenuSub v-for="folder in contentTree.folders" :key="folder.path">
              <DropdownMenuSubTrigger>
                <FolderClosed class="mr-2 h-4 w-4 text-chart-3" />
                <span class="truncate">{{ folder.name }}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent class="w-48">
                  <DropdownMenuItem
                    v-for="file in folder.files"
                    :key="file.id"
                    @click="selectFile(file)"
                  >
                    <File class="mr-2 h-4 w-4 text-muted-foreground" />
                    <span class="truncate">{{ file.title }}</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <!-- Mensagem se não houver arquivos -->
            <div
              v-if="contentTree.files.length === 0 && contentTree.folders.length === 0"
              class="py-4 text-center text-sm text-muted-foreground"
            >
              Nenhum arquivo encontrado
            </div>
          </template>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Título simples sem dropdown -->
      <span
        v-else-if="title"
        class="truncate px-2 py-1 text-sm font-medium text-foreground pointer-events-auto"
      >
        {{ title }}
      </span>
    </div>

    <!-- Spacer para empurrar botões para a direita -->
    <div class="flex-1" />

    <!-- Direita: Botões de controle - minimizar, maximizar, fechar -->
    <div v-if="showControls" class="flex items-center">
      <!-- Minimizar -->
      <button
        type="button"
        class="flex h-9 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted"
        aria-label="Minimizar janela"
        @click.stop="emit('minimize')"
      >
        <Minus class="h-4 w-4" />
      </button>

      <!-- Maximizar / Restaurar -->
      <button
        type="button"
        class="flex h-9 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-muted"
        :aria-label="isMaximized ? 'Restaurar janela' : 'Maximizar janela'"
        @click.stop="emit('maximize')"
      >
        <Copy v-if="isMaximized" class="h-3.5 w-3.5 rotate-180" />
        <Square v-else class="h-3.5 w-3.5" />
      </button>

      <!-- Fechar -->
      <button
        type="button"
        class="flex h-9 w-11 items-center justify-center text-muted-foreground transition-colors hover:bg-destructive hover:text-white"
        aria-label="Fechar janela"
        @click.stop="emit('close')"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>
