<script setup lang="ts">
import { Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const emit = defineEmits<{
  success: []
}>()

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function handleSubmit() {
  const success = await auth.login(email.value, password.value)
  if (success) {
    emit('success')
  }
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div class="space-y-2">
      <Label for="email">Email</Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        placeholder="seu@email.com"
        :disabled="auth.isLoading"
      />
    </div>

    <div class="space-y-2">
      <Label for="password">Senha</Label>
      <div class="relative">
        <Input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
          placeholder="********"
          class="pr-10"
          :disabled="auth.isLoading"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          @click="showPassword = !showPassword"
        >
          <span class="sr-only">{{ showPassword ? 'Ocultar' : 'Mostrar' }} senha</span>
          <EyeOff v-if="showPassword" class="h-4 w-4" />
          <Eye v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <p v-if="auth.error" class="text-sm text-destructive">
      {{ auth.error }}
    </p>

    <Button type="submit" class="w-full" :disabled="auth.isLoading">
      <Loader2 v-if="auth.isLoading" class="mr-2 h-4 w-4 animate-spin" />
      {{ auth.isLoading ? 'Entrando...' : 'Entrar' }}
    </Button>
  </form>
</template>
