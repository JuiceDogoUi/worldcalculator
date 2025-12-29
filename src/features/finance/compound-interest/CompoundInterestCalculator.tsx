'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  TrendingUp,
  ChevronDown,
  ChevronUp,
  PiggyBank,
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
  calculateCompoundInterest,
  validateCompoundInterestInputs,
} from './calculations'
import { formatCurrency, formatNumber, getCurrencyForLocale } from '@/lib/formatters'
import type {
  CompoundInterestInputs,
  CompoundInterestResult,
  CompoundingFrequency,
  ContributionFrequency,
  CompoundInterestValidation,
  YearBreakdown,
} from './types'

interface CompoundInterestTranslations {
  // Input labels
  principal: string
  annualRate: string
  years: string
  compoundingFrequency: string
  contributionAmount: string
  contributionFrequency: string

  // Compounding frequency options
  annually: string
  semiannually: string
  quarterly: string
  monthly: string
  daily: string

  // Contribution frequency options
  noContributions: string
  monthlyContributions: string
  quarterlyContributions: string
  annualContributions: string

  // Results
  finalBalance: string
  totalContributions: string
  totalInterest: string
  effectiveRate: string
  interestOnPrincipal: string
  principalLabel: string

  // Actions
  reset: string
  showBreakdown: string
  hideBreakdown: string

  // Table headers
  year: string
  startingBalance: string
  contributions: string
  interestEarned: string
  endingBalance: string

  // Advanced
  regularContributions: string
}

interface CompoundInterestCalculatorProps {
  locale: string
  translations: CompoundInterestTranslations
}

export function CompoundInterestCalculator({
  locale,
  translations: t,
}: CompoundInterestCalculatorProps) {
  const currency = getCurrencyForLocale(locale)

  // Input state
  const [principal, setPrincipal] = useState<number>(10000)
  const [annualRate, setAnnualRate] = useState<number>(7)
  const [years, setYears] = useState<number>(10)
  const [compoundingFrequency, setCompoundingFrequency] =
    useState<CompoundingFrequency>('monthly')

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [contributionAmount, setContributionAmount] = useState<number>(100)
  const [contributionFrequency, setContributionFrequency] =
    useState<ContributionFrequency>('monthly')

  // UI state
  const [showBreakdown, setShowBreakdown] = useState(false)

  // Build inputs object
  const inputs: CompoundInterestInputs = useMemo(() => {
    return {
      principal,
      annualRate,
      years,
      compoundingFrequency,
      contributionAmount: showAdvanced ? contributionAmount : 0,
      contributionFrequency: showAdvanced ? contributionFrequency : 'none',
    }
  }, [
    principal,
    annualRate,
    years,
    compoundingFrequency,
    showAdvanced,
    contributionAmount,
    contributionFrequency,
  ])

  // Validate inputs
  const validation: CompoundInterestValidation = useMemo(() => {
    return validateCompoundInterestInputs(inputs)
  }, [inputs])

  // Get field error
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Calculate result
  const result: CompoundInterestResult | null = useMemo(() => {
    if (!validation.valid) return null
    return calculateCompoundInterest(inputs)
  }, [inputs, validation.valid])

  // Calculate breakdown percentages for visualization
  const { principalPercentage, contributionsPercentage, interestPercentage } =
    useMemo(() => {
      if (!result)
        return {
          principalPercentage: 0,
          contributionsPercentage: 0,
          interestPercentage: 0,
        }

      const additionalContributions = result.totalContributions - principal

      return {
        principalPercentage: (principal / result.finalBalance) * 100,
        contributionsPercentage:
          (additionalContributions / result.finalBalance) * 100,
        interestPercentage: (result.totalInterest / result.finalBalance) * 100,
      }
    }, [result, principal])

  const handleReset = useCallback(() => {
    setPrincipal(10000)
    setAnnualRate(7)
    setYears(10)
    setCompoundingFrequency('monthly')
    setContributionAmount(100)
    setContributionFrequency('monthly')
    setShowAdvanced(false)
    setShowBreakdown(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result &&
          `${t.finalBalance}: ${formatCurrency(result.finalBalance, currency, locale)}`}
      </div>

      {/* Main grid layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Principal Input */}
          <div className="space-y-3">
            <Label htmlFor="principal" className="text-base font-medium">
              {t.principal}
            </Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="text-lg h-12"
              min={0}
              step={1000}
              aria-invalid={!!getFieldError('principal')}
              aria-describedby={
                getFieldError('principal') ? 'principal-error' : undefined
              }
            />
            {getFieldError('principal') && (
              <p
                id="principal-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {getFieldError('principal')}
              </p>
            )}
            <Slider
              value={[Math.min(principal, 100000)]}
              onValueChange={([value]) => setPrincipal(value)}
              max={100000}
              min={100}
              step={100}
              className="py-2"
            />
          </div>

          {/* Annual Rate Input */}
          <div className="space-y-3">
            <Label htmlFor="annualRate" className="text-base font-medium">
              {t.annualRate}
            </Label>
            <div className="relative">
              <Input
                id="annualRate"
                type="number"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="pr-8 text-lg h-12"
                min={0}
                max={100}
                step={0.1}
                aria-invalid={!!getFieldError('annualRate')}
                aria-describedby={
                  getFieldError('annualRate') ? 'annualRate-error' : undefined
                }
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            {getFieldError('annualRate') && (
              <p
                id="annualRate-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {getFieldError('annualRate')}
              </p>
            )}
            <Slider
              value={[Math.min(annualRate, 20)]}
              onValueChange={([value]) => setAnnualRate(value)}
              max={20}
              min={0}
              step={0.1}
              className="py-2"
            />
          </div>

          {/* Years Input */}
          <div className="space-y-3">
            <Label htmlFor="years" className="text-base font-medium">
              {t.years}
            </Label>
            <Input
              id="years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="text-lg h-12"
              min={1}
              max={100}
              step={1}
              aria-invalid={!!getFieldError('years')}
              aria-describedby={
                getFieldError('years') ? 'years-error' : undefined
              }
            />
            {getFieldError('years') && (
              <p
                id="years-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {getFieldError('years')}
              </p>
            )}
            <Slider
              value={[Math.min(years, 50)]}
              onValueChange={([value]) => setYears(value)}
              max={50}
              min={1}
              step={1}
              className="py-2"
            />
          </div>

          {/* Compounding Frequency */}
          <div className="space-y-3">
            <Label
              htmlFor="compoundingFrequency"
              className="text-base font-medium"
            >
              {t.compoundingFrequency}
            </Label>
            <Select
              value={compoundingFrequency}
              onValueChange={(value: CompoundingFrequency) =>
                setCompoundingFrequency(value)
              }
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t.daily}</SelectItem>
                <SelectItem value="monthly">{t.monthly}</SelectItem>
                <SelectItem value="quarterly">{t.quarterly}</SelectItem>
                <SelectItem value="semiannually">{t.semiannually}</SelectItem>
                <SelectItem value="annually">{t.annually}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Options Toggle */}
          <div>
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between h-10 px-3 text-muted-foreground hover:text-foreground"
              aria-expanded={showAdvanced}
              aria-controls="advanced-options"
            >
              <span className="flex items-center gap-2">
                <PiggyBank className="h-4 w-4" aria-hidden="true" />
                {t.regularContributions}
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            {showAdvanced && (
              <div
                id="advanced-options"
                className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4"
              >
                {/* Contribution Amount */}
                <div className="space-y-2">
                  <Label htmlFor="contributionAmount" className="text-sm">
                    {t.contributionAmount}
                  </Label>
                  <Input
                    id="contributionAmount"
                    type="number"
                    value={contributionAmount}
                    onChange={(e) =>
                      setContributionAmount(Number(e.target.value))
                    }
                    className="h-10"
                    min={0}
                    step={50}
                  />
                </div>

                {/* Contribution Frequency */}
                <div className="space-y-2">
                  <Label htmlFor="contributionFrequency" className="text-sm">
                    {t.contributionFrequency}
                  </Label>
                  <Select
                    value={contributionFrequency}
                    onValueChange={(value: ContributionFrequency) =>
                      setContributionFrequency(value)
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">
                        {t.monthlyContributions}
                      </SelectItem>
                      <SelectItem value="quarterly">
                        {t.quarterlyContributions}
                      </SelectItem>
                      <SelectItem value="annually">
                        {t.annualContributions}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <Button onClick={handleReset} variant="outline" className="w-full">
            {t.reset}
          </Button>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.finalBalance}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {result
                  ? formatCurrency(result.finalBalance, currency, locale)
                  : '--'}
              </div>
              {result && (
                <div className="mt-3 flex items-center gap-2 text-sm opacity-80">
                  <TrendingUp className="h-4 w-4" />
                  <span>
                    {t.effectiveRate}: {formatNumber(result.effectiveAnnualRate, 2, locale)}%
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Breakdown List */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      {t.principalLabel}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(principal, currency, locale)}
                    </span>
                  </div>

                  {result.totalContributions > principal && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full bg-blue-500"
                          aria-hidden="true"
                        />
                        {t.contributions}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(
                          result.totalContributions - principal,
                          currency,
                          locale
                        )}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full bg-green-500"
                        aria-hidden="true"
                      />
                      {t.totalInterest}
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(result.totalInterest, currency, locale)}
                    </span>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center">
                    <span className="font-medium">{t.totalContributions}</span>
                    <span className="font-medium">
                      {formatCurrency(
                        result.totalContributions,
                        currency,
                        locale
                      )}
                    </span>
                  </div>
                </div>

                {/* Visual Bar */}
                <div className="h-4 rounded-full overflow-hidden flex bg-muted">
                  <div
                    className="bg-primary transition-all duration-300"
                    style={{ width: `${principalPercentage}%` }}
                    role="img"
                    aria-label={`${t.principalLabel}: ${principalPercentage.toFixed(1)}%`}
                  />
                  {contributionsPercentage > 0 && (
                    <div
                      className="bg-blue-500 transition-all duration-300"
                      style={{ width: `${contributionsPercentage}%` }}
                      role="img"
                      aria-label={`${t.contributions}: ${contributionsPercentage.toFixed(1)}%`}
                    />
                  )}
                  <div
                    className="bg-green-500 transition-all duration-300"
                    style={{ width: `${interestPercentage}%` }}
                    role="img"
                    aria-label={`${t.totalInterest}: ${interestPercentage.toFixed(1)}%`}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Year-by-Year Breakdown Toggle */}
      {result && (
        <div>
          <Button
            variant="outline"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full"
            aria-expanded={showBreakdown}
            aria-controls="yearly-breakdown"
          >
            {showBreakdown ? t.hideBreakdown : t.showBreakdown}
          </Button>
        </div>
      )}

      {/* Year-by-Year Breakdown Table */}
      {result && showBreakdown && (
        <Card id="yearly-breakdown">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead className="bg-muted">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left font-medium"
                    >
                      {t.year}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      {t.startingBalance}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      {t.contributions}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      {t.interestEarned}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right font-medium"
                    >
                      {t.endingBalance}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {result.yearlyBreakdown.map((row: YearBreakdown) => (
                    <tr key={row.year} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{row.year}</td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(row.startingBalance, currency, locale)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatCurrency(row.contributions, currency, locale)}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600 dark:text-green-400">
                        {formatCurrency(row.interestEarned, currency, locale)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(row.endingBalance, currency, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
