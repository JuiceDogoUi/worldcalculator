'use client'

import { useLocale } from 'next-intl'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { parseLocalizedNumber, formatNumber } from '@/lib/formatters'

interface BaseInputProps {
  /**
   * Input field identifier
   */
  id: string

  /**
   * Input label
   */
  label: string

  /**
   * Optional helper text/description
   */
  description?: string

  /**
   * Error message to display
   */
  error?: string

  /**
   * Whether the field is required
   */
  required?: boolean

  /**
   * Whether the field is disabled
   */
  disabled?: boolean
}

interface NumberInputProps extends BaseInputProps {
  type: 'number'
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

interface TextInputProps extends BaseInputProps {
  type: 'text'
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface SelectInputProps extends BaseInputProps {
  type: 'select'
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}

interface SliderInputProps extends BaseInputProps {
  type: 'slider'
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  unit?: string
}

type CalculatorInputProps =
  | NumberInputProps
  | TextInputProps
  | SelectInputProps
  | SliderInputProps

/**
 * CalculatorInput component
 * Flexible input component for calculator forms
 * Supports number, text, select, and slider inputs with validation
 */
export function CalculatorInput(props: CalculatorInputProps) {
  const locale = useLocale()
  const {
    id,
    label,
    description,
    error,
    required,
    disabled,
    type,
    value,
    onChange,
  } = props

  const renderInput = () => {
    switch (type) {
      case 'number': {
        const { unit } = props
        const displayValue =
          typeof value === 'number' ? formatNumber(value, 2, locale) : ''

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const parsed = parseLocalizedNumber(e.target.value, locale)
          if (parsed !== null) {
            onChange(parsed)
          } else if (e.target.value === '') {
            onChange(0)
          }
        }

        return (
          <div className="relative">
            <Input
              id={id}
              type="text"
              inputMode="decimal"
              value={displayValue}
              onChange={handleChange}
              disabled={disabled}
              className={error ? 'border-destructive' : ''}
              aria-invalid={!!error}
              aria-describedby={
                error ? `${id}-error` : description ? `${id}-description` : undefined
              }
            />
            {unit && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {unit}
              </span>
            )}
          </div>
        )
      }

      case 'text': {
        const { placeholder } = props
        return (
          <Input
            id={id}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={error ? 'border-destructive' : ''}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${id}-error` : description ? `${id}-description` : undefined
            }
          />
        )
      }

      case 'select': {
        const { options } = props
        return (
          <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger
              id={id}
              className={error ? 'border-destructive' : ''}
              aria-invalid={!!error}
              aria-describedby={
                error ? `${id}-error` : description ? `${id}-description` : undefined
              }
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      }

      case 'slider': {
        const { min, max, step = 1, unit } = props
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Slider
                id={id}
                value={[value]}
                onValueChange={(values) => onChange(values[0])}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                className="flex-1"
                aria-invalid={!!error}
                aria-describedby={
                  error ? `${id}-error` : description ? `${id}-description` : undefined
                }
              />
              <span className="ml-4 w-20 text-right text-sm font-medium">
                {formatNumber(value, 2, locale)}
                {unit && ` ${unit}`}
              </span>
            </div>
          </div>
        )
      }
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderInput()}
      {description && !error && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
