/**
 * Scientific Calculator Constants
 * Mathematical constants, operator precedence, and configuration
 */

import type { ConstantType } from './types'

/**
 * Mathematical constants with high precision
 */
export const MATH_CONSTANTS: Record<ConstantType, number> = {
  PI: Math.PI,
  E: Math.E,
  PHI: (1 + Math.sqrt(5)) / 2, // Golden ratio
}

/**
 * Get constant value by name
 */
export function getConstant(name: ConstantType): number {
  return MATH_CONSTANTS[name]
}

/**
 * Operator precedence (higher = binds tighter)
 */
export const OPERATOR_PRECEDENCE: Record<string, number> = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
  MOD: 2,
  '^': 3,
}

/**
 * Right-associative operators
 */
export const RIGHT_ASSOCIATIVE = new Set(['^'])

/**
 * Maximum digits to display
 */
export const MAX_DISPLAY_DIGITS = 15

/**
 * Maximum history entries
 */
export const MAX_HISTORY_ENTRIES = 50

/**
 * Display labels for constants
 */
export const CONSTANT_LABELS: Record<ConstantType, string> = {
  PI: '\u03C0', // Greek letter pi
  E: 'e',
  PHI: '\u03C6', // Greek letter phi
}

/**
 * Function display names
 */
export const FUNCTION_LABELS: Record<string, string> = {
  sin: 'sin',
  cos: 'cos',
  tan: 'tan',
  asin: 'sin\u207B\u00B9', // sin⁻¹
  acos: 'cos\u207B\u00B9', // cos⁻¹
  atan: 'tan\u207B\u00B9', // tan⁻¹
  sinh: 'sinh',
  cosh: 'cosh',
  tanh: 'tanh',
  log: 'log',
  ln: 'ln',
  log2: 'log\u2082', // log₂
  sqrt: '\u221A', // √
  cbrt: '\u221B', // ∛
  exp: 'e^x',
  abs: '|x|',
  floor: '\u230A\u230B', // ⌊⌋
  ceil: '\u2308\u2309', // ⌈⌉
  round: 'round',
}

/**
 * Operator display symbols
 */
export const OPERATOR_SYMBOLS: Record<string, string> = {
  '+': '+',
  '-': '\u2212', // minus sign
  '*': '\u00D7', // multiplication sign
  '/': '\u00F7', // division sign
  '^': '^',
  MOD: 'mod',
}
