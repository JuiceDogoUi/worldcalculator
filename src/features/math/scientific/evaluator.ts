/**
 * Scientific Calculator Evaluator
 * Evaluates AST nodes and computes results
 */

import type {
  ExpressionNode,
  NumberNode,
  BinaryOpNode,
  UnaryOpNode,
  FunctionNode,
  ConstantNode,
  AngleMode,
  CalculationResult,
} from './types'
import { getConstant, MAX_DISPLAY_DIGITS } from './constants'

/**
 * Factorial function with memoization
 */
const factorialCache = new Map<number, number>()

function factorial(n: number): number {
  if (n < 0) throw new Error('Factorial of negative number')
  if (!Number.isInteger(n)) throw new Error('Factorial requires integer')
  if (n > 170) throw new Error('Factorial overflow')

  if (n <= 1) return 1

  if (factorialCache.has(n)) {
    return factorialCache.get(n)!
  }

  const result = n * factorial(n - 1)
  factorialCache.set(n, result)
  return result
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Evaluator class for AST
 */
export class Evaluator {
  private angleMode: AngleMode

  constructor(angleMode: AngleMode = 'radians') {
    this.angleMode = angleMode
  }

  /**
   * Evaluate an AST node
   */
  evaluate(node: ExpressionNode): number {
    switch (node.type) {
      case 'Number':
        return (node as NumberNode).value

      case 'Constant':
        return getConstant((node as ConstantNode).name)

      case 'BinaryOp':
        return this.evaluateBinaryOp(node as BinaryOpNode)

      case 'UnaryOp':
        return this.evaluateUnaryOp(node as UnaryOpNode)

      case 'Function':
        return this.evaluateFunction(node as FunctionNode)

      default:
        throw new Error(`Unknown node type: ${(node as ExpressionNode).type}`)
    }
  }

  /**
   * Evaluate binary operation
   */
  private evaluateBinaryOp(node: BinaryOpNode): number {
    const left = this.evaluate(node.left)
    const right = this.evaluate(node.right)

    let result: number

    switch (node.operator) {
      case '+':
        result = left + right
        break
      case '-':
        result = left - right
        break
      case '*':
        result = left * right
        break
      case '/':
        if (right === 0) throw new Error('Division by zero')
        result = left / right
        break
      case '^':
        result = Math.pow(left, right)
        break
      case 'MOD':
        if (right === 0) throw new Error('Modulo by zero')
        result = left % right
        break
      default:
        throw new Error(`Unknown operator: ${node.operator}`)
    }

    // Check for NaN results (e.g., 0/0 before the zero check, Infinity - Infinity)
    if (Number.isNaN(result)) {
      throw new Error('Undefined result')
    }

    return result
  }

  /**
   * Evaluate unary operation
   */
  private evaluateUnaryOp(node: UnaryOpNode): number {
    const operand = this.evaluate(node.operand)

    switch (node.operator) {
      case 'NEGATE':
        return -operand
      case 'FACTORIAL':
        return factorial(operand)
      case 'PERCENT':
        return operand / 100
      default:
        throw new Error(`Unknown unary operator: ${node.operator}`)
    }
  }

  /**
   * Evaluate function call
   */
  private evaluateFunction(node: FunctionNode): number {
    const args = node.arguments.map((arg) => this.evaluate(arg))

    // Validate argument count
    if (args.length === 0) {
      throw new Error(`Function ${node.name} requires at least one argument`)
    }

    let result: number

    switch (node.name) {
      // Trigonometric (with angle mode conversion)
      case 'sin':
        result = Math.sin(this.toRadiansIfNeeded(args[0]))
        break
      case 'cos':
        result = Math.cos(this.toRadiansIfNeeded(args[0]))
        break
      case 'tan': {
        const radians = this.toRadiansIfNeeded(args[0])
        // Check for undefined values (90, 270, etc. in degrees)
        const cos = Math.cos(radians)
        if (Math.abs(cos) < 1e-10) {
          throw new Error('Tangent undefined at this angle')
        }
        result = Math.tan(radians)
        break
      }
      case 'asin':
        if (args[0] < -1 || args[0] > 1) {
          throw new Error('asin domain error: input must be between -1 and 1')
        }
        result = this.fromRadiansIfNeeded(Math.asin(args[0]))
        break
      case 'acos':
        if (args[0] < -1 || args[0] > 1) {
          throw new Error('acos domain error: input must be between -1 and 1')
        }
        result = this.fromRadiansIfNeeded(Math.acos(args[0]))
        break
      case 'atan':
        result = this.fromRadiansIfNeeded(Math.atan(args[0]))
        break

      // Hyperbolic (always in radians)
      case 'sinh':
        result = Math.sinh(args[0])
        break
      case 'cosh':
        result = Math.cosh(args[0])
        break
      case 'tanh':
        result = Math.tanh(args[0])
        break

      // Logarithmic
      case 'log':
        if (args[0] <= 0) throw new Error('Logarithm of non-positive number')
        result = Math.log10(args[0])
        break
      case 'ln':
        if (args[0] <= 0) throw new Error('Logarithm of non-positive number')
        result = Math.log(args[0])
        break
      case 'log2':
        if (args[0] <= 0) throw new Error('Logarithm of non-positive number')
        result = Math.log2(args[0])
        break

      // Roots and powers
      case 'sqrt':
        if (args[0] < 0) throw new Error('Square root of negative number')
        result = Math.sqrt(args[0])
        break
      case 'cbrt':
        result = Math.cbrt(args[0])
        break
      case 'pow':
        if (args.length < 2) {
          throw new Error('pow() requires two arguments: base and exponent')
        }
        // Check for negative base with fractional exponent (produces NaN)
        if (args[0] < 0 && !Number.isInteger(args[1])) {
          throw new Error('Cannot raise negative number to fractional power')
        }
        result = Math.pow(args[0], args[1])
        break
      case 'exp':
        result = Math.exp(args[0])
        break
      case 'pow10':
        result = Math.pow(10, args[0])
        break

      // Other
      case 'abs':
        result = Math.abs(args[0])
        break
      case 'floor':
        result = Math.floor(args[0])
        break
      case 'ceil':
        result = Math.ceil(args[0])
        break
      case 'round':
        result = Math.round(args[0])
        break
      case 'factorial':
        result = factorial(args[0])
        break

      default:
        throw new Error(`Unknown function: ${node.name}`)
    }

    // Check for NaN results (e.g., invalid operations)
    if (Number.isNaN(result)) {
      throw new Error('Undefined result')
    }

    return result
  }

  /**
   * Convert to radians if angle mode is degrees
   */
  private toRadiansIfNeeded(value: number): number {
    return this.angleMode === 'degrees' ? toRadians(value) : value
  }

  /**
   * Convert from radians if angle mode is degrees
   */
  private fromRadiansIfNeeded(value: number): number {
    return this.angleMode === 'degrees' ? toDegrees(value) : value
  }
}

/**
 * Format a number for display
 */
export function formatResult(value: number): string {
  // Handle special values
  if (!Number.isFinite(value)) {
    if (Number.isNaN(value)) return 'Error'
    return value > 0 ? 'Infinity' : '-Infinity'
  }

  // Handle very small numbers (close to zero)
  if (Math.abs(value) < 1e-15 && value !== 0) {
    return '0'
  }

  // Use scientific notation for very large or very small numbers
  if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(MAX_DISPLAY_DIGITS - 5)
  }

  // Format with appropriate precision
  const formatted = value.toPrecision(MAX_DISPLAY_DIGITS)

  // Remove trailing zeros after decimal point
  const parsed = parseFloat(formatted)

  // Handle integers
  if (Number.isInteger(parsed) && Math.abs(parsed) < 1e15) {
    return parsed.toString()
  }

  // Format with reasonable decimal places
  const str = parsed.toString()
  return str
}

/**
 * Evaluate expression and return result
 */
export function evaluateAST(
  ast: ExpressionNode,
  angleMode: AngleMode = 'radians'
): CalculationResult {
  try {
    const evaluator = new Evaluator(angleMode)
    const result = evaluator.evaluate(ast)

    return {
      success: true,
      result,
      formattedResult: formatResult(result),
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Evaluation error',
    }
  }
}
