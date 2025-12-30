'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  Target,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  calculateROI,
  validateROIInputs,
} from './calculations'
import {
  formatCurrency,
  formatSignedPercentage,
  getCurrencySymbol,
} from '@/lib/formatters'
import type { ROIInputs, ROIResult, ROIValidation, ROICategory } from './types'

interface ROICalculatorTranslations {
  initialInvestment: string
  finalValue: string
  investmentPeriod: string
  roiPercentage: string
  profitLoss: string
  annualizedReturn: string
  totalInvested: string
  calculate: string
  reset: string
  years: string
  optional: string
  profit: string
  loss: string
  // Category labels
  categorySignificantLoss: string
  categoryLoss: string
  categoryBreakEven: string
  categoryLow: string
  categoryModerate: string
  categoryHigh: string
  categoryExceptional: string
  // Summary
  summaryTitle: string
  summaryProfit: string
  summaryLoss: string
  summaryBreakEven: string
  // Validation
  validationError: string
}

interface ROICalculatorProps {
  locale?: string
  currency?: string
  translations: ROICalculatorTranslations
}

export function ROICalculator({
  locale = 'en-US',
  currency = 'USD',
  translations: t,
}: ROICalculatorProps) {
  // Input state
  const [initialInvestment, setInitialInvestment] = useState<number>(10000)
  const [finalValue, setFinalValue] = useState<number>(12500)
  const [investmentPeriodYears, setInvestmentPeriodYears] = useState<number>(1)

  // Get currency symbol
  const currencySymbol = useMemo(() => getCurrencySymbol(locale, currency), [locale, currency])

  // Validate inputs
  const validation: ROIValidation = useMemo(() => {
    return validateROIInputs({
      initialInvestment,
      finalValue,
      investmentPeriodYears: investmentPeriodYears > 0 ? investmentPeriodYears : undefined,
    })
  }, [initialInvestment, finalValue, investmentPeriodYears])

  // Get error for a specific field
  const getFieldError = useCallback((field: string): string | undefined => {
    return validation.errors.find(e => e.field === field)?.message
  }, [validation.errors])

  // Calculate ROI result
  const result: ROIResult | null = useMemo(() => {
    if (!validation.valid) return null

    const inputs: ROIInputs = {
      initialInvestment,
      finalValue,
      investmentPeriodYears: investmentPeriodYears > 0 ? investmentPeriodYears : undefined,
    }

    return calculateROI(inputs)
  }, [initialInvestment, finalValue, investmentPeriodYears, validation.valid])

  // Reset handler
  const handleReset = useCallback(() => {
    setInitialInvestment(10000)
    setFinalValue(12500)
    setInvestmentPeriodYears(1)
  }, [])

  // Get category label
  const getCategoryLabel = (category: ROICategory): string => {
    switch (category) {
      case 'significant-loss': return t.categorySignificantLoss
      case 'loss': return t.categoryLoss
      case 'break-even': return t.categoryBreakEven
      case 'low': return t.categoryLow
      case 'moderate': return t.categoryModerate
      case 'high': return t.categoryHigh
      case 'exceptional': return t.categoryExceptional
      default: return ''
    }
  }

  // Get category color classes
  const getCategoryColors = (category: ROICategory): { bg: string; text: string; border: string } => {
    switch (category) {
      case 'significant-loss':
        return { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' }
      case 'loss':
        return { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/20' }
      case 'break-even':
        return { bg: 'bg-gray-500/10', text: 'text-gray-600', border: 'border-gray-500/20' }
      case 'low':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-600', border: 'border-yellow-500/20' }
      case 'moderate':
        return { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' }
      case 'high':
        return { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/20' }
      case 'exceptional':
        return { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/20' }
      default:
        return { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-muted' }
    }
  }

  // Determine if profit or loss
  const isProfit = result ? result.profitLoss >= 0 : true

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `${t.roiPercentage}: ${formatSignedPercentage(result.roi, 2, locale)}`}
      </div>

      {/* Screen reader live region for validation errors */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {!validation.valid && validation.errors.length > 0 &&
          `${t.validationError}: ${validation.errors.map(e => e.message).join('. ')}`
        }
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Initial Investment */}
          <div className="space-y-3">
            <Label htmlFor="initialInvestment" id="initialInvestment-label" className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.initialInvestment}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                {currencySymbol}
              </span>
              <Input
                id="initialInvestment"
                type="number"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
                className={`pl-8 text-lg h-12 ${getFieldError('initialInvestment') ? 'border-destructive' : ''}`}
                min={0}
                step={1000}
                aria-labelledby="initialInvestment-label"
                aria-invalid={!!getFieldError('initialInvestment')}
                aria-describedby={getFieldError('initialInvestment') ? 'initialInvestment-error' : undefined}
              />
            </div>
            {getFieldError('initialInvestment') && (
              <p id="initialInvestment-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('initialInvestment')}
              </p>
            )}
            <Slider
              value={[Math.min(initialInvestment, 1000000)]}
              onValueChange={([value]) => setInitialInvestment(value)}
              max={1000000}
              min={100}
              step={1000}
              className="py-2"
              aria-labelledby="initialInvestment-label"
              aria-valuemin={100}
              aria-valuemax={1000000}
              aria-valuenow={initialInvestment}
              aria-valuetext={formatCurrency(initialInvestment, currency, locale)}
            />
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>{formatCurrency(100, currency, locale)}</span>
              <span>{formatCurrency(1000000, currency, locale)}</span>
            </div>
          </div>

          {/* Final Value */}
          <div className="space-y-3">
            <Label htmlFor="finalValue" id="finalValue-label" className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.finalValue}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                {currencySymbol}
              </span>
              <Input
                id="finalValue"
                type="number"
                value={finalValue}
                onChange={(e) => setFinalValue(Number(e.target.value))}
                className={`pl-8 text-lg h-12 ${getFieldError('finalValue') ? 'border-destructive' : ''}`}
                min={0}
                step={1000}
                aria-labelledby="finalValue-label"
                aria-invalid={!!getFieldError('finalValue')}
                aria-describedby={getFieldError('finalValue') ? 'finalValue-error' : undefined}
              />
            </div>
            {getFieldError('finalValue') && (
              <p id="finalValue-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('finalValue')}
              </p>
            )}
            <Slider
              value={[Math.min(finalValue, 2000000)]}
              onValueChange={([value]) => setFinalValue(value)}
              max={2000000}
              min={0}
              step={1000}
              className="py-2"
              aria-labelledby="finalValue-label"
              aria-valuemin={0}
              aria-valuemax={2000000}
              aria-valuenow={finalValue}
              aria-valuetext={formatCurrency(finalValue, currency, locale)}
            />
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>{formatCurrency(0, currency, locale)}</span>
              <span>{formatCurrency(2000000, currency, locale)}</span>
            </div>
          </div>

          {/* Investment Period */}
          <div className="space-y-3">
            <Label htmlFor="investmentPeriod" id="investmentPeriod-label" className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.investmentPeriod}
              <span className="text-sm text-muted-foreground">({t.optional})</span>
            </Label>
            <div className="relative">
              <Input
                id="investmentPeriod"
                type="number"
                value={investmentPeriodYears}
                onChange={(e) => setInvestmentPeriodYears(Number(e.target.value))}
                className={`pr-12 text-lg h-12 ${getFieldError('investmentPeriodYears') ? 'border-destructive' : ''}`}
                min={0}
                max={100}
                step={0.5}
                aria-labelledby="investmentPeriod-label"
                aria-invalid={!!getFieldError('investmentPeriodYears')}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">
                {t.years}
              </span>
            </div>
            {getFieldError('investmentPeriodYears') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('investmentPeriodYears')}
              </p>
            )}
            <Slider
              value={[Math.min(investmentPeriodYears, 50)]}
              onValueChange={([value]) => setInvestmentPeriodYears(value)}
              max={50}
              min={0}
              step={0.5}
              className="py-2"
              aria-labelledby="investmentPeriod-label"
              aria-valuemin={0}
              aria-valuemax={50}
              aria-valuenow={investmentPeriodYears}
              aria-valuetext={`${investmentPeriodYears} ${t.years}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>0 {t.years}</span>
              <span>50 {t.years}</span>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card - ROI Percentage */}
          <Card className={`overflow-hidden ${
            result && isProfit
              ? 'bg-gradient-to-br from-green-600 via-green-600 to-green-700'
              : 'bg-gradient-to-br from-red-600 via-red-600 to-red-700'
          } text-white`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-2">
                {isProfit ? (
                  <TrendingUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-4 w-4" aria-hidden="true" />
                )}
                {t.roiPercentage}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {result ? formatSignedPercentage(result.roi, 2, locale) : '--'}
              </div>
              {result && (
                <div className="mt-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    isProfit ? 'bg-white/20' : 'bg-white/20'
                  }`}>
                    {getCategoryLabel(result.roiCategory)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary Card */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">{t.summaryTitle}</h3>

                {/* Profit/Loss */}
                <div className={`p-4 rounded-lg border ${
                  getCategoryColors(result.roiCategory).bg
                } ${getCategoryColors(result.roiCategory).border}`}>
                  <div className="text-sm text-muted-foreground mb-1">
                    {isProfit ? t.profit : t.loss}
                  </div>
                  <div className={`text-2xl font-bold ${getCategoryColors(result.roiCategory).text}`}>
                    {isProfit ? '+' : ''}{formatCurrency(result.profitLoss, currency, locale)}
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Total Invested */}
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      {t.totalInvested}
                    </div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(result.totalInvested, currency, locale)}
                    </div>
                  </div>

                  {/* Annualized Return */}
                  {result.annualizedROI !== undefined && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">
                        {t.annualizedReturn}
                      </div>
                      <div className={`text-xl font-semibold ${
                        result.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatSignedPercentage(result.annualizedROI, 2, locale)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Breakdown Bar */}
                <div className="space-y-2">
                  <div className="h-4 rounded-full overflow-hidden flex bg-muted">
                    {isProfit ? (
                      <>
                        <div
                          className="bg-primary transition-all duration-300"
                          style={{ width: `${(initialInvestment / finalValue) * 100}%` }}
                        />
                        <div
                          className="bg-green-500 transition-all duration-300"
                          style={{ width: `${(result.profitLoss / finalValue) * 100}%` }}
                        />
                      </>
                    ) : (
                      <>
                        <div
                          className="bg-primary transition-all duration-300"
                          style={{ width: `${(finalValue / initialInvestment) * 100}%` }}
                        />
                        <div
                          className="bg-red-500 transition-all duration-300"
                          style={{ width: `${Math.abs(result.profitLoss / initialInvestment) * 100}%` }}
                        />
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t.initialInvestment}</span>
                    <span>{isProfit ? t.profit : t.loss}</span>
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
