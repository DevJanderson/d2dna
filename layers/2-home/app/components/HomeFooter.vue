<script setup lang="ts">
/**
 * Footer completo — logo, colunas de links, redes sociais e copyright
 */
import { Github, Linkedin } from 'lucide-vue-next'

const links = {
  produto: [
    { label: 'Workspace', href: '/login' },
    { label: 'Record Linkage', href: '/#how-it-works' }
  ],
  recursos: [
    { label: 'Documentação', href: '/docs' },
    { label: 'API', href: '/docs' }
  ],
  empresa: [
    { label: 'Sobre', href: '/#team' },
    { label: 'Contato', href: 'mailto:contato@d2dna.com' }
  ]
}

const socials = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/d2dna/',
    icon: Linkedin
  },
  {
    label: 'GitHub',
    href: 'https://github.com/d2dna',
    icon: Github
  }
]
</script>

<template>
  <footer class="relative z-20 border-t border-border/40 font-mono">
    <div class="w-full max-w-7xl mx-auto px-6 py-10 md:py-14">
      <!-- Topo: Logo + colunas -->
      <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
        <!-- Logo e descrição -->
        <div class="col-span-2 md:col-span-1">
          <p class="mb-2 font-mono text-sm font-bold text-foreground">D2DNA</p>
          <p class="text-sm text-muted-foreground leading-relaxed">
            Bioinformática aplicada a record linkage. Unificando registros com a precisão do DNA.
          </p>
          <!-- Redes -->
          <div class="mt-4 flex gap-3">
            <a
              v-for="social in socials"
              :key="social.label"
              :href="social.href"
              :aria-label="social.label"
              target="_blank"
              rel="noopener noreferrer"
              class="text-muted-foreground/50 transition-colors hover:text-foreground"
            >
              <component :is="social.icon" :size="20" :stroke-width="1.5" />
            </a>
          </div>
        </div>

        <!-- Colunas de links -->
        <div>
          <h3 class="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground/70">
            Produto
          </h3>
          <ul class="space-y-2">
            <li v-for="link in links.produto" :key="link.label">
              <NuxtLink
                :to="link.href"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground/70">
            Recursos
          </h3>
          <ul class="space-y-2">
            <li v-for="link in links.recursos" :key="link.label">
              <NuxtLink
                :to="link.href"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="mb-3 font-mono text-xs font-bold uppercase tracking-wider text-foreground/70">
            Empresa
          </h3>
          <ul class="space-y-2">
            <li v-for="link in links.empresa" :key="link.label">
              <NuxtLink
                :to="link.href"
                class="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom: copyright -->
      <div class="mt-10 flex items-center justify-between border-t border-border/20 pt-6">
        <p class="font-mono text-xs text-muted-foreground/60">
          &copy; {{ new Date().getFullYear() }} D2DNA
        </p>
        <p class="font-mono text-xs text-muted-foreground/40">v1.0</p>
      </div>
    </div>
  </footer>
</template>
