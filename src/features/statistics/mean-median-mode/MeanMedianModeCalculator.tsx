'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Calculator,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Hash,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  validateCentralTendencyInputs,
  calculateCentralTendency,
} from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  CentralTendencyInputs,
  CentralTendencyResult,
  CentralTendencyValidation,
  MeanType,
  CalcTranslations,
} from './types'

interface MeanMedianModeCalculatorTranslations {
  inputs: {
    dataInput: string
    dataInputPlaceholder: string
    dataInputHelp: string
    weightsInput: string
    weightsInputPlaceholder: string
    weightsInputHelp: string
    meanType: string
    arithmetic: string
    arithmeticDescription: string
    geometric: string
    geometricDescription: string
    harmonic: string
    harmonicDescription: string
    weighted: string
    weightedDescription: string
    decimalPrecision: string
    decimals: string
  }
  results: {
    mean: string
    median: string
    mode: string
    noMode: string
    unimodal: string
    bimodal: string
    multimodal: string
    count: string
    sum: string
    range: string
    min: string
    max: string
    variance: string
    standardDeviation: string
    quartiles: string
    q1: string
    q2: string
    q3: string
    iqr: string
    frequency: string
    percentage: string
    value: string
    additionalStats: string
    frequencyDistribution: string
    modeValues: string
    selectedMean: string
    allMeans: string
    arithmeticMean: string
    geometricMean: string
    harmonicMean: string
    weightedMean: string
    notAvailable: string
  }
  steps: {
    meanStepsTitle: string
    medianStepsTitle: string
    modeStepsTitle: string
    showSteps: string
    hideSteps: string
  }
  valuesDetected: string
  weightsDetected: string
  reset: string
  tryExample: string
  paginate: string
  showAll: string
  calc: CalcTranslations
}

interface MeanMedianModeCalculatorProps {
  locale?: string
  translations: MeanMedianModeCalculatorTranslations
}

const EXAMPLE_DATA = '10, 12, 23, 23, 16, 23, 21, 16'
const EXAMPLE_WEIGHTS = '1, 1, 2, 2, 1, 2, 1, 1'
const FREQUENCY_PAGE_SIZE = 8

export function MeanMedianModeCalculator({
  locale = 'en-US',
  translations: t,
}: MeanMedianModeCalculatorProps) {
  // Input states
  const [dataInput, setDataInput] = useState<string>('')
  const [weightsInput, setWeightsInput] = useState<string>('')
  const [meanType, setMeanType] = useState<MeanType>('arithmetic')
  const [decimalPrecision, setDecimalPrecision] = useState<number>(4)

  // UI states
  const [showMeanSteps, setShowMeanSteps] = useState(false)
  const [showMedianSteps, setShowMedianSteps] = useState(false)
  const [showModeSteps, setShowModeSteps] = useState(false)
  const [showWeightsInput, setShowWeightsInput] = useState(false)
  const [frequencyPage, setFrequencyPage] = useState(0)
  const [showAllFrequencies, setShowAllFrequencies] = useState(false)

  // Build inputs object
  const inputs: CentralTendencyInputs = useMemo(
    () => ({
      dataInput,
      weightsInput: meanType === 'weighted' ? weightsInput : undefined,
      meanType,
      decimalPrecision,
    }),
    [dataInput, weightsInput, meanType, decimalPrecision]
  )

  // Validate inputs
  const validation: CentralTendencyValidation = useMemo(() => {
    return validateCentralTendencyInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: CentralTendencyResult | null = useMemo(() => {
    if (!validation.valid || !validation.parsedData) return null
    return calculateCentralTendency(
      inputs,
      validation.parsedData,
      validation.parsedWeights,
      t.calc
    )
  }, [inputs, validation, t.calc])

  // Reset handler
  const handleReset = useCallback(() => {
    setDataInput('')
    setWeightsInput('')
    setMeanType('arithmetic')
    setDecimalPrecision(4)
    setShowMeanSteps(false)
    setShowMedianSteps(false)
    setShowModeSteps(false)
    setShowWeightsInput(false)
    setFrequencyPage(0)
    setShowAllFrequencies(false)
  }, [])

  // Load example data
  const handleLoadExample = useCallback(() => {
    setDataInput(EXAMPLE_DATA)
    if (meanType === 'weighted') {
      setWeightsInput(EXAMPLE_WEIGHTS)
    }
  }, [meanType])

  // Handle mean type change
  const handleMeanTypeChange = useCallback((value: MeanType) => {
    setMeanType(value)
    if (value === 'weighted') {
      setShowWeightsInput(true)
    }
  }, [])

  // Get detected values count
  const detectedCount = validation.parsedData?.count || 0
  const weightsCount = validation.parsedWeights?.count || 0

  // Pagination helpers for frequency distribution
  const totalFrequencies = result?.mode.frequencyDistribution.length || 0
  const totalPages = Math.ceil(totalFrequencies / FREQUENCY_PAGE_SIZE)
  const paginatedFrequencies = useMemo(() => {
    if (!result) return []
    if (showAllFrequencies) return result.mode.frequencyDistribution
    const start = frequencyPage * FREQUENCY_PAGE_SIZE
    return result.mode.frequencyDistribution.slice(start, start + FREQUENCY_PAGE_SIZE)
  }, [result, frequencyPage, showAllFrequencies])

  // Format mode display
  const getModeDisplay = () => {
    if (!result) return '--'
    if (result.mode.type === 'no-mode') return t.results.noMode

    const values = result.mode.values
      .map((v) => formatNumber(v, decimalPrecision, locale))
      .join(', ')
    return values
  }

  // Get mode type label
  const getModeTypeLabel = () => {
    if (!result) return ''
    switch (result.mode.type) {
      case 'no-mode':
        return ''
      case 'unimodal':
        return t.results.unimodal
      case 'bimodal':
        return t.results.bimodal
      case 'multimodal':
        return t.results.multimodal
      default:
        return ''
    }
  }

  // Get selected mean display value
  const getSelectedMeanDisplay = () => {
    if (!result) return '--'
    if (result.selectedMean === null) return t.results.notAvailable
    return formatNumber(result.selectedMean, decimalPrecision, locale)
  }

  // Get mean type label
  const getMeanTypeLabel = (type: MeanType) => {
    switch (type) {
      case 'arithmetic':
        return t.results.arithmeticMean
      case 'geometric':
        return t.results.geometricMean
      case 'harmonic':
        return t.results.harmonicMean
      case 'weighted':
        return t.results.weightedMean
    }
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Mean is ${result.selectedMean}, median is ${result.median.value}, mode is ${getModeDisplay()}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Data Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="dataInput" className="text-base font-medium">
                {t.inputs.dataInput}
              </Label>
              {detectedCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {t.valuesDetected.replace('{count}', detectedCount.toString())}
                </span>
              )}
            </div>
            <Textarea
              id="dataInput"
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder={t.inputs.dataInputPlaceholder}
              className="min-h-[120px] font-mono text-base"
              aria-invalid={validation.errors.some((e) => e.field === 'dataInput')}
              aria-describedby="dataInput-help dataInput-error"
            />
            <p id="dataInput-help" className="text-sm text-muted-foreground">
              {t.inputs.dataInputHelp}
            </p>
            {validation.errors
              .filter((e) => e.field === 'dataInput')
              .map((error) => (
                <p
                  key={`data-error-${error.message}`}
                  id="dataInput-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error.message}
                </p>
              ))}
            {validation.warnings
              ?.filter((w) => w.field === 'dataInput')
              .map((warning) => (
                <p
                  key={`data-warning-${warning.message}`}
                  className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-1"
                >
                  <Info className="h-4 w-4" />
                  {warning.message}
                </p>
              ))}
          </div>

          {/* Mean Type Selector */}
          <div className="space-y-2">
            <Label htmlFor="meanType" className="text-base font-medium">
              {t.inputs.meanType}
            </Label>
            <Select value={meanType} onValueChange={handleMeanTypeChange}>
              <SelectTrigger id="meanType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arithmetic">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.arithmetic}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.arithmeticDescription}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="geometric">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.geometric}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.geometricDescription}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="harmonic">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.harmonic}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.harmonicDescription}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="weighted">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.weighted}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.weightedDescription}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weights Input (shown for weighted mean) */}
          {meanType === 'weighted' && (
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setShowWeightsInput(!showWeightsInput)}
              >
                {t.inputs.weightsInput}
                {showWeightsInput ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              {showWeightsInput && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weightsInput" className="text-sm font-medium">
                      {t.inputs.weightsInput}
                    </Label>
                    {weightsCount > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {t.weightsDetected.replace('{count}', weightsCount.toString())}
                      </span>
                    )}
                  </div>
                  <Textarea
                    id="weightsInput"
                    value={weightsInput}
                    onChange={(e) => setWeightsInput(e.target.value)}
                    placeholder={t.inputs.weightsInputPlaceholder}
                    className="min-h-[80px] font-mono text-base"
                    aria-invalid={validation.errors.some((e) => e.field === 'weightsInput')}
                    aria-describedby="weightsInput-help weightsInput-error"
                  />
                  <p id="weightsInput-help" className="text-sm text-muted-foreground">
                    {t.inputs.weightsInputHelp}
                  </p>
                  {validation.errors
                    .filter((e) => e.field === 'weightsInput')
                    .map((error) => (
                      <p
                        key={`weight-error-${error.message}`}
                        id="weightsInput-error"
                        role="alert"
                        className="text-sm text-destructive"
                      >
                        {error.message}
                      </p>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* Decimal Precision */}
          <div className="space-y-2">
            <Label htmlFor="decimalPrecision" className="text-base font-medium">
              {t.inputs.decimalPrecision}
            </Label>
            <Select
              value={decimalPrecision.toString()}
              onValueChange={(v) => setDecimalPrecision(Number(v))}
            >
              <SelectTrigger id="decimalPrecision" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <SelectItem key={n} value={n.toString()}>
                    {n} {t.inputs.decimals}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {/* Three Hero Cards */}
          <div className="grid gap-4 grid-cols-1">
            {/* Mean Card */}
            <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                  <Calculator className="h-4 w-4" />
                  {t.results.mean} ({getMeanTypeLabel(meanType)})
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                  {getSelectedMeanDisplay()}
                </div>
              </CardContent>
            </Card>

            {/* Median Card */}
            <Card className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-500 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  {t.results.median}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                  {result ? formatNumber(result.median.value, decimalPrecision, locale) : '--'}
                </div>
                {result && (
                  <div className="mt-2 text-sm opacity-80">{result.median.position}</div>
                )}
              </CardContent>
            </Card>

            {/* Mode Card */}
            <Card className="bg-gradient-to-br from-emerald-600 via-emerald-600 to-emerald-500 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                  <BarChart3 className="h-4 w-4" />
                  {t.results.mode}
                  {getModeTypeLabel() && (
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                      {getModeTypeLabel()}
                    </span>
                  )}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                  {getModeDisplay()}
                </div>
                {result && result.mode.type !== 'no-mode' && (
                  <div className="mt-2 text-sm opacity-80">
                    {t.results.frequency}: {result.mode.frequency}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* All Means Overview */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t.results.allMeans}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.arithmeticMean}</div>
                    <div className="text-lg font-mono font-semibold">
                      {result.mean.arithmetic !== null
                        ? formatNumber(result.mean.arithmetic, decimalPrecision, locale)
                        : t.results.notAvailable}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.geometricMean}</div>
                    <div className="text-lg font-mono font-semibold">
                      {result.mean.geometric !== null
                        ? formatNumber(result.mean.geometric, decimalPrecision, locale)
                        : t.results.notAvailable}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.harmonicMean}</div>
                    <div className="text-lg font-mono font-semibold">
                      {result.mean.harmonic !== null
                        ? formatNumber(result.mean.harmonic, decimalPrecision, locale)
                        : t.results.notAvailable}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.weightedMean}</div>
                    <div className="text-lg font-mono font-semibold">
                      {result.mean.weighted !== null
                        ? formatNumber(result.mean.weighted, decimalPrecision, locale)
                        : t.results.notAvailable}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Frequency Distribution */}
          {result && result.mode.frequencyDistribution.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  {t.results.frequencyDistribution}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium">{t.results.value}</th>
                        <th className="text-left p-2 font-medium">{t.results.frequency}</th>
                        <th className="text-left p-2 font-medium">{t.results.percentage}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedFrequencies.map((item) => (
                        <tr
                          key={`freq-${item.value}`}
                          className={`border-b border-muted ${item.isMode ? 'bg-primary/10' : ''}`}
                        >
                          <td className="p-2 font-mono">
                            {formatNumber(item.value, decimalPrecision, locale)}
                            {item.isMode && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                                {t.results.mode}
                              </span>
                            )}
                          </td>
                          <td className="p-2 font-mono">{item.frequency}</td>
                          <td className="p-2 font-mono">{item.percentage}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Pagination controls */}
                  {totalFrequencies > FREQUENCY_PAGE_SIZE && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFrequencyPage((p) => Math.max(0, p - 1))}
                          disabled={frequencyPage === 0 || showAllFrequencies}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-xs text-muted-foreground px-2">
                          {showAllFrequencies
                            ? `1-${totalFrequencies} of ${totalFrequencies}`
                            : `${frequencyPage * FREQUENCY_PAGE_SIZE + 1}-${Math.min((frequencyPage + 1) * FREQUENCY_PAGE_SIZE, totalFrequencies)} of ${totalFrequencies}`}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFrequencyPage((p) => Math.min(totalPages - 1, p + 1))}
                          disabled={frequencyPage >= totalPages - 1 || showAllFrequencies}
                          className="h-7 w-7 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAllFrequencies(!showAllFrequencies)
                          setFrequencyPage(0)
                        }}
                        className="h-7 text-xs"
                      >
                        {showAllFrequencies ? t.paginate : t.showAll}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Statistics */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">{t.results.additionalStats}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.count}</div>
                    <div className="text-lg font-mono font-semibold">{result.count}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.sum}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.sum, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.range}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.range, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.min} / {t.results.max}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.min, decimalPrecision, locale)} /{' '}
                      {formatNumber(result.max, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.variance}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.variance, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.standardDeviation}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.standardDeviation, decimalPrecision, locale)}
                    </div>
                  </div>
                </div>

                {/* Quartiles */}
                <h4 className="font-semibold mt-6 mb-3">{t.results.quartiles}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.q1}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.quartiles.q1, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.q2}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.quartiles.q2, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.q3}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.quartiles.q3, decimalPrecision, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">{t.results.iqr}</div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.quartiles.iqr, decimalPrecision, locale)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step-by-Step Calculations */}
          {result && (
            <>
              {/* Mean Steps */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                    onClick={() => setShowMeanSteps((prev) => !prev)}
                  >
                    <span className="text-sm font-medium">{t.steps.meanStepsTitle}</span>
                    {showMeanSteps ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {showMeanSteps && (
                    <div className="mt-4 space-y-3">
                      {result.meanSteps.map((step) => (
                        <div key={step.stepNumber} className="flex gap-3 text-sm">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{step.description}</div>
                            <code className="text-muted-foreground font-mono text-xs block mt-1 overflow-x-auto">
                              {step.expression}
                            </code>
                            {step.result && (
                              <span className="text-green-600 dark:text-green-400 font-medium text-xs">
                                = {step.result}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Median Steps */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                    onClick={() => setShowMedianSteps((prev) => !prev)}
                  >
                    <span className="text-sm font-medium">{t.steps.medianStepsTitle}</span>
                    {showMedianSteps ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {showMedianSteps && (
                    <div className="mt-4 space-y-3">
                      {result.medianSteps.map((step) => (
                        <div key={step.stepNumber} className="flex gap-3 text-sm">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-medium">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{step.description}</div>
                            <code className="text-muted-foreground font-mono text-xs block mt-1 overflow-x-auto">
                              {step.expression}
                            </code>
                            {step.result && (
                              <span className="text-green-600 dark:text-green-400 font-medium text-xs">
                                = {step.result}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mode Steps */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    variant="ghost"
                    className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                    onClick={() => setShowModeSteps((prev) => !prev)}
                  >
                    <span className="text-sm font-medium">{t.steps.modeStepsTitle}</span>
                    {showModeSteps ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {showModeSteps && (
                    <div className="mt-4 space-y-3">
                      {result.modeSteps.map((step) => (
                        <div key={step.stepNumber} className="flex gap-3 text-sm">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-medium">
                            {step.stepNumber}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{step.description}</div>
                            <code className="text-muted-foreground font-mono text-xs block mt-1 overflow-x-auto">
                              {step.expression}
                            </code>
                            {step.result && (
                              <span className="text-green-600 dark:text-green-400 font-medium text-xs">
                                = {step.result}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {/* Warnings */}
          {result && result.warnings.length > 0 && (
            <Card className="border-yellow-500/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-500">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    {result.warnings.map((warning) => (
                      <p key={warning} className="text-sm">
                        {warning}
                      </p>
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
