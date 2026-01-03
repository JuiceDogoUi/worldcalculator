/**
 * Scientific Calculator Display Component
 * Shows expression, result, mode indicators
 */

'use client'

import { cn } from '@/lib/utils'
import type { AngleMode } from '../types'

interface DisplayTranslations {
  result: string
  expression: string
  error: string
  memory: string
  degrees: string
  radians: string
}

interface DisplayProps {
  expression: string
  displayValue: string
  error: string | null
  angleMode: AngleMode
  hasMemory: boolean
  translations: DisplayTranslations
}

export function Display({
  expression,
  displayValue,
  error,
  angleMode,
  hasMemory,
  translations: t,
}: DisplayProps) {
  return (
    <div className="bg-muted/50 dark:bg-muted/30 rounded-lg p-4 mb-4 min-h-[120px]">
      {/* Status indicators */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-2">
          {/* Angle mode indicator */}
          <span
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded',
              'bg-primary/10 text-primary'
            )}
          >
            {angleMode === 'degrees' ? t.degrees : t.radians}
          </span>

          {/* Memory indicator */}
          {hasMemory && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-secondary text-secondary-foreground">
              {t.memory}
            </span>
          )}
        </div>
      </div>

      {/* Expression line */}
      <div
        className="text-sm text-muted-foreground min-h-[20px] overflow-x-auto whitespace-nowrap mb-1 font-mono"
        aria-label={t.expression}
      >
        {expression || '\u00A0'}
      </div>

      {/* Main display / Result */}
      <div
        className={cn(
          'text-3xl sm:text-4xl font-bold text-right overflow-x-auto whitespace-nowrap font-mono',
          error ? 'text-destructive' : 'text-foreground'
        )}
        role="status"
        aria-live="polite"
        aria-label={error ? t.error : t.result}
      >
        {error || displayValue}
      </div>
    </div>
  )
}
