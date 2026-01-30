<script setup lang="ts">
/**
 * Página inicial - Tucuxi-Blast
 */
const auth = useAuthStore()

onMounted(() => {
  auth.checkAuth()
})
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

    <!-- Logado -->
    <template v-if="auth.isAuthenticated">
      <p class="text-sm text-muted-foreground">
        Logado como <span class="font-medium text-foreground">{{ auth.user?.nome }}</span>
      </p>
      <div class="flex gap-4">
        <NuxtLink to="/app">
          <Button size="lg">Acessar Workspace</Button>
        </NuxtLink>
        <Button variant="outline" size="lg" @click="auth.logout()">
          Sair
        </Button>
      </div>
    </template>

    <!-- Não logado -->
    <template v-else>
      <div class="flex gap-4">
        <NuxtLink to="/login">
          <Button size="lg">Fazer Login</Button>
        </NuxtLink>
      </div>
    </template>

    <p class="text-xs text-muted-foreground mt-8">
      &copy; {{ new Date().getFullYear() }} D2DNA
    </p>
  </div>
</template>
