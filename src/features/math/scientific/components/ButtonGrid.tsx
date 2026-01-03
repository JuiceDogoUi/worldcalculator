/**
 * Scientific Calculator Button Grid Component
 * 6-column responsive grid with all calculator buttons
 */

'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ButtonAction, ButtonVariant } from '../types'

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

interface ButtonGridProps {
  onButtonPress: (action: ButtonAction) => void
  secondaryMode: boolean
  translations: ButtonTranslations
}

interface CalcButton {
  label: string
  secondaryLabel?: string
  action: ButtonAction
  secondaryAction?: ButtonAction
  variant: ButtonVariant
  ariaLabel: string
  colSpan?: number
}

export function ButtonGrid({
  onButtonPress,
  secondaryMode,
  translations: t,
}: ButtonGridProps) {
  // Button layout - 6 columns
  const buttons: CalcButton[][] = [
    // Row 1: Secondary toggle, trig functions
    [
      {
        label: '2nd',
        action: { type: 'secondaryToggle' },
        variant: secondaryMode ? 'primary' : 'function',
        ariaLabel: t.second,
      },
      {
        label: 'sin',
        secondaryLabel: 'sin\u207B\u00B9',
        action: { type: 'function', value: 'sin' },
        secondaryAction: { type: 'function', value: 'asin' },
        variant: 'function',
        ariaLabel: secondaryMode ? t.arcsin : t.sin,
      },
      {
        label: 'cos',
        secondaryLabel: 'cos\u207B\u00B9',
        action: { type: 'function', value: 'cos' },
        secondaryAction: { type: 'function', value: 'acos' },
        variant: 'function',
        ariaLabel: secondaryMode ? t.arccos : t.cos,
      },
      {
        label: 'tan',
        secondaryLabel: 'tan\u207B\u00B9',
        action: { type: 'function', value: 'tan' },
        secondaryAction: { type: 'function', value: 'atan' },
        variant: 'function',
        ariaLabel: secondaryMode ? t.arctan : t.tan,
      },
      {
        label: 'ln',
        secondaryLabel: 'e\u02E3',
        action: { type: 'function', value: 'ln' },
        secondaryAction: { type: 'function', value: 'exp' },
        variant: 'function',
        ariaLabel: secondaryMode ? t.exp : t.ln,
      },
      {
        label: 'log',
        secondaryLabel: '10\u02E3',
        action: { type: 'function', value: 'log' },
        secondaryAction: { type: 'function', value: 'pow10' },
        variant: 'function',
        ariaLabel: t.log,
      },
    ],
    // Row 2: Powers, roots, parentheses
    [
      {
        label: 'x\u00B2',
        secondaryLabel: '\u221A',
        action: { type: 'powerOf', exponent: 2 },
        secondaryAction: { type: 'function', value: 'sqrt' },
        variant: 'function',
        ariaLabel: secondaryMode ? t.squareRoot : t.squared,
      },
      {
        label: 'x\u00B3',
        secondaryLabel: '\u221B',
        action: { type: 'powerOf', exponent: 3 },
        secondaryAction: { type: 'function', value: 'cbrt' },
        variant: 'function',
        ariaLabel: secondaryMode ? t.cubeRoot : t.cubed,
      },
      {
        label: 'x\u02B8',
        action: { type: 'operator', value: '^' },
        variant: 'function',
        ariaLabel: t.power,
      },
      {
        label: '\u221A',
        action: { type: 'function', value: 'sqrt' },
        variant: 'function',
        ariaLabel: t.squareRoot,
      },
      {
        label: '(',
        action: { type: 'parenthesis', value: '(' },
        variant: 'default',
        ariaLabel: t.openParen,
      },
      {
        label: ')',
        action: { type: 'parenthesis', value: ')' },
        variant: 'default',
        ariaLabel: t.closeParen,
      },
    ],
    // Row 3: Memory and utilities
    [
      {
        label: 'MC',
        action: { type: 'memory', operation: 'MC' },
        variant: 'memory',
        ariaLabel: t.memoryClear,
      },
      {
        label: 'MR',
        action: { type: 'memory', operation: 'MR' },
        variant: 'memory',
        ariaLabel: t.memoryRecall,
      },
      {
        label: 'M+',
        action: { type: 'memory', operation: 'M+' },
        variant: 'memory',
        ariaLabel: t.memoryAdd,
      },
      {
        label: 'M-',
        action: { type: 'memory', operation: 'M-' },
        variant: 'memory',
        ariaLabel: t.memorySubtract,
      },
      {
        label: 'n!',
        action: { type: 'factorial' },
        variant: 'function',
        ariaLabel: t.factorial,
      },
      {
        label: '%',
        action: { type: 'percent' },
        variant: 'function',
        ariaLabel: t.percent,
      },
    ],
    // Row 4: Number pad row 1
    [
      {
        label: '7',
        action: { type: 'digit', value: '7' },
        variant: 'default',
        ariaLabel: '7',
      },
      {
        label: '8',
        action: { type: 'digit', value: '8' },
        variant: 'default',
        ariaLabel: '8',
      },
      {
        label: '9',
        action: { type: 'digit', value: '9' },
        variant: 'default',
        ariaLabel: '9',
      },
      {
        label: '\u00F7',
        action: { type: 'operator', value: '/' },
        variant: 'operator',
        ariaLabel: t.divide,
      },
      {
        label: '\u03C0',
        action: { type: 'constant', value: 'PI' },
        variant: 'function',
        ariaLabel: t.pi,
      },
      {
        label: 'e',
        action: { type: 'constant', value: 'E' },
        variant: 'function',
        ariaLabel: t.e,
      },
    ],
    // Row 5: Number pad row 2
    [
      {
        label: '4',
        action: { type: 'digit', value: '4' },
        variant: 'default',
        ariaLabel: '4',
      },
      {
        label: '5',
        action: { type: 'digit', value: '5' },
        variant: 'default',
        ariaLabel: '5',
      },
      {
        label: '6',
        action: { type: 'digit', value: '6' },
        variant: 'default',
        ariaLabel: '6',
      },
      {
        label: '\u00D7',
        action: { type: 'operator', value: '*' },
        variant: 'operator',
        ariaLabel: t.multiply,
      },
      {
        label: '|x|',
        action: { type: 'function', value: 'abs' },
        variant: 'function',
        ariaLabel: t.abs,
      },
      {
        label: 'CE',
        action: { type: 'clearEntry' },
        variant: 'danger',
        ariaLabel: t.clearEntry,
      },
    ],
    // Row 6: Number pad row 3
    [
      {
        label: '1',
        action: { type: 'digit', value: '1' },
        variant: 'default',
        ariaLabel: '1',
      },
      {
        label: '2',
        action: { type: 'digit', value: '2' },
        variant: 'default',
        ariaLabel: '2',
      },
      {
        label: '3',
        action: { type: 'digit', value: '3' },
        variant: 'default',
        ariaLabel: '3',
      },
      {
        label: '\u2212',
        action: { type: 'operator', value: '-' },
        variant: 'operator',
        ariaLabel: t.subtract,
      },
      {
        label: 'Ans',
        action: { type: 'ans' },
        variant: 'function',
        ariaLabel: t.answer,
      },
      {
        label: 'AC',
        action: { type: 'clear' },
        variant: 'danger',
        ariaLabel: t.clear,
      },
    ],
    // Row 7: Number pad row 4
    [
      {
        label: '0',
        action: { type: 'digit', value: '0' },
        variant: 'default',
        ariaLabel: '0',
      },
      {
        label: '.',
        action: { type: 'decimal' },
        variant: 'default',
        ariaLabel: t.decimal,
      },
      {
        label: '\u00B1',
        action: { type: 'negate' },
        variant: 'default',
        ariaLabel: t.negate,
      },
      {
        label: '+',
        action: { type: 'operator', value: '+' },
        variant: 'operator',
        ariaLabel: t.add,
      },
      {
        label: '\u232B',
        action: { type: 'backspace' },
        variant: 'default',
        ariaLabel: t.backspace,
      },
      {
        label: '=',
        action: { type: 'equals' },
        variant: 'primary',
        ariaLabel: t.equals,
      },
    ],
  ]

  const getButtonClasses = (variant: ButtonVariant): string => {
    const baseClasses =
      'h-12 sm:h-14 text-base sm:text-lg font-medium transition-all active:scale-95'

    switch (variant) {
      case 'primary':
        return cn(baseClasses, 'bg-primary text-primary-foreground hover:bg-primary/90')
      case 'operator':
        return cn(baseClasses, 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700')
      case 'function':
        return cn(baseClasses, 'bg-muted hover:bg-muted/80')
      case 'memory':
        return cn(baseClasses, 'bg-purple-100 text-purple-900 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-100 dark:hover:bg-purple-900/50')
      case 'danger':
        return cn(baseClasses, 'bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-100 dark:hover:bg-red-900/50')
      default:
        return cn(baseClasses, 'bg-background border hover:bg-accent')
    }
  }

  const handleClick = (button: CalcButton) => {
    if (secondaryMode && button.secondaryAction) {
      onButtonPress(button.secondaryAction)
      // Reset secondary mode after use (except for toggle button)
      if (button.action.type !== 'secondaryToggle') {
        onButtonPress({ type: 'secondaryToggle' })
      }
    } else {
      onButtonPress(button.action)
    }
  }

  // Map colSpan values to Tailwind classes (dynamic classes don't work with Tailwind's purge)
  const colSpanClasses: Record<number, string> = {
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
  }

  return (
    <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
      {buttons.flat().map((button, index) => (
        <Button
          key={`${button.label}-${index}`}
          variant="ghost"
          className={cn(
            getButtonClasses(button.variant),
            button.colSpan && colSpanClasses[button.colSpan]
          )}
          onClick={() => handleClick(button)}
          aria-label={button.ariaLabel}
        >
          {secondaryMode && button.secondaryLabel
            ? button.secondaryLabel
            : button.label}
        </Button>
      ))}
    </div>
  )
}
