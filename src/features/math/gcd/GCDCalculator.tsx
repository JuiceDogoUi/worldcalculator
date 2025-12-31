'use client'

import { useState, useMemo, useCallback } from 'react'
import { Calculator, Info, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { validateGCDInputs, calculateGCDResult } from './calculations'
import { formatNumber } from '@/lib/formatters'
import type { GCDInputs, GCDResult, GCDValidation } from './types'

interface GCDCalculatorTranslations {
  inputs: {
    numbersInput: string
    numbersInputPlaceholder: string
    numbersInputHelp: string
  }
  results: {
    gcd: string
    lcm: string
    primeFactorization: string
    numbersEntered: string
    coprime: string
    notCoprime: string
    gcdIs: string
    lcmIs: string
  }
  steps: {
    title: string
    primeFactorizationTitle: string
    euclideanTitle: string
    gcdExplanation: string
    lcmExplanation: string
  }
  formula: string
  showSteps: string
  hideSteps: string
  numbersDetected: string
  reset: string
  tryExample: string
}

interface GCDCalculatorProps {
  locale?: string
  translations: GCDCalculatorTranslations
}

const EXAMPLE_DATA = '48, 18, 24'

export function GCDCalculator({
  locale = 'en-US',
  translations: t,
}: GCDCalculatorProps) {
  // Input states
  const [numbersInput, setNumbersInput] = useState<string>('')
  const [showSteps, setShowSteps] = useState(false)

  // Build inputs object
  const inputs: GCDInputs = useMemo(
    () => ({
      numbersInput,
    }),
    [numbersInput]
  )

  // Validate inputs
  const validation: GCDValidation = useMemo(() => {
    return validateGCDInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: GCDResult | null = useMemo(() => {
    if (!validation.valid || !validation.parsedNumbers) return null
    return calculateGCDResult(validation.parsedNumbers)
  }, [validation])

  // Reset handler
  const handleReset = useCallback(() => {
    setNumbersInput('')
    setShowSteps(false)
  }, [])

  // Toggle steps handler
  const handleToggleSteps = useCallback(() => {
    setShowSteps((prev) => !prev)
  }, [])

  // Load example data
  const handleLoadExample = useCallback(() => {
    setNumbersInput(EXAMPLE_DATA)
  }, [])

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNumbersInput(e.target.value)
    },
    []
  )

  // Get detected count
  const detectedCount = validation.parsedNumbers?.count || 0

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${t.results.gcdIs} ${result.gcd}, ${t.results.lcmIs} ${result.lcm}`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Numbers Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="numbersInput" className="text-base font-medium">
                {t.inputs.numbersInput}
              </Label>
              {detectedCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {t.numbersDetected.replace('{count}', detectedCount.toString())}
                </span>
              )}
            </div>
            <Textarea
              id="numbersInput"
              value={numbersInput}
              onChange={handleInputChange}
              placeholder={t.inputs.numbersInputPlaceholder}
              className="min-h-[100px] font-mono text-base"
              aria-invalid={validation.errors.some(
                (e) => e.field === 'numbersInput'
              )}
              aria-describedby="numbersInput-help numbersInput-error"
            />
            <p id="numbersInput-help" className="text-sm text-muted-foreground">
              {t.inputs.numbersInputHelp}
            </p>
            {validation.errors
              .filter((e) => e.field === 'numbersInput')
              .map((error, i) => (
                <p
                  key={i}
                  id="numbersInput-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error.message}
                </p>
              ))}
            {validation.warnings
              ?.filter((w) => w.field === 'numbersInput')
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
          {/* Hero Result Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* GCD Card */}
            <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                  <Calculator className="h-4 w-4" />
                  {t.results.gcd}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                  {result ? formatNumber(result.gcd, 0, locale) : '--'}
                </div>
                {result && (
                  <div className="mt-3 text-xs opacity-80 font-mono">
                    {result.gcdFactorization.factorString}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* LCM Card */}
            <Card className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-500 text-white overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                  <Calculator className="h-4 w-4" />
                  {t.results.lcm}
                </div>
                <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                  {result ? formatNumber(result.lcm, 0, locale) : '--'}
                </div>
                {result && (
                  <div className="mt-3 text-xs opacity-80 font-mono">
                    {result.lcmFactorization.factorString}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coprime Status */}
          {result && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {result.areCoprime ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">{t.results.coprime}</div>
                        <div className="text-sm text-muted-foreground">
                          {t.results.gcd} = 1
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <X className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div>
                        <div className="font-medium">{t.results.notCoprime}</div>
                        <div className="text-sm text-muted-foreground">
                          {t.results.gcd} = {result.gcd}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prime Factorizations */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-medium mb-4">
                  {t.results.primeFactorization}
                </h3>
                <div className="space-y-3">
                  {result.factorizations.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-mono font-semibold text-lg">
                        {formatNumber(f.number, 0, locale)}
                      </span>
                      <span className="font-mono text-sm text-muted-foreground">
                        = {f.factorString}
                      </span>
                    </div>
                  ))}
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
                  <div className="mt-4 space-y-6">
                    {/* Euclidean Algorithm (only for 2 numbers) */}
                    {result.euclideanSteps && result.euclideanSteps.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-3">
                          {t.steps.euclideanTitle}
                        </h4>
                        <div className="space-y-2">
                          {result.euclideanSteps.map((step, i) => (
                            <div
                              key={i}
                              className="flex gap-3 text-sm items-center"
                            >
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                                {i + 1}
                              </div>
                              <code className="font-mono bg-muted px-3 py-1.5 rounded flex-1">
                                {step.equation}
                              </code>
                            </div>
                          ))}
                          <div className="flex gap-3 text-sm items-center mt-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs">
                              <Check className="h-4 w-4" />
                            </div>
                            <span className="text-muted-foreground">
                              {t.results.gcd} = {result.gcd}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* GCD Explanation */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {t.steps.gcdExplanation}
                      </h4>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <div className="font-mono">
                          {t.results.gcd}({result.numbers.join(', ')}) = {result.gcd}
                        </div>
                        <div className="text-muted-foreground mt-2">
                          = {result.gcdFactorization.factorString}
                        </div>
                      </div>
                    </div>

                    {/* LCM Explanation */}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        {t.steps.lcmExplanation}
                      </h4>
                      <div className="bg-muted p-3 rounded-lg text-sm">
                        <div className="font-mono">
                          {t.results.lcm}({result.numbers.join(', ')}) = {result.lcm}
                        </div>
                        <div className="text-muted-foreground mt-2">
                          = {result.lcmFactorization.factorString}
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
