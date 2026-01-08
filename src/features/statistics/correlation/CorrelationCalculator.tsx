'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  validateCorrelationInputs,
  calculateCorrelationResult,
} from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  CorrelationInputs,
  CorrelationResult,
  CorrelationValidation,
  CorrelationCalculatorTranslations,
  InputMethod,
  CorrelationStrength,
} from './types'

interface CorrelationCalculatorProps {
  locale?: string
  translations: CorrelationCalculatorTranslations
}

// Example data for pairs mode
const EXAMPLE_PAIRS = `1, 2
2, 4
3, 5
4, 4
5, 5
6, 7
7, 8
8, 9
9, 10
10, 11`

// Example data for columns mode
const EXAMPLE_X = '1, 2, 3, 4, 5, 6, 7, 8, 9, 10'
const EXAMPLE_Y = '2, 4, 5, 4, 5, 7, 8, 9, 10, 11'

const DEVIATIONS_PAGE_SIZE = 10

export function CorrelationCalculator({
  locale = 'en-US',
  translations: t,
}: CorrelationCalculatorProps) {
  // Input states
  const [inputMethod, setInputMethod] = useState<InputMethod>('pairs')
  const [pairsInput, setPairsInput] = useState<string>('')
  const [xDataInput, setXDataInput] = useState<string>('')
  const [yDataInput, setYDataInput] = useState<string>('')
  const [decimalPrecision] = useState<number>(4)
  const [showSteps, setShowSteps] = useState(false)
  const [deviationsPage, setDeviationsPage] = useState(0)
  const [showAllDeviations, setShowAllDeviations] = useState(false)

  // Build inputs object
  const inputs: CorrelationInputs = useMemo(
    () => ({
      inputMethod,
      pairsInput,
      xDataInput,
      yDataInput,
      decimalPrecision,
    }),
    [inputMethod, pairsInput, xDataInput, yDataInput, decimalPrecision]
  )

  // Validate inputs
  const validation: CorrelationValidation = useMemo(() => {
    return validateCorrelationInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: CorrelationResult | null = useMemo(() => {
    if (!validation.valid || !validation.parsedData) return null
    try {
      return calculateCorrelationResult(validation.parsedData, decimalPrecision)
    } catch {
      return null
    }
  }, [validation, decimalPrecision])

  // Reset handler
  const handleReset = useCallback(() => {
    setPairsInput('')
    setXDataInput('')
    setYDataInput('')
    setShowSteps(false)
    setDeviationsPage(0)
    setShowAllDeviations(false)
  }, [])

  // Toggle steps handler
  const handleToggleSteps = useCallback(() => {
    setShowSteps((prev) => !prev)
  }, [])

  // Load example data
  const handleLoadExample = useCallback(() => {
    if (inputMethod === 'pairs') {
      setPairsInput(EXAMPLE_PAIRS)
    } else {
      setXDataInput(EXAMPLE_X)
      setYDataInput(EXAMPLE_Y)
    }
  }, [inputMethod])

  // Get strength translation
  const getStrengthLabel = useCallback(
    (strength: CorrelationStrength): string => {
      return t.strength[strength] || strength
    },
    [t.strength]
  )

  // Get strength color
  const getStrengthColor = useCallback(
    (strength: CorrelationStrength): string => {
      if (strength.includes('positive')) {
        if (strength.includes('perfect') || strength.includes('strong')) {
          return 'text-green-600 dark:text-green-400'
        } else if (strength.includes('moderate')) {
          return 'text-green-500 dark:text-green-300'
        } else {
          return 'text-green-400 dark:text-green-200'
        }
      } else if (strength.includes('negative')) {
        if (strength.includes('perfect') || strength.includes('strong')) {
          return 'text-red-600 dark:text-red-400'
        } else if (strength.includes('moderate')) {
          return 'text-red-500 dark:text-red-300'
        } else {
          return 'text-red-400 dark:text-red-200'
        }
      }
      return 'text-gray-500'
    },
    []
  )

  const getDirectionIcon = () => {
    if (!result) return null
    if (result.direction === 'positive') {
      return <TrendingUp className="h-5 w-5" />
    } else if (result.direction === 'negative') {
      return <TrendingDown className="h-5 w-5" />
    }
    return <Minus className="h-5 w-5" />
  }

  // Pagination helpers
  const totalDeviations = result?.deviations.length || 0
  const totalPages = Math.ceil(totalDeviations / DEVIATIONS_PAGE_SIZE)
  const paginatedDeviations = useMemo(() => {
    if (!result) return []
    if (showAllDeviations) return result.deviations
    const start = deviationsPage * DEVIATIONS_PAGE_SIZE
    return result.deviations.slice(start, start + DEVIATIONS_PAGE_SIZE)
  }, [result, deviationsPage, showAllDeviations])

  // Get detected pairs count
  const detectedCount = validation.parsedData?.count || 0

  // Field error/warning helpers
  const getFieldError = (field: string) => {
    return validation.errors.find((e) => e.field === field)?.message
  }

  const getFieldWarning = (field: string) => {
    return validation.warnings?.find((w) => w.field === field)?.message
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `Correlation coefficient is ${result.correlationCoefficient}, R-squared is ${result.rSquared}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Input Method */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t.inputs.inputMethod}
            </Label>
            <RadioGroup
              value={inputMethod}
              onValueChange={(v) => {
                setInputMethod(v as InputMethod)
                handleReset()
              }}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="pairs" id="pairs" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="pairs" className="font-medium cursor-pointer">
                    {t.inputs.pairsMode}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.inputs.pairsModeDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="columns" id="columns" className="mt-1" />
                <div className="flex-1">
                  <Label
                    htmlFor="columns"
                    className="font-medium cursor-pointer"
                  >
                    {t.inputs.columnsMode}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {t.inputs.columnsModeDescription}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Data Input */}
          {inputMethod === 'pairs' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pairsInput" className="text-base font-medium">
                  {t.inputs.pairsInput}
                </Label>
                {detectedCount > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {t.pairsDetected.replace(
                      '{count}',
                      detectedCount.toString()
                    )}
                  </span>
                )}
              </div>
              <Textarea
                id="pairsInput"
                value={pairsInput}
                onChange={(e) => setPairsInput(e.target.value)}
                placeholder={t.inputs.pairsInputPlaceholder}
                className="min-h-[180px] font-mono text-base"
                aria-invalid={!!getFieldError('pairsInput')}
                aria-describedby="pairsInput-help pairsInput-error"
              />
              <p id="pairsInput-help" className="text-sm text-muted-foreground">
                {t.inputs.pairsInputHelp}
              </p>
              {getFieldError('pairsInput') && (
                <p
                  id="pairsInput-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {getFieldError('pairsInput')}
                </p>
              )}
              {getFieldWarning('pairsInput') && (
                <p className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  {getFieldWarning('pairsInput')}
                </p>
              )}
            </div>
          ) : (
            <>
              {/* X Values */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="xDataInput" className="text-base font-medium">
                    {t.inputs.xInput}
                  </Label>
                </div>
                <Textarea
                  id="xDataInput"
                  value={xDataInput}
                  onChange={(e) => setXDataInput(e.target.value)}
                  placeholder={t.inputs.xInputPlaceholder}
                  className="min-h-[80px] font-mono text-base"
                  aria-invalid={!!getFieldError('xDataInput')}
                  aria-describedby="xDataInput-error"
                />
                {getFieldError('xDataInput') && (
                  <p
                    id="xDataInput-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {getFieldError('xDataInput')}
                  </p>
                )}
                {getFieldWarning('xDataInput') && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    {getFieldWarning('xDataInput')}
                  </p>
                )}
              </div>

              {/* Y Values */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="yDataInput" className="text-base font-medium">
                    {t.inputs.yInput}
                  </Label>
                  {detectedCount > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {t.pairsDetected.replace(
                        '{count}',
                        detectedCount.toString()
                      )}
                    </span>
                  )}
                </div>
                <Textarea
                  id="yDataInput"
                  value={yDataInput}
                  onChange={(e) => setYDataInput(e.target.value)}
                  placeholder={t.inputs.yInputPlaceholder}
                  className="min-h-[80px] font-mono text-base"
                  aria-invalid={!!getFieldError('yDataInput')}
                  aria-describedby="yDataInput-help yDataInput-error"
                />
                <p
                  id="yDataInput-help"
                  className="text-sm text-muted-foreground"
                >
                  {t.inputs.columnsHelp}
                </p>
                {getFieldError('yDataInput') && (
                  <p
                    id="yDataInput-error"
                    role="alert"
                    className="text-sm text-destructive"
                  >
                    {getFieldError('yDataInput')}
                  </p>
                )}
                {getFieldWarning('yDataInput') && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-500 flex items-center gap-1">
                    <Info className="h-4 w-4" />
                    {getFieldWarning('yDataInput')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleLoadExample}
              variant="outline"
              className="flex-1"
            >
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
                {getDirectionIcon()}
                {t.results.correlationCoefficient}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight font-mono">
                {result
                  ? formatNumber(result.correlationCoefficient, 4, locale)
                  : '--'}
              </div>
              {result && (
                <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
                  <div>
                    <div className="text-xs opacity-70">
                      {t.results.rSquared}
                    </div>
                    <div className="text-lg font-semibold font-mono">
                      {formatNumber(result.rSquared, 4, locale)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-70">
                      {t.results.sampleSize}
                    </div>
                    <div className="text-lg font-semibold font-mono">
                      {result.count}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interpretation Card */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {t.interpretation}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{t.results.strength}:</span>
                    <span
                      className={`font-semibold ${getStrengthColor(result.strength)}`}
                    >
                      {getStrengthLabel(result.strength)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t.rSquaredExplanation.replace(
                      '{percentage}',
                      formatNumber(result.rSquared * 100, 1, locale)
                    )}
                  </p>
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
                      {t.results.xMean}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.xMean, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.yMean}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.yMean, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.xStdDev}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.xStdDev, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.yStdDev}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.yStdDev, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.covariance}
                    </div>
                    <div className="text-lg font-mono font-semibold">
                      {formatNumber(result.covariance, 4, locale)}
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground">
                      {t.results.regression}
                    </div>
                    <div className="text-sm font-mono font-semibold">
                      {result.regression.equation}
                    </div>
                  </div>
                  {result.significance && (
                    <>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          {t.results.tStatistic}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {formatNumber(
                            result.significance.tStatistic,
                            4,
                            locale
                          )}
                        </div>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <div className="text-xs text-muted-foreground">
                          {t.results.pValue}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {result.significance.pValueApprox}
                          <span className="text-xs ml-2 text-muted-foreground">
                            {result.significance.isSignificant
                              ? t.results.significant
                              : t.results.notSignificant}
                          </span>
                        </div>
                      </div>
                    </>
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
                            x̄ = {formatNumber(result.xMean, 4, locale)}, ȳ ={' '}
                            {formatNumber(result.yMean, 4, locale)}
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
                                  <th className="text-left p-1 font-medium">
                                    {t.steps.x}
                                  </th>
                                  <th className="text-left p-1 font-medium">
                                    {t.steps.y}
                                  </th>
                                  <th className="text-left p-1 font-medium">
                                    {t.steps.xDeviation}
                                  </th>
                                  <th className="text-left p-1 font-medium">
                                    {t.steps.yDeviation}
                                  </th>
                                  <th className="text-left p-1 font-medium">
                                    {t.steps.product}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {paginatedDeviations.map((d, i) => (
                                  <tr key={i} className="border-b border-muted">
                                    <td className="p-1 font-mono">
                                      {formatNumber(d.point.x, 2, locale)}
                                    </td>
                                    <td className="p-1 font-mono">
                                      {formatNumber(d.point.y, 2, locale)}
                                    </td>
                                    <td className="p-1 font-mono">
                                      {formatNumber(d.xDeviation, 4, locale)}
                                    </td>
                                    <td className="p-1 font-mono">
                                      {formatNumber(d.yDeviation, 4, locale)}
                                    </td>
                                    <td className="p-1 font-mono">
                                      {formatNumber(d.product, 4, locale)}
                                    </td>
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
                                    onClick={() =>
                                      setDeviationsPage((p) =>
                                        Math.max(0, p - 1)
                                      )
                                    }
                                    disabled={
                                      deviationsPage === 0 || showAllDeviations
                                    }
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
                                    onClick={() =>
                                      setDeviationsPage((p) =>
                                        Math.min(totalPages - 1, p + 1)
                                      )
                                    }
                                    disabled={
                                      deviationsPage >= totalPages - 1 ||
                                      showAllDeviations
                                    }
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
                            Σ(xi - x̄)(yi - ȳ) ={' '}
                            {formatNumber(result.sumXDevYDev, 4, locale)}
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
                            √[Σ(xi - x̄)² × Σ(yi - ȳ)²] = √[
                            {formatNumber(result.sumXDevSquared, 4, locale)} ×{' '}
                            {formatNumber(result.sumYDevSquared, 4, locale)}] ={' '}
                            {formatNumber(
                              Math.sqrt(
                                result.sumXDevSquared * result.sumYDevSquared
                              ),
                              4,
                              locale
                            )}
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
                            r = {formatNumber(result.sumXDevYDev, 4, locale)} /{' '}
                            {formatNumber(
                              Math.sqrt(
                                result.sumXDevSquared * result.sumYDevSquared
                              ),
                              4,
                              locale
                            )}{' '}
                            ={' '}
                            {formatNumber(
                              result.correlationCoefficient,
                              4,
                              locale
                            )}
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
