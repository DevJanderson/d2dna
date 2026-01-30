<script setup lang="ts">
/**
 * Pagina inicial - Tucuxi-Blast
 * Design: MX (Machine Experience) + ASCII Art
 */
const auth = useAuthStore()

onMounted(() => {
  auth.checkAuth()
})

// ASCII Art do Tucuxi (golfinho da Amazonia)
const asciiLogo = `
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

// Structured data para SEO/AI
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'Tucuxi-Blast',
        description: 'Sistema de Record Linkage e Gestao de Dados',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        provider: {
          '@type': 'Organization',
          name: 'D2DNA'
        }
      })
    }
  ]
})
</script>

<template>
  <main class="min-h-screen bg-background font-mono">
    <article class="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <!-- Header - Two Columns -->
      <header class="mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <!-- Esquerda: Titulo -->
        <div>
          <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Tucuxi-Blast
          </h1>
          <p class="text-sm text-muted-foreground mb-4">
            Sistema de Record Linkage e Gestao de Dados
          </p>
          <!-- Logo D2DNA ASCII -->
          <pre class="text-[10px] sm:text-xs leading-tight text-muted-foreground/70 select-none" aria-hidden="true">
 ____   ___  ____  _   _    _
|  _ \ |__ \|  _ \| \ | |  / \
| | | |  / /| | | |  \| | / _ \
| |_| | / /_| |_| | |\  |/ ___ \
|____/ |____|____/|_| \_/_/   \_\</pre>
        </div>

        <!-- Direita: ASCII Art -->
        <div class="overflow-hidden" aria-hidden="true">
          <pre class="text-[6px] sm:text-[8px] md:text-[10px] leading-tight text-primary select-none whitespace-pre">{{ asciiLogo }}</pre>
        </div>
      </header>

      <!-- Separador -->
      <div class="mb-8 text-muted-foreground/30 text-xs select-none" aria-hidden="true">
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      </div>

      <!-- Descricao -->
      <section aria-labelledby="about-heading" class="mb-8">
        <h2 id="about-heading" class="sr-only">Sobre o sistema</h2>
        <p class="text-sm text-muted-foreground leading-relaxed">
          Plataforma que elimina duplicatas e garante dados unicos
          e confiaveis atraves de algoritmos avancados de comparacao
          e vinculacao de registros.
        </p>
      </section>

      <!-- Separador -->
      <div class="mb-8 text-muted-foreground/30 text-xs select-none" aria-hidden="true">
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      </div>

      <!-- Acoes -->
      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading" class="sr-only">Acoes disponiveis</h2>

        <!-- Autenticado -->
        <div v-if="auth.isAuthenticated" class="space-y-6">
          <div class="text-sm space-y-1">
            <p>
              <span class="text-muted-foreground">&gt; status:</span>
              <span class="text-green-500 ml-2">online</span>
            </p>
            <p>
              <span class="text-muted-foreground">&gt; user:</span>
              <span class="text-foreground ml-2">{{ auth.user?.nome }}</span>
            </p>
          </div>

          <nav aria-label="Navegacao principal" class="flex flex-col sm:flex-row gap-3">
            <NuxtLink to="/app">
              <Button size="lg" class="w-full sm:w-auto">
                [ Acessar Workspace ]
              </Button>
            </NuxtLink>
            <Button variant="ghost" size="lg" @click="auth.logout()">
              [ Sair ]
            </Button>
          </nav>
        </div>

        <!-- Nao autenticado -->
        <div v-else class="space-y-6">
          <div class="text-sm">
            <span class="text-muted-foreground">&gt; status:</span>
            <span class="text-yellow-500 ml-2">aguardando autenticacao</span>
          </div>

          <nav aria-label="Navegacao principal">
            <NuxtLink to="/login">
              <Button size="lg">
                [ Iniciar Sessao ]
              </Button>
            </NuxtLink>
          </nav>
        </div>
      </section>
    </article>

    <!-- Footer -->
    <footer class="max-w-4xl mx-auto px-6 pb-12">
      <div class="text-xs text-muted-foreground/50 mb-8">
        <span>&copy; {{ new Date().getFullYear() }} D2DNA</span>
        <span class="mx-2">~</span>
        <span>v1.0</span>
      </div>

      <!-- Equipe -->
      <div class="text-center">
        <p class="text-xs text-muted-foreground mb-8">&gt; equipe</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <!-- Deney Araújo - CEO & Dev → Verde -->
          <div class="relative h-40">
            <svg class="absolute top-0 left-0 w-48 h-40 text-green-200 dark:text-green-900/50" viewBox="0 0 288 199" fill="currentColor">
              <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
            </svg>
            <div class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-green-100 dark:bg-green-900">
              <img src="https://d2dna.com/wp-content/uploads/2024/04/Deney.png" alt="Deney Araújo" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-8 left-36 text-left">
              <p class="text-lg font-bold text-green-700 dark:text-green-300">Deney Araújo</p>
              <p class="text-sm text-muted-foreground">CEO & Dev</p>
            </div>
          </div>
          <!-- Helder Nakaya - CSO → Azul -->
          <div class="relative h-40">
            <svg class="absolute top-0 left-0 w-48 h-40 text-blue-200 dark:text-blue-900/50" viewBox="0 0 288 199" fill="currentColor">
              <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
            </svg>
            <div class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-blue-100 dark:bg-blue-900">
              <img src="https://d2dna.com/wp-content/uploads/2024/04/helder.png" alt="Helder Nakaya" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-8 left-36 text-left">
              <p class="text-lg font-bold text-blue-700 dark:text-blue-300">Helder Nakaya</p>
              <p class="text-sm text-muted-foreground">CSO</p>
            </div>
          </div>
          <!-- Jorge Kalil - Consultor Sênior → Âmbar -->
          <div class="relative h-40">
            <svg class="absolute top-0 left-0 w-48 h-40 text-amber-200 dark:text-amber-900/50" viewBox="0 0 288 199" fill="currentColor">
              <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
            </svg>
            <div class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-amber-100 dark:bg-amber-900">
              <img src="https://d2dna.com/wp-content/uploads/2024/04/Jorge.png" alt="Jorge Kalil" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-8 left-36 text-left">
              <p class="text-lg font-bold text-amber-700 dark:text-amber-300">Jorge Kalil</p>
              <p class="text-sm text-muted-foreground">Consultor Sênior</p>
            </div>
          </div>
          <!-- Joana Azevedo - Bioinformata → Fuchsia -->
          <div class="relative h-40">
            <svg class="absolute top-0 left-0 w-48 h-40 text-fuchsia-200 dark:text-fuchsia-900/50" viewBox="0 0 288 199" fill="currentColor">
              <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
            </svg>
            <div class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-fuchsia-100 dark:bg-fuchsia-900">
              <img src="https://d2dna.com/wp-content/uploads/2024/04/Joana.png" alt="Joana Azevedo" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-8 left-36 text-left">
              <p class="text-lg font-bold text-fuchsia-700 dark:text-fuchsia-300">Joana Azevedo</p>
              <p class="text-sm text-muted-foreground">Bioinformata</p>
            </div>
          </div>
          <!-- Willian Caldas - Backend & Data Engineer → Indigo -->
          <div class="relative h-40">
            <svg class="absolute top-0 left-0 w-48 h-40 text-indigo-200 dark:text-indigo-900/50" viewBox="0 0 288 199" fill="currentColor">
              <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
            </svg>
            <div class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-indigo-100 dark:bg-indigo-900">
              <img src="https://d2dna.com/wp-content/uploads/2024/04/willian.png" alt="Willian Caldas" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-8 left-36 text-left">
              <p class="text-lg font-bold text-indigo-700 dark:text-indigo-300">Willian Caldas</p>
              <p class="text-sm text-muted-foreground">Backend & Data Engineer</p>
            </div>
          </div>
          <!-- Janderson Lira - Frontend & DevOps → Laranja -->
          <div class="relative h-40">
            <svg class="absolute top-0 left-0 w-48 h-40 text-orange-200 dark:text-orange-900/50" viewBox="0 0 288 199" fill="currentColor">
              <path d="M288 155.81V43.39c0-41.85-53.48-59.36-78.23-25.61l-52.79 71.98a43.317 43.317 0 0 1-34.92 17.69H43.31C19.39 107.45 0 126.84 0 150.76v5.05c0 23.92 19.39 43.31 43.31 43.31h201.38c23.92 0 43.31-19.39 43.31-43.31Z" />
            </svg>
            <div class="absolute top-6 left-6 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-orange-100 dark:bg-orange-900">
              <img src="https://d2dna.com/wp-content/uploads/2024/04/janderson.png" alt="Janderson Lira" class="w-full h-full object-cover" />
            </div>
            <div class="absolute top-8 left-36 text-left">
              <p class="text-lg font-bold text-orange-700 dark:text-orange-300">Janderson Lira</p>
              <p class="text-sm text-muted-foreground">Frontend & DevOps</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </main>
</template>
