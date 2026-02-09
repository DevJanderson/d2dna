<script setup lang="ts">
/**
 * Layout Desktop
 * Layout para área autenticada com navbar, dock e sistema de janelas
 * O Desktop vive aqui para que janelas persistam entre navegações de páginas
 */

const windowManager = useWindowManager()
const LazyWindowWelcomeComp = defineAsyncComponent(
  () => import('~/layers/0-base/app/components/WindowWelcome.vue')
)

// Janela de boas-vindas na primeira visita
onMounted(() => {
  const dismissed = localStorage.getItem('welcome-dismissed')
  if (!dismissed && windowManager.windows.value.length === 0) {
    const w = 550
    const h = 480
    windowManager.open({
      id: 'welcome',
      title: 'Bem-vindo ao Tucuxi',
      component: LazyWindowWelcomeComp,
      position: {
        x: Math.max(0, (window.innerWidth - w) / 2),
        y: Math.max(0, (window.innerHeight - h) / 2)
      },
      size: { width: w, height: h }
    })
  }
})

watch(
  () => windowManager.windows.value.some(w => w.id === 'welcome'),
  (exists, existed) => {
    if (existed && !exists) {
      localStorage.setItem('welcome-dismissed', '1')
    }
  }
)
</script>

<template>
  <div class="relative h-screen bg-muted pt-2">
    <!-- Navbar superior (h-12 = 48px + pt-2 = 8px = 56px total) -->
    <DesktopNavbar class="h-12" />

    <!-- Área de trabalho -->
    <div class="relative z-20 h-[calc(100vh-3rem-0.5rem)]">
      <!-- Dock flutuante -->
      <AppDock />

      <!-- Conteúdo principal (largura total) -->
      <main class="relative h-full overflow-hidden">
        <Desktop>
          <template #background>
            <slot />
          </template>
        </Desktop>
      </main>
    </div>
  </div>
</template>
