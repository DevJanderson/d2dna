<script setup lang="ts">
/**
 * Seção call-to-action — antes do footer
 * Incentiva o visitante a começar ou explorar a documentação
 */
const { sectionRef, isVisible } = useSectionVisibility({ threshold: 0.2 })

const { prefersReducedMotion } = usePrefersReducedMotion()
</script>

<template>
  <section
    ref="sectionRef"
    class="relative z-20 w-full max-w-7xl mx-auto px-6 py-16 md:py-24 transition-all duration-700 ease-out"
    :class="isVisible || prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'"
  >
    <div
      class="mx-auto max-w-3xl rounded-2xl border border-border/40 bg-card px-6 py-12 text-center md:px-12 md:py-16"
    >
      <!-- ASCII decorativo -->
      <p
        class="mb-6 font-mono text-xs text-muted-foreground/30 select-none tracking-[0.3em]"
        aria-hidden="true"
      >
        ╔══════════════════════╗
      </p>

      <h2 class="mb-3 font-mono text-3xl font-bold text-foreground md:text-4xl">
        Comece a unificar seus dados hoje
      </h2>
      <p class="mx-auto mb-8 max-w-md text-base text-muted-foreground leading-relaxed">
        De registros fragmentados a um cadastro único e rastreável. Sem cluster, sem cloud — no seu
        servidor.
      </p>

      <div class="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button as-child>
          <NuxtLink to="/login">Começar agora</NuxtLink>
        </Button>
        <Button variant="outline" as-child>
          <NuxtLink to="/docs">Documentação</NuxtLink>
        </Button>
      </div>

      <p
        class="mt-6 font-mono text-xs text-muted-foreground/30 select-none tracking-[0.3em]"
        aria-hidden="true"
      >
        ╚══════════════════════╝
      </p>
    </div>
  </section>
</template>
