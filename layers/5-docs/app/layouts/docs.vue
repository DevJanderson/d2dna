<script setup lang="ts">
const sidebarOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-background">
    <DocsHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="mx-auto flex max-w-screen-2xl">
      <!-- Sidebar desktop -->
      <aside class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 lg:block">
        <ScrollArea class="h-full">
          <DocsNav />
        </ScrollArea>
      </aside>

      <!-- Sidebar mobile (Sheet) -->
      <Sheet v-model:open="sidebarOpen">
        <SheetContent side="left" class="w-72 p-0">
          <SheetHeader class="border-b border-border px-4 py-3">
            <SheetTitle class="font-mono text-lg font-bold tracking-wider">
              TUCUXI<span class="cursor-blink">_</span>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea class="h-[calc(100vh-4rem)]">
            <DocsNav />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <!-- Conteúdo principal -->
      <main class="min-w-0 flex-1 px-6 py-8 lg:px-12">
        <div class="mx-auto max-w-3xl">
          <slot />
        </div>
      </main>

      <!-- TOC desktop -->
      <aside class="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-52 shrink-0 xl:block">
        <div id="docs-toc" class="h-full overflow-auto px-4 py-8" />
      </aside>
    </div>
  </div>
</template>
