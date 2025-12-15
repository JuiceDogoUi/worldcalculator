'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCalculatorValue } from '@/lib/formatters'

interface CalculatorOutputProps {
  /**
   * Output title/label
   */
  label: string

  /**
   * The calculated value to display
   */
  value: number | string

  /**
   * Type of value for formatting
   */
  type?: 'number' | 'currency' | 'percentage' | 'text'

  /**
   * Currency code (for currency type)
   */
  currency?: string

  /**
   * Number of decimal places
   */
  decimals?: number

  /**
   * Optional unit suffix (e.g., "kg", "km")
   */
  unit?: string

  /**
   * Optional description/explanation
   */
  description?: string

  /**
   * Whether to show copy button
   */
  showCopy?: boolean

  /**
   * Highlight the result
   */
  highlight?: boolean
}

/**
 * CalculatorOutput component
 * Displays formatted calculation results with optional copy functionality
 */
export function CalculatorOutput({
  label,
  value,
  type = 'number',
  currency = 'USD',
  decimals = 2,
  unit,
  description,
  showCopy = true,
  highlight = false,
}: CalculatorOutputProps) {
  const locale = useLocale()
  const t = useTranslations('actions')
  const [copied, setCopied] = useState(false)

  // Use shared formatter to eliminate duplication
  const formattedValue = type === 'text'
    ? String(value)
    : formatCalculatorValue(value, {
        type: type as 'number' | 'currency' | 'percentage',
        locale,
        decimals,
        currency,
        unit,
      })

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Card className={highlight ? 'border-primary' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          {showCopy && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
              aria-label={t('copy')}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${highlight ? 'text-primary' : ''}`}
        >
          {formattedValue}
        </div>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
