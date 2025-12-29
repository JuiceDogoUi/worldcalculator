'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  Target,
  ChevronDown,
  Clock,
  TrendingUp,
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
import {
  calculateSavingsGoal,
  validateSavingsGoalInputs,
} from './calculations'
import { formatCurrency, getCurrencyForLocale } from '@/lib/formatters'
import type {
  SavingsGoalInputs,
  SavingsGoalResult,
  DepositFrequency,
  CalculationMode,
  SavingsGoalValidation,
} from './types'

interface SavingsGoalTranslations {
  // Input labels
  savingsGoal: string
  currentSavings: string
  annualRate: string
  timeframe: string
  depositFrequency: string
  depositAmount: string
  modeLabel: string

  // Calculation mode options
  modeRequiredDeposit: string
  modeTimeToGoal: string
  modeFinalBalance: string

  // Deposit frequency options
  frequencyWeekly: string
  frequencyBiweekly: string
  frequencyMonthly: string
  frequencyQuarterly: string
  frequencyAnnually: string

  // Results
  resultRequiredDeposit: string
  resultTimeToGoal: string
  resultFinalBalance: string
  resultTotalDeposits: string
  resultTotalInterest: string
  resultCurrentSavings: string
  resultSavingsGoal: string
  years: string
  months: string

  // Actions
  reset: string
  calculate: string
  showBreakdown: string
  hideBreakdown: string
  fixErrors: string

  // Table headers
  tableYear: string
  tableStartingBalance: string
  tableDeposits: string
  tableInterestEarned: string
  tableEndingBalance: string
}

interface SavingsGoalCalculatorProps {
  locale: string
  translations: SavingsGoalTranslations
}

// Default values for inputs
const DEFAULTS = {
  savingsGoal: 50000,
  currentSavings: 5000,
  annualRate: 5,
  years: 10,
  depositFrequency: 'monthly' as DepositFrequency,
  depositAmount: 300,
  calculationMode: 'requiredDeposit' as CalculationMode,
}

export function SavingsGoalCalculator({
  locale,
  translations: t,
}: SavingsGoalCalculatorProps) {
  const currency = getCurrencyForLocale(locale)

  // Input state
  const [savingsGoal, setSavingsGoal] = useState<number>(DEFAULTS.savingsGoal)
  const [currentSavings, setCurrentSavings] = useState<number>(DEFAULTS.currentSavings)
  const [annualRate, setAnnualRate] = useState<number>(DEFAULTS.annualRate)
  const [years, setYears] = useState<number>(DEFAULTS.years)
  const [depositFrequency, setDepositFrequency] = useState<DepositFrequency>(DEFAULTS.depositFrequency)
  const [depositAmount, setDepositAmount] = useState<number>(DEFAULTS.depositAmount)
  const [calculationMode, setCalculationMode] = useState<CalculationMode>(DEFAULTS.calculationMode)

  // UI state
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Build inputs object
  const inputs: SavingsGoalInputs = useMemo(() => {
    return {
      savingsGoal,
      currentSavings,
      annualRate,
      years,
      depositFrequency,
      depositAmount,
      calculationMode,
    }
  }, [
    savingsGoal,
    currentSavings,
    annualRate,
    years,
    depositFrequency,
    depositAmount,
    calculationMode,
  ])

  // Validate inputs
  const validation: SavingsGoalValidation = useMemo(() => {
    return validateSavingsGoalInputs(inputs)
  }, [inputs])

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Calculate result
  const result: SavingsGoalResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateSavingsGoal(inputs)
  }, [inputs, validation.valid])

  // Calculate breakdown percentages for visualization
  const { depositsPercentage, interestPercentage } = useMemo(() => {
    if (!result) {
      return { depositsPercentage: 100, interestPercentage: 0 }
    }
    const total = result.finalBalance
    if (total <= 0) {
      return { depositsPercentage: 100, interestPercentage: 0 }
    }
    return {
      depositsPercentage: Math.round((result.totalDeposits / total) * 100),
      interestPercentage: Math.round((result.totalInterest / total) * 100),
    }
  }, [result])

  // Handle reset
  const handleReset = useCallback(() => {
    setSavingsGoal(DEFAULTS.savingsGoal)
    setCurrentSavings(DEFAULTS.currentSavings)
    setAnnualRate(DEFAULTS.annualRate)
    setYears(DEFAULTS.years)
    setDepositFrequency(DEFAULTS.depositFrequency)
    setDepositAmount(DEFAULTS.depositAmount)
    setCalculationMode(DEFAULTS.calculationMode)
    setShowBreakdown(false)
  }, [])

  // Format time display
  const formatTimeToGoal = (monthsValue: number): string => {
    if (!isFinite(monthsValue) || monthsValue <= 0) return '—'
    const y = Math.floor(monthsValue / 12)
    const m = monthsValue % 12
    if (y === 0) return `${m} ${t.months}`
    if (m === 0) return `${y} ${t.years}`
    return `${y} ${t.years} ${m} ${t.months}`
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Screen reader live region for results */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {result && (
            <>
              {calculationMode === 'requiredDeposit' &&
                `Required deposit: ${formatCurrency(result.requiredDeposit || 0, currency, locale)}`}
              {calculationMode === 'timeToGoal' &&
                `Time to goal: ${formatTimeToGoal(result.monthsToGoal || 0)}`}
              {calculationMode === 'finalBalance' &&
                `Final balance: ${formatCurrency(result.finalBalance, currency, locale)}`}
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs Column */}
          <div className="space-y-6">
            {/* Calculation Mode */}
            <div className="space-y-2">
              <Label htmlFor="calculationMode">{t.modeLabel}</Label>
              <Select
                value={calculationMode}
                onValueChange={(v) => setCalculationMode(v as CalculationMode)}
              >
                <SelectTrigger id="calculationMode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requiredDeposit">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {t.modeRequiredDeposit}
                    </div>
                  </SelectItem>
                  <SelectItem value="timeToGoal">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {t.modeTimeToGoal}
                    </div>
                  </SelectItem>
                  <SelectItem value="finalBalance">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {t.modeFinalBalance}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Savings Goal (not shown for finalBalance mode) */}
            {calculationMode !== 'finalBalance' && (
              <div className="space-y-2">
                <Label htmlFor="savingsGoal">{t.savingsGoal}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="savingsGoal"
                    type="number"
                    value={savingsGoal}
                    onChange={(e) => setSavingsGoal(Number(e.target.value))}
                    min={0}
                    step={1000}
                    aria-invalid={!!getFieldError('savingsGoal')}
                    aria-describedby={getFieldError('savingsGoal') ? 'savingsGoal-error' : undefined}
                  />
                </div>
                <Slider
                  aria-label={t.savingsGoal}
                  value={[Math.min(savingsGoal, 500000)]}
                  onValueChange={([value]) => setSavingsGoal(value)}
                  max={500000}
                  step={5000}
                  className="mt-2"
                />
                {getFieldError('savingsGoal') && (
                  <p id="savingsGoal-error" className="text-sm text-destructive">
                    {getFieldError('savingsGoal')}
                  </p>
                )}
              </div>
            )}

            {/* Current Savings */}
            <div className="space-y-2">
              <Label htmlFor="currentSavings">{t.currentSavings}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  min={0}
                  step={500}
                  aria-invalid={!!getFieldError('currentSavings')}
                  aria-describedby={getFieldError('currentSavings') ? 'currentSavings-error' : undefined}
                />
              </div>
              <Slider
                aria-label={t.currentSavings}
                value={[Math.min(currentSavings, 100000)]}
                onValueChange={([value]) => setCurrentSavings(value)}
                max={100000}
                step={1000}
                className="mt-2"
              />
              {getFieldError('currentSavings') && (
                <p id="currentSavings-error" className="text-sm text-destructive">
                  {getFieldError('currentSavings')}
                </p>
              )}
            </div>

            {/* Annual Rate */}
            <div className="space-y-2">
              <Label htmlFor="annualRate">{t.annualRate}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="annualRate"
                  type="number"
                  value={annualRate}
                  onChange={(e) => setAnnualRate(Number(e.target.value))}
                  min={0}
                  max={50}
                  step={0.1}
                  aria-invalid={!!getFieldError('annualRate')}
                  aria-describedby={getFieldError('annualRate') ? 'annualRate-error' : undefined}
                />
                <span className="text-muted-foreground">%</span>
              </div>
              <Slider
                aria-label={t.annualRate}
                value={[annualRate]}
                onValueChange={([value]) => setAnnualRate(value)}
                max={20}
                step={0.5}
                className="mt-2"
              />
              {getFieldError('annualRate') && (
                <p id="annualRate-error" className="text-sm text-destructive">
                  {getFieldError('annualRate')}
                </p>
              )}
            </div>

            {/* Years (not shown for timeToGoal mode) */}
            {calculationMode !== 'timeToGoal' && (
              <div className="space-y-2">
                <Label htmlFor="years">{t.timeframe}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="years"
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    min={1}
                    max={100}
                    step={1}
                    aria-invalid={!!getFieldError('years')}
                    aria-describedby={getFieldError('years') ? 'years-error' : undefined}
                  />
                </div>
                <Slider
                  aria-label={t.timeframe}
                  value={[years]}
                  onValueChange={([value]) => setYears(value)}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                {getFieldError('years') && (
                  <p id="years-error" className="text-sm text-destructive">
                    {getFieldError('years')}
                  </p>
                )}
              </div>
            )}

            {/* Deposit Amount (for timeToGoal and finalBalance modes) */}
            {(calculationMode === 'timeToGoal' || calculationMode === 'finalBalance') && (
              <div className="space-y-2">
                <Label htmlFor="depositAmount">{t.depositAmount}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="depositAmount"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    min={0}
                    step={50}
                    aria-invalid={!!getFieldError('depositAmount')}
                    aria-describedby={getFieldError('depositAmount') ? 'depositAmount-error' : undefined}
                  />
                </div>
                <Slider
                  aria-label={t.depositAmount}
                  value={[Math.min(depositAmount, 5000)]}
                  onValueChange={([value]) => setDepositAmount(value)}
                  max={5000}
                  step={50}
                  className="mt-2"
                />
                {getFieldError('depositAmount') && (
                  <p id="depositAmount-error" className="text-sm text-destructive">
                    {getFieldError('depositAmount')}
                  </p>
                )}
              </div>
            )}

            {/* Deposit Frequency */}
            <div className="space-y-2">
              <Label htmlFor="depositFrequency">{t.depositFrequency}</Label>
              <Select
                value={depositFrequency}
                onValueChange={(v) => setDepositFrequency(v as DepositFrequency)}
              >
                <SelectTrigger id="depositFrequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">{t.frequencyWeekly}</SelectItem>
                  <SelectItem value="biweekly">{t.frequencyBiweekly}</SelectItem>
                  <SelectItem value="monthly">{t.frequencyMonthly}</SelectItem>
                  <SelectItem value="quarterly">{t.frequencyQuarterly}</SelectItem>
                  <SelectItem value="annually">{t.frequencyAnnually}</SelectItem>
                </SelectContent>
              </Select>
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
                {/* Primary Result */}
                <div className="rounded-lg bg-primary/10 p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {calculationMode === 'requiredDeposit' && <Target className="h-6 w-6 text-primary" />}
                    {calculationMode === 'timeToGoal' && <Clock className="h-6 w-6 text-primary" />}
                    {calculationMode === 'finalBalance' && <TrendingUp className="h-6 w-6 text-primary" />}
                    <span className="text-sm font-medium text-muted-foreground">
                      {calculationMode === 'requiredDeposit' && t.resultRequiredDeposit}
                      {calculationMode === 'timeToGoal' && t.resultTimeToGoal}
                      {calculationMode === 'finalBalance' && t.resultFinalBalance}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    {calculationMode === 'requiredDeposit' &&
                      formatCurrency(result.requiredDeposit || 0, currency, locale)}
                    {calculationMode === 'timeToGoal' &&
                      formatTimeToGoal(result.monthsToGoal || 0)}
                    {calculationMode === 'finalBalance' &&
                      formatCurrency(result.finalBalance, currency, locale)}
                  </p>
                </div>

                {/* Secondary Results */}
                <div className="grid grid-cols-2 gap-4">
                  {calculationMode !== 'finalBalance' && (
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-xs text-muted-foreground mb-1">{t.resultFinalBalance}</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(result.finalBalance, currency, locale)}
                      </p>
                    </div>
                  )}
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t.resultTotalDeposits}</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(result.totalDeposits, currency, locale)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-xs text-muted-foreground mb-1">{t.resultTotalInterest}</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(result.totalInterest, currency, locale)}
                    </p>
                  </div>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="space-y-2">
                  <div
                    className="h-8 rounded-lg overflow-hidden flex"
                    role="img"
                    aria-label={`Breakdown: ${depositsPercentage}% deposits, ${interestPercentage}% interest`}
                  >
                    <div
                      className="bg-blue-500 flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${depositsPercentage}%` }}
                    >
                      {depositsPercentage > 10 && `${depositsPercentage}%`}
                    </div>
                    <div
                      className="bg-green-500 flex items-center justify-center text-xs font-medium text-white"
                      style={{ width: `${interestPercentage}%` }}
                    >
                      {interestPercentage > 10 && `${interestPercentage}%`}
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-blue-500" />
                      {t.resultTotalDeposits}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-green-500" />
                      {t.resultTotalInterest}
                    </span>
                  </div>
                </div>

                {/* Breakdown Toggle */}
                <Button
                  variant="ghost"
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full"
                  aria-expanded={showBreakdown}
                  aria-controls="breakdown-table"
                >
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} />
                  {showBreakdown ? t.hideBreakdown : t.showBreakdown}
                </Button>

                {/* Year-by-Year Breakdown Table */}
                {showBreakdown && result.yearlyBreakdown.length > 0 && (
                  <div
                    id="breakdown-table"
                    className="overflow-x-auto rounded-lg border"
                  >
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr>
                          <th scope="col" className="px-3 py-2 text-left font-medium">{t.tableYear}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableStartingBalance}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableDeposits}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableInterestEarned}</th>
                          <th scope="col" className="px-3 py-2 text-right font-medium">{t.tableEndingBalance}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearlyBreakdown.map((row) => (
                          <tr key={row.year} className="border-t">
                            <td className="px-3 py-2">{row.year}</td>
                            <td className="px-3 py-2 text-right">
                              {formatCurrency(row.startingBalance, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right">
                              {formatCurrency(row.yearlyDeposits, currency, locale)}
                            </td>
                            <td className="px-3 py-2 text-right text-green-600">
                              {formatCurrency(row.interestEarned, currency, locale)}
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
