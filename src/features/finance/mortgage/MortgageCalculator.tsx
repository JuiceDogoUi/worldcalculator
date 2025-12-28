'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Home,
  DollarSign,
  Percent,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Settings2,
  Info,
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
  calculateMortgage,
  validateMortgageInputs,
  formatPercentage,
} from './calculations'
import type {
  MortgageInputs,
  MortgageResult,
  DownPaymentType,
  PaymentFrequency,
  AmortizationScheduleEntry,
} from './types'

interface MortgageCalculatorTranslations {
  // Input labels
  homePrice: string
  downPayment: string
  downPaymentType: string
  downPaymentPercentage: string
  downPaymentAmount: string
  interestRate: string
  loanTerm: string
  paymentFrequency: string
  propertyTax: string
  homeInsurance: string
  hoaFees: string
  pmiRate: string

  // Options
  monthly: string
  biweekly: string
  weekly: string
  percentage: string
  amount: string
  years: string

  // Results
  totalMonthlyPayment: string
  loanAmount: string
  downPaymentLabel: string
  totalInterest: string
  totalCost: string
  payoffDate: string

  // Payment breakdown
  paymentBreakdown: string
  principalInterest: string
  propertyTaxLabel: string
  homeInsuranceLabel: string
  pmiLabel: string
  hoaFeesLabel: string

  // PMI info
  pmiRequired: string
  pmiNotRequired: string
  pmiRemovalInfo: string

  // Actions
  calculate: string
  reset: string
  showSchedule: string
  hideSchedule: string
  advancedOptions: string
  showMore: string
  showLess: string

  // Amortization
  amortizationSchedule: string
  period: string
  payment: string
  principal: string
  interest: string
  balance: string
  pmi: string
  page: string
  of: string

  // Validation
  validationError?: string
}

interface MortgageCalculatorProps {
  locale?: string
  currency?: string
  translations: MortgageCalculatorTranslations
}

const ROWS_PER_PAGE = 12

// Get currency symbol from locale
function getCurrencySymbol(locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  })
    .formatToParts(0)
    .find((part) => part.type === 'currency')?.value || '$'
}

// Format currency
function formatCurrency(value: number, locale: string, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage
function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`
}

export function MortgageCalculator({
  locale = 'en-US',
  currency = 'USD',
  translations: t,
}: MortgageCalculatorProps) {
  // Input state
  const [homePrice, setHomePrice] = useState<number>(300000)
  const [downPaymentType, setDownPaymentType] = useState<DownPaymentType>('percentage')
  const [downPaymentPercentage, setDownPaymentPercentage] = useState<number>(20)
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(60000)
  const [interestRate, setInterestRate] = useState<number>(6.5)
  const [loanTermYears, setLoanTermYears] = useState<number>(30)
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly')

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(0)
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(0)
  const [hoaFees, setHoaFees] = useState<number>(0)
  const [pmiEnabled] = useState(true)
  const [pmiRate, setPmiRate] = useState<number>(0.5)

  // UI state
  const [showAmortization, setShowAmortization] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Sync down payment amount/percentage when type changes
  useEffect(() => {
    if (downPaymentType === 'percentage') {
      setDownPaymentAmount((homePrice * downPaymentPercentage) / 100)
    } else {
      setDownPaymentPercentage((downPaymentAmount / homePrice) * 100)
    }
  }, [homePrice, downPaymentType, downPaymentPercentage, downPaymentAmount])

  // Get currency symbol
  const currencySymbol = useMemo(
    () => getCurrencySymbol(locale, currency),
    [locale, currency]
  )

  // Calculate total term in months
  const totalTermMonths = loanTermYears * 12

  // Validate inputs
  const validation = useMemo(() => {
    return validateMortgageInputs({
      homePrice,
      downPaymentType,
      downPaymentPercentage,
      downPaymentAmount,
      interestRate,
      loanTerm: totalTermMonths,
      paymentFrequency,
      propertyTaxAnnual: showAdvanced ? propertyTaxAnnual : undefined,
      homeInsuranceAnnual: showAdvanced ? homeInsuranceAnnual : undefined,
      hoaFees: showAdvanced ? hoaFees : undefined,
      pmiRate,
      pmiEnabled,
    })
  }, [
    homePrice,
    downPaymentType,
    downPaymentPercentage,
    downPaymentAmount,
    interestRate,
    totalTermMonths,
    paymentFrequency,
    showAdvanced,
    propertyTaxAnnual,
    homeInsuranceAnnual,
    hoaFees,
    pmiRate,
    pmiEnabled,
  ])

  // Get error for a specific field
  const getFieldError = useCallback(
    (field: string): string | undefined => {
      return validation.errors.find((e) => e.field === field)?.message
    },
    [validation.errors]
  )

  // Calculate mortgage result
  const result: MortgageResult | null = useMemo(() => {
    if (!validation.valid) return null

    const inputs: MortgageInputs = {
      homePrice,
      downPaymentType,
      downPaymentPercentage,
      downPaymentAmount,
      interestRate,
      loanTerm: totalTermMonths,
      paymentFrequency,
      propertyTaxAnnual: showAdvanced ? propertyTaxAnnual : 0,
      homeInsuranceAnnual: showAdvanced ? homeInsuranceAnnual : 0,
      hoaFees: showAdvanced ? hoaFees : 0,
      pmiEnabled,
      pmiRate,
    }

    return calculateMortgage(inputs)
  }, [
    validation.valid,
    homePrice,
    downPaymentType,
    downPaymentPercentage,
    downPaymentAmount,
    interestRate,
    totalTermMonths,
    paymentFrequency,
    showAdvanced,
    propertyTaxAnnual,
    homeInsuranceAnnual,
    hoaFees,
    pmiEnabled,
    pmiRate,
  ])

  const handleReset = useCallback(() => {
    setHomePrice(300000)
    setDownPaymentType('percentage')
    setDownPaymentPercentage(20)
    setDownPaymentAmount(60000)
    setInterestRate(6.5)
    setLoanTermYears(30)
    setPaymentFrequency('monthly')
    setPropertyTaxAnnual(0)
    setHomeInsuranceAnnual(0)
    setHoaFees(0)
    setPmiRate(0.5)
    setShowAdvanced(false)
    setShowAmortization(false)
    setCurrentPage(1)
  }, [])

  // Pagination for amortization schedule
  const { totalPages, paginatedSchedule } = useMemo(() => {
    if (!result) {
      return { totalPages: 0, paginatedSchedule: [] as AmortizationScheduleEntry[] }
    }
    return {
      totalPages: Math.ceil(result.amortizationSchedule.length / ROWS_PER_PAGE),
      paginatedSchedule: result.amortizationSchedule.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
      ),
    }
  }, [result, currentPage])

  return (
    <div className="space-y-6">
      {/* Screen reader live region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `Total Monthly Payment: ${formatCurrency(result.totalMonthlyPayment, locale, currency)}`}
      </div>

      {/* 2-COLUMN GRID */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT COLUMN - ALL INPUTS */}
        <div className="space-y-6">
          {/* Home Price */}
          <div className="space-y-3">
            <Label htmlFor="homePrice" className="flex items-center gap-2 text-base">
              <Home className="h-4 w-4 text-muted-foreground" />
              {t.homePrice}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {currencySymbol}
              </span>
              <Input
                id="homePrice"
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="pl-8 text-lg h-12"
                min={0}
                step={1000}
              />
            </div>
            {getFieldError('homePrice') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('homePrice')}
              </p>
            )}
            <Slider
              value={[Math.min(homePrice, 2000000)]}
              onValueChange={([value]) => setHomePrice(value)}
              max={2000000}
              min={50000}
              step={10000}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(50000, locale, currency)}</span>
              <span>{formatCurrency(2000000, locale, currency)}</span>
            </div>
          </div>

          {/* Down Payment */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              {t.downPayment}
            </Label>
            <div className="flex gap-2 mb-2">
              <Button
                type="button"
                variant={downPaymentType === 'percentage' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDownPaymentType('percentage')}
              >
                {t.percentage}
              </Button>
              <Button
                type="button"
                variant={downPaymentType === 'amount' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDownPaymentType('amount')}
              >
                {t.amount}
              </Button>
            </div>
            {downPaymentType === 'percentage' ? (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[downPaymentPercentage]}
                    onValueChange={([value]) => setDownPaymentPercentage(value)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-medium">
                    {downPaymentPercentage}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(
                    (homePrice * downPaymentPercentage) / 100,
                    locale,
                    currency
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {currencySymbol}
                  </span>
                  <Input
                    type="number"
                    value={downPaymentAmount}
                    onChange={(e) => setDownPaymentAmount(Number(e.target.value))}
                    className="pl-8 text-lg h-12"
                    min={0}
                    max={homePrice}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatPercentage((downPaymentAmount / homePrice) * 100)}
                </p>
              </div>
            )}
            {getFieldError('downPayment') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('downPayment')}
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div className="space-y-3">
            <Label htmlFor="interestRate" className="flex items-center gap-2 text-base">
              <Percent className="h-4 w-4 text-muted-foreground" />
              {t.interestRate}
            </Label>
            <div className="relative">
              <Input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="pr-7 text-lg h-12"
                min={0}
                max={15}
                step={0.1}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
            {getFieldError('interestRate') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {getFieldError('interestRate')}
              </p>
            )}
            <Slider
              value={[Math.min(interestRate, 15)]}
              onValueChange={([value]) => setInterestRate(value)}
              min={0}
              max={15}
              step={0.1}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div className="space-y-3">
            <Label htmlFor="loanTerm" className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {t.loanTerm}
            </Label>
            <Select
              value={loanTermYears.toString()}
              onValueChange={(value) => setLoanTermYears(Number(value))}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 {t.years}</SelectItem>
                <SelectItem value="15">15 {t.years}</SelectItem>
                <SelectItem value="20">20 {t.years}</SelectItem>
                <SelectItem value="25">25 {t.years}</SelectItem>
                <SelectItem value="30">30 {t.years}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Frequency */}
          <div className="space-y-3">
            <Label htmlFor="paymentFrequency" className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {t.paymentFrequency}
            </Label>
            <Select
              value={paymentFrequency}
              onValueChange={(value: PaymentFrequency) => setPaymentFrequency(value)}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t.monthly}</SelectItem>
                <SelectItem value="biweekly">{t.biweekly}</SelectItem>
                <SelectItem value="weekly">{t.weekly}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Options */}
          <div>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between h-10 px-3 text-muted-foreground hover:text-foreground"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                {t.advancedOptions}
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                {/* Property Tax */}
                <div className="space-y-2">
                  <Label htmlFor="propertyTax" className="text-sm">{t.propertyTax}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="propertyTax"
                      type="number"
                      value={propertyTaxAnnual}
                      onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                      className="pl-8 h-10"
                      min={0}
                    />
                  </div>
                </div>

                {/* Home Insurance */}
                <div className="space-y-2">
                  <Label htmlFor="homeInsurance" className="text-sm">{t.homeInsurance}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="homeInsurance"
                      type="number"
                      value={homeInsuranceAnnual}
                      onChange={(e) => setHomeInsuranceAnnual(Number(e.target.value))}
                      className="pl-8 h-10"
                      min={0}
                    />
                  </div>
                </div>

                {/* HOA Fees */}
                <div className="space-y-2">
                  <Label htmlFor="hoaFees" className="text-sm">{t.hoaFees}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {currencySymbol}
                    </span>
                    <Input
                      id="hoaFees"
                      type="number"
                      value={hoaFees}
                      onChange={(e) => setHoaFees(Number(e.target.value))}
                      className="pl-8 h-10"
                      min={0}
                    />
                  </div>
                </div>

                {/* PMI Rate */}
                <div className="space-y-2">
                  <Label htmlFor="pmiRate" className="flex items-center gap-2 text-sm">
                    {t.pmiRate}
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <div className="relative">
                    <Input
                      id="pmiRate"
                      type="number"
                      value={pmiRate}
                      onChange={(e) => setPmiRate(Number(e.target.value))}
                      className="pr-7 h-10"
                      min={0}
                      max={5}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={handleReset} variant="outline" className="flex-1 h-12">
              {t.reset}
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN - ALL RESULTS */}
        <div className="space-y-6">
          {/* 1. HERO RESULT CARD - Total Monthly Payment */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {t.totalMonthlyPayment}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {result ? formatCurrency(result.totalMonthlyPayment, locale, currency) : '--'}
              </div>
              {result && (
                <div className="mt-3 text-sm opacity-80">
                  {loanTermYears} {t.years} • {new Date(new Date().setMonth(new Date().getMonth() + inputs.loanTerm)).toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short'
                  })}
                </div>
              )}
              {result && result.pmiRequired && (
                <div className="mt-4 bg-primary-foreground/10 rounded-lg p-3 text-sm">
                  <p className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {t.pmiRequired}
                    {result.pmiRemovalPeriod && (
                      <span className="opacity-90">
                        {' - '}
                        {t.pmiRemovalInfo.replace(
                          '{period}',
                          result.pmiRemovalPeriod.toString()
                        )}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Payment Breakdown Card */}
          {result && (
            <Card>
              <CardContent className="p-6">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {t.paymentBreakdown}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{t.principalInterest}</span>
                    <span className="font-medium">
                      {formatCurrency(
                        result.monthlyPayment.principal + result.monthlyPayment.interest,
                        locale,
                        currency
                      )}
                    </span>
                  </div>
                  {result.monthlyPayment.propertyTax > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.propertyTaxLabel}</span>
                      <span className="font-medium">
                        {formatCurrency(result.monthlyPayment.propertyTax, locale, currency)}
                      </span>
                    </div>
                  )}
                  {result.monthlyPayment.homeInsurance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.homeInsuranceLabel}</span>
                      <span className="font-medium">
                        {formatCurrency(result.monthlyPayment.homeInsurance, locale, currency)}
                      </span>
                    </div>
                  )}
                  {result.monthlyPayment.pmi > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.pmiLabel}</span>
                      <span className="font-medium">
                        {formatCurrency(result.monthlyPayment.pmi, locale, currency)}
                      </span>
                    </div>
                  )}
                  {result.monthlyPayment.hoaFees > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{t.hoaFeesLabel}</span>
                      <span className="font-medium">
                        {formatCurrency(result.monthlyPayment.hoaFees, locale, currency)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. Summary Stats Card */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.loanAmount}</span>
                    <span className="font-medium">{formatCurrency(result.loanAmount, locale, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.downPaymentLabel}</span>
                    <span className="font-medium">{formatCurrency(result.downPaymentAmount, locale, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.totalInterest}</span>
                    <span className="font-medium">{formatCurrency(result.totalInterest, locale, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-muted-foreground font-medium">{t.totalCost}</span>
                    <span className="font-bold">{formatCurrency(result.totalCostOfOwnership, locale, currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* BELOW GRID - FULL WIDTH */}
      {/* Amortization Schedule */}
      {result && (
        <Card>
          <CardContent className="p-6">
            <Button
              onClick={() => setShowAmortization(!showAmortization)}
              variant="outline"
              className="w-full"
            >
              {showAmortization ? t.hideSchedule : t.showSchedule}
            </Button>

            {showAmortization && (
              <div className="mt-6 space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">{t.period}</th>
                        <th className="text-right p-2">{t.payment}</th>
                        <th className="text-right p-2">{t.principal}</th>
                        <th className="text-right p-2">{t.interest}</th>
                        {result.pmiRequired && <th className="text-right p-2">{t.pmi}</th>}
                        <th className="text-right p-2">{t.balance}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedSchedule.map((row) => (
                        <tr key={row.period} className="border-b">
                          <td className="p-2">{row.period}</td>
                          <td className="text-right p-2">
                            {formatCurrency(row.payment, locale, currency)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(row.principal, locale, currency)}
                          </td>
                          <td className="text-right p-2">
                            {formatCurrency(row.interest, locale, currency)}
                          </td>
                          {result.pmiRequired && (
                            <td className="text-right p-2">
                              {row.pmi ? formatCurrency(row.pmi, locale, currency) : '-'}
                            </td>
                          )}
                          <td className="text-right p-2">
                            {formatCurrency(row.balance, locale, currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      {t.page} {currentPage} {t.of} {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
