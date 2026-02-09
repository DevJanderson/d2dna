export function useDocsToc() {
  const activeId = ref('')

  let observer: IntersectionObserver | null = null

  function observe(container: HTMLElement) {
    const headings = container.querySelectorAll('h2[id], h3[id]')
    if (!headings.length) return

    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    )

    headings.forEach(heading => observer!.observe(heading))
  }

  function cleanup() {
    observer?.disconnect()
    observer = null
  }

  onBeforeUnmount(cleanup)

  return {
    activeId,
    observe,
    cleanup
  }
}
