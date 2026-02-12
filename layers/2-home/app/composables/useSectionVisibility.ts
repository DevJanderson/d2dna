import { useIntersectionObserver } from '@vueuse/core'

/**
 * Composable para fade-in de seções via IntersectionObserver.
 * Dispara uma vez e para de observar automaticamente.
 */
export function useSectionVisibility(options?: { threshold?: number }) {
  const sectionRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  const { stop } = useIntersectionObserver(
    sectionRef,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true
        stop()
      }
    },
    { threshold: options?.threshold ?? 0.15 }
  )

  return { sectionRef, isVisible }
}
