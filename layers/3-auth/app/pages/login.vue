<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const auth = useAuthStore()

// Se já autenticado, redireciona
onMounted(async () => {
  if (auth.isAuthenticated) {
    navigateTo('/app')
    return
  }

  // Verifica se há sessão válida
  const isAuthenticated = await auth.checkAuth()
  if (isAuthenticated) {
    navigateTo('/app')
  }
})

function handleSuccess() {
  navigateTo('/app')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-sm space-y-6">
      <!-- Logo/Título -->
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Tucuxi</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Entre com suas credenciais
        </p>
      </div>

      <!-- Card de Login -->
      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <AuthLoginForm @success="handleSuccess" />

        <div class="mt-4 text-center">
          <NuxtLink to="/forgot-password" class="text-sm text-muted-foreground hover:text-primary hover:underline">
            Esqueci minha senha
          </NuxtLink>
        </div>
      </div>

      <!-- Voltar -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-muted-foreground hover:text-primary hover:underline">
          Voltar para a página inicial
        </NuxtLink>
      </div>

      <!-- Footer -->
      <p class="text-center text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} D2DNA. Todos os direitos reservados.
      </p>
    </div>
  </div>
</template>
