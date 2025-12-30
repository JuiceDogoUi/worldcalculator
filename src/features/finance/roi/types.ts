/**
 * ROI Calculator Types
 * Provides type definitions for Return on Investment calculations
 */

/**
 * ROI calculation inputs
 */
export interface ROIInputs {
  initialInvestment: number
  finalValue: number
  investmentPeriodYears?: number
}

/**
 * ROI calculation results
 */
export interface ROIResult {
  roi: number // ROI percentage
  profitLoss: number // Absolute profit or loss amount
  annualizedROI?: number // Annualized return (if period provided)
  totalInvested: number // Total amount invested
  roiCategory: ROICategory
}

/**
 * ROI performance category
 */
export type ROICategory =
  | 'significant-loss'
  | 'loss'
  | 'break-even'
  | 'low'
  | 'moderate'
  | 'high'
  | 'exceptional'

/**
 * Validation result for ROI inputs
 */
export interface ROIValidation {
  valid: boolean
  errors: {
    field: string
    message: string
  }[]
}
