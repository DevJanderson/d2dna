<script setup lang="ts">
/**
 * WallpaperSelector - Seletor de wallpaper do desktop
 *
 * Exibe grid de wallpapers disponíveis (cores sólidas, gradientes, imagens)
 * Permite selecionar e visualizar preview em tempo real
 */
import { Check } from 'lucide-vue-next'
import type { Wallpaper } from '../composables/useWallpaper'

interface Props {
  /** Wallpaper selecionado atualmente */
  modelValue?: string
  /** Mostrar apenas tipo específico */
  filterType?: 'solid' | 'gradient' | 'pattern' | 'image' | 'all'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  filterType: 'all'
})

const emit = defineEmits<{
  'update:modelValue': [id: string]
  select: [wallpaper: Wallpaper]
}>()

const { currentWallpaper, allWallpapers, setWallpaper } = useWallpaper()

// ID do wallpaper selecionado (usa currentWallpaper se não tiver v-model)
const selectedId = computed(() => props.modelValue || currentWallpaper.value.id)

// Filtrar wallpapers por tipo
const filteredWallpapers = computed(() => {
  if (props.filterType === 'all') {
    return allWallpapers.value
  }
  return allWallpapers.value.filter(w => w.type === props.filterType)
})

// Agrupar por tipo para exibição
type WallpaperType = 'solid' | 'gradient' | 'pattern' | 'image'

const groupedWallpapers = computed(() => {
  const groups: Record<WallpaperType, Wallpaper[]> = {
    solid: [],
    gradient: [],
    pattern: [],
    image: []
  }

  for (const wp of filteredWallpapers.value) {
    groups[wp.type].push(wp)
  }

  return groups
})

// Nomes dos grupos em português
const groupNames: Record<string, string> = {
  solid: 'Cores Sólidas',
  gradient: 'Gradientes',
  pattern: 'Padrões',
  image: 'Imagens'
}

// Selecionar wallpaper
function selectWallpaper(wallpaper: Wallpaper) {
  setWallpaper(wallpaper)
  emit('update:modelValue', wallpaper.id)
  emit('select', wallpaper)
}

// Gerar estilo de preview para cada wallpaper
function getPreviewStyle(wallpaper: Wallpaper): Record<string, string | undefined> {
  // Para imagens, usar thumbnail se disponível
  if (wallpaper.type === 'image' && wallpaper.thumbnail) {
    return {
      backgroundImage: `url(${wallpaper.thumbnail})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }

  // Para outros tipos, usar o style diretamente
  return wallpaper.style as Record<string, string | undefined>
}
</script>

<template>
  <div class="space-y-6">
    <!-- Grupos de wallpapers -->
    <template v-for="(wallpapers, type) in groupedWallpapers" :key="type">
      <div v-if="wallpapers.length > 0" class="space-y-3">
        <!-- Título do grupo -->
        <h3 class="text-sm font-medium text-muted-foreground">
          {{ groupNames[type] }}
        </h3>

        <!-- Grid de wallpapers com animação -->
        <div v-auto-animate class="grid grid-cols-4 gap-3">
          <button
            v-for="wallpaper in wallpapers"
            :key="wallpaper.id"
            type="button"
            class="group relative aspect-video overflow-hidden rounded-lg border-2 transition-all hover:scale-105"
            :class="[
              selectedId === wallpaper.id
                ? 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-background'
                : 'border-border hover:border-muted-foreground'
            ]"
            :title="wallpaper.name"
            @click="selectWallpaper(wallpaper)"
          >
            <!-- Preview do wallpaper -->
            <div class="absolute inset-0" :style="getPreviewStyle(wallpaper)" />

            <!-- Overlay com check quando selecionado -->
            <div
              v-if="selectedId === wallpaper.id"
              class="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <div class="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <Check class="h-4 w-4 text-primary-foreground" />
              </div>
            </div>

            <!-- Nome no hover -->
            <div
              class="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <span class="text-xs font-medium text-white">{{ wallpaper.name }}</span>
            </div>
          </button>
        </div>
      </div>
    </template>

    <!-- Mensagem se não houver wallpapers -->
    <div
      v-if="filteredWallpapers.length === 0"
      class="flex flex-col items-center justify-center py-8 text-muted-foreground"
    >
      <p class="text-sm">Nenhum wallpaper disponível</p>
    </div>
  </div>
</template>
