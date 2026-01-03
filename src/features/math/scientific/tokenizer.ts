/**
 * Scientific Calculator Tokenizer
 * Converts expression string into tokens for parsing
 */

import type { Token, FunctionType, ConstantType } from './types'

/**
 * Known function names (case-insensitive)
 */
const FUNCTIONS: Set<string> = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'sinh',
  'cosh',
  'tanh',
  'log',
  'ln',
  'log2',
  'sqrt',
  'cbrt',
  'pow',
  'exp',
  'pow10',
  'abs',
  'floor',
  'ceil',
  'round',
])

/**
 * Known constants (case-insensitive mapping)
 */
const CONSTANTS: Record<string, ConstantType> = {
  pi: 'PI',
  PI: 'PI',
  e: 'E',
  E: 'E',
  phi: 'PHI',
  PHI: 'PHI',
}

/**
 * Tokenizer class for mathematical expressions
 */
export class Tokenizer {
  private input: string
  private position: number
  private tokens: Token[]

  constructor(input: string) {
    // Normalize input: remove extra whitespace, handle special cases
    this.input = this.normalizeInput(input)
    this.position = 0
    this.tokens = []
  }

  /**
   * Normalize input expression
   */
  private normalizeInput(input: string): string {
    return input
      .replace(/\s+/g, '') // Remove whitespace
      .replace(/\u00D7/g, '*') // × to *
      .replace(/\u00F7/g, '/') // ÷ to /
      .replace(/\u2212/g, '-') // minus sign to hyphen
      .replace(/\u03C0/g, 'PI') // π to PI
      .replace(/\u221A/g, 'sqrt') // √ to sqrt
      .replace(/\u221B/g, 'cbrt') // ∛ to cbrt
  }

  /**
   * Tokenize the entire input
   */
  tokenize(): Token[] {
    while (this.position < this.input.length) {
      const token = this.nextToken()
      if (token) {
        this.tokens.push(token)
      }
    }

    this.tokens.push({
      type: 'EOF',
      value: '',
      position: this.position,
    })

    return this.tokens
  }

  /**
   * Get next token from input
   */
  private nextToken(): Token | null {
    const char = this.input[this.position]
    const startPos = this.position

    // Numbers (including decimals and scientific notation)
    if (this.isDigit(char) || (char === '.' && this.isDigit(this.peek(1)))) {
      return this.readNumber()
    }

    // Operators
    if ('+-*/^'.includes(char)) {
      this.position++
      return { type: 'OPERATOR', value: char, position: startPos }
    }

    // Parentheses
    if (char === '(') {
      this.position++
      return { type: 'LPAREN', value: '(', position: startPos }
    }
    if (char === ')') {
      this.position++
      return { type: 'RPAREN', value: ')', position: startPos }
    }

    // Factorial
    if (char === '!') {
      this.position++
      return { type: 'FACTORIAL', value: '!', position: startPos }
    }

    // Percent
    if (char === '%') {
      this.position++
      return { type: 'PERCENT', value: '%', position: startPos }
    }

    // Comma (for function arguments)
    if (char === ',') {
      this.position++
      return { type: 'COMMA', value: ',', position: startPos }
    }

    // Identifiers (functions and constants)
    if (this.isAlpha(char)) {
      return this.readIdentifier()
    }

    // Unknown character - skip
    this.position++
    return null
  }

  /**
   * Read a number (integer, decimal, or scientific notation)
   */
  private readNumber(): Token {
    const startPos = this.position
    let value = ''

    // Read integer part
    while (this.isDigit(this.current())) {
      value += this.current()
      this.position++
    }

    // Read decimal part
    if (this.current() === '.') {
      if (value === '') {
        // Handle ".5" case -> "0.5"
        value = '0.'
      } else {
        // Handle "5." or "5.5" case
        value += '.'
      }
      this.position++
      while (this.isDigit(this.current())) {
        value += this.current()
        this.position++
      }
    }

    // Read scientific notation
    if (this.current()?.toLowerCase() === 'e') {
      const nextChar = this.peek(1)
      if (
        this.isDigit(nextChar) ||
        nextChar === '+' ||
        nextChar === '-'
      ) {
        value += 'e'
        this.position++
        if (this.current() === '+' || this.current() === '-') {
          value += this.current()
          this.position++
        }
        while (this.isDigit(this.current())) {
          value += this.current()
          this.position++
        }
      }
    }

    return {
      type: 'NUMBER',
      value: parseFloat(value),
      position: startPos,
    }
  }

  /**
   * Read an identifier (function or constant)
   */
  private readIdentifier(): Token {
    const startPos = this.position
    let value = ''

    while (this.isAlphaNumeric(this.current())) {
      value += this.current()
      this.position++
    }

    const lowerValue = value.toLowerCase()

    // Check if it's a constant
    if (CONSTANTS[value] || CONSTANTS[lowerValue]) {
      return {
        type: 'CONSTANT',
        value: CONSTANTS[value] || CONSTANTS[lowerValue],
        position: startPos,
      }
    }

    // Check if it's a function
    if (FUNCTIONS.has(lowerValue)) {
      return {
        type: 'FUNCTION',
        value: lowerValue as FunctionType,
        position: startPos,
      }
    }

    // Unknown identifier - treat as error
    throw new Error(`Unknown identifier: ${value} at position ${startPos}`)
  }

  private current(): string {
    return this.input[this.position] || ''
  }

  private peek(offset: number): string {
    return this.input[this.position + offset] || ''
  }

  private isDigit(char: string): boolean {
    return char >= '0' && char <= '9'
  }

  private isAlpha(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')
  }

  private isAlphaNumeric(char: string): boolean {
    return this.isDigit(char) || this.isAlpha(char)
  }
}

/**
 * Tokenize an expression string
 */
export function tokenize(expression: string): Token[] {
  const tokenizer = new Tokenizer(expression)
  return tokenizer.tokenize()
}
