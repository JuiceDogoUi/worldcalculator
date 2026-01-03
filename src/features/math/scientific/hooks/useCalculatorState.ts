/**
 * Scientific Calculator State Management Hook
 * Manages expression, result, memory, and history
 */

import { useReducer, useCallback } from 'react'
import type {
  ScientificCalculatorState,
  ButtonAction,
  HistoryEntry,
} from '../types'
import { calculateExpression } from '../calculations'
import { MAX_HISTORY_ENTRIES } from '../constants'

// Initial state
const initialState: ScientificCalculatorState = {
  expression: '',
  displayValue: '0',
  result: null,
  error: null,
  angleMode: 'degrees',
  memory: 0,
  hasMemory: false,
  history: [],
  shouldReplace: true,
  lastWasEquals: false,
  openParentheses: 0,
  secondaryMode: false,
}

// Action types
type CalculatorAction =
  | { type: 'DIGIT'; digit: string }
  | { type: 'OPERATOR'; operator: string }
  | { type: 'FUNCTION'; func: string }
  | { type: 'CONSTANT'; constant: string }
  | { type: 'PARENTHESIS'; paren: '(' | ')' }
  | { type: 'DECIMAL' }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'CLEAR_ENTRY' }
  | { type: 'BACKSPACE' }
  | { type: 'NEGATE' }
  | { type: 'PERCENT' }
  | { type: 'FACTORIAL' }
  | { type: 'MEMORY_ADD' }
  | { type: 'MEMORY_SUBTRACT' }
  | { type: 'MEMORY_RECALL' }
  | { type: 'MEMORY_CLEAR' }
  | { type: 'MEMORY_STORE' }
  | { type: 'TOGGLE_ANGLE_MODE' }
  | { type: 'TOGGLE_SECONDARY' }
  | { type: 'USE_ANS' }
  | { type: 'SELECT_HISTORY'; entry: HistoryEntry }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'POWER_OF'; exponent: number }

// Reducer
function calculatorReducer(
  state: ScientificCalculatorState,
  action: CalculatorAction
): ScientificCalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      const digit = action.digit
      if (state.shouldReplace) {
        return {
          ...state,
          displayValue: digit,
          expression: state.lastWasEquals ? digit : state.expression + digit,
          shouldReplace: false,
          lastWasEquals: false,
          error: null,
        }
      }
      // Prevent multiple leading zeros
      if (state.displayValue === '0' && digit === '0') {
        return state
      }
      const newDisplay =
        state.displayValue === '0' ? digit : state.displayValue + digit
      return {
        ...state,
        displayValue: newDisplay,
        expression: state.expression + digit,
        error: null,
      }
    }

    case 'OPERATOR': {
      const op = action.operator
      let newExpression = state.expression

      if (state.lastWasEquals && state.result !== null) {
        newExpression = state.result.toString()
      }

      // Replace operator if last char was an operator
      const lastChar = newExpression.slice(-1)
      if (['+', '-', '*', '/', '^'].includes(lastChar)) {
        newExpression = newExpression.slice(0, -1)
      }

      return {
        ...state,
        expression: newExpression + op,
        displayValue: op,
        shouldReplace: true,
        lastWasEquals: false,
        error: null,
      }
    }

    case 'FUNCTION': {
      const func = action.func
      const funcWithParen = `${func}(`

      if (state.shouldReplace || state.lastWasEquals) {
        return {
          ...state,
          expression: funcWithParen,
          displayValue: funcWithParen,
          openParentheses: 1,
          shouldReplace: false,
          lastWasEquals: false,
          error: null,
        }
      }

      return {
        ...state,
        expression: state.expression + funcWithParen,
        displayValue: funcWithParen,
        openParentheses: state.openParentheses + 1,
        error: null,
      }
    }

    case 'CONSTANT': {
      const constant = action.constant
      if (state.shouldReplace || state.lastWasEquals) {
        return {
          ...state,
          expression: constant,
          displayValue: constant,
          shouldReplace: false,
          lastWasEquals: false,
          error: null,
        }
      }
      return {
        ...state,
        expression: state.expression + constant,
        displayValue: constant,
        error: null,
      }
    }

    case 'PARENTHESIS': {
      const paren = action.paren

      if (paren === '(') {
        const newExpr = state.shouldReplace ? '(' : state.expression + '('
        return {
          ...state,
          expression: newExpr,
          displayValue: '(',
          openParentheses: state.openParentheses + 1,
          shouldReplace: false,
          error: null,
        }
      } else {
        if (state.openParentheses > 0) {
          return {
            ...state,
            expression: state.expression + ')',
            displayValue: ')',
            openParentheses: state.openParentheses - 1,
            error: null,
          }
        }
        return state
      }
    }

    case 'DECIMAL': {
      // Check if current number already has decimal
      const parts = state.expression.split(/[+\-*/^(]/)
      const currentNumber = parts[parts.length - 1]
      if (currentNumber.includes('.')) {
        return state
      }

      if (state.shouldReplace) {
        return {
          ...state,
          displayValue: '0.',
          expression: state.lastWasEquals ? '0.' : state.expression + '0.',
          shouldReplace: false,
          lastWasEquals: false,
          error: null,
        }
      }

      return {
        ...state,
        displayValue: state.displayValue + '.',
        expression: state.expression + '.',
        error: null,
      }
    }

    case 'EQUALS': {
      if (!state.expression.trim()) {
        return state
      }

      // Close any open parentheses
      let expr = state.expression
      for (let i = 0; i < state.openParentheses; i++) {
        expr += ')'
      }

      const result = calculateExpression(expr, state.angleMode)

      if (!result.success || result.result === undefined) {
        return {
          ...state,
          error: result.error || 'Error',
          lastWasEquals: true,
        }
      }

      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression: expr,
        result: result.result,
        timestamp: new Date(),
        angleMode: state.angleMode,
      }

      const newHistory = [historyEntry, ...state.history].slice(
        0,
        MAX_HISTORY_ENTRIES
      )

      return {
        ...state,
        displayValue: result.formattedResult || result.result.toString(),
        result: result.result,
        error: null,
        history: newHistory,
        shouldReplace: true,
        lastWasEquals: true,
        openParentheses: 0,
      }
    }

    case 'CLEAR':
      return {
        ...initialState,
        angleMode: state.angleMode,
        memory: state.memory,
        hasMemory: state.hasMemory,
        history: state.history,
      }

    case 'CLEAR_ENTRY':
      return {
        ...state,
        displayValue: '0',
        shouldReplace: true,
        error: null,
      }

    case 'BACKSPACE': {
      if (state.expression.length === 0 || state.shouldReplace) {
        return {
          ...state,
          displayValue: '0',
          expression: '',
          shouldReplace: true,
        }
      }

      const lastChar = state.expression.slice(-1)
      const newExpr = state.expression.slice(0, -1)

      // Adjust parentheses count
      let newOpenParens = state.openParentheses
      if (lastChar === '(') newOpenParens--
      if (lastChar === ')') newOpenParens++

      return {
        ...state,
        expression: newExpr,
        displayValue: newExpr.slice(-1) || '0',
        openParentheses: Math.max(0, newOpenParens),
      }
    }

    case 'NEGATE': {
      if (state.displayValue === '0') return state

      // Check if expression is wrapped in negation: (-...)
      // We need to verify that the closing ) matches the opening (-
      const isWrappedNegative = (() => {
        if (!state.expression.startsWith('(-') || !state.expression.endsWith(')')) {
          return false
        }
        // Find the matching closing paren for the opening at position 1
        let depth = 0
        for (let i = 1; i < state.expression.length; i++) {
          if (state.expression[i] === '(') depth++
          if (state.expression[i] === ')') depth--
          // If depth goes to 0, this is the matching close paren
          if (depth === 0) {
            // It's a valid negation wrapper only if this is the last character
            return i === state.expression.length - 1
          }
        }
        return false
      })()

      let newExpression: string
      let newDisplay: string

      if (isWrappedNegative) {
        // Remove the negation wrapper: (-expr) -> expr
        newExpression = state.expression.slice(2, -1)
        newDisplay = state.displayValue.startsWith('-')
          ? state.displayValue.slice(1)
          : state.displayValue
      } else {
        // Add negation wrapper: expr -> (-expr)
        newExpression = `(-${state.expression})`
        newDisplay = state.displayValue.startsWith('-')
          ? state.displayValue
          : '-' + state.displayValue
      }

      return {
        ...state,
        displayValue: newDisplay,
        expression: newExpression,
      }
    }

    case 'PERCENT': {
      return {
        ...state,
        expression: state.expression + '%',
        displayValue: '%',
        shouldReplace: true,
      }
    }

    case 'FACTORIAL': {
      return {
        ...state,
        expression: state.expression + '!',
        displayValue: '!',
        shouldReplace: true,
      }
    }

    case 'POWER_OF': {
      let newExpression = state.expression

      if (state.lastWasEquals && state.result !== null) {
        newExpression = state.result.toString()
      }

      return {
        ...state,
        expression: newExpression + '^' + action.exponent,
        displayValue: '^' + action.exponent,
        shouldReplace: true,
        lastWasEquals: false,
        error: null,
      }
    }

    case 'MEMORY_ADD': {
      const value = parseFloat(state.displayValue) || 0
      return {
        ...state,
        memory: state.memory + value,
        hasMemory: true,
      }
    }

    case 'MEMORY_SUBTRACT': {
      const value = parseFloat(state.displayValue) || 0
      return {
        ...state,
        memory: state.memory - value,
        hasMemory: true,
      }
    }

    case 'MEMORY_RECALL': {
      if (!state.hasMemory) return state
      const memStr = state.memory.toString()
      return {
        ...state,
        displayValue: memStr,
        expression: state.shouldReplace
          ? memStr
          : state.expression + memStr,
        shouldReplace: false,
      }
    }

    case 'MEMORY_CLEAR':
      return {
        ...state,
        memory: 0,
        hasMemory: false,
      }

    case 'MEMORY_STORE': {
      const value = parseFloat(state.displayValue) || 0
      return {
        ...state,
        memory: value,
        hasMemory: true,
      }
    }

    case 'TOGGLE_ANGLE_MODE':
      return {
        ...state,
        angleMode: state.angleMode === 'degrees' ? 'radians' : 'degrees',
      }

    case 'TOGGLE_SECONDARY':
      return {
        ...state,
        secondaryMode: !state.secondaryMode,
      }

    case 'USE_ANS': {
      if (state.result === null) return state
      const ans = state.result.toString()
      return {
        ...state,
        expression: state.shouldReplace ? ans : state.expression + ans,
        displayValue: ans,
        shouldReplace: false,
      }
    }

    case 'SELECT_HISTORY': {
      return {
        ...state,
        expression: action.entry.result.toString(),
        displayValue: action.entry.result.toString(),
        result: action.entry.result,
        shouldReplace: false,
        lastWasEquals: false,
      }
    }

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
      }

    default:
      return state
  }
}

/**
 * Custom hook for calculator state management
 */
export function useCalculatorState() {
  const [state, dispatch] = useReducer(calculatorReducer, initialState)

  const handleButtonPress = useCallback((action: ButtonAction) => {
    switch (action.type) {
      case 'digit':
        dispatch({ type: 'DIGIT', digit: action.value })
        break
      case 'operator':
        dispatch({ type: 'OPERATOR', operator: action.value })
        break
      case 'function':
        dispatch({ type: 'FUNCTION', func: action.value })
        break
      case 'constant':
        dispatch({ type: 'CONSTANT', constant: action.value })
        break
      case 'parenthesis':
        dispatch({ type: 'PARENTHESIS', paren: action.value })
        break
      case 'decimal':
        dispatch({ type: 'DECIMAL' })
        break
      case 'equals':
        dispatch({ type: 'EQUALS' })
        break
      case 'clear':
        dispatch({ type: 'CLEAR' })
        break
      case 'clearEntry':
        dispatch({ type: 'CLEAR_ENTRY' })
        break
      case 'backspace':
        dispatch({ type: 'BACKSPACE' })
        break
      case 'negate':
        dispatch({ type: 'NEGATE' })
        break
      case 'percent':
        dispatch({ type: 'PERCENT' })
        break
      case 'factorial':
        dispatch({ type: 'FACTORIAL' })
        break
      case 'memory':
        switch (action.operation) {
          case 'M+':
            dispatch({ type: 'MEMORY_ADD' })
            break
          case 'M-':
            dispatch({ type: 'MEMORY_SUBTRACT' })
            break
          case 'MR':
            dispatch({ type: 'MEMORY_RECALL' })
            break
          case 'MC':
            dispatch({ type: 'MEMORY_CLEAR' })
            break
          case 'MS':
            dispatch({ type: 'MEMORY_STORE' })
            break
        }
        break
      case 'angleMode':
        dispatch({ type: 'TOGGLE_ANGLE_MODE' })
        break
      case 'secondaryToggle':
        dispatch({ type: 'TOGGLE_SECONDARY' })
        break
      case 'ans':
        dispatch({ type: 'USE_ANS' })
        break
      case 'powerOf':
        dispatch({ type: 'POWER_OF', exponent: action.exponent })
        break
    }
  }, [])

  const selectHistoryEntry = useCallback((entry: HistoryEntry) => {
    dispatch({ type: 'SELECT_HISTORY', entry })
  }, [])

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' })
  }, [])

  return {
    state,
    handleButtonPress,
    selectHistoryEntry,
    clearHistory,
  }
}
