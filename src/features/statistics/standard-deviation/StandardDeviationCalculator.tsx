'use client'

import { useState, useMemo, useCallback } from 'react'
import { BarChart3, Info, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  validateStandardDeviationInputs,
  calculateStandardDeviationResult,
} from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  StandardDeviationInputs,
  StandardDeviationResult,
  StandardDeviationValidation,
  CalculationType,
} from './types'

interface StandardDeviationCalculatorTranslations {
  inputs: {
    dataInput: string
    dataInputPlaceholder: string
    dataInputHelp: string
    calculationType: string
    population: string
    populationDescription: string
    sample: string
    sampleDescription: string
  }
  results: {
    standardDeviation: string
    variance: string
    mean: string
    count: string
    sum: string
    sumOfSquares: string
    range: string
    min: string
    max: string
    standardError: string
    coefficientOfVariation: string
  }
  steps: {
    title: string
    step1: string
    step2: string
    step3: string
    step4: string
    step5: string
    deviationsTable: string
    value: string
    deviation: string
    squaredDeviation: string
  }
  formula: string
  showSteps: string
  hideSteps: string
  valuesDetected: string
  reset: string
  tryExample: string
}

interface StandardDeviationCalculatorProps {
  locale?: string
  translations: StandardDeviationCalculatorTranslations
}

const EXAMPLE_DATA = '10, 12, 23, 23, 16, 23, 21, 16'
const DEVIATIONS_PAGE_SIZE = 10

export function StandardDeviationCalculator({
  locale = 'en-US',
  translations: t,
}: StandardDeviationCalculatorProps) {
  // Input states
  const [dataInput, setDataInput] = useState<string>('')
  const [calculationType, setCalculationType] = useState<CalculationType>('sample')
  const [showSteps, setShowSteps] = useState(false)
  const [deviationsPage, setDeviationsPage] = useState(0)
  const [showAllDeviations, setShowAllDeviations] = useState(false)

  // Build inputs object
  const inputs: StandardDeviationInputs = useMemo(
    () => ({
      dataInput,
      calculationType,
    }),
    [dataInput, calculationType]
  )

  // Validate inputs
  const validation: StandardDeviationValidation = useMemo(() => {
    return validateStandardDeviationInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: StandardDeviationResult | null = useMemo(() => {
    if (!validation.valid || !validation.parsedData) return null
    return calculateStandardDeviationResult(inputs, validation.parsedData)
  }, [inputs, validation])

  // Reset handler
  const handleReset = useCallback(() => {
    setDataInput('')
    setCalculationType('sample')
    setShowSteps(false)
    setDeviationsPage(0)
    setShowAllDeviations(false)
  }, [])

  // Toggle steps handler
  const handleToggleSteps = useCallback(() => {
    setShowSteps(prev => !prev)
  }, [])

  // Pagination helpers
  const totalDeviations = result?.deviations.length || 0
  const totalPages = Math.ceil(totalDeviations / DEVIATIONS_PAGE_SIZE)
  const paginatedDeviations = useMemo(() => {
    if (!result) return []
    if (showAllDeviations) return result.deviations
    const start = deviationsPage * DEVIATIONS_PAGE_SIZE
    return result.deviations.slice(start, start + DEVIATIONS_PAGE_SIZE)
  }, [result, deviationsPage, showAllDeviations])

  // Load example data
  const handleLoadExample = useCallback(() => {
    setDataInput(EXAMPLE_DATA)
  }, [])

  // Get detected values count
  const detectedCount = validation.parsedData?.count || 0

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Standard deviation is ${result.standardDeviation}, mean is ${result.mean}`}
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
              aria-invalid={
                validation.errors.some((e) => e.field === 'dataInput')
              }
              aria-describedby="dataInput-help dataInput-error"
            />
            <p id="dataInput-help" className="text-sm text-muted-foreground">
              {t.inputs.dataInputHelp}
            </p>
            {validation.errors
              .filter((e) => e.field === 'dataInput')
              .map((error, i) => (
                <p
                  key={i}
                  id="dataInput-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error.message}
                </p>
              ))}
            {validation.warnings
              ?.filter((w) => w.field === 'dataInput')
              .map((warning, i) => (
                <p
                  key={i}
                  className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-1"
                >
                  <Info className="h-4 w-4" />
                  {warning.message}
                </p>
              ))}
          </div>

          {/* Calculation Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t.inputs.calculationType}
            </Label>
            <RadioGroup
              value={calculationType}
              onValueChange={(v) => setCalculationType(v as CalculationType)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="sample" id="sample" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="sample" className="font-medium cursor-pointer">
                    {t.inputs.sample}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.inputs.sampleDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="population" id="population" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="population" className="font-medium cursor-pointer">
                    {t.inputs.population}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.inputs.populationDescription}
                  </p>
                </div>
              </div>
            </RadioGroup>
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
                {t.results.standardDeviation}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight font-mono">
                {result ? formatNumber(result.standardDeviation, 4, locale) : '--'}
              </div>
              {result && (
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
                  <div>
                    <div className="text-xs opacity-70">{t.results.variance}</div>
                    <div className="text-lg font-semibold font-mono">
                      {formatNumber(result.variance, 4, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70">{t.results.mean}</div>
                    <div className="text-lg font-semibold font-mono">
                      {formatNumber(result.mean, 4, locale)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Statistics */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.count}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {result.count}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.sum}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.sum, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.range}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.range, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.min} / {t.results.max}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.min, 2, locale)} / {formatNumber(result.max, 2, locale)}
                    </div>
                  </div>
                  {result.standardError !== undefined && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        {t.results.standardError}
                      </div>
                      <div className="text-lg font-mono font-semibold">
                        {formatNumber(result.standardError, 4, locale)}
                      </div>
                    </div>
                  )}
                  {result.coefficientOfVariation !== undefined && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-xs text-muted-foreground">
                        {t.results.coefficientOfVariation}
                      </div>
                      <div className="text-lg font-mono font-semibold">
                        {formatNumber(result.coefficientOfVariation, 2, locale)}%
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step-by-Step Calculation */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                  onClick={handleToggleSteps}
                >
                  <span className="text-sm font-medium">
                    {showSteps ? t.hideSteps : t.showSteps}
                  </span>
                  {showSteps ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showSteps && (
                  <div className="mt-4 space-y-4">
                    {/* Formula */}
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        {t.formula}
                      </div>
                      <code className="text-sm bg-muted p-3 rounded-lg block font-mono">
                        {result.formula}
                      </code>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                      <div className="flex gap-3 text-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{t.steps.step1}</div>
                          <code className="text-muted-foreground font-mono text-xs">
                            {result.calculationType === 'sample' ? 'x̄' : 'μ'} = {result.sum} / {result.count} = {result.mean}
                          </code>
                        </div>
                      </div>

                      <div className="flex gap-3 text-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{t.steps.step2}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {t.steps.deviationsTable}
                          </div>
                          <div className="mt-2 overflow-x-auto">
                            <table className="text-xs w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-1 font-medium">{t.steps.value}</th>
                                  <th className="text-left p-1 font-medium">{t.steps.deviation}</th>
                                  <th className="text-left p-1 font-medium">{t.steps.squaredDeviation}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedDeviations.map((d, i) => (
                                  <tr key={i} className="border-b border-muted">
                                    <td className="p-1 font-mono">{d.value}</td>
                                    <td className="p-1 font-mono">{d.deviation}</td>
                                    <td className="p-1 font-mono">{d.squaredDeviation}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {/* Pagination controls */}
                            {totalDeviations > DEVIATIONS_PAGE_SIZE && (
                              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeviationsPage(p => Math.max(0, p - 1))}
                                    disabled={deviationsPage === 0 || showAllDeviations}
                                    className="h-7 w-7 p-0"
                                  >
                                    <ChevronLeft className="h-4 w-4" />
                                  </Button>
                                  <span className="text-xs text-muted-foreground px-2">
                                    {showAllDeviations
                                      ? `1-${totalDeviations} of ${totalDeviations}`
                                      : `${deviationsPage * DEVIATIONS_PAGE_SIZE + 1}-${Math.min((deviationsPage + 1) * DEVIATIONS_PAGE_SIZE, totalDeviations)} of ${totalDeviations}`}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeviationsPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={deviationsPage >= totalPages - 1 || showAllDeviations}
                                    className="h-7 w-7 p-0"
                                  >
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setShowAllDeviations(!showAllDeviations)
                                    setDeviationsPage(0)
                                  }}
                                  className="h-7 text-xs"
                                >
                                  {showAllDeviations ? 'Paginate' : 'Show all'}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 text-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          3
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{t.steps.step3}</div>
                          <code className="text-muted-foreground font-mono text-xs">
                            Σ(xi - {result.calculationType === 'sample' ? 'x̄' : 'μ'})² = {result.sumOfSquares}
                          </code>
                        </div>
                      </div>

                      <div className="flex gap-3 text-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          4
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{t.steps.step4}</div>
                          <code className="text-muted-foreground font-mono text-xs">
                            {result.calculationType === 'sample' ? 's²' : 'σ²'} = {result.sumOfSquares} / {result.divisor} = {result.variance}
                          </code>
                        </div>
                      </div>

                      <div className="flex gap-3 text-sm">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          5
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{t.steps.step5}</div>
                          <code className="text-muted-foreground font-mono text-xs">
                            {result.calculationType === 'sample' ? 's' : 'σ'} = √{result.variance} = {result.standardDeviation}
                          </code>
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
