/**
 * Composable para animação count-up com easing cubic.
 * Respeita prefers-reduced-motion e faz cleanup do RAF automaticamente.
 */
interface CountUpStat {
  value: number
  decimals?: number
}

interface UseCountUpOptions {
  duration?: number
}

export function useCountUp(stats: CountUpStat[], options?: UseCountUpOptions) {
  const duration = options?.duration ?? 1500
  const hasAnimated = ref(false)
  const displayValues = ref<string[]>(stats.map(() => '0'))

  let animationFrameId: number | null = null

  function easeOut(t: number): number {
    return 1 - (1 - t) ** 3
  }

  function formatValue(current: number, stat: CountUpStat): string {
    if (stat.decimals && stat.decimals > 0) {
      return current.toFixed(stat.decimals)
    }
    return Math.round(current).toString()
  }

  function start(skipAnimation = false) {
    if (hasAnimated.value) return
    hasAnimated.value = true

    if (skipAnimation) {
      displayValues.value = stats.map((stat) => formatValue(stat.value, stat))
      return
    }

    const startTime = performance.now()

    function animate(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOut(progress)

      displayValues.value = stats.map((stat) => {
        const current = eased * stat.value
        return formatValue(current, stat)
      })

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate)
      } else {
        animationFrameId = null
      }
    }

    animationFrameId = requestAnimationFrame(animate)
  }

  onUnmounted(() => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return { displayValues, hasAnimated, start }
}
