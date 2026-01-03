/**
 * Scientific Calculator Types
 * Expression-based calculator with tokenizer, parser, and evaluator
 */

// =============================================================================
// CALCULATOR STATE
// =============================================================================

/**
 * Angle mode for trigonometric functions
 */
export type AngleMode = 'degrees' | 'radians'

/**
 * Memory operation types
 */
export type MemoryOperation = 'MC' | 'MR' | 'M+' | 'M-' | 'MS'

/**
 * Calculator state interface
 */
export interface ScientificCalculatorState {
  /** Current expression being built */
  expression: string

  /** Current display value (main display) */
  displayValue: string

  /** Last calculated result */
  result: number | null

  /** Whether there was an error in the last calculation */
  error: string | null

  /** Angle mode for trig functions */
  angleMode: AngleMode

  /** Memory storage value */
  memory: number

  /** Whether memory has a stored value */
  hasMemory: boolean

  /** Calculation history */
  history: HistoryEntry[]

  /** Whether a new input should replace the display */
  shouldReplace: boolean

  /** Whether last action was equals (for chaining) */
  lastWasEquals: boolean

  /** Open parentheses count (for validation) */
  openParentheses: number

  /** Whether secondary function mode is active (for shift/2nd key) */
  secondaryMode: boolean
}

/**
 * History entry for past calculations
 */
export interface HistoryEntry {
  id: string
  expression: string
  result: number
  timestamp: Date
  angleMode: AngleMode
}

// =============================================================================
// TOKEN TYPES (for expression parsing)
// =============================================================================

/**
 * Token types for the lexer
 */
export type TokenType =
  | 'NUMBER'
  | 'OPERATOR'
  | 'FUNCTION'
  | 'CONSTANT'
  | 'LPAREN'
  | 'RPAREN'
  | 'COMMA'
  | 'FACTORIAL'
  | 'PERCENT'
  | 'EOF'

/**
 * Operator types with precedence
 */
export type OperatorType = '+' | '-' | '*' | '/' | '^' | 'MOD'

/**
 * Function types supported
 */
export type FunctionType =
  // Trigonometric
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'sinh'
  | 'cosh'
  | 'tanh'
  // Logarithmic
  | 'log'
  | 'ln'
  | 'log2'
  // Roots and powers
  | 'sqrt'
  | 'cbrt'
  | 'pow'
  | 'exp'
  | 'pow10'
  // Other
  | 'abs'
  | 'floor'
  | 'ceil'
  | 'round'
  | 'factorial'

/**
 * Constant types
 */
export type ConstantType = 'PI' | 'E' | 'PHI'

/**
 * Token interface
 */
export interface Token {
  type: TokenType
  value: string | number
  position: number
}

// =============================================================================
// AST NODE TYPES (for expression tree)
// =============================================================================

/**
 * Base AST node
 */
export interface ASTNode {
  type: string
}

/**
 * Number literal node
 */
export interface NumberNode extends ASTNode {
  type: 'Number'
  value: number
}

/**
 * Binary operation node (e.g., 2 + 3)
 */
export interface BinaryOpNode extends ASTNode {
  type: 'BinaryOp'
  operator: OperatorType
  left: ExpressionNode
  right: ExpressionNode
}

/**
 * Unary operation node (e.g., -5, 5!)
 */
export interface UnaryOpNode extends ASTNode {
  type: 'UnaryOp'
  operator: 'NEGATE' | 'FACTORIAL' | 'PERCENT'
  operand: ExpressionNode
}

/**
 * Function call node (e.g., sin(45))
 */
export interface FunctionNode extends ASTNode {
  type: 'Function'
  name: FunctionType
  arguments: ExpressionNode[]
}

/**
 * Constant node (e.g., PI, E)
 */
export interface ConstantNode extends ASTNode {
  type: 'Constant'
  name: ConstantType
}

/**
 * Union type for all AST nodes
 */
export type ExpressionNode =
  | NumberNode
  | BinaryOpNode
  | UnaryOpNode
  | FunctionNode
  | ConstantNode

// =============================================================================
// BUTTON CONFIGURATION
// =============================================================================

/**
 * Button action types
 */
export type ButtonAction =
  | { type: 'digit'; value: string }
  | { type: 'operator'; value: OperatorType }
  | { type: 'function'; value: FunctionType }
  | { type: 'constant'; value: ConstantType }
  | { type: 'parenthesis'; value: '(' | ')' }
  | { type: 'decimal' }
  | { type: 'equals' }
  | { type: 'clear' }
  | { type: 'clearEntry' }
  | { type: 'backspace' }
  | { type: 'negate' }
  | { type: 'percent' }
  | { type: 'factorial' }
  | { type: 'memory'; operation: MemoryOperation }
  | { type: 'angleMode' }
  | { type: 'secondaryToggle' }
  | { type: 'ans' }
  | { type: 'powerOf'; exponent: number }

/**
 * Button variant for styling
 */
export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'operator'
  | 'function'
  | 'memory'
  | 'danger'

/**
 * Button configuration
 */
export interface ButtonConfig {
  /** Display label (primary) */
  label: string

  /** Secondary label (shown in 2nd mode) */
  secondaryLabel?: string

  /** Action when pressed */
  action: ButtonAction

  /** Secondary action (when 2nd mode active) */
  secondaryAction?: ButtonAction

  /** Visual variant */
  variant: ButtonVariant

  /** Column span (default 1) */
  colSpan?: number

  /** Accessibility label */
  ariaLabel: string

  /** Keyboard shortcut */
  keyboardShortcut?: string
}

// =============================================================================
// CALCULATION RESULT
// =============================================================================

/**
 * Result of expression evaluation
 */
export interface CalculationResult {
  success: boolean
  result?: number
  error?: string
  formattedResult?: string
}

/**
 * Parser result
 */
export interface ParseResult {
  success: boolean
  ast?: ExpressionNode
  error?: string
  position?: number
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Expression validation result
 */
export interface ExpressionValidation {
  valid: boolean
  errors: {
    message: string
    position?: number
  }[]
  warnings?: string[]
}
