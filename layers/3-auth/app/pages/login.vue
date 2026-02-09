<script setup lang="ts">
/**
 * Página de login - Estilo MX (Machine Experience)
 * Design terminal com ASCII art e efeitos CRT
 */
definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

useHead({ title: 'Login - Tucuxi' })

function handleSuccess() {
  navigateTo('/app')
}
</script>

<template>
  <div class="min-h-screen bg-background font-mono flex items-center justify-center p-4">
    <div class="w-full max-w-sm space-y-8">
      <!-- Header com ASCII art -->
      <header class="text-center space-y-4">
        <!-- ASCII D2DNA -->
        <pre class="text-xs text-primary/70 select-none leading-tight" aria-hidden="true">
█████▄   ██████╗    █████▄   ███╗   ██╗  █████╗
██   ██  ╚════██╗   ██   ██  ████╗  ██║ ██╔══██╗
██   ██   █████╔╝   ██   ██  ██╔██╗ ██║ ███████║
██   ██  ██╔═══╝    ██   ██  ██║╚██╗██║ ██╔══██║
█████▀   ███████╗   █████▀   ██║ ╚████║ ██║  ██║
╚════╝   ╚══════╝   ╚════╝   ╚═╝  ╚═══╝ ╚═╝  ╚═╝</pre
        >

        <div class="space-y-2">
          <h1 class="text-2xl font-bold tracking-wider text-foreground">
            TUCUXI<span class="cursor-blink text-primary">_</span>
          </h1>
          <p class="text-xs text-muted-foreground">
            <span class="text-muted-foreground/50">&gt;</span> record linkage e gestao de dados
          </p>
        </div>
      </header>

      <!-- Card de Login -->
      <div
        class="relative z-20 bg-white dark:bg-card rounded-lg border border-border/50 shadow-sm p-6 space-y-4"
      >
        <p class="text-xs text-muted-foreground text-center">
          <span class="text-muted-foreground/50">&gt;</span> autenticacao_requerida
        </p>

        <!-- Formulário -->
        <AuthLoginForm @success="handleSuccess" />

        <!-- Links -->
        <div class="flex justify-between text-xs pt-2">
          <NuxtLink
            to="/forgot-password"
            class="text-muted-foreground hover:text-primary transition-colors"
          >
            <span class="text-muted-foreground/50">&gt;</span> esqueci_senha
          </NuxtLink>
          <NuxtLink to="/" class="text-muted-foreground hover:text-primary transition-colors">
            <span class="text-muted-foreground/50">&gt;</span> voltar
          </NuxtLink>
        </div>
      </div>

      <!-- Footer -->
      <footer class="text-center">
        <p class="text-xs text-muted-foreground/70">
          <span class="text-muted-foreground/50">&gt;</span> copyright:
          {{ new Date().getFullYear() }} D2DNA
        </p>
      </footer>
    </div>
  </div>
</template>
