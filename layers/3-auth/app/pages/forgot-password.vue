<script setup lang="ts">
import { Check, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'guest'
})

useHead({ title: 'Recuperar Senha - Tucuxi' })

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
    error.value = err.data?.message || 'Erro ao enviar solicitacao'
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
        <p class="mt-1 text-sm text-muted-foreground">Digite seu email para receber instrucoes</p>
      </div>

      <div class="rounded-lg border bg-card p-6 shadow-sm">
        <!-- Formulario -->
        <form v-if="!isSubmitted" class="space-y-4" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="seu@email.com"
              :disabled="isLoading"
            />
          </div>

          <p v-if="error" class="text-sm text-destructive">
            {{ error }}
          </p>

          <Button type="submit" class="w-full" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? 'Enviando...' : 'Enviar instrucoes' }}
          </Button>
        </form>

        <!-- Sucesso -->
        <div v-else class="space-y-4 text-center">
          <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check class="h-6 w-6 text-green-600" />
          </div>
          <p class="text-sm text-muted-foreground">
            Se o email existir em nossa base, voce recebera instrucoes para redefinir sua senha.
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
