export type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly'

/**
 * Rate input type - what type of interest rate the user knows
 */
export type RateInputType = 'nominal' | 'apr' | 'both' | 'unknown'

export interface LoanInputs {
  loanAmount: number
  interestRate: number // Annual nominal interest rate (TAN) as percentage
  loanTerm: number // In months
  paymentFrequency: PaymentFrequency
  // Optional fee/cost fields for TAE/TAEG calculation
  originationFee?: number // As percentage of loan amount
  monthlyFee?: number // Fixed monthly account fee
  insuranceCost?: number // Monthly insurance premium
  otherFees?: number // One-time additional fees
}

export interface AmortizationRow {
  period: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResult {
  periodicPayment: number
  paymentFrequency: PaymentFrequency
  periodsPerYear: number
  totalPeriods: number
  totalPayment: number
  totalInterest: number
  nominalRate: number // TAN - input rate
  effectiveRate: number // TAE/TAEG - includes all costs
  totalFees: number // Sum of all fees
  amortizationSchedule: AmortizationRow[]
}

export interface LoanSummary {
  principal: number
  totalInterest: number
  totalPayment: number
  payoffDate: Date
}

/**
 * Validation result for loan inputs
 */
export interface LoanValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
