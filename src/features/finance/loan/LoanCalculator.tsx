'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  DollarSign,
  Percent,
  Calendar,
  CreditCard,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Settings2,
} from 'lucide-react'
import { ConversationalSummary } from './ConversationalSummary'
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
  calculateLoan,
  formatCurrency,
  formatPercentage,
  calculatePayoffDate,
  getCurrencySymbol,
  validateLoanInputs,
  getNominalRateFromInput,
  convertNominalToApr,
} from './calculations'
import type { LoanInputs, LoanResult, AmortizationRow, PaymentFrequency, LoanValidation, RateInputType } from './types'

interface SummaryTranslations {
  title: string
  loanReceived: string
  loanReceivedNoFee: string
  periodicPayment: string
  totalPayment: string
  effectiveRate: string
  paidOffBy: string
  viewBreakdown: string
  hideBreakdown: string
}

interface RateTypeTranslations {
  question: string
  nominal: string
  nominalDescription: string
  apr: string
  aprDescription: string
  both: string
  bothDescription: string
  unknown: string
  unknownDescription: string
  usingEstimatedRate?: string
  calculatedNominal?: string
  calculatedEffective?: string
}

interface LoanCalculatorTranslations {
  loanAmount: string
  interestRate: string
  loanTerm: string
  paymentFrequency: string
  monthlyPayment: string
  biweeklyPayment: string
  weeklyPayment: string
  totalPayment: string
  totalInterest: string
  calculate: string
  reset: string
  monthly: string
  biweekly: string
  weekly: string
  years: string
  months: string
  amortizationSchedule: string
  period: string
  payment: string
  principal: string
  interest: string
  balance: string
  payoffDate: string
  showSchedule: string
  hideSchedule: string
  loanSummary: string
  // New translations for European features
  nominalRate?: string
  effectiveRate?: string
  advancedOptions?: string
  originationFee?: string
  monthlyFee?: string
  insuranceCost?: string
  otherFees?: string
  totalFees?: string
  totalMonths?: string
  page?: string
  of?: string
  showMore?: string
  showLess?: string
  // Validation messages
  validationError?: string
  // Summary translations for conversational display
  summary?: SummaryTranslations
  // Rate type selector translations
  rateType?: RateTypeTranslations
}

interface LoanCalculatorProps {
  locale?: string
  currency?: string
  translations: LoanCalculatorTranslations
}

const ROWS_PER_PAGE = 12

/**
 * Get locale-specific rate terminology
 */
function getRateLabels(locale: string): { nominal: string; effective: string } {
  const lang = locale.split('-')[0].toLowerCase()
  switch (lang) {
    case 'es':
      return { nominal: 'TIN', effective: 'TAE' }
    case 'fr':
    case 'pt':
    case 'it':
      return { nominal: 'TAN', effective: 'TAEG' }
    case 'de':
      return { nominal: 'Nominalzins', effective: 'Eff. Jahreszins' }
    default:
      return { nominal: 'APR', effective: 'Eff. Rate' }
  }
}

export function LoanCalculator({
  locale = 'en-US',
  currency = 'USD',
  translations: t,
}: LoanCalculatorProps) {
  // Input state
  const [loanAmount, setLoanAmount] = useState<number>(10000)
  const [rateInputType, setRateInputType] = useState<RateInputType>('nominal')
  const [nominalRateInput, setNominalRateInput] = useState<number>(5)
  const [aprRateInput, setAprRateInput] = useState<number>(5.12)
  const [loanTermYears, setLoanTermYears] = useState<number>(5)
  const [loanTermMonths, setLoanTermMonths] = useState<number>(0)
  const [paymentFrequency, setPaymentFrequency] = useState<PaymentFrequency>('monthly')

  // Advanced options state
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [originationFee, setOriginationFee] = useState<number>(0)
  const [monthlyFee, setMonthlyFee] = useState<number>(0)
  const [insuranceCost, setInsuranceCost] = useState<number>(0)
  const [otherFees, setOtherFees] = useState<number>(0)

  // UI state
  const [showAmortization, setShowAmortization] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state after hydration to avoid date formatting mismatches
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Get currency symbol
  const currencySymbol = useMemo(() => getCurrencySymbol(locale, currency), [locale, currency])

  // Get locale-specific rate labels
  const rateLabels = useMemo(() => getRateLabels(locale), [locale])

  // Calculate total term in months
  const totalTermMonths = loanTermYears * 12 + loanTermMonths

  // Get periods per year for rate conversions
  const periodsPerYear = useMemo(() => {
    switch (paymentFrequency) {
      case 'weekly': return 365 / 7
      case 'biweekly': return 365 / 14
      default: return 12
    }
  }, [paymentFrequency])

  // Calculate the nominal interest rate to use based on rate input type
  const interestRate = useMemo(() => {
    return getNominalRateFromInput(rateInputType, nominalRateInput, aprRateInput, periodsPerYear)
  }, [rateInputType, nominalRateInput, aprRateInput, periodsPerYear])

  // Calculate APR for display when user enters nominal rate
  const displayApr = useMemo(() => {
    if (rateInputType === 'apr' || rateInputType === 'both') {
      return aprRateInput
    }
    return convertNominalToApr(nominalRateInput, periodsPerYear)
  }, [rateInputType, nominalRateInput, aprRateInput, periodsPerYear])

  // Validate inputs
  const validation: LoanValidation = useMemo(() => {
    return validateLoanInputs({
      loanAmount,
      interestRate,
      loanTerm: totalTermMonths,
      paymentFrequency,
      originationFee: showAdvanced ? originationFee : undefined,
      monthlyFee: showAdvanced ? monthlyFee : undefined,
      insuranceCost: showAdvanced ? insuranceCost : undefined,
      otherFees: showAdvanced ? otherFees : undefined,
    })
  }, [loanAmount, interestRate, totalTermMonths, paymentFrequency, showAdvanced, originationFee, monthlyFee, insuranceCost, otherFees])

  // Get error for a specific field
  const getFieldError = useCallback((field: string): string | undefined => {
    return validation.errors.find(e => e.field === field)?.message
  }, [validation.errors])

  // Calculate loan result
  const result: LoanResult | null = useMemo(() => {
    if (!validation.valid) return null

    const inputs: LoanInputs = {
      loanAmount,
      interestRate,
      loanTerm: totalTermMonths,
      paymentFrequency,
      originationFee: showAdvanced ? originationFee : 0,
      monthlyFee: showAdvanced ? monthlyFee : 0,
      insuranceCost: showAdvanced ? insuranceCost : 0,
      otherFees: showAdvanced ? otherFees : 0,
    }

    return calculateLoan(inputs)
  }, [loanAmount, interestRate, totalTermMonths, paymentFrequency, validation.valid, showAdvanced, originationFee, monthlyFee, insuranceCost, otherFees])

  const payoffDate = useMemo(() => {
    if (!result) return new Date()
    return calculatePayoffDate(result.totalPeriods, result.periodsPerYear)
  }, [result])

  const handleReset = useCallback(() => {
    setLoanAmount(10000)
    setRateInputType('nominal')
    setNominalRateInput(5)
    setAprRateInput(5.12)
    setLoanTermYears(5)
    setLoanTermMonths(0)
    setPaymentFrequency('monthly')
    setOriginationFee(0)
    setMonthlyFee(0)
    setInsuranceCost(0)
    setOtherFees(0)
    setShowAdvanced(false)
    setShowAmortization(false)
    setCurrentPage(1)
  }, [])

  // Calculate payment breakdown percentages for visual (memoized)
  const { principalPercentage, interestPercentage, feesPercentage } = useMemo(() => {
    if (!result) return { principalPercentage: 0, interestPercentage: 0, feesPercentage: 0 }
    return {
      principalPercentage: (loanAmount / result.totalPayment) * 100,
      interestPercentage: (result.totalInterest / result.totalPayment) * 100,
      feesPercentage: result.totalFees > 0 ? (result.totalFees / result.totalPayment) * 100 : 0,
    }
  }, [result, loanAmount])

  // Pagination for amortization schedule (memoized to prevent array slicing on every render)
  const { totalPages, paginatedSchedule } = useMemo(() => {
    if (!result) {
      return { totalPages: 0, paginatedSchedule: [] as AmortizationRow[] }
    }
    return {
      totalPages: Math.ceil(result.amortizationSchedule.length / ROWS_PER_PAGE),
      paginatedSchedule: result.amortizationSchedule.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
      ),
    }
  }, [result, currentPage])

  // Get payment label based on frequency
  const getPaymentLabel = () => {
    switch (result?.paymentFrequency) {
      case 'weekly':
        return t.weeklyPayment
      case 'biweekly':
        return t.biweeklyPayment
      default:
        return t.monthlyPayment
    }
  }

  return (
    <div className="space-y-6">
      {/* Screen reader live region for result updates */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {result && `${getPaymentLabel()}: ${formatCurrency(result.periodicPayment, locale, currency)}`}
      </div>

      {/* Screen reader live region for validation errors - announces all errors */}
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {!validation.valid && validation.errors.length > 0 &&
          `${t.validationError || 'Validation error'}: ${validation.errors.map(e => e.message).join('. ')}`
        }
      </div>

      {/* Calculator Input Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Loan Amount */}
          <div className="space-y-3">
            <Label htmlFor="loanAmount" id="loanAmount-label" className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.loanAmount}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                {currencySymbol}
              </span>
              <Input
                id="loanAmount"
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className={`pl-8 text-lg h-12 ${getFieldError('loanAmount') ? 'border-destructive' : ''}`}
                min={0}
                step={1000}
                aria-labelledby="loanAmount-label"
                aria-invalid={!!getFieldError('loanAmount')}
                aria-describedby={getFieldError('loanAmount') ? 'loanAmount-error' : undefined}
              />
            </div>
            {getFieldError('loanAmount') && (
              <p id="loanAmount-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('loanAmount')}
              </p>
            )}
            <Slider
              value={[Math.min(loanAmount, 1000000)]}
              onValueChange={([value]) => setLoanAmount(value)}
              max={1000000}
              min={1000}
              step={1000}
              className="py-2"
              aria-labelledby="loanAmount-label"
              aria-valuemin={1000}
              aria-valuemax={1000000}
              aria-valuenow={loanAmount}
              aria-valuetext={formatCurrency(loanAmount, locale, currency)}
            />
            <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
              <span>{formatCurrency(1000, locale, currency)}</span>
              <span>{formatCurrency(1000000, locale, currency)}</span>
            </div>
          </div>

          {/* Interest Rate Type Selector */}
          <div className="space-y-3">
            <Label htmlFor="rateType" id="rateType-label" className="flex items-center gap-2 text-base">
              <Percent className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.rateType?.question || 'What interest rate do you know?'}
            </Label>
            <Select
              value={rateInputType}
              onValueChange={(value: RateInputType) => setRateInputType(value)}
            >
              <SelectTrigger className="h-12 text-base" aria-labelledby="rateType-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nominal">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">{t.rateType?.nominal || `Nominal Rate (${rateLabels.nominal})`}</span>
                  </div>
                </SelectItem>
                <SelectItem value="apr">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">{t.rateType?.apr || `Effective Rate (${rateLabels.effective})`}</span>
                  </div>
                </SelectItem>
                <SelectItem value="both">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">{t.rateType?.both || 'I know both rates'}</span>
                  </div>
                </SelectItem>
                <SelectItem value="unknown">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">{t.rateType?.unknown || "I don't know the rate"}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Rate type explanation */}
            <p className="text-sm text-muted-foreground">
              {rateInputType === 'nominal' && (t.rateType?.nominalDescription || `The ${rateLabels.nominal} is the base interest rate without compounding. Most loan advertisements show this rate.`)}
              {rateInputType === 'apr' && (t.rateType?.aprDescription || `The ${rateLabels.effective} includes the effect of compounding and gives you the true annual cost of the loan.`)}
              {rateInputType === 'both' && (t.rateType?.bothDescription || 'Enter both rates to verify the loan terms. The calculator will use the nominal rate for payment calculations.')}
              {rateInputType === 'unknown' && (t.rateType?.unknownDescription || "We'll use a typical rate of 7% for estimation. You can adjust this once you know the actual rate.")}
            </p>
          </div>

          {/* Nominal Rate Input - shown for 'nominal', 'both', and displays calculated value for 'apr' */}
          {(rateInputType === 'nominal' || rateInputType === 'both') && (
            <div className="space-y-3">
              <Label htmlFor="nominalRate" id="nominalRate-label" className="flex items-center gap-2 text-base">
                {t.nominalRate || `Nominal Rate (${rateLabels.nominal})`}
              </Label>
              <div className="relative">
                <Input
                  id="nominalRate"
                  type="number"
                  value={nominalRateInput}
                  onChange={(e) => setNominalRateInput(Number(e.target.value))}
                  className={`pr-7 text-lg h-12 ${getFieldError('interestRate') ? 'border-destructive' : ''}`}
                  min={0}
                  max={100}
                  step={0.1}
                  aria-labelledby="nominalRate-label"
                  aria-invalid={!!getFieldError('interestRate')}
                  aria-describedby={getFieldError('interestRate') ? 'interestRate-error' : undefined}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                  %
                </span>
              </div>
              {getFieldError('interestRate') && (
                <p id="interestRate-error" className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" aria-hidden="true" />
                  {getFieldError('interestRate')}
                </p>
              )}
              <Slider
                value={[Math.min(nominalRateInput, 30)]}
                onValueChange={([value]) => setNominalRateInput(value)}
                max={30}
                min={0}
                step={0.1}
                className="py-2"
                aria-labelledby="nominalRate-label"
                aria-valuemin={0}
                aria-valuemax={30}
                aria-valuenow={nominalRateInput}
                aria-valuetext={`${nominalRateInput}%`}
              />
              <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>
          )}

          {/* APR/Effective Rate Input - shown for 'apr' and 'both' */}
          {(rateInputType === 'apr' || rateInputType === 'both') && (
            <div className="space-y-3">
              <Label htmlFor="aprRate" id="aprRate-label" className="flex items-center gap-2 text-base">
                {t.effectiveRate || `Effective Rate (${rateLabels.effective})`}
              </Label>
              <div className="relative">
                <Input
                  id="aprRate"
                  type="number"
                  value={aprRateInput}
                  onChange={(e) => setAprRateInput(Number(e.target.value))}
                  className={`pr-7 text-lg h-12 ${getFieldError('interestRate') ? 'border-destructive' : ''}`}
                  min={0}
                  max={100}
                  step={0.1}
                  aria-labelledby="aprRate-label"
                  aria-invalid={!!getFieldError('interestRate')}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true">
                  %
                </span>
              </div>
              <Slider
                value={[Math.min(aprRateInput, 30)]}
                onValueChange={([value]) => setAprRateInput(value)}
                max={30}
                min={0}
                step={0.1}
                className="py-2"
                aria-labelledby="aprRate-label"
                aria-valuemin={0}
                aria-valuemax={30}
                aria-valuenow={aprRateInput}
                aria-valuetext={`${aprRateInput}%`}
              />
              <div className="flex justify-between text-xs text-muted-foreground" aria-hidden="true">
                <span>0%</span>
                <span>30%</span>
              </div>
            </div>
          )}

          {/* Show calculated/converted rate info */}
          {rateInputType === 'nominal' && nominalRateInput > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">
                {t.rateType?.calculatedEffective || 'Calculated effective rate'} ({rateLabels.effective}): <strong className="text-foreground">{displayApr.toFixed(2)}%</strong>
              </span>
            </div>
          )}
          {rateInputType === 'apr' && aprRateInput > 0 && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">
                {t.rateType?.calculatedNominal || 'Calculated nominal rate'} ({rateLabels.nominal}): <strong className="text-foreground">{interestRate.toFixed(2)}%</strong>
              </span>
            </div>
          )}
          {rateInputType === 'unknown' && (
            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">
                {t.rateType?.usingEstimatedRate || 'Using estimated rate'}: <strong className="text-foreground">7.00%</strong> ({rateLabels.nominal})
              </span>
            </div>
          )}

          {/* Loan Term */}
          <div className="space-y-3">
            <Label id="loanTerm-label" className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.loanTerm}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="loanTermYears" className="sr-only">{t.years}</Label>
                <div className="relative">
                  <Input
                    id="loanTermYears"
                    type="number"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}
                    className="pr-12 text-lg h-12"
                    min={0}
                    max={50}
                    aria-label={`${t.loanTerm} ${t.years}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">
                    {t.years}
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="loanTermMonths" className="sr-only">{t.months}</Label>
                <div className="relative">
                  <Input
                    id="loanTermMonths"
                    type="number"
                    value={loanTermMonths}
                    onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                    className="pr-12 text-lg h-12"
                    min={0}
                    max={11}
                    aria-label={`${t.loanTerm} ${t.months}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground" aria-hidden="true">
                    {t.months}
                  </span>
                </div>
              </div>
            </div>
            {/* Total months helper */}
            <p className="text-sm text-muted-foreground">
              {t.totalMonths || 'Total'}: {totalTermMonths} {t.months}
            </p>
            {getFieldError('loanTerm') && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {getFieldError('loanTerm')}
              </p>
            )}
          </div>

          {/* Payment Frequency */}
          <div className="space-y-3">
            <Label htmlFor="paymentFrequency" id="paymentFrequency-label" className="flex items-center gap-2 text-base">
              <CreditCard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              {t.paymentFrequency}
            </Label>
            <Select
              value={paymentFrequency}
              onValueChange={(value: PaymentFrequency) => setPaymentFrequency(value)}
            >
              <SelectTrigger className="h-12 text-base" aria-labelledby="paymentFrequency-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">{t.monthly}</SelectItem>
                <SelectItem value="biweekly">{t.biweekly}</SelectItem>
                <SelectItem value="weekly">{t.weekly}</SelectItem>
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
                <Settings2 className="h-4 w-4" aria-hidden="true" />
                {t.advancedOptions || 'Advanced Options (Fees & Insurance)'}
              </span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              )}
            </Button>

            {/* Advanced Options Panel */}
            {showAdvanced && (
              <div id="advanced-options" className="mt-4 p-4 bg-muted/50 rounded-lg space-y-4">
                {/* Origination Fee */}
                <div className="space-y-2">
                  <Label htmlFor="originationFee" className="text-sm">
                    {t.originationFee || 'Origination Fee (%)'}
                  </Label>
                  <div className="relative">
                    <Input
                      id="originationFee"
                      type="number"
                      value={originationFee}
                      onChange={(e) => setOriginationFee(Number(e.target.value))}
                      className="pr-7 h-10"
                      min={0}
                      max={20}
                      step={0.1}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                  </div>
                </div>

                {/* Monthly Fee */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyFee" className="text-sm">
                    {t.monthlyFee || 'Monthly Account Fee'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currencySymbol}</span>
                    <Input
                      id="monthlyFee"
                      type="number"
                      value={monthlyFee}
                      onChange={(e) => setMonthlyFee(Number(e.target.value))}
                      className="pl-8 h-10"
                      min={0}
                      step={1}
                    />
                  </div>
                </div>

                {/* Insurance Cost */}
                <div className="space-y-2">
                  <Label htmlFor="insuranceCost" className="text-sm">
                    {t.insuranceCost || 'Monthly Insurance'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currencySymbol}</span>
                    <Input
                      id="insuranceCost"
                      type="number"
                      value={insuranceCost}
                      onChange={(e) => setInsuranceCost(Number(e.target.value))}
                      className="pl-8 h-10"
                      min={0}
                      step={1}
                    />
                  </div>
                </div>

                {/* Other Fees */}
                <div className="space-y-2">
                  <Label htmlFor="otherFees" className="text-sm">
                    {t.otherFees || 'Other One-time Fees'}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{currencySymbol}</span>
                    <Input
                      id="otherFees"
                      type="number"
                      value={otherFees}
                      onChange={(e) => setOtherFees(Number(e.target.value))}
                      className="pl-8 h-10"
                      min={0}
                      step={10}
                    />
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

        {/* Right Column - Results */}
        <div className="space-y-6">
          {/* Hero Result Card - Large and prominent */}
          <Card className="bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground overflow-hidden">
            <CardContent className="p-6">
              <div className="text-sm font-medium opacity-90 mb-2">
                {getPaymentLabel()}
              </div>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                {result ? formatCurrency(result.periodicPayment, locale, currency) : '--'}
              </div>
              {result && (
                <div className="mt-3 text-sm opacity-80">
                  {t.months && `${totalTermMonths} ${t.months}`} • {isMounted ? payoffDate.toLocaleDateString(locale, {
                    year: 'numeric',
                    month: 'short',
                  }) : '...'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversational Summary */}
          {result && t.summary && (
            <Card>
              <CardContent className="p-6">
                <ConversationalSummary
                  result={result}
                  loanAmount={loanAmount}
                  locale={locale}
                  currency={currency}
                  translations={t.summary}
                  rateLabels={rateLabels}
                  payoffDate={payoffDate}
                  frequencyLabel={
                    paymentFrequency === 'weekly' ? t.weekly :
                    paymentFrequency === 'biweekly' ? t.biweekly :
                    t.monthly
                  }
                  isMounted={isMounted}
                />
              </CardContent>
            </Card>
          )}

          {/* Payment Breakdown */}
          {result && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  {t.loanSummary}
                </div>

                {/* Visual Bar */}
                <div className="h-5 rounded-full overflow-hidden flex bg-muted">
                  {/* Principal - solid color */}
                  <div
                    className="bg-primary transition-all duration-300"
                    style={{ width: `${principalPercentage}%` }}
                    role="img"
                    aria-label={`${t.principal}: ${formatCurrency(loanAmount, locale, currency)} (${formatPercentage(principalPercentage, 1)})`}
                  />
                  {/* Interest - diagonal stripes pattern */}
                  <div
                    className="bg-chart-interest transition-all duration-300"
                    style={{
                      width: `${interestPercentage}%`,
                      backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.3) 2px, rgba(255,255,255,0.3) 4px)',
                    }}
                    role="img"
                    aria-label={`${t.interest}: ${formatCurrency(result.totalInterest, locale, currency)} (${formatPercentage(interestPercentage, 1)})`}
                  />
                  {/* Fees - dotted pattern */}
                  {feesPercentage > 0 && (
                    <div
                      className="bg-chart-fees transition-all duration-300"
                      style={{
                        width: `${feesPercentage}%`,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
                        backgroundSize: '4px 4px',
                      }}
                      role="img"
                      aria-label={`${t.totalFees || 'Fees'}: ${formatCurrency(result.totalFees, locale, currency)} (${formatPercentage(feesPercentage, 1)})`}
                    />
                  )}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" aria-hidden="true" />
                    <span>
                      {t.principal}: {formatCurrency(loanAmount, locale, currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full bg-chart-interest"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255,255,255,0.4) 1px, rgba(255,255,255,0.4) 2px)',
                      }}
                      aria-hidden="true"
                    />
                    <span>
                      {t.interest}: {formatCurrency(result.totalInterest, locale, currency)}
                    </span>
                  </div>
                  {result.totalFees > 0 && (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full bg-chart-fees"
                        style={{
                          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
                          backgroundSize: '3px 3px',
                        }}
                        aria-hidden="true"
                      />
                      <span>
                        {t.totalFees || 'Fees'}: {formatCurrency(result.totalFees, locale, currency)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Amortization Schedule Toggle */}
      {result && (
        <div>
          <Button
            variant="outline"
            onClick={() => {
              setShowAmortization(!showAmortization)
              setCurrentPage(1)
            }}
            className="w-full"
            aria-expanded={showAmortization}
            aria-controls="amortization-schedule"
          >
            {showAmortization ? t.hideSchedule : t.showSchedule}
          </Button>
        </div>
      )}

      {/* Amortization Schedule */}
      {result && showAmortization && (
        <Card id="amortization-schedule">
          <CardContent className="p-0">
            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label={t.amortizationSchedule}>
                <caption className="sr-only">{t.amortizationSchedule}</caption>
                <thead className="bg-muted">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left font-medium">{t.period}</th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">{t.payment}</th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">{t.principal}</th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">{t.interest}</th>
                    <th scope="col" className="px-6 py-3 text-right font-medium">{t.balance}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paginatedSchedule.map((row: AmortizationRow) => (
                    <tr key={row.period} className="hover:bg-muted/50 min-h-[44px]">
                      <td className="px-6 py-3">{row.period}</td>
                      <td className="px-6 py-3 text-right">
                        {formatCurrency(row.payment, locale, currency)}
                      </td>
                      <td className="px-6 py-3 text-right">
                        {formatCurrency(row.principal, locale, currency)}
                      </td>
                      <td className="px-6 py-3 text-right text-chart-interest">
                        {formatCurrency(row.interest, locale, currency)}
                      </td>
                      <td className="px-6 py-3 text-right font-medium">
                        {formatCurrency(row.balance, locale, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="sm:hidden divide-y">
              {paginatedSchedule.map((row: AmortizationRow) => (
                <div key={row.period} className="p-6 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t.period} {row.period}</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(row.payment, locale, currency)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs">{t.principal}</div>
                      <div>{formatCurrency(row.principal, locale, currency)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">{t.interest}</div>
                      <div className="text-chart-interest">{formatCurrency(row.interest, locale, currency)}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs">{t.balance}</div>
                      <div className="font-medium">{formatCurrency(row.balance, locale, currency)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {t.page || 'Page'} {currentPage} {t.of || 'of'} {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
