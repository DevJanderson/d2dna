import { describe, it, expect } from 'vitest'
import { cn } from '../../../../layers/0-base/app/utils/utils'

describe('cn', () => {
  it('should merge single class', () => {
    expect(cn('text-red-500')).toBe('text-red-500')
  })

  it('should merge multiple classes', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should resolve tailwind conflicts (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })

  it('should handle conditional classes via clsx', () => {
    const result = cn('base', false && 'hidden', 'visible')
    expect(result).toBe('base visible')
  })

  it('should handle objects', () => {
    const result = cn('base', { 'text-bold': true, hidden: false })
    expect(result).toBe('base text-bold')
  })

  it('should handle arrays', () => {
    const result = cn(['p-4', 'mt-2'])
    expect(result).toBe('p-4 mt-2')
  })

  it('should handle undefined and null', () => {
    const result = cn('base', undefined, null, 'end')
    expect(result).toBe('base end')
  })

  it('should return empty string for no args', () => {
    expect(cn()).toBe('')
  })

  it('should merge padding conflicts', () => {
    const result = cn('p-4', 'p-2')
    expect(result).toBe('p-2')
  })
})
