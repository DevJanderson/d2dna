<script setup lang="ts">
/**
 * Hero section - inspirada no Anytype.io
 * Layout: título esquerda, ilustração direita, feature cards abaixo
 */
const auth = useAuthStore()

const _asciiTucuxi = `                                      .--.
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
      <div class="absolute bottom-0 right-0 h-[70%] w-[50%] bg-linear-to-tl from-sky-100/50 via-blue-50/30 to-transparent dark:from-sky-950/20 dark:via-blue-950/10 dark:to-transparent" />
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
            <span class="text-sky-500 dark:text-sky-400">agora conectados</span>
          </h1>
        </div>

        <!-- Direita: Ilustração line-art de dados sendo conectados -->
        <div
          class="relative flex justify-center lg:justify-end transition-all duration-1000 ease-out delay-300"
          :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
          aria-hidden="true"
        >
          <svg viewBox="0 0 460 400" fill="none" class="w-full max-w-130 h-auto" xmlns="http://www.w3.org/2000/svg">
            <!-- Glow sutil atrás do registro central -->
            <circle cx="230" cy="200" r="110" fill="currentColor" class="hero-glow text-sky-500/5" />

            <!-- ═══ REGISTRO CENTRAL UNIFICADO ═══ -->
            <rect x="150" y="100" width="160" height="200" rx="10" fill="currentColor" class="text-background" />
            <rect x="150" y="100" width="160" height="200" rx="10" stroke="currentColor" stroke-width="2" class="text-foreground/70" />
            <!-- Header -->
            <rect x="150" y="100" width="160" height="34" rx="10" fill="currentColor" class="text-foreground/5" />
            <rect x="150" y="124" width="160" height="10" fill="currentColor" class="text-foreground/5" />
            <line x1="150" y1="134" x2="310" y2="134" stroke="currentColor" stroke-width="1.2" class="text-foreground/15" />
            <!-- Dots do header -->
            <circle cx="167" cy="117" r="4" fill="currentColor" class="text-sky-500/40" />
            <circle cx="181" cy="117" r="4" fill="currentColor" class="text-amber-400/40" />
            <circle cx="195" cy="117" r="4" fill="currentColor" class="text-emerald-400/40" />
            <!-- Ícone pessoa -->
            <circle cx="230" cy="170" r="18" stroke="currentColor" stroke-width="2" class="text-foreground/40" />
            <path d="M210 202 a20 12 0 0 1 40 0" stroke="currentColor" stroke-width="2" class="text-foreground/40" />
            <!-- Linhas de dados -->
            <rect x="172" y="222" width="116" height="6" rx="3" fill="currentColor" class="text-foreground/10" />
            <rect x="172" y="238" width="96" height="6" rx="3" fill="currentColor" class="text-foreground/8" />
            <rect x="172" y="254" width="72" height="6" rx="3" fill="currentColor" class="text-foreground/6" />
            <!-- Label "DNA" no card -->
            <text x="280" y="150" class="text-sky-500/20" fill="currentColor" font-size="11" font-family="monospace" font-weight="bold">DNA</text>
            <!-- Badge verificado -->
            <circle cx="292" cy="280" r="12" fill="currentColor" class="text-emerald-500/15" />
            <circle cx="292" cy="280" r="12" stroke="currentColor" stroke-width="1.5" class="text-emerald-500/50" />
            <path d="M286 280 l4 4 l7 -9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500/70" />

            <!-- ═══ FRAGMENTO 1 — TOPO ESQUERDA (Documento) ═══ -->
            <g class="hero-float">
            <rect x="15" y="25" width="120" height="85" rx="8" fill="currentColor" class="text-background" />
            <rect x="15" y="25" width="120" height="85" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/20" />
            <rect x="15" y="25" width="120" height="26" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="15" y="43" width="120" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="15" y1="51" x2="135" y2="51" stroke="currentColor" stroke-width="0.8" class="text-foreground/10" />
            <rect x="28" y="60" width="72" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="28" y="72" width="88" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="28" y="84" width="54" height="5" rx="2.5" fill="currentColor" class="text-foreground/4" />
            <!-- Ícone doc -->
            <rect x="30" y="32" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.2" class="text-foreground/18" />
            <line x1="33" y1="37" x2="39" y2="37" stroke="currentColor" stroke-width="0.8" class="text-foreground/12" />
            <line x1="33" y1="40" x2="39" y2="40" stroke="currentColor" stroke-width="0.8" class="text-foreground/12" />
            </g>

            <!-- ═══ FRAGMENTO 2 — TOPO DIREITA (Banco de dados) ═══ -->
            <g class="hero-float hero-float-delay-1">
            <rect x="325" y="15" width="120" height="85" rx="8" fill="currentColor" class="text-background" />
            <rect x="325" y="15" width="120" height="85" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/20" />
            <rect x="325" y="15" width="120" height="26" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="325" y="33" width="120" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="325" y1="41" x2="445" y2="41" stroke="currentColor" stroke-width="0.8" class="text-foreground/10" />
            <rect x="338" y="50" width="88" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="338" y="62" width="72" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="338" y="74" width="54" height="5" rx="2.5" fill="currentColor" class="text-foreground/4" />
            <!-- Ícone database -->
            <ellipse cx="340" cy="27" rx="7" ry="4" stroke="currentColor" stroke-width="1.2" class="text-foreground/18" />
            <path d="M333 27 v8 a7 4 0 0 0 14 0 v-8" stroke="currentColor" stroke-width="1.2" class="text-foreground/18" />
            </g>

            <!-- ═══ FRAGMENTO 3 — BAIXO ESQUERDA (Busca) ═══ -->
            <g class="hero-float hero-float-delay-2">
            <rect x="10" y="285" width="120" height="85" rx="8" fill="currentColor" class="text-background" />
            <rect x="10" y="285" width="120" height="85" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/20" />
            <rect x="10" y="285" width="120" height="26" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="10" y="303" width="120" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="10" y1="311" x2="130" y2="311" stroke="currentColor" stroke-width="0.8" class="text-foreground/10" />
            <rect x="24" y="320" width="88" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="24" y="332" width="72" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="24" y="344" width="46" height="5" rx="2.5" fill="currentColor" class="text-foreground/4" />
            <!-- Ícone search -->
            <circle cx="30" cy="298" r="6" stroke="currentColor" stroke-width="1.2" class="text-foreground/18" />
            <line x1="35" y1="303" x2="39" y2="307" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" class="text-foreground/18" />
            </g>

            <!-- ═══ FRAGMENTO 4 — BAIXO DIREITA (Gráfico) ═══ -->
            <g class="hero-float hero-float-delay-3">
            <rect x="325" y="290" width="120" height="85" rx="8" fill="currentColor" class="text-background" />
            <rect x="325" y="290" width="120" height="85" rx="8" stroke="currentColor" stroke-width="1.5" class="text-foreground/20" />
            <rect x="325" y="290" width="120" height="26" rx="8" fill="currentColor" class="text-foreground/4" />
            <rect x="325" y="308" width="120" height="8" fill="currentColor" class="text-foreground/4" />
            <line x1="325" y1="316" x2="445" y2="316" stroke="currentColor" stroke-width="0.8" class="text-foreground/10" />
            <rect x="338" y="325" width="88" height="5" rx="2.5" fill="currentColor" class="text-foreground/8" />
            <rect x="338" y="337" width="72" height="5" rx="2.5" fill="currentColor" class="text-foreground/6" />
            <rect x="338" y="349" width="54" height="5" rx="2.5" fill="currentColor" class="text-foreground/4" />
            <!-- Ícone chart -->
            <rect x="332" y="303" width="3" height="10" rx="1" fill="currentColor" class="text-foreground/18" />
            <rect x="337" y="299" width="3" height="14" rx="1" fill="currentColor" class="text-foreground/18" />
            <rect x="342" y="306" width="3" height="7" rx="1" fill="currentColor" class="text-foreground/18" />
            </g>

            <!-- ═══ CONEXÕES (top, right, bottom, left do card central) ═══ -->
            <!-- Frag 1 (topo-esq) → TOP (230, 100) -->
            <path d="M135 67 C180 67, 230 75, 230 100" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" class="hero-flow text-sky-500/35" />
            <!-- Frag 2 (topo-dir) → RIGHT (310, 200) -->
            <path d="M325 57 C325 120, 310 140, 310 200" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" class="hero-flow hero-flow-delay-1 text-sky-500/35" />
            <!-- Frag 3 (baixo-esq) → LEFT (150, 200) -->
            <path d="M130 327 C130 270, 150 250, 150 200" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" class="hero-flow hero-flow-delay-2 text-sky-500/35" />
            <!-- Frag 4 (baixo-dir) → BOTTOM (230, 300) -->
            <path d="M325 332 C280 332, 230 320, 230 300" stroke="currentColor" stroke-width="1.5" stroke-dasharray="6 4" class="hero-flow hero-flow-delay-3 text-sky-500/35" />

            <!-- Círculos estáticos: top, right, bottom, left -->
            <circle cx="230" cy="100" r="4" fill="currentColor" class="text-sky-500/50" />
            <circle cx="310" cy="200" r="4" fill="currentColor" class="text-sky-500/50" />
            <circle cx="150" cy="200" r="4" fill="currentColor" class="text-sky-500/50" />
            <circle cx="230" cy="300" r="4" fill="currentColor" class="text-sky-500/50" />

            <!-- Halos estáticos: top, right, bottom, left -->
            <circle cx="230" cy="100" r="8" stroke="currentColor" stroke-width="0.8" fill="none" class="text-sky-500/15" />
            <circle cx="310" cy="200" r="8" stroke="currentColor" stroke-width="0.8" fill="none" class="text-sky-500/15" />
            <circle cx="150" cy="200" r="8" stroke="currentColor" stroke-width="0.8" fill="none" class="text-sky-500/15" />
            <circle cx="230" cy="300" r="8" stroke="currentColor" stroke-width="0.8" fill="none" class="text-sky-500/15" />
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

<style scoped>
/* Fluxo de dados nas conexões (stroke-dashoffset animado) */
.hero-flow {
  animation: hero-flow 2.5s linear infinite;
}
.hero-flow-delay-1 { animation-delay: 0.6s; }
.hero-flow-delay-2 { animation-delay: 1.2s; }
.hero-flow-delay-3 { animation-delay: 1.8s; }

@keyframes hero-flow {
  to {
    stroke-dashoffset: -20;
  }
}

/* Flutuação sutil dos fragmentos */
.hero-float {
  animation: hero-float 4s ease-in-out infinite;
}
.hero-float-delay-1 { animation-delay: 1s; }
.hero-float-delay-2 { animation-delay: 2s; }
.hero-float-delay-3 { animation-delay: 3s; }

@keyframes hero-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* Pulse no glow atrás do card central */
.hero-glow {
  transform-origin: center;
  animation: hero-glow 3.5s ease-in-out infinite;
}

@keyframes hero-glow {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.08);
  }
}

/* Respeita preferência do usuário por menos movimento */
@media (prefers-reduced-motion: reduce) {
  .hero-flow,
  .hero-float,
  .hero-glow {
    animation: none;
  }
}
</style>
