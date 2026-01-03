/**
 * Scientific Calculator - Main Calculations Entry Point
 * Combines tokenizer, parser, and evaluator
 */

import type { AngleMode, CalculationResult, ExpressionValidation } from './types'
import { tokenize } from './tokenizer'
import { parse } from './parser'
import { evaluateAST, formatResult } from './evaluator'

/**
 * Validate expression syntax
 */
export function validateExpression(expression: string): ExpressionValidation {
  const errors: ExpressionValidation['errors'] = []
  const warnings: string[] = []

  // Check for empty expression
  if (!expression.trim()) {
    errors.push({ message: 'Expression is empty' })
    return { valid: false, errors }
  }

  // Check parentheses balance
  let parenCount = 0
  for (let i = 0; i < expression.length; i++) {
    if (expression[i] === '(') parenCount++
    if (expression[i] === ')') parenCount--
    if (parenCount < 0) {
      errors.push({ message: 'Unmatched closing parenthesis', position: i })
      break
    }
  }
  if (parenCount > 0) {
    errors.push({ message: `Missing ${parenCount} closing parenthesis(es)` })
  }

  // Try to tokenize and parse
  try {
    const tokens = tokenize(expression)
    const parseResult = parse(tokens)

    if (!parseResult.success) {
      errors.push({
        message: parseResult.error || 'Parse error',
        position: parseResult.position,
      })
    }
  } catch (error) {
    errors.push({
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

/**
 * Calculate expression result
 */
export function calculateExpression(
  expression: string,
  angleMode: AngleMode = 'radians'
): CalculationResult {
  try {
    // Handle empty expression
    if (!expression.trim()) {
      return {
        success: false,
        error: 'Empty expression',
      }
    }

    // Tokenize
    const tokens = tokenize(expression)

    // Parse
    const parseResult = parse(tokens)
    if (!parseResult.success || !parseResult.ast) {
      return {
        success: false,
        error: parseResult.error || 'Parse error',
      }
    }

    // Evaluate
    return evaluateAST(parseResult.ast, angleMode)
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Calculation error',
    }
  }
}

/**
 * Format number for display with locale support
 */
export function formatDisplayNumber(
  value: number,
  locale: string = 'en-US'
): string {
  const formatted = formatResult(value)

  // Handle special cases
  if (
    formatted === 'Error' ||
    formatted === 'Infinity' ||
    formatted === '-Infinity'
  ) {
    return formatted
  }

  // Handle scientific notation
  if (formatted.includes('e')) {
    return formatted
  }

  // Use Intl for locale-specific formatting
  const num = parseFloat(formatted)
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 15,
    useGrouping: true,
  }).format(num)
}

/**
 * Round to specified decimal places
 */
export function roundToDecimals(value: number, decimals: number = 10): number {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

// Re-export utilities
export { formatResult } from './evaluator'
export { tokenize } from './tokenizer'
export { parse } from './parser'
export { evaluateAST } from './evaluator'
