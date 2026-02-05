<script setup lang="ts">
/**
 * Hero section - inspirada no Anytype.io
 * Layout: título esquerda, ilustração direita, feature cards abaixo
 */
const auth = useAuthStore()

const asciiTucuxi = `                                      .--.
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
                  ^~^~^~^~^~^~^~^~^~^~^~^~^~^"".  "^~^~^~^~^
                                            ^~^~^~^  ~^~
                                                 ^~^~^~`

const features = [
  {
    title: 'Record Linkage',
    description: 'Algoritmos avançados de vinculação determinística e probabilística para unificar registros.'
  },
  {
    title: 'Busca Inteligente',
    description: 'Encontra pacientes mesmo com dados parciais, incompletos ou com erros de digitação.'
  },
  {
    title: 'Seguro & Privado',
    description: 'Dados protegidos com criptografia, autenticação BFF e cookies httpOnly.'
  }
]

// Animação de entrada
const isVisible = ref(false)
onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})
</script>

<template>
  <section class="relative overflow-hidden">
    <!-- Gradiente warm sutil — canto inferior direito como Anytype -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-background" />
      <div class="absolute bottom-0 right-0 h-[70%] w-[50%] bg-gradient-to-tl from-amber-100/60 via-rose-100/30 to-transparent dark:from-amber-950/20 dark:via-rose-950/10 dark:to-transparent" />
    </div>

    <!-- Navbar simples -->
    <nav class="relative z-20 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
      <pre class="text-[3.5px] sm:text-[4.3px] leading-none font-mono text-foreground/80 select-none">████████╗██╗   ██╗ ██████╗██╗   ██╗██╗  ██╗██╗
╚══██╔══╝██║   ██║██╔════╝██║   ██║╚██╗██╔╝██║
   ██║   ██║   ██║██║     ██║   ██║ ╚███╔╝ ██║
   ██║   ██║   ██║██║     ██║   ██║ ██╔██╗ ██║
   ██║   ╚██████╔╝╚██████╗╚██████╔╝██╔╝ ██╗██║
   ╚═╝    ╚═════╝  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝</pre>
      <div class="flex items-center gap-3">
        <NuxtLink v-if="auth.isAuthenticated" to="/app">
          <Button size="sm" class="bg-foreground text-background hover:bg-foreground/90 text-xs px-4">
            Workspace
          </Button>
        </NuxtLink>
        <NuxtLink v-else to="/login">
          <Button size="sm" class="bg-foreground text-background hover:bg-foreground/90 text-xs px-4">
            Entrar
          </Button>
        </NuxtLink>
      </div>
    </nav>

    <!-- Hero principal — duas colunas -->
    <div class="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 md:pb-28">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <!-- Esquerda: Título grande -->
        <div
          class="transition-all duration-1000 ease-out"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
        >
          <h1 class="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-foreground leading-[1.08]">
            Dados fragmentados,
            <span class="text-rose-400 dark:text-rose-400">agora conectados</span>
          </h1>
        </div>

        <!-- Direita: Ilustração line-art de dados sendo conectados -->
        <div
          class="relative flex justify-center lg:justify-end transition-all duration-1000 ease-out delay-300"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          aria-hidden="true"
        >
          <svg viewBox="0 0 440 380" fill="none" class="w-full max-w-125 h-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- Glow sutil atrás do registro central -->
            <circle cx="220" cy="200" r="100" fill="currentColor" class="text-rose-400/5" />

            <!-- Registro central unificado (maior, com fill sutil) -->
            <rect x="140" y="100" width="160" height="190" rx="10" fill="currentColor" class="text-background" />
            <rect x="140" y="100" width="160" height="190" rx="10" stroke="currentColor" stroke-width="2" class="text-foreground/70" />
            <!-- Header do registro central -->
            <rect x="140" y="100" width="160" height="34" rx="10" fill="currentColor" class="text-foreground/5" />
            <rect x="140" y="124" width="160" height="10" fill="currentColor" class="text-foreground/5" />
            <line x1="140" y1="134" x2="300" y2="134" stroke="currentColor" stroke-width="1.2" class="text-foreground/20" />
            <!-- Dots do header -->
            <circle cx="157" cy="117" r="4" fill="currentColor" class="text-rose-400/40" />
            <circle cx="171" cy="117" r="4" fill="currentColor" class="text-amber-400/40" />
            <circle cx="185" cy="117" r="4" fill="currentColor" class="text-emerald-400/40" />
            <!-- Ícone pessoa no registro central -->
            <circle cx="220" cy="168" r="18" stroke="currentColor" stroke-width="2" class="text-foreground/50" />
            <path d="M200 200 a20 12 0 0 1 40 0" stroke="currentColor" stroke-width="2" class="text-foreground/50" />
            <!-- Linhas de dados no registro central -->
            <rect x="162" y="218" width="116" height="6" rx="3" fill="currentColor" class="text-foreground/10" />
            <rect x="162" y="234" width="96" height="6" rx="3" fill="currentColor" class="text-foreground/8" />
            <rect x="162" y="250" width="72" height="6" rx="3" fill="currentColor" class="text-foreground/6" />
            <!-- Badge de verificado -->
            <circle cx="282" cy="270" r="12" fill="currentColor" class="text-emerald-500/20" />
            <circle cx="282" cy="270" r="12" stroke="currentColor" stroke-width="1.5" class="text-emerald-500/60" />
            <path d="M276 270 l4 4 l7 -9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500/80" />

            <!-- Registro fragmentado 1 (topo esquerda) -->
            <rect x="12" y="18" width="115" height="84" rx="8" fill="currentColor" class="text-background" />
            <rect x="12" y="18" width="115" height="84" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/25" />
            <rect x="12" y="18" width="115" height="28" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="12" y="38" width="115" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="12" y1="46" x2="127" y2="46" stroke="currentColor" stroke-width="0.8" class="text-foreground/12" />
            <rect x="26" y="56" width="68" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="26" y="68" width="84" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="26" y="80" width="50" height="5" rx="2.5" fill="currentColor" class="text-foreground/5" />
            <!-- Ícone doc -->
            <rect x="28" y="26" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.2" class="text-foreground/20" />
            <line x1="31" y1="31" x2="37" y2="31" stroke="currentColor" stroke-width="0.8" class="text-foreground/15" />
            <line x1="31" y1="34" x2="37" y2="34" stroke="currentColor" stroke-width="0.8" class="text-foreground/15" />

            <!-- Registro fragmentado 2 (topo direita) -->
            <rect x="310" y="8" width="115" height="84" rx="8" fill="currentColor" class="text-background" />
            <rect x="310" y="8" width="115" height="84" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/25" />
            <rect x="310" y="8" width="115" height="28" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="310" y="28" width="115" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="310" y1="36" x2="425" y2="36" stroke="currentColor" stroke-width="0.8" class="text-foreground/12" />
            <rect x="324" y="46" width="84" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="324" y="58" width="68" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="324" y="70" width="50" height="5" rx="2.5" fill="currentColor" class="text-foreground/5" />
            <!-- Ícone database -->
            <ellipse cx="326" cy="20" rx="7" ry="4" stroke="currentColor" stroke-width="1.2" class="text-foreground/20" />
            <path d="M319 20 v8 a7 4 0 0 0 14 0 v-8" stroke="currentColor" stroke-width="1.2" class="text-foreground/20" />

            <!-- Registro fragmentado 3 (baixo esquerda) -->
            <rect x="5" y="268" width="115" height="84" rx="8" fill="currentColor" class="text-background" />
            <rect x="5" y="268" width="115" height="84" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/25" />
            <rect x="5" y="268" width="115" height="28" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="5" y="288" width="115" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="5" y1="296" x2="120" y2="296" stroke="currentColor" stroke-width="0.8" class="text-foreground/12" />
            <rect x="19" y="306" width="84" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="19" y="318" width="68" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="19" y="330" width="42" height="5" rx="2.5" fill="currentColor" class="text-foreground/5" />
            <!-- Ícone search -->
            <circle cx="25" cy="282" r="6" stroke="currentColor" stroke-width="1.2" class="text-foreground/20" />
            <line x1="30" y1="287" x2="34" y2="291" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" class="text-foreground/20" />

            <!-- Registro fragmentado 4 (baixo direita) -->
            <rect x="330" y="295" width="100" height="68" rx="8" fill="currentColor" class="text-background" />
            <rect x="330" y="295" width="100" height="68" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/18" />
            <rect x="330" y="295" width="100" height="24" rx="8" fill="currentColor" class="text-foreground/3" />
            <rect x="330" y="312" width="100" height="7" fill="currentColor" class="text-foreground/3" />
            <line x1="330" y1="319" x2="430" y2="319" stroke="currentColor" stroke-width="0.8" class="text-foreground/10" />
            <rect x="344" y="329" width="68" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="344" y="341" width="50" height="5" rx="2.5" fill="currentColor" class="text-foreground/4" />

            <!-- Linhas de conexão (pontilhadas, com cor accent) dos fragmentos ao central -->
            <!-- Fragmento 1 → Central -->
            <path d="M127 65 C155 65, 155 80, 155 100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" class="text-rose-400/30" />
            <!-- Fragmento 2 → Central -->
            <path d="M310 55 C285 55, 280 75, 280 100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" class="text-rose-400/30" />
            <!-- Fragmento 3 → Central -->
            <path d="M120 305 C145 290, 150 290, 155 290" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" class="text-rose-400/30" />
            <!-- Fragmento 4 → Central -->
            <path d="M330 325 C310 310, 305 295, 300 290" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4" class="text-rose-400/25" />

            <!-- Círculos nos pontos de conexão (com cor accent) -->
            <circle cx="155" cy="100" r="4" fill="currentColor" class="text-rose-400/50" />
            <circle cx="280" cy="100" r="4" fill="currentColor" class="text-rose-400/50" />
            <circle cx="155" cy="290" r="4" fill="currentColor" class="text-rose-400/50" />
            <circle cx="300" cy="290" r="4" fill="currentColor" class="text-rose-400/45" />

            <!-- Pequenos pontos decorativos nas conexões -->
            <circle cx="142" cy="82" r="2" fill="currentColor" class="text-rose-400/25" />
            <circle cx="290" cy="78" r="2" fill="currentColor" class="text-rose-400/25" />
            <circle cx="138" cy="290" r="2" fill="currentColor" class="text-rose-400/25" />
            <circle cx="315" cy="300" r="2" fill="currentColor" class="text-rose-400/20" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Feature cards — borda superior, 3 colunas com divisórias -->
    <div class="border-t border-border/40">
      <div
        class="max-w-7xl mx-auto transition-all duration-1000 ease-out delay-500"
        :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/40">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="px-6 py-8 md:px-8 md:py-10"
          >
            <h3 class="text-lg font-bold text-foreground mb-2">{{ feature.title }}</h3>
            <p class="text-base text-muted-foreground leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
