'use client'

import { useState, useMemo, useCallback } from 'react'
import { BarChart3, ArrowLeftRight, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  validateZScoreInputs,
  calculateZScoreResult,
} from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  ZScoreInputs,
  ZScoreResult,
  ZScoreValidation,
  CalculationMode,
} from './types'

interface ZScoreCalculatorTranslations {
  inputs: {
    mode: string
    modeZScore: string
    modeZScoreDescription: string
    modeValue: string
    modeValueDescription: string
    value: string
    valuePlaceholder: string
    mean: string
    meanPlaceholder: string
    standardDeviation: string
    standardDeviationPlaceholder: string
    zScore: string
    zScorePlaceholder: string
  }
  results: {
    zScore: string
    value: string
    percentile: string
    standardDeviationsFromMean: string
    leftTailedPValue: string
    rightTailedPValue: string
    twoTailedPValue: string
    confidenceLevel: string
  }
  interpretation: {
    belowMean: string
    atMean: string
    aboveMean: string
  }
  formula: string
  pValuesTitle: string
  showPValues: string
  hidePValues: string
  reset: string
  tryExample: string
}

interface ZScoreCalculatorProps {
  locale?: string
  translations: ZScoreCalculatorTranslations
}

// Example values for demonstration
const EXAMPLE_VALUES = {
  value: 85,
  mean: 75,
  standardDeviation: 10,
}

export function ZScoreCalculator({
  locale = 'en-US',
  translations: t,
}: ZScoreCalculatorProps) {
  // Input states
  const [mode, setMode] = useState<CalculationMode>('z-score')
  const [value, setValue] = useState<string>('')
  const [mean, setMean] = useState<string>('')
  const [standardDeviation, setStandardDeviation] = useState<string>('')
  const [zScore, setZScore] = useState<string>('')
  const [showPValues, setShowPValues] = useState(false)

  // Build inputs object
  const inputs: ZScoreInputs = useMemo(
    () => ({
      mode,
      value: value ? parseFloat(value) : null,
      mean: mean ? parseFloat(mean) : null,
      standardDeviation: standardDeviation ? parseFloat(standardDeviation) : null,
      zScore: zScore ? parseFloat(zScore) : null,
    }),
    [mode, value, mean, standardDeviation, zScore]
  )

  // Validate inputs
  const validation: ZScoreValidation = useMemo(() => {
    return validateZScoreInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: ZScoreResult | null = useMemo(() => {
    if (!validation.valid) return null
    try {
      return calculateZScoreResult(inputs)
    } catch {
      return null
    }
  }, [inputs, validation])

  // Reset handler
  const handleReset = useCallback(() => {
    setValue('')
    setMean('')
    setStandardDeviation('')
    setZScore('')
    setShowPValues(false)
  }, [])

  // Load example data
  const handleLoadExample = useCallback(() => {
    setMode('z-score')
    setValue(EXAMPLE_VALUES.value.toString())
    setMean(EXAMPLE_VALUES.mean.toString())
    setStandardDeviation(EXAMPLE_VALUES.standardDeviation.toString())
  }, [])

  // Mode change handler
  const handleModeChange = useCallback((newMode: CalculationMode) => {
    setMode(newMode)
    // Clear relevant fields when switching modes
    if (newMode === 'z-score') {
      setZScore('')
    } else {
      setValue('')
    }
  }, [])

  // Get error for a specific field
  const getFieldError = (field: string) => {
    return validation.errors.find((e) => e.field === field)?.message
  }

  // Get interpretation text
  const getInterpretationText = () => {
    if (!result) return ''
    switch (result.interpretation) {
      case 'below_mean':
        return t.interpretation.belowMean
      case 'at_mean':
        return t.interpretation.atMean
      case 'above_mean':
        return t.interpretation.aboveMean
    }
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Z-score is ${result.zScore}, percentile is ${result.percentile}%`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Calculation Mode */}
          <div className="space-y-3">
            <Label className="text-base font-medium">{t.inputs.mode}</Label>
            <RadioGroup
              value={mode}
              onValueChange={(v) => handleModeChange(v as CalculationMode)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="z-score" id="mode-zscore" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="mode-zscore" className="font-medium cursor-pointer">
                    {t.inputs.modeZScore}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.inputs.modeZScoreDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="value" id="mode-value" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="mode-value" className="font-medium cursor-pointer">
                    {t.inputs.modeValue}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.inputs.modeValueDescription}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Value Input (for z-score mode) */}
          {mode === 'z-score' && (
            <div className="space-y-2">
              <Label htmlFor="value" className="text-base font-medium">
                {t.inputs.value}
              </Label>
              <Input
                id="value"
                type="number"
                step="any"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={t.inputs.valuePlaceholder}
                className="font-mono"
                aria-invalid={!!getFieldError('value')}
                aria-describedby="value-error"
              />
              {getFieldError('value') && (
                <p id="value-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('value')}
                </p>
              )}
            </div>
          )}

          {/* Z-Score Input (for value mode) */}
          {mode === 'value' && (
            <div className="space-y-2">
              <Label htmlFor="zScoreInput" className="text-base font-medium">
                {t.inputs.zScore}
              </Label>
              <Input
                id="zScoreInput"
                type="number"
                step="any"
                value={zScore}
                onChange={(e) => setZScore(e.target.value)}
                placeholder={t.inputs.zScorePlaceholder}
                className="font-mono"
                aria-invalid={!!getFieldError('zScore')}
                aria-describedby="zScore-error"
              />
              {getFieldError('zScore') && (
                <p id="zScore-error" role="alert" className="text-sm text-destructive">
                  {getFieldError('zScore')}
                </p>
              )}
            </div>
          )}

          {/* Mean Input */}
          <div className="space-y-2">
            <Label htmlFor="mean" className="text-base font-medium">
              {t.inputs.mean}
            </Label>
            <Input
              id="mean"
              type="number"
              step="any"
              value={mean}
              onChange={(e) => setMean(e.target.value)}
              placeholder={t.inputs.meanPlaceholder}
              className="font-mono"
              aria-invalid={!!getFieldError('mean')}
              aria-describedby="mean-error"
            />
            {getFieldError('mean') && (
              <p id="mean-error" role="alert" className="text-sm text-destructive">
                {getFieldError('mean')}
              </p>
            )}
          </div>

          {/* Standard Deviation Input */}
          <div className="space-y-2">
            <Label htmlFor="standardDeviation" className="text-base font-medium">
              {t.inputs.standardDeviation}
            </Label>
            <Input
              id="standardDeviation"
              type="number"
              step="any"
              min="0"
              value={standardDeviation}
              onChange={(e) => setStandardDeviation(e.target.value)}
              placeholder={t.inputs.standardDeviationPlaceholder}
              className="font-mono"
              aria-invalid={!!getFieldError('standardDeviation')}
              aria-describedby="standardDeviation-error"
            />
            {getFieldError('standardDeviation') && (
              <p
                id="standardDeviation-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {getFieldError('standardDeviation')}
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button onClick={handleLoadExample} variant="outline" className="flex-1">
              {t.tryExample}
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                <BarChart3 className="h-4 w-4" />
                {mode === 'z-score' ? t.results.zScore : t.results.value}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight font-mono">
                {result
                  ? mode === 'z-score'
                    ? formatNumber(result.zScore, 4, locale)
                    : formatNumber(result.value, 4, locale)
                  : '--'}
              </div>
              {result && (
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
                  <div>
                    <div className="text-xs opacity-70">
                      {mode === 'z-score' ? t.results.value : t.results.zScore}
                    </div>
                    <div className="text-lg font-semibold font-mono">
                      {mode === 'z-score'
                        ? formatNumber(result.value, 4, locale)
                        : formatNumber(result.zScore, 4, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70">{t.results.percentile}</div>
                    <div className="text-lg font-semibold font-mono">
                      {formatNumber(result.percentile, 2, locale)}%
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interpretation */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      {getInterpretationText()
                        .replace(/\[\[value\]\]/g, formatNumber(result.value, 2, locale))
                        .replace(/\[\[zScore\]\]/g, formatNumber(result.zScore, 4, locale))
                        .replace(
                          /\[\[stdDevs\]\]/g,
                          formatNumber(result.standardDeviationsFromMean, 2, locale)
                        )
                        .replace(/\[\[percentile\]\]/g, formatNumber(result.percentile, 2, locale))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Statistics */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.standardDeviationsFromMean}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.standardDeviationsFromMean, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.percentile}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.percentile, 2, locale)}%
                    </div>
                  </div>
                </div>

                {/* Formula */}
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    {t.formula}
                  </div>
                  <code className="text-sm bg-muted p-3 rounded-lg block font-mono">
                    {result.formula}
                  </code>
                </div>
              </CardContent>
            </Card>
          )}

          {/* P-Values Section */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                  onClick={() => setShowPValues(!showPValues)}
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <ArrowLeftRight className="h-4 w-4" />
                    {t.pValuesTitle}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {showPValues ? t.hidePValues : t.showPValues}
                  </span>
                </Button>

                {showPValues && (
                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          {t.results.leftTailedPValue}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {formatNumber(result.pValues.leftTailed, 6, locale)}
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          {t.results.rightTailedPValue}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {formatNumber(result.pValues.rightTailed, 6, locale)}
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          {t.results.twoTailedPValue}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {formatNumber(result.pValues.twoTailed, 6, locale)}
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          {t.results.confidenceLevel}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {formatNumber(result.pValues.confidenceLevel * 100, 2, locale)}%
                        </div>
                      </div>
                    </div>
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
