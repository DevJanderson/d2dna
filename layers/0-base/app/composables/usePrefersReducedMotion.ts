export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false)

  onMounted(() => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
  })

  return { prefersReducedMotion }
}
