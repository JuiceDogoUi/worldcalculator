/**
 * Scientific Calculator Component
 * Full-featured scientific calculator with expression parsing
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { History, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Display } from './components/Display'
import { ButtonGrid } from './components/ButtonGrid'
import { HistoryPanel } from './components/HistoryPanel'
import { useCalculatorState } from './hooks/useCalculatorState'
import type { ButtonAction } from './types'

interface DisplayTranslations {
  result: string
  expression: string
  error: string
  memory: string
  degrees: string
  radians: string
}

interface ButtonTranslations {
  clear: string
  clearEntry: string
  backspace: string
  equals: string
  add: string
  subtract: string
  multiply: string
  divide: string
  power: string
  squareRoot: string
  cubeRoot: string
  squared: string
  cubed: string
  factorial: string
  percent: string
  negate: string
  decimal: string
  openParen: string
  closeParen: string
  pi: string
  e: string
  sin: string
  cos: string
  tan: string
  arcsin: string
  arccos: string
  arctan: string
  log: string
  ln: string
  exp: string
  memoryAdd: string
  memorySubtract: string
  memoryRecall: string
  memoryClear: string
  second: string
  answer: string
  abs: string
}

interface HistoryTranslations {
  title: string
  empty: string
  clear: string
  useResult: string
}

export interface ScientificCalculatorTranslations {
  display: DisplayTranslations
  buttons: ButtonTranslations
  history: HistoryTranslations
  toggleHistory: string
  angleMode: string
}

interface ScientificCalculatorProps {
  locale?: string
  translations: ScientificCalculatorTranslations
}

export function ScientificCalculator({
  locale = 'en-US',
  translations: t,
}: ScientificCalculatorProps) {
  const { state, handleButtonPress, selectHistoryEntry, clearHistory } =
    useCalculatorState()
  const [showHistory, setShowHistory] = useState(false)

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default for calculator keys
      const calcKeys = [
        '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
        '+', '-', '*', '/', '^', '.', '(', ')', '%', '!',
        'Enter', 'Escape', 'Backspace', 'Delete',
      ]

      if (calcKeys.includes(e.key)) {
        e.preventDefault()
      }

      // Map keyboard to actions
      const action = mapKeyToAction(e.key)
      if (action) {
        handleButtonPress(action)
      }
    },
    [handleButtonPress]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Screen reader announcements */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {state.error || state.displayValue}
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Angle Mode Toggle */}
          <div className="flex justify-between items-center mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleButtonPress({ type: 'angleMode' })}
              className="text-xs"
            >
              {state.angleMode === 'degrees' ? 'DEG' : 'RAD'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              aria-expanded={showHistory}
              className="text-xs"
            >
              {showHistory ? (
                <X className="h-4 w-4 mr-1" />
              ) : (
                <History className="h-4 w-4 mr-1" />
              )}
              {t.toggleHistory}
            </Button>
          </div>

          {/* Display */}
          <Display
            expression={state.expression}
            displayValue={state.displayValue}
            error={state.error}
            angleMode={state.angleMode}
            hasMemory={state.hasMemory}
            translations={t.display}
          />

          {/* Button Grid */}
          <ButtonGrid
            onButtonPress={handleButtonPress}
            secondaryMode={state.secondaryMode}
            translations={t.buttons}
          />
        </CardContent>
      </Card>

      {/* History Panel */}
      {showHistory && (
        <HistoryPanel
          history={state.history}
          onSelectEntry={(entry) => {
            selectHistoryEntry(entry)
            setShowHistory(false)
          }}
          onClearHistory={clearHistory}
          translations={t.history}
          locale={locale}
        />
      )}
    </div>
  )
}

/**
 * Map keyboard key to calculator action
 */
function mapKeyToAction(key: string): ButtonAction | null {
  // Numbers
  if (/^[0-9]$/.test(key)) {
    return { type: 'digit', value: key }
  }

  // Operators
  switch (key) {
    case '+':
      return { type: 'operator', value: '+' }
    case '-':
      return { type: 'operator', value: '-' }
    case '*':
      return { type: 'operator', value: '*' }
    case '/':
      return { type: 'operator', value: '/' }
    case '^':
      return { type: 'operator', value: '^' }
    case '.':
      return { type: 'decimal' }
    case '(':
      return { type: 'parenthesis', value: '(' }
    case ')':
      return { type: 'parenthesis', value: ')' }
    case '%':
      return { type: 'percent' }
    case '!':
      return { type: 'factorial' }
    case 'Enter':
    case '=':
      return { type: 'equals' }
    case 'Escape':
      return { type: 'clear' }
    case 'Backspace':
      return { type: 'backspace' }
    case 'Delete':
      return { type: 'clearEntry' }
    default:
      return null
  }
}
