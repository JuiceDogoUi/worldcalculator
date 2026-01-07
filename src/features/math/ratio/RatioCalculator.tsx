'use client'

import { useState, useMemo, useCallback } from 'react'
import { Equal, ArrowLeftRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { calculateRatio, validateRatioInputs } from './calculations'
import { formatNumber, formatPercentage } from '@/lib/formatters'
import type {
  RatioInputs,
  RatioResult,
  RatioMode,
  RatioValidation,
  CalcTranslations,
} from './types'

interface ModeTranslations {
  label: string
  description: string
}

interface RatioCalculatorTranslations {
  modes: {
    simplify: ModeTranslations
    scale: ModeTranslations
    findMissing: ModeTranslations
    convert: ModeTranslations
    compare: ModeTranslations
  }
  inputs: {
    antecedent: string
    consequent: string
    scaleTargetValue: string
    scaleTargetPosition: string
    antecedentOption: string
    consequentOption: string
    knownValue: string
    knownPosition: string
    secondAntecedent: string
    secondConsequent: string
  }
  results: {
    result: string
    simplifiedRatio: string
    scaledRatio: string
    missingValue: string
    fraction: string
    decimal: string
    percentage: string
    partsNotation: string
    partsTo: string
    partSingular: string
    partPlural: string
    comparison: string
    equal: string
    greater: string
    less: string
    difference: string
  }
  errors: {
    consequentZero: string
    scaleTargetRequired: string
    scaleTargetPositive: string
    knownValueRequired: string
    knownValuePositive: string
    compareRatioRequired: string
    compareConsequentZero: string
  }
  steps: string
  formula: string
  explanation: string
  reset: string
  calc: CalcTranslations
}

interface RatioCalculatorProps {
  locale?: string
  translations: RatioCalculatorTranslations
}

export function RatioCalculator({
  locale = 'en-US',
  translations: t,
}: RatioCalculatorProps) {
  // Mode state
  const [mode, setMode] = useState<RatioMode>('simplify')

  // Primary ratio inputs
  const [antecedent, setAntecedent] = useState<number>(4)
  const [consequent, setConsequent] = useState<number>(8)

  // Scale mode inputs
  const [scaleTargetValue, setScaleTargetValue] = useState<number>(10)
  const [scaleTargetPosition, setScaleTargetPosition] = useState<
    'antecedent' | 'consequent'
  >('consequent')

  // Find missing mode inputs
  const [knownValue, setKnownValue] = useState<number>(6)
  const [knownPosition, setKnownPosition] = useState<
    'antecedent' | 'consequent'
  >('antecedent')

  // Compare mode inputs
  const [secondAntecedent, setSecondAntecedent] = useState<number>(2)
  const [secondConsequent, setSecondConsequent] = useState<number>(4)

  // Build inputs object based on current mode
  const inputs: RatioInputs = useMemo(() => {
    const base = {
      mode,
      ratio: { antecedent, consequent },
    }

    switch (mode) {
      case 'scale':
        return {
          ...base,
          scaleTarget: {
            position: scaleTargetPosition,
            value: scaleTargetValue,
          },
        }
      case 'find-missing':
        return {
          ...base,
          proportion: {
            knownValue,
            knownPosition,
          },
        }
      case 'compare':
        return {
          ...base,
          compareRatio: {
            antecedent: secondAntecedent,
            consequent: secondConsequent,
          },
        }
      default:
        return base
    }
  }, [
    mode,
    antecedent,
    consequent,
    scaleTargetValue,
    scaleTargetPosition,
    knownValue,
    knownPosition,
    secondAntecedent,
    secondConsequent,
  ])

  // Validate inputs
  const validation: RatioValidation = useMemo(() => {
    return validateRatioInputs(inputs)
  }, [inputs])

  // Map field names to translation keys
  const getTranslatedError = useCallback(
    (field: string): string | undefined => {
      const error = validation.errors.find((e) => e.field === field)
      if (!error) return undefined

      // Map field to translated error message
      const errorMap: Record<string, string> = {
        'ratio.consequent': t.errors.consequentZero,
        'scaleTarget': t.errors.scaleTargetRequired,
        'scaleTarget.value': t.errors.scaleTargetPositive,
        'proportion': t.errors.knownValueRequired,
        'proportion.knownValue': t.errors.knownValuePositive,
        'compareRatio': t.errors.compareRatioRequired,
        'compareRatio.consequent': t.errors.compareConsequentZero,
      }

      return errorMap[field] || error.message
    },
    [validation.errors, t.errors]
  )

  // Format parts notation with proper grammar
  const formatPartsNotation = useCallback(
    (a: number, b: number): string => {
      const partA = a === 1 ? t.results.partSingular : t.results.partPlural
      const partB = b === 1 ? t.results.partSingular : t.results.partPlural
      return t.results.partsTo
        .replace('{a}', `${a} ${partA}`)
        .replace('{b}', `${b} ${partB}`)
    },
    [t.results.partsTo, t.results.partSingular, t.results.partPlural]
  )

  // Calculate result
  const result: RatioResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateRatio(inputs, t.calc)
  }, [inputs, validation.valid, t.calc])

  // Reset handler
  const handleReset = useCallback(() => {
    setAntecedent(4)
    setConsequent(8)
    setScaleTargetValue(10)
    setScaleTargetPosition('consequent')
    setKnownValue(6)
    setKnownPosition('antecedent')
    setSecondAntecedent(2)
    setSecondConsequent(4)
    setMode('simplify')
  }, [])

  // Render mode-specific inputs
  const renderModeInputs = () => {
    // Common ratio input for all modes
    const commonRatioInput = (
      <div className="grid grid-cols-5 gap-2 items-end">
        <div className="col-span-2 space-y-2">
          <Label htmlFor="antecedent">{t.inputs.antecedent}</Label>
          <Input
            id="antecedent"
            type="number"
            value={antecedent}
            onChange={(e) => setAntecedent(Number(e.target.value))}
            className="text-lg h-12"
            step="1"
          />
        </div>
        <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground pb-2">
          :
        </div>
        <div className="col-span-2 space-y-2">
          <Label htmlFor="consequent">{t.inputs.consequent}</Label>
          <Input
            id="consequent"
            type="number"
            value={consequent}
            onChange={(e) => setConsequent(Number(e.target.value))}
            className="text-lg h-12"
            step="1"
            aria-invalid={!!getTranslatedError('ratio.consequent')}
          />
        </div>
        {getTranslatedError('ratio.consequent') && (
          <p className="col-span-5 text-sm text-destructive">
            {getTranslatedError('ratio.consequent')}
          </p>
        )}
      </div>
    )

    switch (mode) {
      case 'simplify':
      case 'convert':
        return commonRatioInput

      case 'scale':
        return (
          <>
            {commonRatioInput}
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>{t.inputs.scaleTargetPosition}</Label>
                <RadioGroup
                  value={scaleTargetPosition}
                  onValueChange={(v) =>
                    setScaleTargetPosition(v as 'antecedent' | 'consequent')
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="antecedent" id="scale-antecedent" />
                    <Label htmlFor="scale-antecedent">
                      {t.inputs.antecedentOption}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consequent" id="scale-consequent" />
                    <Label htmlFor="scale-consequent">
                      {t.inputs.consequentOption}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scaleTargetValue">
                  {t.inputs.scaleTargetValue}
                </Label>
                <Input
                  id="scaleTargetValue"
                  type="number"
                  value={scaleTargetValue}
                  onChange={(e) => setScaleTargetValue(Number(e.target.value))}
                  className="text-lg h-12"
                  step="1"
                  min="1"
                />
              </div>
            </div>
          </>
        )

      case 'find-missing':
        return (
          <>
            {commonRatioInput}
            <div className="flex items-center justify-center text-xl font-bold text-muted-foreground my-4">
              =
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.inputs.knownPosition}</Label>
                <RadioGroup
                  value={knownPosition}
                  onValueChange={(v) =>
                    setKnownPosition(v as 'antecedent' | 'consequent')
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="antecedent" id="known-antecedent" />
                    <Label htmlFor="known-antecedent">
                      {t.inputs.antecedentOption}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="consequent" id="known-consequent" />
                    <Label htmlFor="known-consequent">
                      {t.inputs.consequentOption}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="knownValue">{t.inputs.knownValue}</Label>
                <Input
                  id="knownValue"
                  type="number"
                  value={knownValue}
                  onChange={(e) => setKnownValue(Number(e.target.value))}
                  className="text-lg h-12"
                  step="1"
                  min="1"
                />
              </div>
            </div>
          </>
        )

      case 'compare':
        return (
          <>
            {commonRatioInput}
            <div className="flex items-center justify-center my-4">
              <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-5 gap-2 items-end">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="secondAntecedent">
                  {t.inputs.secondAntecedent}
                </Label>
                <Input
                  id="secondAntecedent"
                  type="number"
                  value={secondAntecedent}
                  onChange={(e) => setSecondAntecedent(Number(e.target.value))}
                  className="text-lg h-12"
                  step="1"
                />
              </div>
              <div className="flex items-center justify-center text-2xl font-bold text-muted-foreground pb-2">
                :
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="secondConsequent">
                  {t.inputs.secondConsequent}
                </Label>
                <Input
                  id="secondConsequent"
                  type="number"
                  value={secondConsequent}
                  onChange={(e) => setSecondConsequent(Number(e.target.value))}
                  className="text-lg h-12"
                  step="1"
                />
              </div>
            </div>
          </>
        )
    }
  }

  // Get mode key for translations
  const getModeKey = (
    modeType: RatioMode
  ): 'simplify' | 'scale' | 'findMissing' | 'convert' | 'compare' => {
    if (modeType === 'find-missing') return 'findMissing'
    return modeType
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
          {/* Mode Tabs */}
          <Tabs
            value={mode}
            onValueChange={(v) => setMode(v as RatioMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger
                value="simplify"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.simplify.label}
              </TabsTrigger>
              <TabsTrigger
                value="scale"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.scale.label}
              </TabsTrigger>
              <TabsTrigger
                value="find-missing"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.findMissing.label}
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 mt-2 h-auto">
              <TabsTrigger
                value="convert"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.convert.label}
              </TabsTrigger>
              <TabsTrigger
                value="compare"
                className="text-xs sm:text-sm py-2.5 px-1"
              >
                {t.modes.compare.label}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mode description */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {t.modes[getModeKey(mode)].description}
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
                {t.results.result}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {result ? result.ratioDisplay : '--'}
              </div>
              {result?.missingValue !== undefined && (
                <div className="mt-2 text-lg opacity-90">
                  {t.results.missingValue}: {result.missingValue}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversions Card (for convert mode) */}
          {result && mode === 'convert' && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold mb-4">{t.modes.convert.label}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t.results.fraction}
                    </div>
                    <div className="text-lg font-medium">
                      {result.conversions.fraction}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t.results.decimal}
                    </div>
                    <div className="text-lg font-medium">
                      {formatNumber(result.conversions.decimal, 4, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t.results.percentage}
                    </div>
                    <div className="text-lg font-medium">
                      {formatPercentage(result.conversions.percentage, 2, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      {t.results.partsNotation}
                    </div>
                    <div className="text-lg font-medium">
                      {formatPartsNotation(
                        result.result.antecedent,
                        result.result.consequent
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Result Card */}
          {result && mode === 'compare' && result.comparisonResult && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t.results.comparison}</h3>
                <div
                  className={`text-lg font-medium ${
                    result.comparisonResult.equal
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {result.comparisonResult.equal ? (
                    <span className="flex items-center gap-2">
                      <Equal className="h-5 w-5" />
                      {t.results.equal}
                    </span>
                  ) : result.comparisonResult.firstGreater ? (
                    t.results.greater
                  ) : (
                    t.results.less
                  )}
                </div>
                {!result.comparisonResult.equal && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {t.results.difference}:{' '}
                    {formatNumber(result.comparisonResult.difference, 6, locale)}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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

                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {t.steps}
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {result.steps.map((step) => (
                      <li key={step.stepNumber}>
                        <span className="font-medium">{step.description}</span>
                        <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                          {step.expression}
                        </code>
                        {step.result && (
                          <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                            = {step.result}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
