'use client'

import { useLocale } from 'next-intl'
import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { formatCalculatorValue } from '@/lib/formatters'

interface ResultCardProps {
  /**
   * Result label
   */
  label: string

  /**
   * The value to display
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
   * Optional unit suffix
   */
  unit?: string

  /**
   * Optional icon
   */
  icon?: LucideIcon

  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive'
}

/**
 * ResultCard component
 * Compact card for displaying a single result value
 * Ideal for showing multiple results in a grid layout
 */
export function ResultCard({
  label,
  value,
  type = 'number',
  currency = 'USD',
  decimals = 2,
  unit,
  icon: Icon,
  variant = 'default',
}: ResultCardProps) {
  const locale = useLocale()

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

  const variantClasses = {
    default: '',
    primary: 'border-primary/50 bg-primary/5',
    success: 'border-green-500/50 bg-green-50 dark:bg-green-950',
    warning: 'border-orange-500/50 bg-orange-50 dark:bg-orange-950',
    destructive: 'border-destructive/50 bg-destructive/5',
  }

  const textVariantClasses = {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-green-700 dark:text-green-400',
    warning: 'text-orange-700 dark:text-orange-400',
    destructive: 'text-destructive',
  }

  return (
    <Card className={variantClasses[variant]}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p
              className={`mt-1 text-2xl font-bold ${textVariantClasses[variant]}`}
            >
              {formattedValue}
            </p>
          </div>
          {Icon && (
            <Icon
              className={`h-5 w-5 ${textVariantClasses[variant]} opacity-60`}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
