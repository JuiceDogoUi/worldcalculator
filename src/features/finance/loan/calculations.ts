import type { LoanInputs, LoanResult, AmortizationRow, PaymentFrequency, LoanValidation, RateInputType } from './types'

/**
 * Round to cents to avoid floating point precision issues
 */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Get periods per year based on payment frequency
 * Uses accurate values: 365/7 for weekly, 365/14 for biweekly
 */
function getPeriodsPerYear(frequency: PaymentFrequency): number {
  switch (frequency) {
    case 'weekly':
      return 365 / 7 // 52.142857...
    case 'biweekly':
      return 365 / 14 // 26.071428...
    default:
      return 12
  }
}

/**
 * Convert APR (Effective Annual Rate / TAE) to Nominal Rate (TIN/TAN)
 * Formula: Nominal = periodsPerYear * ((1 + APR/100)^(1/periodsPerYear) - 1) * 100
 */
export function convertAprToNominal(
  apr: number,
  periodsPerYear: number = 12
): number {
  if (apr <= 0 || periodsPerYear <= 0) return 0
  const aprDecimal = apr / 100
  const nominalDecimal = periodsPerYear * (Math.pow(1 + aprDecimal, 1 / periodsPerYear) - 1)
  return roundToCents(nominalDecimal * 100)
}

/**
 * Convert Nominal Rate (TIN/TAN) to APR (Effective Annual Rate / TAE)
 * Formula: APR = ((1 + Nominal/periodsPerYear)^periodsPerYear - 1) * 100
 */
export function convertNominalToApr(
  nominal: number,
  periodsPerYear: number = 12
): number {
  if (nominal <= 0 || periodsPerYear <= 0) return 0
  const periodicRate = nominal / 100 / periodsPerYear
  const aprDecimal = Math.pow(1 + periodicRate, periodsPerYear) - 1
  return roundToCents(aprDecimal * 100)
}

/**
 * Get the nominal rate to use for calculations based on rate input type
 */
export function getNominalRateFromInput(
  rateType: RateInputType,
  nominalInput: number,
  aprInput: number,
  periodsPerYear: number = 12
): number {
  switch (rateType) {
    case 'apr':
      return convertAprToNominal(aprInput, periodsPerYear)
    case 'both':
      // When both are provided, use the nominal rate for calculations
      return nominalInput
    case 'unknown':
      // Default to a typical rate for estimation
      return 7.0
    case 'nominal':
    default:
      return nominalInput
  }
}

/**
 * Validate loan inputs
 */
export function validateLoanInputs(inputs: Partial<LoanInputs>): LoanValidation {
  const errors: LoanValidation['errors'] = []

  if (!inputs.loanAmount || inputs.loanAmount <= 0) {
    errors.push({ field: 'loanAmount', message: 'Loan amount must be greater than zero' })
  } else if (inputs.loanAmount > 100000000) {
    errors.push({ field: 'loanAmount', message: 'Loan amount exceeds maximum (100,000,000)' })
  }

  if (inputs.interestRate === undefined || inputs.interestRate < 0) {
    errors.push({ field: 'interestRate', message: 'Interest rate cannot be negative' })
  } else if (inputs.interestRate > 100) {
    errors.push({ field: 'interestRate', message: 'Interest rate exceeds 100%' })
  }

  if (!inputs.loanTerm || inputs.loanTerm <= 0) {
    errors.push({ field: 'loanTerm', message: 'Loan term must be greater than zero' })
  } else if (inputs.loanTerm > 600) {
    errors.push({ field: 'loanTerm', message: 'Loan term exceeds maximum (50 years)' })
  }

  if (inputs.originationFee !== undefined && (inputs.originationFee < 0 || inputs.originationFee > 20)) {
    errors.push({ field: 'originationFee', message: 'Origination fee must be between 0% and 20%' })
  }

  if (inputs.monthlyFee !== undefined && inputs.monthlyFee < 0) {
    errors.push({ field: 'monthlyFee', message: 'Monthly fee cannot be negative' })
  }

  if (inputs.insuranceCost !== undefined && inputs.insuranceCost < 0) {
    errors.push({ field: 'insuranceCost', message: 'Insurance cost cannot be negative' })
  }

  if (inputs.otherFees !== undefined && inputs.otherFees < 0) {
    errors.push({ field: 'otherFees', message: 'Other fees cannot be negative' })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate loan payment using the standard amortization formula
 * P = L * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 * P = Periodic payment
 * L = Loan amount (principal)
 * r = Periodic interest rate
 * n = Total number of payments
 */
export function calculatePeriodicPayment(
  principal: number,
  annualRate: number,
  totalPeriods: number,
  periodsPerYear: number
): number {
  if (principal <= 0 || totalPeriods <= 0) return 0

  // Handle 0% interest rate
  if (annualRate === 0) {
    return principal / totalPeriods
  }

  const periodicRate = annualRate / 100 / periodsPerYear
  const numerator = periodicRate * Math.pow(1 + periodicRate, totalPeriods)
  const denominator = Math.pow(1 + periodicRate, totalPeriods) - 1

  return principal * (numerator / denominator)
}

/**
 * Generate full amortization schedule based on payment frequency
 * Uses proper rounding to ensure final balance is exactly zero
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  totalPeriods: number,
  periodsPerYear: number,
  periodicPayment: number
): AmortizationRow[] {
  const schedule: AmortizationRow[] = []
  let balance = principal
  const periodicRate = annualRate / 100 / periodsPerYear

  for (let period = 1; period <= totalPeriods; period++) {
    // Round intermediate calculations to avoid cumulative errors
    const interestPayment = roundToCents(balance * periodicRate)
    let principalPayment = roundToCents(periodicPayment - interestPayment)

    // Handle final payment to ensure balance reaches exactly zero
    if (period === totalPeriods || balance - principalPayment < 0.01) {
      principalPayment = roundToCents(balance)
      balance = 0
    } else {
      balance = roundToCents(balance - principalPayment)
    }

    schedule.push({
      period,
      payment: roundToCents(interestPayment + principalPayment),
      principal: principalPayment,
      interest: interestPayment,
      balance,
    })

    // Safety check: stop if balance is zero
    if (balance <= 0) break
  }

  return schedule
}

/**
 * Calculate TAE/TAEG (Effective Annual Rate) including all fees
 * Uses the internal rate of return (IRR) method
 */
function calculateEffectiveRate(
  loanAmount: number,
  periodicPayment: number,
  totalPeriods: number,
  periodsPerYear: number,
  originationFeeAmount: number,
  monthlyFee: number,
  insuranceCost: number,
  otherFees: number
): number {
  // Net amount received by borrower
  const netAmount = loanAmount - originationFeeAmount - otherFees

  // Total periodic payment including monthly fees and insurance
  const totalPeriodicPayment = periodicPayment + (monthlyFee * 12 / periodsPerYear) + (insuranceCost * 12 / periodsPerYear)

  if (netAmount <= 0 || totalPeriodicPayment <= 0) return 0

  // Use Newton-Raphson method to find IRR
  let rate = 0.05 / periodsPerYear // Initial guess
  const maxIterations = 100
  const tolerance = 0.0000001

  for (let i = 0; i < maxIterations; i++) {
    let npv = -netAmount
    let npvDerivative = 0

    for (let t = 1; t <= totalPeriods; t++) {
      const discountFactor = Math.pow(1 + rate, t)
      npv += totalPeriodicPayment / discountFactor
      npvDerivative -= t * totalPeriodicPayment / Math.pow(1 + rate, t + 1)
    }

    const newRate = rate - npv / npvDerivative

    if (Math.abs(newRate - rate) < tolerance) {
      // Convert periodic rate to annual rate
      return (Math.pow(1 + newRate, periodsPerYear) - 1) * 100
    }

    rate = newRate
  }

  // Fallback to simple calculation if IRR doesn't converge
  return (Math.pow(1 + rate, periodsPerYear) - 1) * 100
}

/**
 * Calculate complete loan result with all details
 */
export function calculateLoan(inputs: LoanInputs): LoanResult {
  const {
    loanAmount,
    interestRate,
    loanTerm,
    paymentFrequency,
    originationFee = 0,
    monthlyFee = 0,
    insuranceCost = 0,
    otherFees = 0,
  } = inputs

  // Get periods per year based on frequency
  const periodsPerYear = getPeriodsPerYear(paymentFrequency)

  // Calculate total number of payments
  // loanTerm is in months, convert to the appropriate number of periods
  const totalPeriods = Math.round(loanTerm * (periodsPerYear / 12))

  // Calculate periodic payment using correct formula
  const periodicPayment = calculatePeriodicPayment(
    loanAmount,
    interestRate,
    totalPeriods,
    periodsPerYear
  )

  // Calculate fees
  const originationFeeAmount = (originationFee / 100) * loanAmount
  const totalMonthlyFees = monthlyFee * loanTerm
  const totalInsuranceCost = insuranceCost * loanTerm
  const totalFees = roundToCents(originationFeeAmount + totalMonthlyFees + totalInsuranceCost + otherFees)

  // Calculate totals
  const totalPayment = roundToCents(periodicPayment * totalPeriods + totalFees)
  const totalInterest = roundToCents(totalPayment - loanAmount - totalFees)

  // Calculate effective annual rate (TAE/TAEG) including all costs
  const effectiveRate = calculateEffectiveRate(
    loanAmount,
    periodicPayment,
    totalPeriods,
    periodsPerYear,
    originationFeeAmount,
    monthlyFee,
    insuranceCost,
    otherFees
  )

  // Generate amortization schedule based on selected frequency
  const amortizationSchedule = generateAmortizationSchedule(
    loanAmount,
    interestRate,
    totalPeriods,
    periodsPerYear,
    periodicPayment
  )

  return {
    periodicPayment: roundToCents(periodicPayment),
    paymentFrequency,
    periodsPerYear,
    totalPeriods,
    totalPayment,
    totalInterest,
    nominalRate: interestRate,
    effectiveRate: roundToCents(effectiveRate),
    totalFees,
    amortizationSchedule,
  }
}

/**
 * Legacy function for backward compatibility - calculates monthly payment
 */
export function calculateLoanPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  return calculatePeriodicPayment(principal, annualRate, termMonths, 12)
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Get currency symbol for a given locale and currency
 */
export function getCurrencySymbol(locale: string, currency: string): string {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).formatToParts(0)

  return parts.find(part => part.type === 'currency')?.value || currency
}

/**
 * Calculate payoff date based on payment frequency
 */
export function calculatePayoffDate(
  totalPeriods: number,
  periodsPerYear: number,
  startDate = new Date()
): Date {
  const payoffDate = new Date(startDate)
  const daysToAdd = Math.round((totalPeriods / periodsPerYear) * 365)
  payoffDate.setDate(payoffDate.getDate() + daysToAdd)
  return payoffDate
}
