<script setup lang="ts">
/**
 * Seção "Enterprise-ready" — segurança e compliance
 * Inspirada na Pinecone, adaptada para contexto LGPD/saúde
 */
import { Scale, Shield } from 'lucide-vue-next'

const { sectionRef, isVisible } = useSectionVisibility()

const { prefersReducedMotion } = usePrefersReducedMotion()

const blocks = [
  {
    icon: Shield,
    title: 'Seguro por Design',
    items: [
      'Cookies httpOnly — zero tokens no client',
      'Dados em trânsito encriptados (TLS)',
      'Codificação DNA muda a cada execução'
    ]
  },
  {
    icon: Scale,
    title: 'LGPD Compliance',
    items: [
      'Dados de saúde protegidos por lei',
      'Trilha de auditoria completa',
      'Conformidade com legislação brasileira'
    ]
  }
]
</script>

<template>
  <section
    id="security"
    ref="sectionRef"
    aria-labelledby="security-heading"
    class="relative z-20 w-full max-w-7xl mx-auto px-6 py-12 md:py-20"
  >
    <h2
      id="security-heading"
      class="mb-4 text-center font-mono text-3xl font-bold text-foreground transition-all duration-700 ease-out"
      :class="
        isVisible || prefersReducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      "
    >
      Enterprise-Ready
    </h2>
    <p
      class="mx-auto mb-10 max-w-xl text-center text-base text-muted-foreground transition-all duration-700 ease-out delay-100"
      :class="
        isVisible || prefersReducedMotion
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4'
      "
    >
      Segurança e compliance pensados para dados sensíveis de saúde.
    </p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div
        v-for="(block, index) in blocks"
        :key="block.title"
        class="rounded-2xl border border-border/40 bg-card p-6 transition-all duration-500 ease-out md:p-8"
        :class="
          isVisible || prefersReducedMotion
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        "
        :style="{ transitionDelay: prefersReducedMotion ? '0ms' : `${index * 150}ms` }"
      >
        <div class="mb-4 flex items-center gap-3">
          <component
            :is="block.icon"
            :size="24"
            :stroke-width="1.5"
            class="text-muted-foreground"
          />
          <h3 class="text-xl font-bold text-foreground">{{ block.title }}</h3>
        </div>
        <ul class="space-y-2">
          <li
            v-for="item in block.items"
            :key="item"
            class="flex items-start gap-2 text-base text-muted-foreground leading-relaxed"
          >
            <span class="mt-1.5 block h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
