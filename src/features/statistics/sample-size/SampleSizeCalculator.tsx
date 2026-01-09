'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Users,
  Percent,
  Target,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  calculateSampleSize,
  validateSampleSizeInputs,
  generateSampleSizeTable,
} from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  SampleSizeInputs,
  SampleSizeResult,
  SampleSizeValidation,
  ConfidenceLevelPreset,
} from './types'

interface SampleSizeCalculatorTranslations {
  inputs: {
    confidenceLevel: string
    confidenceLevelHelp: string
    confidence90: string
    confidence95: string
    confidence99: string
    confidenceCustom: string
    customConfidenceLevel: string
    marginOfError: string
    marginOfErrorHelp: string
    populationSize: string
    populationSizeHelp: string
    expectedProportion: string
    expectedProportionHelp: string
    useFinitePopulation: string
  }
  results: {
    requiredSampleSize: string
    sampleSizeInfinite: string
    confidenceLevel: string
    marginOfError: string
    expectedProportion: string
    populationSize: string
    samplingFraction: string
    finiteCorrectionApplied: string
  }
  comparison: {
    title: string
    showComparison: string
    hideComparison: string
    confidenceLevel: string
    marginOfError: string
    sampleSize: string
  }
  formula: string
  showFormula: string
  hideFormula: string
  reset: string
  interpretation: {
    title: string
    description: string
  }
}

interface SampleSizeCalculatorProps {
  locale?: string
  translations: SampleSizeCalculatorTranslations
}

export function SampleSizeCalculator({
  locale = 'en-US',
  translations: t,
}: SampleSizeCalculatorProps) {
  // Input state
  const [confidenceLevelPreset, setConfidenceLevelPreset] =
    useState<ConfidenceLevelPreset>('95')
  const [customConfidenceLevel, setCustomConfidenceLevel] = useState<number>(95)
  const [marginOfError, setMarginOfError] = useState<number>(5)
  const [useFinitePopulation, setUseFinitePopulation] = useState<boolean>(false)
  const [populationSize, setPopulationSize] = useState<number>(10000)
  const [expectedProportion, setExpectedProportion] = useState<number>(50)

  // UI state
  const [showFormula, setShowFormula] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  // Build inputs object
  const inputs: SampleSizeInputs = useMemo(
    () => ({
      confidenceLevelPreset,
      customConfidenceLevel:
        confidenceLevelPreset === 'custom' ? customConfidenceLevel : undefined,
      marginOfError,
      populationSize: useFinitePopulation ? populationSize : undefined,
      expectedProportion,
    }),
    [
      confidenceLevelPreset,
      customConfidenceLevel,
      marginOfError,
      useFinitePopulation,
      populationSize,
      expectedProportion,
    ]
  )

  // Validation
  const validation: SampleSizeValidation = useMemo(() => {
    return validateSampleSizeInputs(inputs)
  }, [inputs])

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Get field warning
  const getFieldWarning = useCallback(
    (field: string): string | undefined => {
      return validation.warnings?.find((w) => w.field === field)?.message
    },
    [validation.warnings]
  )

  // Calculate result
  const result: SampleSizeResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateSampleSize(inputs)
  }, [inputs, validation.valid])

  // Generate comparison table
  const comparisonTable = useMemo(() => {
    if (!showComparison) return []
    return generateSampleSizeTable(
      expectedProportion,
      useFinitePopulation ? populationSize : undefined
    )
  }, [showComparison, expectedProportion, useFinitePopulation, populationSize])

  // Reset handler
  const handleReset = useCallback(() => {
    setConfidenceLevelPreset('95')
    setCustomConfidenceLevel(95)
    setMarginOfError(5)
    setUseFinitePopulation(false)
    setPopulationSize(10000)
    setExpectedProportion(50)
    setShowFormula(false)
    setShowComparison(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${t.results.requiredSampleSize}: ${formatNumber(result.sampleSize, 0, locale)}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Confidence Level */}
          <div className="space-y-3">
            <Label
              htmlFor="confidenceLevel"
              className="flex items-center gap-2 text-base"
            >
              <Target
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t.inputs.confidenceLevel}
            </Label>
            <Select
              value={confidenceLevelPreset}
              onValueChange={(value: ConfidenceLevelPreset) =>
                setConfidenceLevelPreset(value)
              }
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="90">{t.inputs.confidence90}</SelectItem>
                <SelectItem value="95">{t.inputs.confidence95}</SelectItem>
                <SelectItem value="99">{t.inputs.confidence99}</SelectItem>
                <SelectItem value="custom">
                  {t.inputs.confidenceCustom}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t.inputs.confidenceLevelHelp}
            </p>

            {/* Custom confidence level input */}
            {confidenceLevelPreset === 'custom' && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="customConfidence" className="text-sm">
                  {t.inputs.customConfidenceLevel}
                </Label>
                <div className="relative">
                  <Input
                    id="customConfidence"
                    type="number"
                    value={customConfidenceLevel}
                    onChange={(e) =>
                      setCustomConfidenceLevel(Number(e.target.value))
                    }
                    className={`pr-7 h-10 ${
                      getFieldError('customConfidenceLevel')
                        ? 'border-destructive'
                        : ''
                    }`}
                    min={50}
                    max={99.99}
                    step={0.1}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                {getFieldError('customConfidenceLevel') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('customConfidenceLevel')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Margin of Error */}
          <div className="space-y-3">
            <Label
              htmlFor="marginOfError"
              className="flex items-center gap-2 text-base"
            >
              <Percent
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t.inputs.marginOfError}
            </Label>
            <div className="relative">
              <Input
                id="marginOfError"
                type="number"
                value={marginOfError}
                onChange={(e) => setMarginOfError(Number(e.target.value))}
                className={`pr-7 text-lg h-12 ${
                  getFieldError('marginOfError') ? 'border-destructive' : ''
                }`}
                min={0.1}
                max={50}
                step={0.5}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            {getFieldError('marginOfError') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('marginOfError')}
              </p>
            )}
            {getFieldWarning('marginOfError') && (
              <p className="text-sm text-amber-600 flex items-center gap-1">
                <Info className="h-4 w-4" />
                {getFieldWarning('marginOfError')}
              </p>
            )}
            <Slider
              value={[Math.min(marginOfError, 20)]}
              onValueChange={([value]) => setMarginOfError(value)}
              max={20}
              min={1}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>20%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.inputs.marginOfErrorHelp}
            </p>
          </div>

          {/* Expected Proportion */}
          <div className="space-y-3">
            <Label
              htmlFor="expectedProportion"
              className="flex items-center gap-2 text-base"
            >
              <Percent
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              {t.inputs.expectedProportion}
            </Label>
            <div className="relative">
              <Input
                id="expectedProportion"
                type="number"
                value={expectedProportion}
                onChange={(e) => setExpectedProportion(Number(e.target.value))}
                className={`pr-7 text-lg h-12 ${
                  getFieldError('expectedProportion') ? 'border-destructive' : ''
                }`}
                min={1}
                max={99}
                step={1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            {getFieldError('expectedProportion') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('expectedProportion')}
              </p>
            )}
            <Slider
              value={[expectedProportion]}
              onValueChange={([value]) => setExpectedProportion(value)}
              max={99}
              min={1}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1%</span>
              <span>50%</span>
              <span>99%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.inputs.expectedProportionHelp}
            </p>
          </div>

          {/* Finite Population Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="useFinite"
                className="flex items-center gap-2 text-base"
              >
                <Users
                  className="h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                {t.inputs.useFinitePopulation}
              </Label>
              <Switch
                id="useFinite"
                checked={useFinitePopulation}
                onCheckedChange={setUseFinitePopulation}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {t.inputs.populationSizeHelp}
            </p>

            {/* Population Size Input */}
            {useFinitePopulation && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="populationSize" className="text-sm">
                  {t.inputs.populationSize}
                </Label>
                <Input
                  id="populationSize"
                  type="number"
                  value={populationSize}
                  onChange={(e) => setPopulationSize(Number(e.target.value))}
                  className={`text-lg h-12 ${
                    getFieldError('populationSize') ? 'border-destructive' : ''
                  }`}
                  min={1}
                  step={100}
                />
                {getFieldError('populationSize') && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('populationSize')}
                  </p>
                )}
                {getFieldWarning('populationSize') && (
                  <p className="text-sm text-amber-600 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    {getFieldWarning('populationSize')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="outline" className="w-full h-12">
            {t.reset}
          </Button>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                <Users className="h-4 w-4" />
                {t.results.requiredSampleSize}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {result ? formatNumber(result.sampleSize, 0, locale) : '--'}
              </div>
              {result && result.finiteCorrectionApplied && (
                <div className="mt-3 text-sm opacity-80">
                  {t.results.finiteCorrectionApplied}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Results */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.confidenceLevel}
                    </div>
                    <div className="text-lg font-semibold">
                      {result.confidenceLevel}%
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.marginOfError}
                    </div>
                    <div className="text-lg font-semibold">
                      ±{result.marginOfError}%
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.expectedProportion}
                    </div>
                    <div className="text-lg font-semibold">
                      {result.expectedProportion}%
                    </div>
                  </div>
                  {result.populationSize && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        {t.results.populationSize}
                      </div>
                      <div className="text-lg font-semibold">
                        {formatNumber(result.populationSize, 0, locale)}
                      </div>
                    </div>
                  )}
                  {result.samplingFraction && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        {t.results.samplingFraction}
                      </div>
                      <div className="text-lg font-semibold">
                        {result.samplingFraction}%
                      </div>
                    </div>
                  )}
                  {result.finiteCorrectionApplied && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        {t.results.sampleSizeInfinite}
                      </div>
                      <div className="text-lg font-semibold text-muted-foreground">
                        {formatNumber(result.infiniteSampleSize, 0, locale)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interpretation */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{t.interpretation.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {t.interpretation.description
                    .replace(
                      '[[sampleSize]]',
                      formatNumber(result.sampleSize, 0, locale)
                    )
                    .replace(
                      '[[confidenceLevel]]',
                      result.confidenceLevel.toString()
                    )
                    .replace('[[marginOfError]]', result.marginOfError.toString())}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Formula Toggle */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                  onClick={() => setShowFormula(!showFormula)}
                  aria-expanded={showFormula}
                >
                  <span className="text-sm font-medium">
                    {showFormula ? t.hideFormula : t.showFormula}
                  </span>
                  {showFormula ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showFormula && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-4">{t.formula}</h3>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto space-y-2">
                      <p>{result.formula}</p>
                      <p className="text-muted-foreground text-xs">
                        {result.formulaWithValues}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Comparison Table Toggle */}
      <Card>
        <CardContent className="p-6">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
            onClick={() => setShowComparison(!showComparison)}
            aria-expanded={showComparison}
          >
            <span className="text-sm font-medium">
              {showComparison
                ? t.comparison.hideComparison
                : t.comparison.showComparison}
            </span>
            {showComparison ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showComparison && comparisonTable.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-4">{t.comparison.title}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">
                        {t.comparison.confidenceLevel}
                      </th>
                      <th className="px-4 py-3 text-left font-medium">
                        {t.comparison.marginOfError}
                      </th>
                      <th className="px-4 py-3 text-right font-medium">
                        {t.comparison.sampleSize}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {comparisonTable.map((row, i) => (
                      <tr
                        key={i}
                        className={
                          row.confidenceLevel === result?.confidenceLevel &&
                          row.marginOfError === result?.marginOfError
                            ? 'bg-primary/10'
                            : 'hover:bg-muted/50'
                        }
                      >
                        <td className="px-4 py-3">{row.confidenceLevel}%</td>
                        <td className="px-4 py-3">±{row.marginOfError}%</td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatNumber(row.sampleSize, 0, locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
