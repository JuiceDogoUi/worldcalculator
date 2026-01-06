'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  PiggyBank,
  ChevronDown,
  TrendingUp,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { calculateRetirement, validateRetirementInputs } from './calculations'
import { formatCurrency, getCurrencyForLocale } from '@/lib/formatters'
import type {
  RetirementInputs,
  RetirementResult,
  RetirementValidation,
} from './types'

export interface RetirementCalculatorTranslations {
  // Input labels
  currentAge: string
  retirementAge: string
  lifeExpectancy: string
  currentSavings: string
  monthlyContribution: string
  preRetirementReturn: string
  postRetirementReturn: string
  inflationRate: string
  withdrawalRate: string

  // Results
  resultBalanceAtRetirement: string
  resultMonthlyIncome: string
  resultRealMonthlyIncome: string
  resultYearsToRetirement: string
  resultYearsInRetirement: string
  resultTotalContributions: string
  resultInvestmentGrowth: string
  resultSavingsLongevity: string
  resultFinalBalance: string
  years: string
  months: string
  unlimited: string

  // Status messages
  onTrack: string
  needsAttention: string
  savingsWillLast: string
  savingsRunsOut: string

  // Actions
  reset: string
  showAccumulationBreakdown: string
  hideAccumulationBreakdown: string
  showRetirementBreakdown: string
  hideRetirementBreakdown: string
  fixErrors: string

  // Table headers
  tableYear: string
  tableAge: string
  tableStartingBalance: string
  tableContributions: string
  tableWithdrawals: string
  tableGrowth: string
  tableEndingBalance: string
}

interface RetirementCalculatorProps {
  locale: string
  translations: RetirementCalculatorTranslations
}

// Default values for inputs
const DEFAULTS = {
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 50000,
  monthlyContribution: 500,
  preRetirementReturn: 7,
  postRetirementReturn: 5,
  inflationRate: 2.5,
  withdrawalRate: 4,
}

export function RetirementCalculator({
  locale,
  translations: t,
}: RetirementCalculatorProps) {
  const currency = getCurrencyForLocale(locale)

  // Input state
  const [currentAge, setCurrentAge] = useState<number>(DEFAULTS.currentAge)
  const [retirementAge, setRetirementAge] = useState<number>(DEFAULTS.retirementAge)
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(DEFAULTS.lifeExpectancy)
  const [currentSavings, setCurrentSavings] = useState<number>(DEFAULTS.currentSavings)
  const [monthlyContribution, setMonthlyContribution] = useState<number>(DEFAULTS.monthlyContribution)
  const [preRetirementReturn, setPreRetirementReturn] = useState<number>(DEFAULTS.preRetirementReturn)
  const [postRetirementReturn, setPostRetirementReturn] = useState<number>(DEFAULTS.postRetirementReturn)
  const [inflationRate, setInflationRate] = useState<number>(DEFAULTS.inflationRate)
  const [withdrawalRate, setWithdrawalRate] = useState<number>(DEFAULTS.withdrawalRate)

  // UI state
  const [showAccumulationBreakdown, setShowAccumulationBreakdown] = useState(false)
  const [showRetirementBreakdown, setShowRetirementBreakdown] = useState(false)

  // Build inputs object
  const inputs: RetirementInputs = useMemo(() => {
    return {
      currentAge,
      retirementAge,
      lifeExpectancy,
      currentSavings,
      monthlyContribution,
      preRetirementReturn,
      postRetirementReturn,
      inflationRate,
      withdrawalRate,
    }
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    preRetirementReturn,
    postRetirementReturn,
    inflationRate,
    withdrawalRate,
  ])

  // Validate inputs
  const validation: RetirementValidation = useMemo(() => {
    return validateRetirementInputs(inputs)
  }, [inputs])

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Calculate result
  const result: RetirementResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateRetirement(inputs)
  }, [inputs, validation.valid])

  // Handle reset
  const handleReset = useCallback(() => {
    setCurrentAge(DEFAULTS.currentAge)
    setRetirementAge(DEFAULTS.retirementAge)
    setLifeExpectancy(DEFAULTS.lifeExpectancy)
    setCurrentSavings(DEFAULTS.currentSavings)
    setMonthlyContribution(DEFAULTS.monthlyContribution)
    setPreRetirementReturn(DEFAULTS.preRetirementReturn)
    setPostRetirementReturn(DEFAULTS.postRetirementReturn)
    setInflationRate(DEFAULTS.inflationRate)
    setWithdrawalRate(DEFAULTS.withdrawalRate)
    setShowAccumulationBreakdown(false)
    setShowRetirementBreakdown(false)
  }, [])

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Screen reader live region for results */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {result && (
            <>
              {`Balance at retirement: ${formatCurrency(result.accumulationSummary.balanceAtRetirement, currency, locale)}`}
              {`, Monthly income: ${formatCurrency(result.retirementSummary.sustainableMonthlyIncome, currency, locale)}`}
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs Column */}
          <div className="space-y-5">
            {/* Age Inputs Group */}
            <div className="grid grid-cols-3 gap-3">
              {/* Current Age */}
              <div className="space-y-2">
                <Label htmlFor="currentAge" className="text-sm">{t.currentAge}</Label>
                <Input
                  id="currentAge"
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  min={18}
                  max={100}
                  aria-invalid={!!getFieldError('currentAge')}
                  aria-describedby={getFieldError('currentAge') ? 'currentAge-error' : undefined}
                />
                {getFieldError('currentAge') && (
                  <p id="currentAge-error" className="text-xs text-destructive">{getFieldError('currentAge')}</p>
                )}
              </div>

              {/* Retirement Age */}
              <div className="space-y-2">
                <Label htmlFor="retirementAge" className="text-sm">{t.retirementAge}</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  min={30}
                  max={100}
                  aria-invalid={!!getFieldError('retirementAge')}
                  aria-describedby={getFieldError('retirementAge') ? 'retirementAge-error' : undefined}
                />
                {getFieldError('retirementAge') && (
                  <p id="retirementAge-error" className="text-xs text-destructive">{getFieldError('retirementAge')}</p>
                )}
              </div>

              {/* Life Expectancy */}
              <div className="space-y-2">
                <Label htmlFor="lifeExpectancy" className="text-sm">{t.lifeExpectancy}</Label>
                <Input
                  id="lifeExpectancy"
                  type="number"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(Number(e.target.value))}
                  min={50}
                  max={120}
                  aria-invalid={!!getFieldError('lifeExpectancy')}
                  aria-describedby={getFieldError('lifeExpectancy') ? 'lifeExpectancy-error' : undefined}
                />
                {getFieldError('lifeExpectancy') && (
                  <p id="lifeExpectancy-error" className="text-xs text-destructive">{getFieldError('lifeExpectancy')}</p>
                )}
              </div>
            </div>

            {/* Current Savings */}
            <div className="space-y-2">
              <Label htmlFor="currentSavings">{t.currentSavings}</Label>
              <Input
                id="currentSavings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                min={0}
                step={1000}
                aria-invalid={!!getFieldError('currentSavings')}
                aria-describedby={getFieldError('currentSavings') ? 'currentSavings-error' : undefined}
              />
              <Slider
                aria-label={t.currentSavings}
                value={[Math.min(currentSavings, 1000000)]}
                onValueChange={([value]) => setCurrentSavings(value)}
                max={1000000}
                step={10000}
                className="mt-2"
              />
              {getFieldError('currentSavings') && (
                <p id="currentSavings-error" className="text-sm text-destructive">{getFieldError('currentSavings')}</p>
              )}
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">{t.monthlyContribution}</Label>
              <Input
                id="monthlyContribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                min={0}
                step={100}
                aria-invalid={!!getFieldError('monthlyContribution')}
                aria-describedby={getFieldError('monthlyContribution') ? 'monthlyContribution-error' : undefined}
              />
              <Slider
                aria-label={t.monthlyContribution}
                value={[Math.min(monthlyContribution, 10000)]}
                onValueChange={([value]) => setMonthlyContribution(value)}
                max={10000}
                step={100}
                className="mt-2"
              />
              {getFieldError('monthlyContribution') && (
                <p id="monthlyContribution-error" className="text-sm text-destructive">{getFieldError('monthlyContribution')}</p>
              )}
            </div>

            {/* Return Rates */}
            <div className="grid grid-cols-2 gap-4">
              {/* Pre-Retirement Return */}
              <div className="space-y-2">
                <Label htmlFor="preRetirementReturn" className="text-sm">{t.preRetirementReturn}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="preRetirementReturn"
                    type="number"
                    value={preRetirementReturn}
                    onChange={(e) => setPreRetirementReturn(Number(e.target.value))}
                    min={-10}
                    max={25}
                    step={0.5}
                    aria-invalid={!!getFieldError('preRetirementReturn')}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <Slider
                  aria-label={t.preRetirementReturn}
                  value={[preRetirementReturn]}
                  onValueChange={([value]) => setPreRetirementReturn(value)}
                  min={0}
                  max={15}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              {/* Post-Retirement Return */}
              <div className="space-y-2">
                <Label htmlFor="postRetirementReturn" className="text-sm">{t.postRetirementReturn}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="postRetirementReturn"
                    type="number"
                    value={postRetirementReturn}
                    onChange={(e) => setPostRetirementReturn(Number(e.target.value))}
                    min={-10}
                    max={15}
                    step={0.5}
                    aria-invalid={!!getFieldError('postRetirementReturn')}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <Slider
                  aria-label={t.postRetirementReturn}
                  value={[postRetirementReturn]}
                  onValueChange={([value]) => setPostRetirementReturn(value)}
                  min={0}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Inflation and Withdrawal Rate */}
            <div className="grid grid-cols-2 gap-4">
              {/* Inflation Rate */}
              <div className="space-y-2">
                <Label htmlFor="inflationRate" className="text-sm">{t.inflationRate}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="inflationRate"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    min={0}
                    max={20}
                    step={0.1}
                    aria-invalid={!!getFieldError('inflationRate')}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <Slider
                  aria-label={t.inflationRate}
                  value={[inflationRate]}
                  onValueChange={([value]) => setInflationRate(value)}
                  min={0}
                  max={10}
                  step={0.5}
                  className="mt-2"
                />
              </div>

              {/* Withdrawal Rate */}
              <div className="space-y-2">
                <Label htmlFor="withdrawalRate" className="text-sm">{t.withdrawalRate}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="withdrawalRate"
                    type="number"
                    value={withdrawalRate}
                    onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                    min={1}
                    max={15}
                    step={0.5}
                    aria-invalid={!!getFieldError('withdrawalRate')}
                  />
                  <span className="text-muted-foreground">%</span>
                </div>
                <Slider
                  aria-label={t.withdrawalRate}
                  value={[withdrawalRate]}
                  onValueChange={([value]) => setWithdrawalRate(value)}
                  min={2}
                  max={8}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Reset Button */}
            <Button variant="outline" onClick={handleReset} className="w-full">
              {t.reset}
            </Button>
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Primary Results */}
                <div className="rounded-lg bg-primary/10 p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <PiggyBank className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.resultBalanceAtRetirement}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(result.accumulationSummary.balanceAtRetirement, currency, locale)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ({formatCurrency(result.accumulationSummary.realBalanceAtRetirement, currency, locale)} {t.resultRealMonthlyIncome})
                  </p>
                </div>

                {/* Monthly Income Result */}
                <div className="rounded-lg bg-green-500/10 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {t.resultMonthlyIncome}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(result.retirementSummary.sustainableMonthlyIncome, currency, locale)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ({formatCurrency(result.retirementSummary.realMonthlyIncome, currency, locale)} {t.resultRealMonthlyIncome})
                  </p>
                </div>

                {/* Status Indicator */}
                <div
                  role="status"
                  className={`rounded-lg p-4 flex items-center gap-3 ${
                    result.retirementSummary.savingsLastsThroughRetirement
                      ? 'bg-green-500/10'
                      : 'bg-amber-500/10'
                  }`}
                >
                  {result.retirementSummary.savingsLastsThroughRetirement ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-600">{t.onTrack}</p>
                        <p className="text-sm text-muted-foreground">{t.savingsWillLast}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-600">{t.needsAttention}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.savingsRunsOut} {result.retirementSummary.ageWhenDepleted?.toFixed(0)}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Secondary Results Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t.resultYearsToRetirement}</p>
                    <p className="text-lg font-semibold">
                      {result.accumulationSummary.yearsToRetirement} {t.years}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t.resultYearsInRetirement}</p>
                    <p className="text-lg font-semibold">
                      {result.retirementSummary.yearsInRetirement} {t.years}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t.resultTotalContributions}</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(result.accumulationSummary.totalContributions, currency, locale)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t.resultInvestmentGrowth}</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(result.accumulationSummary.totalGrowth, currency, locale)}
                    </p>
                  </div>
                </div>

                {/* Accumulation Breakdown Toggle */}
                <Button
                  variant="ghost"
                  onClick={() => setShowAccumulationBreakdown(!showAccumulationBreakdown)}
                  className="w-full"
                  aria-expanded={showAccumulationBreakdown}
                  aria-controls="accumulation-table"
                >
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showAccumulationBreakdown ? 'rotate-180' : ''}`} />
                  {showAccumulationBreakdown ? t.hideAccumulationBreakdown : t.showAccumulationBreakdown}
                </Button>

                {/* Accumulation Year-by-Year Table */}
                {showAccumulationBreakdown && result.accumulationProjections.length > 0 && (
                  <div
                    id="accumulation-table"
                    className="overflow-x-auto rounded-lg border"
                  >
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left font-medium">{t.tableYear}</th>
                          <th scope="col" className="px-3 py-2 text-left font-medium">{t.tableAge}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableStartingBalance}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableContributions}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableGrowth}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableEndingBalance}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.accumulationProjections.map((row) => (
                          <tr key={row.year} className="border-t">
                            <td className="px-3 py-2">{row.year}</td>
                            <td className="px-3 py-2">{row.age}</td>
                            <td className="px-3 py-2 text-right">
                              {formatCurrency(row.startingBalance, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {formatCurrency(row.contributions, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right text-green-600">
                              {formatCurrency(row.investmentGrowth, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              {formatCurrency(row.endingBalance, currency, locale)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Retirement Breakdown Toggle */}
                <Button
                  variant="ghost"
                  onClick={() => setShowRetirementBreakdown(!showRetirementBreakdown)}
                  className="w-full"
                  aria-expanded={showRetirementBreakdown}
                  aria-controls="retirement-table"
                >
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showRetirementBreakdown ? 'rotate-180' : ''}`} />
                  {showRetirementBreakdown ? t.hideRetirementBreakdown : t.showRetirementBreakdown}
                </Button>

                {/* Retirement Year-by-Year Table */}
                {showRetirementBreakdown && result.retirementProjections.length > 0 && (
                  <div
                    id="retirement-table"
                    className="overflow-x-auto rounded-lg border"
                  >
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left font-medium">{t.tableYear}</th>
                          <th scope="col" className="px-3 py-2 text-left font-medium">{t.tableAge}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableStartingBalance}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableWithdrawals}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableGrowth}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableEndingBalance}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.retirementProjections.map((row) => (
                          <tr key={row.year} className={`border-t ${row.isSavingsDepleted ? 'bg-red-50' : ''}`}>
                            <td className="px-3 py-2">{row.year}</td>
                            <td className="px-3 py-2">{row.age}</td>
                            <td className="px-3 py-2 text-right">
                              {formatCurrency(row.startingBalance, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right text-red-600">
                              -{formatCurrency(row.withdrawals, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right text-green-600">
                              {formatCurrency(row.investmentGrowth, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right font-medium">
                              {formatCurrency(row.endingBalance, currency, locale)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {/* Error state */}
            {!result && validation.errors.length > 0 && (
              <div className="rounded-lg bg-destructive/10 p-6 text-center">
                <p className="text-sm text-destructive">{t.fixErrors}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
