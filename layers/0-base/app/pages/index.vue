<script setup lang="ts">
/**
 * Página inicial - Tucuxi-Blast
 */
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
    <div class="text-center space-y-4 max-w-xl">
      <h1 class="text-5xl font-bold tracking-tight">
        Tucuxi-Blast
      </h1>
      <p class="text-xl text-muted-foreground">
        Sistema de Record Linkage e Gestão de Dados
      </p>
      <p class="text-muted-foreground">
        Plataforma de unificação de registros, eliminando duplicatas e garantindo dados únicos e confiáveis.
      </p>
    </div>

    <div class="flex gap-4">
      <NuxtLink to="/example">
        <Button size="lg">Acessar Sistema</Button>
      </NuxtLink>
    </div>
  </div>
</template>
