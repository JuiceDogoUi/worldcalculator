'use client'

import { useState, useMemo, useCallback } from 'react'
import { RotateCcw, Check, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  calculateSquareRoot,
  validateSquareRootInputs,
} from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  SquareRootInputs,
  SquareRootResult,
  SquareRootMode,
  SquareRootValidation,
} from './types'

interface ModeTranslations {
  label: string
  description: string
}

interface SquareRootCalculatorTranslations {
  modes: {
    squareRoot: ModeTranslations
    nthRoot: ModeTranslations
    square: ModeTranslations
  }
  inputs: {
    number: string
    numberPlaceholder: string
    rootIndex: string
    rootIndexPlaceholder: string
  }
  results: {
    title: string
    positiveRoot: string
    negativeRoot: string
    exactValue: string
    approximateValue: string
    simplifiedForm: string
    isPerfectSquare: string
    yes: string
    no: string
  }
  steps: string
  formula: string
  explanation: string
  primeFactorization: string
  reset: string
  errors: {
    negativeSquareRoot: string
    negativeEvenRoot: string
    invalidNumber: string
    invalidRootIndex: string
  }
}

interface SquareRootCalculatorProps {
  locale?: string
  translations: SquareRootCalculatorTranslations
}

export function SquareRootCalculator({
  locale = 'en-US',
  translations: t,
}: SquareRootCalculatorProps) {
  // State
  const [mode, setMode] = useState<SquareRootMode>('square-root')
  const [number, setNumber] = useState<string>('16')
  const [nthRoot, setNthRoot] = useState<string>('3')

  // Build inputs object
  const inputs: SquareRootInputs = useMemo(() => {
    return {
      mode,
      number: parseFloat(number) || 0,
      nthRoot: mode === 'nth-root' ? parseInt(nthRoot) || 2 : 2,
    }
  }, [mode, number, nthRoot])

  // Validate inputs
  const validation: SquareRootValidation = useMemo(() => {
    return validateSquareRootInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: SquareRootResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateSquareRoot(inputs)
  }, [inputs, validation.valid])

  // Reset handler
  const handleReset = useCallback(() => {
    setNumber('16')
    setNthRoot('3')
    setMode('square-root')
  }, [])

  // Get error for a field
  const getError = (field: string) =>
    validation.errors.find((e) => e.field === field)?.message

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
            onValueChange={(v) => setMode(v as SquareRootMode)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-auto">
              <TabsTrigger
                value="square-root"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <span className="text-lg font-mono">√x</span>
                <span className="hidden sm:inline">{t.modes.squareRoot.label}</span>
              </TabsTrigger>
              <TabsTrigger
                value="nth-root"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <span className="text-lg font-mono">ⁿ√x</span>
                <span className="hidden sm:inline">{t.modes.nthRoot.label}</span>
              </TabsTrigger>
              <TabsTrigger
                value="square"
                className="text-xs sm:text-sm py-2.5 px-1 flex flex-col gap-1"
              >
                <span className="text-lg font-mono">x²</span>
                <span className="hidden sm:inline">{t.modes.square.label}</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Mode description */}
          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              {mode === 'square-root' && t.modes.squareRoot.description}
              {mode === 'nth-root' && t.modes.nthRoot.description}
              {mode === 'square' && t.modes.square.description}
            </CardContent>
          </Card>

          {/* Inputs */}
          <div className="space-y-4">
            {/* Main number input */}
            <div className="space-y-2">
              <Label htmlFor="number" className="text-base font-medium">
                {t.inputs.number}
              </Label>
              <div className="relative">
                {mode === 'square-root' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-mono text-muted-foreground">
                    √
                  </span>
                )}
                {mode === 'nth-root' && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-mono text-muted-foreground">
                    <sup className="text-sm">{nthRoot || 'n'}</sup>√
                  </span>
                )}
                <Input
                  id="number"
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className={`text-2xl h-14 font-mono text-center ${
                    mode !== 'square' ? 'pl-12' : ''
                  }`}
                  placeholder={t.inputs.numberPlaceholder}
                  aria-invalid={!!getError('number')}
                />
                {mode === 'square' && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xl font-mono text-muted-foreground">
                    ²
                  </span>
                )}
              </div>
              {getError('number') && (
                <p className="text-sm text-destructive">{getError('number')}</p>
              )}
            </div>

            {/* Nth root index input */}
            {mode === 'nth-root' && (
              <div className="space-y-2">
                <Label htmlFor="nthRoot" className="text-base font-medium">
                  {t.inputs.rootIndex}
                </Label>
                <Input
                  id="nthRoot"
                  type="number"
                  min="1"
                  value={nthRoot}
                  onChange={(e) => setNthRoot(e.target.value)}
                  className="text-xl h-12 font-mono text-center"
                  placeholder={t.inputs.rootIndexPlaceholder}
                  aria-invalid={!!getError('nthRoot')}
                />
                {getError('nthRoot') && (
                  <p className="text-sm text-destructive">{getError('nthRoot')}</p>
                )}
              </div>
            )}
          </div>

          {/* Reset button */}
          <Button onClick={handleReset} variant="outline" className="w-full">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t.reset}
          </Button>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.results.title}
              </div>

              {result ? (
                <>
                  {/* Main result */}
                  <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono mb-4">
                    {mode === 'square'
                      ? result.exactValue
                      : result.exactValue
                        ? result.exactValue
                        : `≈ ${formatNumber(result.positiveRoot, 6, locale)}`}
                  </div>

                  {/* Simplified form (if applicable) */}
                  {result.simplifiedDisplay && (
                    <div className="mb-4 p-3 rounded-lg bg-primary-foreground/10">
                      <div className="text-xs opacity-70 mb-1">{t.results.simplifiedForm}</div>
                      <div className="text-2xl font-mono font-semibold">
                        {result.simplifiedDisplay}
                      </div>
                    </div>
                  )}

                  {/* Positive and Negative roots */}
                  {mode !== 'square' && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-foreground/20">
                      <div>
                        <div className="text-xs opacity-70">{t.results.positiveRoot}</div>
                        <div className="text-lg font-semibold font-mono">
                          +{formatNumber(result.positiveRoot, 8, locale)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs opacity-70">{t.results.negativeRoot}</div>
                        <div className="text-lg font-semibold font-mono">
                          {!isNaN(result.negativeRoot)
                            ? formatNumber(result.negativeRoot, 8, locale)
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-5xl md:text-6xl font-bold tracking-tight font-mono">
                  --
                </div>
              )}
            </CardContent>
          </Card>

          {/* Perfect Square Indicator */}
          {result && mode !== 'square' && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t.results.isPerfectSquare}</span>
                  <div className="flex items-center gap-2">
                    {result.isPerfectNthRoot ? (
                      <>
                        <Check className="h-5 w-5 text-green-500" />
                        <span className="text-green-600 font-medium">{t.results.yes}</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5 text-red-500" />
                        <span className="text-red-600 font-medium">{t.results.no}</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prime Factorization */}
          {result?.primeFactorization && result.originalNumber > 1 && (
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {t.primeFactorization}
                </div>
                <code className="text-lg font-mono bg-muted p-2 rounded block">
                  {result.originalNumber} = {result.primeFactorization.expression}
                </code>
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
                      <div key={step.stepNumber} className="flex gap-3 text-sm">
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
