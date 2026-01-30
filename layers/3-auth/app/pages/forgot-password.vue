<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const email = ref('')
const isLoading = ref(false)
const isSubmitted = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  isLoading.value = true
  error.value = null

  try {
    await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value }
    })
    isSubmitted.value = true
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    error.value = err.data?.message || 'Erro ao enviar solicitação'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-sm space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Esqueci minha senha</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Digite seu email para receber instruções
        </p>
      </div>

      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <!-- Formulário -->
        <form v-if="!isSubmitted" class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="seu@email.com"
              :disabled="isLoading"
            />
          </div>

          <p v-if="error" class="text-sm text-destructive">
            {{ error }}
          </p>

          <button
            type="submit"
            class="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar instruções' }}
          </button>
        </form>

        <!-- Sucesso -->
        <div v-else class="space-y-4 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="text-green-600"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p class="text-sm text-muted-foreground">
            Se o email existir em nossa base, você receberá instruções para redefinir sua senha.
          </p>
        </div>
      </div>

      <div class="text-center">
        <NuxtLink to="/login" class="text-sm text-primary hover:underline">
          Voltar para o login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
