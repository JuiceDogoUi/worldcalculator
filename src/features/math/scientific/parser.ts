/**
 * Scientific Calculator Parser
 * Recursive descent parser for mathematical expressions
 *
 * Grammar (in order of precedence, lowest to highest):
 *   expression := term (('+' | '-') term)*
 *   term       := unary (('*' | '/') unary)*
 *   unary      := ('-')? power
 *   power      := postfix ('^' power)?  // Right associative
 *   postfix    := primary ('!' | '%')*
 *   primary    := NUMBER | CONSTANT | function | '(' expression ')'
 *   function   := FUNCTION '(' expression (',' expression)* ')'
 *
 * Note: Unary negation has LOWER precedence than exponentiation
 * so -5^2 = -(5^2) = -25 (mathematically correct)
 */

import type {
  Token,
  ExpressionNode,
  NumberNode,
  BinaryOpNode,
  UnaryOpNode,
  FunctionNode,
  ConstantNode,
  ParseResult,
  OperatorType,
  FunctionType,
  ConstantType,
} from './types'

/**
 * Maximum recursion depth to prevent stack overflow
 */
const MAX_RECURSION_DEPTH = 100

/**
 * Recursive descent parser for mathematical expressions
 */
export class Parser {
  private tokens: Token[]
  private position: number
  private depth: number

  constructor(tokens: Token[]) {
    this.tokens = tokens
    this.position = 0
    this.depth = 0
  }

  /**
   * Check and increment recursion depth
   */
  private checkDepth(): void {
    this.depth++
    if (this.depth > MAX_RECURSION_DEPTH) {
      throw new Error('Expression too deeply nested')
    }
  }

  /**
   * Decrement recursion depth
   */
  private decrementDepth(): void {
    this.depth--
  }

  /**
   * Parse tokens into AST
   */
  parse(): ParseResult {
    try {
      // Handle empty expression
      if (this.tokens.length === 1 && this.tokens[0].type === 'EOF') {
        return {
          success: false,
          error: 'Empty expression',
        }
      }

      const ast = this.parseExpression()

      if (this.current().type !== 'EOF') {
        return {
          success: false,
          error: `Unexpected token: ${this.current().value}`,
          position: this.current().position,
        }
      }

      return { success: true, ast }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Parse error',
        position: this.current().position,
      }
    }
  }

  /**
   * Parse addition/subtraction (lowest precedence)
   */
  private parseExpression(): ExpressionNode {
    let left = this.parseTerm()

    while (this.isOperator(['+', '-'])) {
      const operator = this.current().value as OperatorType
      this.advance()
      const right = this.parseTerm()
      left = {
        type: 'BinaryOp',
        operator,
        left,
        right,
      } as BinaryOpNode
    }

    return left
  }

  /**
   * Parse multiplication/division
   */
  private parseTerm(): ExpressionNode {
    let left = this.parseUnary()

    while (this.isOperator(['*', '/'])) {
      const operator = this.current().value as OperatorType
      this.advance()
      const right = this.parseUnary()
      left = {
        type: 'BinaryOp',
        operator,
        left,
        right,
      } as BinaryOpNode
    }

    return left
  }

  /**
   * Parse unary operators (negation)
   * Note: Unary negation has LOWER precedence than exponentiation
   * so -5^2 = -(5^2) = -25
   */
  private parseUnary(): ExpressionNode {
    if (this.isOperator(['-'])) {
      this.advance()
      const operand = this.parseUnary() // Allow chained negation: --5
      return {
        type: 'UnaryOp',
        operator: 'NEGATE',
        operand,
      } as UnaryOpNode
    }

    // Handle unary plus (skip it)
    if (this.isOperator(['+'])) {
      this.advance()
    }

    return this.parsePower()
  }

  /**
   * Parse exponentiation (right associative)
   */
  private parsePower(): ExpressionNode {
    const base = this.parsePostfix()

    if (this.isOperator(['^'])) {
      this.advance()
      const exponent = this.parseUnary() // Go back to unary for right side to handle -2^2^3 correctly
      return {
        type: 'BinaryOp',
        operator: '^',
        left: base,
        right: exponent,
      } as BinaryOpNode
    }

    return base
  }

  /**
   * Parse postfix operators (factorial, percent)
   */
  private parsePostfix(): ExpressionNode {
    let node = this.parsePrimary()

    while (true) {
      if (this.current().type === 'FACTORIAL') {
        this.advance()
        node = {
          type: 'UnaryOp',
          operator: 'FACTORIAL',
          operand: node,
        } as UnaryOpNode
      } else if (this.current().type === 'PERCENT') {
        this.advance()
        node = {
          type: 'UnaryOp',
          operator: 'PERCENT',
          operand: node,
        } as UnaryOpNode
      } else {
        break
      }
    }

    return node
  }

  /**
   * Parse primary expressions (numbers, constants, functions, parentheses)
   */
  private parsePrimary(): ExpressionNode {
    const token = this.current()

    // Number
    if (token.type === 'NUMBER') {
      this.advance()
      return {
        type: 'Number',
        value: token.value as number,
      } as NumberNode
    }

    // Constant
    if (token.type === 'CONSTANT') {
      this.advance()
      return {
        type: 'Constant',
        name: token.value as ConstantType,
      } as ConstantNode
    }

    // Function
    if (token.type === 'FUNCTION') {
      return this.parseFunction()
    }

    // Parenthesized expression
    if (token.type === 'LPAREN') {
      this.checkDepth()
      this.advance()
      const expr = this.parseExpression()
      this.expect('RPAREN', 'Expected closing parenthesis')
      this.decrementDepth()
      return expr
    }

    throw new Error(`Unexpected token: ${token.type} (${token.value})`)
  }

  /**
   * Parse function call
   */
  private parseFunction(): FunctionNode {
    this.checkDepth()
    const name = this.current().value as FunctionType
    this.advance()

    this.expect('LPAREN', 'Expected opening parenthesis after function name')

    const args: ExpressionNode[] = []

    if (this.current().type !== 'RPAREN') {
      args.push(this.parseExpression())

      while (this.current().type === 'COMMA') {
        this.advance()
        args.push(this.parseExpression())
      }
    }

    this.expect('RPAREN', 'Expected closing parenthesis')
    this.decrementDepth()

    return {
      type: 'Function',
      name,
      arguments: args,
    }
  }

  // Helper methods

  private current(): Token {
    return (
      this.tokens[this.position] || { type: 'EOF', value: '', position: -1 }
    )
  }

  private advance(): void {
    this.position++
  }

  private isOperator(operators: string[]): boolean {
    return (
      this.current().type === 'OPERATOR' &&
      operators.includes(this.current().value as string)
    )
  }

  private expect(type: string, message: string): void {
    if (this.current().type !== type) {
      throw new Error(message)
    }
    this.advance()
  }
}

/**
 * Parse an expression string into AST
 */
export function parse(tokens: Token[]): ParseResult {
  const parser = new Parser(tokens)
  return parser.parse()
}
