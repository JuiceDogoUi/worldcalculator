/**
 * Mortgage Calculator Types
 * Comprehensive type definitions for mortgage calculations including
 * home price, down payment, loan details, taxes, insurance, and PMI
 */

/**
 * Payment frequency options for mortgage payments
 */
export type PaymentFrequency = 'monthly' | 'biweekly' | 'weekly'

/**
 * Down payment input type - percentage or dollar amount
 */
export type DownPaymentType = 'percentage' | 'amount'

/**
 * Mortgage input parameters
 */
export interface MortgageInputs {
  // Property details
  homePrice: number // Total purchase price
  downPaymentType: DownPaymentType
  downPaymentPercentage: number // If using percentage (e.g., 20 for 20%)
  downPaymentAmount: number // If using dollar amount

  // Loan details
  interestRate: number // Annual nominal interest rate (percentage)
  loanTerm: number // In months (typically 180, 240, 360)
  paymentFrequency: PaymentFrequency

  // Property costs (optional)
  propertyTaxAnnual?: number // Annual property tax
  homeInsuranceAnnual?: number // Annual home insurance premium
  hoaFees?: number // Monthly HOA/condo fees

  // PMI (Private Mortgage Insurance)
  pmiRate?: number // Annual PMI rate as percentage of loan amount
  pmiEnabled?: boolean // Auto-calculate based on down payment < 20%

  // Closing costs
  closingCosts?: number // One-time closing costs
  originationFee?: number // As percentage of loan amount
  otherFees?: number // Other one-time fees
}

/**
 * Breakdown of monthly mortgage payment components
 */
export interface MonthlyPaymentBreakdown {
  principal: number // Principal portion of mortgage payment
  interest: number // Interest portion of mortgage payment
  propertyTax: number // Monthly property tax
  homeInsurance: number // Monthly insurance premium
  pmi: number // Monthly PMI (if applicable)
  hoaFees: number // Monthly HOA fees
  totalMonthly: number // Total monthly payment (PITI + PMI + HOA)
}

/**
 * Amortization schedule entry for a single payment period
 */
export interface AmortizationScheduleEntry {
  period: number // Payment number
  payment: number // Total payment (principal + interest only)
  principal: number // Principal paid this period
  interest: number // Interest paid this period
  balance: number // Remaining loan balance
  cumulativePrincipal: number // Total principal paid to date
  cumulativeInterest: number // Total interest paid to date
  pmi?: number // PMI amount (if applicable this period)
}

/**
 * Complete mortgage calculation results
 */
export interface MortgageResult {
  // Loan amounts
  homePrice: number
  downPaymentAmount: number
  downPaymentPercentage: number
  loanAmount: number

  // Monthly breakdown
  monthlyPayment: MonthlyPaymentBreakdown

  // Totals
  totalMonthlyPayment: number // Shortcut to monthlyPayment.totalMonthly
  totalPayment: number // Sum of all payments over loan term
  totalInterest: number // Total interest paid
  totalPrincipal: number // Should equal loanAmount
  totalPmi: number // Total PMI paid over life of loan
  totalClosingCosts: number // All upfront costs
  totalCostOfOwnership: number // Everything: home price + interest + PMI + taxes + insurance + fees

  // Payment details
  paymentFrequency: PaymentFrequency
  periodsPerYear: number
  totalPeriods: number
  loanTermYears: number

  // Rates
  nominalRate: number // Input interest rate
  effectiveRate: number // APR including all costs

  // PMI details
  pmiMonthly: number
  pmiRequired: boolean // True if down payment < 20%
  pmiRemovalPeriod?: number // Period when PMI can be removed (80% LTV)

  // Amortization
  amortizationSchedule: AmortizationScheduleEntry[]
}

/**
 * Validation errors for mortgage inputs
 */
export interface MortgageValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
