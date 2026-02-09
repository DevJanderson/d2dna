/**
 * Utilitários DOM para o sistema de janelas
 * @module utils/dom
 */

import type { Ref } from 'vue'

/** Obtém o DOMRect do elemento pai de um elemento referenciado */
export function getParentRect(elementRef: Ref<HTMLElement | null>): DOMRect | null {
  const parent = elementRef.value?.parentElement
  return parent?.getBoundingClientRect() || null
}
