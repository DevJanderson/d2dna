<script setup lang="ts">
/**
 * Header da página inicial
 * Título, subtítulo e ASCII logos (D2DNA + Tucuxi)
 */

// ASCII Art do Tucuxi (golfinho da Amazonia)
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
                                                   ^~^~^~
`
</script>

<template>
  <header class="mb-12 md:mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
    <!-- Esquerda: Titulo -->
    <div>
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">
        Tucuxi-Blast
      </h1>
      <p class="text-sm text-muted-foreground mb-8">
        Sistema de Record Linkage e Gestao de Dados
      </p>
      <!-- Logo D2DNA ASCII -->
      <pre class="text-[8px] sm:text-[10px] leading-tight text-primary/70 select-none" aria-hidden="true">
█████▄   ██████╗    █████▄   ███╗   ██╗  █████╗
██   ██  ╚════██╗   ██   ██  ████╗  ██║ ██╔══██╗
██   ██   █████╔╝   ██   ██  ██╔██╗ ██║ ███████║
██   ██  ██╔═══╝    ██   ██  ██║╚██╗██║ ██╔══██║
█████▀   ███████╗   █████▀   ██║ ╚████║ ██║  ██║
╚════╝   ╚══════╝   ╚════╝   ╚═╝  ╚═══╝ ╚═╝  ╚═╝</pre>
    </div>

    <!-- Direita: ASCII Art Tucuxi -->
    <div class="overflow-hidden" aria-hidden="true">
      <pre class="text-[6px] sm:text-[8px] md:text-[10px] leading-tight text-primary select-none whitespace-pre">{{ asciiTucuxi }}</pre>
    </div>
  </header>
</template>
