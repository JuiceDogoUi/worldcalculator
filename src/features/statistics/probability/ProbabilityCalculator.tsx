'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Dice5,
  Info,
  ChevronDown,
  ChevronUp,
  Percent,
  Target,
  Scale,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { validateProbabilityInputs, calculateProbability } from './calculations'
import { formatNumber } from '@/lib/formatters'
import type {
  ProbabilityInputs,
  ProbabilityResult,
  ProbabilityValidation,
  ProbabilityMode,
  EventRelationship,
  CalcTranslations,
} from './types'

interface ProbabilityCalculatorTranslations {
  inputs: {
    mode: string
    modeSingle: string
    modeSingleDescription: string
    modeAnd: string
    modeAndDescription: string
    modeOr: string
    modeOrDescription: string
    modeConditional: string
    modeConditionalDescription: string
    favorableOutcomes: string
    favorableOutcomesPlaceholder: string
    totalOutcomes: string
    totalOutcomesPlaceholder: string
    probabilityA: string
    probabilityAPlaceholder: string
    probabilityB: string
    probabilityBPlaceholder: string
    relationship: string
    independent: string
    independentDescription: string
    dependent: string
    dependentDescription: string
    probabilityBGivenA: string
    probabilityBGivenAPlaceholder: string
    probabilityAAndB: string
    probabilityAAndBPlaceholder: string
    decimalPrecision: string
    decimals: string
  }
  results: {
    probability: string
    probabilityPercent: string
    complement: string
    complementPercent: string
    oddsFor: string
    oddsAgainst: string
    fraction: string
    formula: string
    stepsTitle: string
    showSteps: string
    hideSteps: string
  }
  reset: string
  tryExample: string
  calc: CalcTranslations
}

interface ProbabilityCalculatorProps {
  locale?: string
  translations: ProbabilityCalculatorTranslations
}

// Example values for each mode
const EXAMPLES: Record<ProbabilityMode, Partial<ProbabilityInputs>> = {
  single: { favorableOutcomes: 1, totalOutcomes: 6 }, // Rolling a 6
  and: { probabilityA: 0.5, probabilityB: 0.5 }, // Two coin flips, both heads
  or: { probabilityA: 0.5, probabilityB: 0.5 }, // Two coin flips, at least one head
  conditional: { probabilityA: 0.3, probabilityB: 0.4, probabilityAAndB: 0.12 },
}

export function ProbabilityCalculator({
  locale = 'en-US',
  translations: t,
}: ProbabilityCalculatorProps) {
  // Mode state
  const [mode, setMode] = useState<ProbabilityMode>('single')

  // Single event inputs
  const [favorableOutcomes, setFavorableOutcomes] = useState<string>('1')
  const [totalOutcomes, setTotalOutcomes] = useState<string>('6')

  // Two-event inputs
  const [probabilityA, setProbabilityA] = useState<string>('0.5')
  const [probabilityB, setProbabilityB] = useState<string>('0.5')
  const [relationship, setRelationship] = useState<EventRelationship>('independent')

  // Dependent event inputs
  const [probabilityBGivenA, setProbabilityBGivenA] = useState<string>('')
  const [probabilityAAndB, setProbabilityAAndB] = useState<string>('')

  // Precision
  const [decimalPrecision, setDecimalPrecision] = useState<number>(4)

  // UI states
  const [showSteps, setShowSteps] = useState(false)

  // Build inputs object
  const inputs: ProbabilityInputs = useMemo(
    () => ({
      mode,
      favorableOutcomes: parseFloat(favorableOutcomes) || 0,
      totalOutcomes: parseFloat(totalOutcomes) || 0,
      probabilityA: parseFloat(probabilityA) || 0,
      probabilityB: parseFloat(probabilityB) || 0,
      relationship,
      probabilityBGivenA: probabilityBGivenA ? parseFloat(probabilityBGivenA) : undefined,
      probabilityAAndB: probabilityAAndB ? parseFloat(probabilityAAndB) : undefined,
      decimalPrecision,
    }),
    [
      mode,
      favorableOutcomes,
      totalOutcomes,
      probabilityA,
      probabilityB,
      relationship,
      probabilityBGivenA,
      probabilityAAndB,
      decimalPrecision,
    ]
  )

  // Validate inputs
  const validation: ProbabilityValidation = useMemo(() => {
    return validateProbabilityInputs(inputs)
  }, [inputs])

  // Calculate result
  const result: ProbabilityResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateProbability(inputs, t.calc)
  }, [inputs, validation, t.calc])

  // Reset handler
  const handleReset = useCallback(() => {
    setMode('single')
    setFavorableOutcomes('1')
    setTotalOutcomes('6')
    setProbabilityA('0.5')
    setProbabilityB('0.5')
    setRelationship('independent')
    setProbabilityBGivenA('')
    setProbabilityAAndB('')
    setDecimalPrecision(4)
    setShowSteps(false)
  }, [])

  // Load example handler
  const handleLoadExample = useCallback(() => {
    const example = EXAMPLES[mode]
    if (mode === 'single') {
      setFavorableOutcomes(String(example.favorableOutcomes))
      setTotalOutcomes(String(example.totalOutcomes))
    } else {
      setProbabilityA(String(example.probabilityA))
      setProbabilityB(String(example.probabilityB))
      if (example.probabilityAAndB !== undefined) {
        setProbabilityAAndB(String(example.probabilityAAndB))
      }
    }
  }, [mode])

  // Handle mode change
  const handleModeChange = useCallback((value: ProbabilityMode) => {
    setMode(value)
    // Reset dependent inputs when mode changes
    setProbabilityBGivenA('')
    setProbabilityAAndB('')
    setRelationship('independent')
  }, [])

  // Get field error
  const getFieldError = (field: string) => {
    return validation.errors.find((e) => e.field === field)?.message
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `Probability is ${result.probabilityPercent}%`}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="space-y-2">
            <Label htmlFor="mode" className="text-base font-medium">
              {t.inputs.mode}
            </Label>
            <Select value={mode} onValueChange={handleModeChange}>
              <SelectTrigger id="mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.modeSingle}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.modeSingleDescription}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="and">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.modeAnd}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.modeAndDescription}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="or">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.modeOr}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.modeOrDescription}
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="conditional">
                  <div className="flex flex-col items-start">
                    <span>{t.inputs.modeConditional}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.inputs.modeConditionalDescription}
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Single Event Inputs */}
          {mode === 'single' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="favorableOutcomes" className="text-base font-medium">
                  {t.inputs.favorableOutcomes}
                </Label>
                <Input
                  id="favorableOutcomes"
                  type="number"
                  min="0"
                  step="1"
                  value={favorableOutcomes}
                  onChange={(e) => setFavorableOutcomes(e.target.value)}
                  placeholder={t.inputs.favorableOutcomesPlaceholder}
                  className="font-mono"
                  aria-invalid={!!getFieldError('favorableOutcomes')}
                />
                {getFieldError('favorableOutcomes') && (
                  <p role="alert" className="text-sm text-destructive">
                    {getFieldError('favorableOutcomes')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalOutcomes" className="text-base font-medium">
                  {t.inputs.totalOutcomes}
                </Label>
                <Input
                  id="totalOutcomes"
                  type="number"
                  min="1"
                  step="1"
                  value={totalOutcomes}
                  onChange={(e) => setTotalOutcomes(e.target.value)}
                  placeholder={t.inputs.totalOutcomesPlaceholder}
                  className="font-mono"
                  aria-invalid={!!getFieldError('totalOutcomes')}
                />
                {getFieldError('totalOutcomes') && (
                  <p role="alert" className="text-sm text-destructive">
                    {getFieldError('totalOutcomes')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Two-Event Inputs (AND, OR, Conditional) */}
          {(mode === 'and' || mode === 'or' || mode === 'conditional') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="probabilityA" className="text-base font-medium">
                  {t.inputs.probabilityA}
                </Label>
                <Input
                  id="probabilityA"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={probabilityA}
                  onChange={(e) => setProbabilityA(e.target.value)}
                  placeholder={t.inputs.probabilityAPlaceholder}
                  className="font-mono"
                  aria-invalid={!!getFieldError('probabilityA')}
                />
                {getFieldError('probabilityA') && (
                  <p role="alert" className="text-sm text-destructive">
                    {getFieldError('probabilityA')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="probabilityB" className="text-base font-medium">
                  {t.inputs.probabilityB}
                </Label>
                <Input
                  id="probabilityB"
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={probabilityB}
                  onChange={(e) => setProbabilityB(e.target.value)}
                  placeholder={t.inputs.probabilityBPlaceholder}
                  className="font-mono"
                  aria-invalid={!!getFieldError('probabilityB')}
                />
                {getFieldError('probabilityB') && (
                  <p role="alert" className="text-sm text-destructive">
                    {getFieldError('probabilityB')}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Relationship Selector (for AND and OR) */}
          {(mode === 'and' || mode === 'or') && (
            <div className="space-y-2">
              <Label htmlFor="relationship" className="text-base font-medium">
                {t.inputs.relationship}
              </Label>
              <Select
                value={relationship}
                onValueChange={(v) => setRelationship(v as EventRelationship)}
              >
                <SelectTrigger id="relationship" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent">
                    <div className="flex flex-col items-start">
                      <span>{t.inputs.independent}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.inputs.independentDescription}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="dependent">
                    <div className="flex flex-col items-start">
                      <span>{t.inputs.dependent}</span>
                      <span className="text-xs text-muted-foreground">
                        {t.inputs.dependentDescription}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* P(B|A) for dependent AND */}
          {mode === 'and' && relationship === 'dependent' && (
            <div className="space-y-2">
              <Label htmlFor="probabilityBGivenA" className="text-base font-medium">
                {t.inputs.probabilityBGivenA}
              </Label>
              <Input
                id="probabilityBGivenA"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={probabilityBGivenA}
                onChange={(e) => setProbabilityBGivenA(e.target.value)}
                placeholder={t.inputs.probabilityBGivenAPlaceholder}
                className="font-mono"
                aria-invalid={!!getFieldError('probabilityBGivenA')}
              />
              {getFieldError('probabilityBGivenA') && (
                <p role="alert" className="text-sm text-destructive">
                  {getFieldError('probabilityBGivenA')}
                </p>
              )}
            </div>
          )}

          {/* P(A ∩ B) for dependent OR and conditional */}
          {((mode === 'or' && relationship === 'dependent') || mode === 'conditional') && (
            <div className="space-y-2">
              <Label htmlFor="probabilityAAndB" className="text-base font-medium">
                {t.inputs.probabilityAAndB}
              </Label>
              <Input
                id="probabilityAAndB"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={probabilityAAndB}
                onChange={(e) => setProbabilityAAndB(e.target.value)}
                placeholder={t.inputs.probabilityAAndBPlaceholder}
                className="font-mono"
                aria-invalid={!!getFieldError('probabilityAAndB')}
              />
              {getFieldError('probabilityAAndB') && (
                <p role="alert" className="text-sm text-destructive">
                  {getFieldError('probabilityAAndB')}
                </p>
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
                {[2, 3, 4, 5, 6].map((n) => (
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
          {/* Probability Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                <Dice5 className="h-4 w-4" />
                {t.results.probability}
              </div>
              <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                {result ? formatNumber(result.probability, decimalPrecision, locale) : '--'}
              </div>
              {result && (
                <div className="mt-2 text-lg font-semibold opacity-90">
                  {formatNumber(result.probabilityPercent, Math.max(0, decimalPrecision - 2), locale)}%
                </div>
              )}
            </CardContent>
          </Card>

          {/* Complement Card */}
          <Card className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                <Target className="h-4 w-4" />
                {t.results.complement}
              </div>
              <div className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
                {result
                  ? formatNumber(result.complementProbability, decimalPrecision, locale)
                  : '--'}
              </div>
              {result && (
                <div className="mt-2 text-lg font-semibold opacity-90">
                  {formatNumber(result.complementPercent, Math.max(0, decimalPrecision - 2), locale)}%
                </div>
              )}
            </CardContent>
          </Card>

          {/* Odds and Fraction */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Scale className="h-3 w-3" />
                      {t.results.oddsFor}
                    </div>
                    <div className="text-lg font-mono font-semibold">{result.oddsFor}</div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Scale className="h-3 w-3" />
                      {t.results.oddsAgainst}
                    </div>
                    <div className="text-lg font-mono font-semibold">{result.oddsAgainst}</div>
                  </div>
                  {result.fractionNumerator !== undefined &&
                    result.fractionDenominator !== undefined && (
                      <div className="p-3 bg-muted rounded-lg col-span-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Percent className="h-3 w-3" />
                          {t.results.fraction}
                        </div>
                        <div className="text-lg font-mono font-semibold">
                          {result.fractionNumerator}/{result.fractionDenominator}
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formula Used */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">{t.results.formula}</h3>
                <div className="p-4 bg-muted rounded-lg">
                  <code className="text-sm font-mono block mb-2">{result.formulaUsed}</code>
                  <p className="text-sm text-muted-foreground">{result.formulaDescription}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step-by-Step */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-0 h-auto hover:bg-transparent"
                  onClick={() => setShowSteps((prev) => !prev)}
                >
                  <span className="text-sm font-medium">{t.results.stepsTitle}</span>
                  {showSteps ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showSteps && (
                  <div className="mt-4 space-y-3">
                    {result.steps.map((step) => (
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

          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <Card className="border-yellow-500/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-yellow-600 dark:text-yellow-500">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    {validation.warnings.map((warning) => (
                      <p key={`${warning.field}-${warning.message}`} className="text-sm">
                        {warning.message}
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
