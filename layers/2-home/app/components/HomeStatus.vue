<script setup lang="ts">
/**
 * Status de autenticação e ações
 * Exibe status online/offline e botões de ação
 */
const auth = useAuthStore()
</script>

<template>
  <section aria-labelledby="actions-heading">
    <h2 id="actions-heading" class="sr-only">Acoes disponiveis</h2>

    <!-- Autenticado -->
    <div v-if="auth.isAuthenticated" class="space-y-6">
      <div class="text-sm space-y-1">
        <p>
          <span class="text-muted-foreground">&gt; status:</span>
          <span class="text-green-500 ml-2">online</span>
          <span class="cursor-blink text-green-500">_</span>
        </p>
        <p>
          <span class="text-muted-foreground">&gt; user:</span>
          <span class="text-foreground ml-2">{{ auth.user?.nome }}</span>
        </p>
      </div>

      <nav aria-label="Navegacao principal" class="flex flex-col sm:flex-row gap-3">
        <NuxtLink to="/app">
          <Button size="lg" class="w-full sm:w-auto">
            [ Acessar Workspace ]
          </Button>
        </NuxtLink>
        <Button variant="ghost" size="lg" @click="auth.logout()">
          [ Sair ]
        </Button>
      </nav>
    </div>

    <!-- Nao autenticado -->
    <div v-else class="space-y-6">
      <div class="text-sm">
        <span class="text-muted-foreground">&gt; status:</span>
        <span class="text-yellow-500 ml-2">aguardando autenticacao</span>
        <span class="cursor-blink text-yellow-500">_</span>
      </div>

      <nav aria-label="Navegacao principal">
        <NuxtLink to="/login">
          <Button size="lg">
            [ Iniciar Sessao ]
          </Button>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>
