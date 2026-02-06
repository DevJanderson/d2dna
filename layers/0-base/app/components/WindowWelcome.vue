<script setup lang="ts">
/**
 * WindowWelcome - Conteúdo da janela de boas-vindas
 * Exibe ASCII art do tucuxi e descrição do sistema
 */

const authStore = useAuthStore()

const asciiTucuxi = `
                                          .--.
                  _______             .-"  .'
          .---u"""       """"---._  ."    %
        .'                        "--.    %
   __.--'  o                          "".. "
  (____.                                  ":
   \`----.__                                 ".
           \`----------__                     ".
                 ".   . ""--.                 ".
                   ". ".     ""-.              ".
                     "-.)        ""-.           ".
                                     "".         ".
                                        "".       ".
                                           "".      ".
                                              "".    ".
                        ^~^~^~^~^~^~^~^~^~^~^~^~^"".  "^~^~^~^~^
                                              ^~^~^~^  ~^~
                                                   ^~^~^~`

const userName = computed(() => {
  const nome = authStore.user?.nome || 'Usuário'
  return nome.split(' ')[0]
})
</script>

<template>
  <div class="flex h-full flex-col px-2">
    <div class="-mx-2 -mt-2 flex-shrink-0 overflow-hidden">
      <pre class="select-none whitespace-pre font-mono text-[7px] leading-tight text-primary/70">{{ asciiTucuxi }}</pre>
    </div>

    <div class="-mt-2 flex-1 space-y-5">
      <div>
        <h2 class="text-base font-semibold">
          Olá, {{ userName }}!
        </h2>
        <p class="mt-0.5 text-xs text-muted-foreground">
          Bem-vindo ao <strong>Tucuxi</strong> — Sistema de Record Linkage e Gestão de Dados.
        </p>
      </div>

      <div class="space-y-2">
        <p class="text-xs text-muted-foreground">
          Tecnologia <strong>DNA</strong> (Digital Numeric Algorithm) para:
        </p>
        <ul class="ml-1 space-y-1.5 text-xs text-muted-foreground">
          <li class="flex items-start gap-2">
            <span class="text-[10px] text-primary">▸</span>
            <span><strong>Identificar</strong> pacientes com dados incompletos</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[10px] text-primary">▸</span>
            <span><strong>Unificar</strong> registros em cadastro único</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="text-[10px] text-primary">▸</span>
            <span><strong>Qualificar</strong> dados com revisão assistida</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="mt-auto flex-shrink-0 border-t pt-3">
      <p class="text-center text-[9px] text-muted-foreground/50">
        D2DNA &copy; {{ new Date().getFullYear() }} &bull; Tecnologia DNA para dados de saúde
      </p>
    </div>
  </div>
</template>
