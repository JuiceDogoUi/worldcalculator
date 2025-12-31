'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Minus, X, Divide, Sparkles, ArrowRightLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { calculateFraction, validateFractionInputs } from './calculations'
import { formatNumber, formatPercentage } from '@/lib/formatters'
import type {
  Fraction,
  FractionInputs,
  FractionResult,
  FractionMode,
  FractionValidation,
  ConversionFormat,
} from './types'

interface ModeTranslations {
  label: string
  description: string
}

interface FractionCalculatorTranslations {
  modes: {
    add: ModeTranslations
    subtract: ModeTranslations
    multiply: ModeTranslations
    divide: ModeTranslations
    simplify: ModeTranslations
    convert: ModeTranslations
  }
  inputs: {
    fraction1: string
    fraction2: string
    numerator: string
    denominator: string
    wholeNumber: string
    convertTo: string
  }
  conversionFormats: {
    decimal: string
    percentage: string
    mixed: string
    improper: string
  }
  result: string
  decimalValue: string
  percentageValue: string
  steps: string
  formula: string
  explanation: string
  reset: string
  conversionResults: string
}

interface FractionCalculatorProps {
  locale?: string
  translations: FractionCalculatorTranslations
}

function FractionInput({
  label,
  fraction,
  onChange,
  showWholeNumber = true,
  errors,
  prefix,
  translations,
}: {
  label: string
  fraction: Fraction
  onChange: (fraction: Fraction) => void
  showWholeNumber?: boolean
  errors: FractionValidation['errors']
  prefix: string
  translations: FractionCalculatorTranslations
}) {
  const getError = (field: string) =>
    errors.find((e) => e.field === `${prefix}.${field}`)?.message

  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">{label}</Label>
      <div className="flex items-center gap-2">
        {showWholeNumber && (
          <>
            <div className="flex-1">
              <Label htmlFor={`${prefix}-whole`} className="text-xs text-muted-foreground">
                {translations.inputs.wholeNumber}
              </Label>
              <Input
                id={`${prefix}-whole`}
                type="number"
                value={fraction.wholeNumber || ''}
                onChange={(e) =>
                  onChange({
                    ...fraction,
                    wholeNumber: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="text-lg h-12 text-center"
                placeholder="0"
              />
            </div>
          </>
        )}
        <div className="flex flex-col items-center flex-1">
          <div className="w-full">
            <Label htmlFor={`${prefix}-num`} className="text-xs text-muted-foreground">
              {translations.inputs.numerator}
            </Label>
            <Input
              id={`${prefix}-num`}
              type="number"
              value={fraction.numerator}
              onChange={(e) =>
                onChange({ ...fraction, numerator: Number(e.target.value) })
              }
              className="text-lg h-12 text-center"
              aria-invalid={!!getError('numerator')}
            />
          </div>
          <div className="w-full h-[2px] bg-foreground my-1" />
          <div className="w-full">
            <Input
              id={`${prefix}-den`}
              type="number"
              value={fraction.denominator}
              onChange={(e) =>
                onChange({ ...fraction, denominator: Number(e.target.value) })
              }
              className="text-lg h-12 text-center"
              aria-invalid={!!getError('denominator')}
            />
            <Label htmlFor={`${prefix}-den`} className="text-xs text-muted-foreground">
              {translations.inputs.denominator}
            </Label>
          </div>
        </div>
      </div>
      {getError('denominator') && (
        <p className="text-sm text-destructive">{getError('denominator')}</p>
      )}
      {getError('numerator') && (
        <p className="text-sm text-destructive">{getError('numerator')}</p>
      )}
    </div>
  )
}

export function FractionCalculator({
  locale = 'en-US',
  translations: t,
}: FractionCalculatorProps) {
  // Mode state
  const [mode, setMode] = useState<FractionMode>('add')

  // Fraction inputs
  const [fraction1, setFraction1] = useState<Fraction>({
    numerator: 1,
    denominator: 2,
  })
  const [fraction2, setFraction2] = useState<Fraction>({
    numerator: 1,
    denominator: 4,
  })

  // Conversion format
  const [conversionFormat, setConversionFormat] = useState<ConversionFormat>('decimal')

  // Build inputs object
  const inputs: FractionInputs = useMemo(() => {
    const base: FractionInputs = {
      mode,
      fraction1,
      conversionFormat,
    }

    if (['add', 'subtract', 'multiply', 'divide'].includes(mode)) {
      base.fraction2 = fraction2
    }

    return base
  }, [mode, fraction1, fraction2, conversionFormat])

  // Validate inputs
  const validation: FractionValidation = useMemo(() => {
    return validateFractionInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: FractionResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateFraction(inputs)
  }, [inputs, validation.valid])

  // Reset handler
  const handleReset = useCallback(() => {
    setFraction1({ numerator: 1, denominator: 2 })
    setFraction2({ numerator: 1, denominator: 4 })
    setConversionFormat('decimal')
    setMode('add')
  }, [])

  // Check if mode requires two fractions
  const isBinaryOperation = ['add', 'subtract', 'multiply', 'divide'].includes(mode)

  // Get operation symbol
  const getOperationSymbol = () => {
    switch (mode) {
      case 'add':
        return <Plus className="h-6 w-6" />
      case 'subtract':
        return <Minus className="h-6 w-6" />
      case 'multiply':
        return <X className="h-6 w-6" />
      case 'divide':
        return <Divide className="h-6 w-6" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && result.explanation}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Mode selector and inputs */}
        <div className="space-y-6">
          {/* Mode Tabs - Operations */}
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as FractionMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger
                value="add"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t.modes.add.label}</span>
              </TabsTrigger>
              <TabsTrigger
                value="subtract"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <Minus className="h-4 w-4" />
                <span className="hidden sm:inline">{t.modes.subtract.label}</span>
              </TabsTrigger>
              <TabsTrigger
                value="multiply"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">{t.modes.multiply.label}</span>
              </TabsTrigger>
              <TabsTrigger
                value="divide"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <Divide className="h-4 w-4" />
                <span className="hidden sm:inline">{t.modes.divide.label}</span>
              </TabsTrigger>
            </TabsList>

            {/* Utility modes */}
            <TabsList className="grid w-full grid-cols-2 mt-2 h-auto">
              <TabsTrigger
                value="simplify"
                className="text-xs sm:text-sm py-2.5 px-1 flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {t.modes.simplify.label}
              </TabsTrigger>
              <TabsTrigger
                value="convert"
                className="text-xs sm:text-sm py-2.5 px-1 flex items-center gap-2"
              >
                <ArrowRightLeft className="h-4 w-4" />
                {t.modes.convert.label}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mode description */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {t.modes[mode].description}
            </CardContent>
          </Card>

          {/* Fraction inputs */}
          <div className="space-y-6">
            <FractionInput
              label={t.inputs.fraction1}
              fraction={fraction1}
              onChange={setFraction1}
              showWholeNumber={true}
              errors={validation.errors}
              prefix="fraction1"
              translations={t}
            />

            {isBinaryOperation && (
              <>
                <div className="flex justify-center">
                  <div className="p-3 rounded-full bg-muted">
                    {getOperationSymbol()}
                  </div>
                </div>

                <FractionInput
                  label={t.inputs.fraction2}
                  fraction={fraction2}
                  onChange={setFraction2}
                  showWholeNumber={true}
                  errors={validation.errors}
                  prefix="fraction2"
                  translations={t}
                />
              </>
            )}

            {mode === 'convert' && (
              <div className="space-y-2">
                <Label>{t.inputs.convertTo}</Label>
                <Select
                  value={conversionFormat}
                  onValueChange={(v) => setConversionFormat(v as ConversionFormat)}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="decimal">
                      {t.conversionFormats.decimal}
                    </SelectItem>
                    <SelectItem value="percentage">
                      {t.conversionFormats.percentage}
                    </SelectItem>
                    <SelectItem value="mixed">
                      {t.conversionFormats.mixed}
                    </SelectItem>
                    <SelectItem value="improper">
                      {t.conversionFormats.improper}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Reset button */}
          <Button onClick={handleReset} variant="outline" className="w-full">
            {t.reset}
          </Button>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.result}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight font-mono">
                {result ? result.fractionDisplay : '--'}
              </div>
              {result && (
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
                  <div>
                    <div className="text-xs opacity-70">{t.decimalValue}</div>
                    <div className="text-lg font-semibold">
                      {formatNumber(result.decimalValue, 6, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70">{t.percentageValue}</div>
                    <div className="text-lg font-semibold">
                      {formatPercentage(result.percentageValue, 4, locale)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Results (for convert mode) */}
          {result?.conversionResults && mode === 'convert' && (
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {t.conversionResults}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.conversionFormats.decimal}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {result.conversionResults.decimal}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.conversionFormats.percentage}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {result.conversionResults.percentage}%
                    </div>
                  </div>
                  {result.conversionResults.mixedNumber && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        {t.conversionFormats.mixed}
                      </div>
                      <div className="text-lg font-mono font-semibold">
                        {result.conversionResults.mixedNumber}
                      </div>
                    </div>
                  )}
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.conversionFormats.improper}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {result.conversionResults.improperFraction}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calculation Steps */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {t.explanation}
                  </div>
                  <p className="text-base">{result.explanation}</p>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {t.formula}
                  </div>
                  <code className="text-sm bg-muted p-3 rounded-lg block font-mono">
                    {result.formula}
                  </code>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-3">
                    {t.steps}
                  </div>
                  <div className="space-y-3">
                    {result.steps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="flex gap-3 text-sm"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          {step.stepNumber}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{step.description}</div>
                          <code className="text-muted-foreground font-mono text-xs">
                            {step.expression}
                          </code>
                          {step.result && (
                            <div className="text-primary font-semibold mt-1">
                              = {step.result}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
