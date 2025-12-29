'use client'

import { useState, useMemo, useCallback } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { calculatePercentage, validatePercentageInputs } from './calculations'
import { formatNumber, formatPercentage } from '@/lib/formatters'
import type {
  PercentageInputs,
  PercentageResult,
  PercentageMode,
  PercentageValidation,
} from './types'

interface ModeTranslations {
  label: string
  description: string
}

interface PercentageCalculatorTranslations {
  // Mode labels
  modes: {
    whatIsPercentOf: ModeTranslations
    isWhatPercentOf: ModeTranslations
    isPercentOfWhat: ModeTranslations
    percentChange: ModeTranslations
    percentDifference: ModeTranslations
  }

  // Input labels by mode
  inputs: {
    percentValue: string
    baseValue: string
    partValue: string
    wholeValue: string
    resultValue: string
    percentOfWhole: string
    initialValue: string
    finalValue: string
    value1: string
    value2: string
  }

  // Results
  result: string
  formula: string
  explanation: string
  absoluteDifference: string
  increase: string
  decrease: string
  noChange: string

  // Actions
  reset: string
}

interface PercentageCalculatorProps {
  locale?: string
  translations: PercentageCalculatorTranslations
}

export function PercentageCalculator({
  locale = 'en-US',
  translations: t,
}: PercentageCalculatorProps) {
  // Mode state
  const [mode, setMode] = useState<PercentageMode>('what-is-percent-of')

  // Input states for different modes
  const [percentValue, setPercentValue] = useState<number>(25)
  const [baseValue, setBaseValue] = useState<number>(200)
  const [partValue, setPartValue] = useState<number>(50)
  const [wholeValue, setWholeValue] = useState<number>(200)
  const [resultValue, setResultValue] = useState<number>(50)
  const [percentOfWhole, setPercentOfWhole] = useState<number>(25)
  const [initialValue, setInitialValue] = useState<number>(100)
  const [finalValue, setFinalValue] = useState<number>(125)
  const [value1, setValue1] = useState<number>(100)
  const [value2, setValue2] = useState<number>(120)

  // Build inputs object based on current mode
  const inputs: PercentageInputs = useMemo(() => {
    const base = { mode }

    switch (mode) {
      case 'what-is-percent-of':
        return { ...base, percentValue, baseValue }
      case 'is-what-percent-of':
        return { ...base, partValue, wholeValue }
      case 'is-percent-of-what':
        return { ...base, resultValue, percentOfWhole }
      case 'percent-change':
        return { ...base, initialValue, finalValue }
      case 'percent-difference':
        return { ...base, value1, value2 }
      default:
        return base
    }
  }, [
    mode,
    percentValue,
    baseValue,
    partValue,
    wholeValue,
    resultValue,
    percentOfWhole,
    initialValue,
    finalValue,
    value1,
    value2,
  ])

  // Validate inputs
  const validation: PercentageValidation = useMemo(() => {
    return validatePercentageInputs(inputs)
  }, [inputs])

  // Get error for specific field
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Calculate result
  const result: PercentageResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculatePercentage(inputs)
  }, [inputs, validation.valid])

  // Reset handler
  const handleReset = useCallback(() => {
    setPercentValue(25)
    setBaseValue(200)
    setPartValue(50)
    setWholeValue(200)
    setResultValue(50)
    setPercentOfWhole(25)
    setInitialValue(100)
    setFinalValue(125)
    setValue1(100)
    setValue2(120)
    setMode('what-is-percent-of')
  }, [])

  // Render input fields based on mode
  const renderModeInputs = () => {
    switch (mode) {
      case 'what-is-percent-of':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="percentValue">{t.inputs.percentValue}</Label>
              <div className="relative">
                <Input
                  id="percentValue"
                  type="number"
                  value={percentValue}
                  onChange={(e) => setPercentValue(Number(e.target.value))}
                  className="pr-8 text-lg h-12"
                  step="0.01"
                  min="0"
                  max="1000"
                  aria-invalid={!!getFieldError('percentValue')}
                  aria-describedby={getFieldError('percentValue') ? 'percentValue-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              {getFieldError('percentValue') && (
                <p id="percentValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('percentValue')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseValue">{t.inputs.baseValue}</Label>
              <Input
                id="baseValue"
                type="number"
                value={baseValue}
                onChange={(e) => setBaseValue(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('baseValue')}
                aria-describedby={getFieldError('baseValue') ? 'baseValue-error' : undefined}
              />
              {getFieldError('baseValue') && (
                <p id="baseValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('baseValue')}
                </p>
              )}
            </div>
          </>
        )

      case 'is-what-percent-of':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="partValue">{t.inputs.partValue}</Label>
              <Input
                id="partValue"
                type="number"
                value={partValue}
                onChange={(e) => setPartValue(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('partValue')}
                aria-describedby={getFieldError('partValue') ? 'partValue-error' : undefined}
              />
              {getFieldError('partValue') && (
                <p id="partValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('partValue')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="wholeValue">{t.inputs.wholeValue}</Label>
              <Input
                id="wholeValue"
                type="number"
                value={wholeValue}
                onChange={(e) => setWholeValue(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('wholeValue')}
                aria-describedby={getFieldError('wholeValue') ? 'wholeValue-error' : undefined}
              />
              {getFieldError('wholeValue') && (
                <p id="wholeValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('wholeValue')}
                </p>
              )}
            </div>
          </>
        )

      case 'is-percent-of-what':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="resultValue">{t.inputs.resultValue}</Label>
              <Input
                id="resultValue"
                type="number"
                value={resultValue}
                onChange={(e) => setResultValue(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('resultValue')}
                aria-describedby={getFieldError('resultValue') ? 'resultValue-error' : undefined}
              />
              {getFieldError('resultValue') && (
                <p id="resultValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('resultValue')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="percentOfWhole">{t.inputs.percentOfWhole}</Label>
              <div className="relative">
                <Input
                  id="percentOfWhole"
                  type="number"
                  value={percentOfWhole}
                  onChange={(e) => setPercentOfWhole(Number(e.target.value))}
                  className="pr-8 text-lg h-12"
                  step="0.01"
                  min="0"
                  max="1000"
                  aria-invalid={!!getFieldError('percentOfWhole')}
                  aria-describedby={getFieldError('percentOfWhole') ? 'percentOfWhole-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              {getFieldError('percentOfWhole') && (
                <p id="percentOfWhole-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('percentOfWhole')}
                </p>
              )}
            </div>
          </>
        )

      case 'percent-change':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="initialValue">{t.inputs.initialValue}</Label>
              <Input
                id="initialValue"
                type="number"
                value={initialValue}
                onChange={(e) => setInitialValue(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('initialValue')}
                aria-describedby={getFieldError('initialValue') ? 'initialValue-error' : undefined}
              />
              {getFieldError('initialValue') && (
                <p id="initialValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('initialValue')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalValue">{t.inputs.finalValue}</Label>
              <Input
                id="finalValue"
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('finalValue')}
                aria-describedby={getFieldError('finalValue') ? 'finalValue-error' : undefined}
              />
              {getFieldError('finalValue') && (
                <p id="finalValue-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('finalValue')}
                </p>
              )}
            </div>
          </>
        )

      case 'percent-difference':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="value1">{t.inputs.value1}</Label>
              <Input
                id="value1"
                type="number"
                value={value1}
                onChange={(e) => setValue1(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('value1')}
                aria-describedby={getFieldError('value1') ? 'value1-error' : undefined}
              />
              {getFieldError('value1') && (
                <p id="value1-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('value1')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="value2">{t.inputs.value2}</Label>
              <Input
                id="value2"
                type="number"
                value={value2}
                onChange={(e) => setValue2(Number(e.target.value))}
                className="text-lg h-12"
                step="0.01"
                aria-invalid={!!getFieldError('value2')}
                aria-describedby={getFieldError('value2') ? 'value2-error' : undefined}
              />
              {getFieldError('value2') && (
                <p id="value2-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('value2')}
                </p>
              )}
            </div>
          </>
        )
    }
  }

  // Check if result is a percentage type
  const isPercentageResult = (): boolean => {
    return (
      mode === 'is-what-percent-of' ||
      mode === 'percent-change' ||
      mode === 'percent-difference'
    )
  }

  // Format result based on type
  const formatResult = (): string => {
    if (!result) return '--'
    if (isPercentageResult()) {
      return formatPercentage(result.result, 2, locale)
    }
    return formatNumber(result.result, 2, locale)
  }

  // Get change indicator for percent-change mode
  const getChangeIndicator = () => {
    if (!result || mode !== 'percent-change') return null

    if (result.isIncrease) {
      return (
        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <TrendingUp className="h-5 w-5" />
          <span className="text-sm font-medium">{t.increase}</span>
        </div>
      )
    }
    if (result.isDecrease) {
      return (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <TrendingDown className="h-5 w-5" />
          <span className="text-sm font-medium">{t.decrease}</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Minus className="h-5 w-5" />
        <span className="text-sm font-medium">{t.noChange}</span>
      </div>
    )
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
          {/* Mode Tabs - Primary modes */}
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as PercentageMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger
                value="what-is-percent-of"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.whatIsPercentOf.label}
              </TabsTrigger>
              <TabsTrigger
                value="is-what-percent-of"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.isWhatPercentOf.label}
              </TabsTrigger>
              <TabsTrigger
                value="is-percent-of-what"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.isPercentOfWhat.label}
              </TabsTrigger>
            </TabsList>

            {/* Secondary modes */}
            <TabsList className="grid w-full grid-cols-2 mt-2 h-auto">
              <TabsTrigger
                value="percent-change"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.percentChange.label}
              </TabsTrigger>
              <TabsTrigger
                value="percent-difference"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.percentDifference.label}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mode description */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {mode === 'what-is-percent-of' &&
                t.modes.whatIsPercentOf.description}
              {mode === 'is-what-percent-of' &&
                t.modes.isWhatPercentOf.description}
              {mode === 'is-percent-of-what' &&
                t.modes.isPercentOfWhat.description}
              {mode === 'percent-change' && t.modes.percentChange.description}
              {mode === 'percent-difference' &&
                t.modes.percentDifference.description}
            </CardContent>
          </Card>

          {/* Mode-specific inputs */}
          <div className="space-y-4">{renderModeInputs()}</div>

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
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {formatResult()}
              </div>
              {getChangeIndicator()}
            </CardContent>
          </Card>

          {/* Explanation Card */}
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
                  <code className="text-sm bg-muted p-3 rounded-lg block overflow-x-auto font-mono">
                    {result.formula}
                  </code>
                </div>

                {result.absoluteDifference !== undefined && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      {t.absoluteDifference}
                    </div>
                    <p className="text-base font-medium">
                      {formatNumber(result.absoluteDifference, 2, locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
