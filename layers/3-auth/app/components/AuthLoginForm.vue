<script setup lang="ts">
/**
 * Formulário de login - Estilo MX (Machine Experience)
 * Labels e inputs com estética terminal
 */
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
  <form class="space-y-5" @submit.prevent="handleSubmit">
    <!-- Email -->
    <div class="space-y-2">
      <Label for="email" class="text-sm text-foreground font-mono font-medium">
        <span class="text-foreground/50">&gt;</span> email:
      </Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        autocomplete="email"
        required
        placeholder="usuario@dominio.com"
        :disabled="auth.isLoading"
        class="font-mono bg-white dark:bg-background border-foreground/20 focus:border-primary placeholder:text-foreground/40"
      />
    </div>

    <!-- Senha -->
    <div class="space-y-2">
      <Label for="password" class="text-sm text-foreground font-mono font-medium">
        <span class="text-foreground/50">&gt;</span> senha:
      </Label>
      <div class="relative">
        <Input
          id="password"
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="current-password"
          required
          placeholder="••••••••"
          class="pr-10 font-mono bg-white dark:bg-background border-foreground/20 focus:border-primary placeholder:text-foreground/40"
          :disabled="auth.isLoading"
        />
        <button
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
          @click="showPassword = !showPassword"
        >
          <span class="sr-only">{{ showPassword ? 'Ocultar' : 'Mostrar' }} senha</span>
          <EyeOff v-if="showPassword" class="h-4 w-4" />
          <Eye v-else class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Mensagem de erro estilo terminal -->
    <div v-if="auth.error" class="text-xs font-mono p-3 bg-destructive/10 border border-destructive/30 text-destructive">
      <span class="text-destructive/70">[ERRO]</span> {{ auth.error }}
    </div>

    <!-- Botão de submit -->
    <Button
      type="submit"
      class="w-full font-mono tracking-wider"
      :disabled="auth.isLoading"
    >
      <Loader2 v-if="auth.isLoading" class="mr-2 h-4 w-4 animate-spin" />
      <span v-if="auth.isLoading">&gt; AUTENTICANDO...</span>
      <span v-else>&gt; AUTENTICAR</span>
    </Button>
  </form>
</template>
