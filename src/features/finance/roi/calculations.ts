import type { ROIInputs, ROIResult, ROIValidation, ROICategory } from './types'

/**
 * Round to cents to avoid floating point precision issues
 */
function roundToCents(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Round percentage to 2 decimal places
 */
function roundToPercentage(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Validate ROI inputs
 */
export function validateROIInputs(inputs: Partial<ROIInputs>): ROIValidation {
  const errors: ROIValidation['errors'] = []

  if (inputs.initialInvestment === undefined || inputs.initialInvestment === null) {
    errors.push({ field: 'initialInvestment', message: 'Initial investment is required' })
  } else if (inputs.initialInvestment === 0) {
    errors.push({ field: 'initialInvestment', message: 'Initial investment cannot be zero' })
  } else if (inputs.initialInvestment < 0) {
    errors.push({ field: 'initialInvestment', message: 'Initial investment cannot be negative' })
  } else if (inputs.initialInvestment > 1000000000000) {
    errors.push({ field: 'initialInvestment', message: 'Initial investment exceeds maximum (1 trillion)' })
  }

  if (inputs.finalValue === undefined || inputs.finalValue === null) {
    errors.push({ field: 'finalValue', message: 'Final value is required' })
  } else if (inputs.finalValue < 0) {
    errors.push({ field: 'finalValue', message: 'Final value cannot be negative' })
  } else if (inputs.finalValue > 1000000000000) {
    errors.push({ field: 'finalValue', message: 'Final value exceeds maximum (1 trillion)' })
  }

  if (inputs.investmentPeriodYears !== undefined && inputs.investmentPeriodYears !== null) {
    if (inputs.investmentPeriodYears < 0) {
      errors.push({ field: 'investmentPeriodYears', message: 'Investment period cannot be negative' })
    } else if (inputs.investmentPeriodYears > 100) {
      errors.push({ field: 'investmentPeriodYears', message: 'Investment period exceeds maximum (100 years)' })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate basic ROI percentage
 * Formula: ((Final Value - Initial Investment) / Initial Investment) × 100
 */
export function calculateBasicROI(
  initialInvestment: number,
  finalValue: number
): number {
  if (initialInvestment === 0) return 0
  return ((finalValue - initialInvestment) / initialInvestment) * 100
}

/**
 * Calculate annualized ROI (CAGR - Compound Annual Growth Rate)
 * Formula: (((Final Value / Initial Investment) ^ (1 / Years)) - 1) × 100
 */
export function calculateAnnualizedROI(
  initialInvestment: number,
  finalValue: number,
  years: number
): number {
  if (initialInvestment === 0 || years === 0) return 0

  // Handle edge case where final value is 0 or negative
  if (finalValue <= 0) {
    // Return -100% if complete loss
    if (finalValue === 0) return -100
    // For negative final values, calculate the loss percentage
    return ((finalValue - initialInvestment) / initialInvestment) * 100 / years
  }

  // For periods less than 1 year, use simple annualized calculation
  if (years < 1) {
    const roi = calculateBasicROI(initialInvestment, finalValue)
    // Annualize by extrapolating to full year
    return roi / years
  }

  // Standard CAGR formula
  const annualizedReturn = Math.pow(finalValue / initialInvestment, 1 / years) - 1
  return annualizedReturn * 100
}

/**
 * Categorize ROI performance
 */
export function categorizeROI(roi: number): ROICategory {
  if (roi < -50) return 'significant-loss'
  if (roi < -5) return 'loss'
  if (roi >= -5 && roi < 5) return 'break-even'
  if (roi >= 5 && roi < 15) return 'low'
  if (roi >= 15 && roi < 50) return 'moderate'
  if (roi >= 50 && roi < 100) return 'high'
  return 'exceptional'
}

/**
 * Calculate complete ROI result with all metrics
 */
export function calculateROI(inputs: ROIInputs): ROIResult {
  const {
    initialInvestment,
    finalValue,
    investmentPeriodYears,
  } = inputs

  // Calculate basic ROI
  const roi = roundToPercentage(calculateBasicROI(initialInvestment, finalValue))

  // Calculate profit/loss
  const profitLoss = roundToCents(finalValue - initialInvestment)

  // Calculate annualized ROI if period provided and > 0
  const annualizedROI = investmentPeriodYears && investmentPeriodYears > 0
    ? roundToPercentage(calculateAnnualizedROI(initialInvestment, finalValue, investmentPeriodYears))
    : undefined

  // Categorize ROI performance
  const roiCategory = categorizeROI(roi)

  return {
    roi,
    profitLoss,
    annualizedROI,
    totalInvested: initialInvestment,
    roiCategory,
  }
}

/**
 * Calculate required final value for target ROI
 */
export function calculateTargetFinalValue(
  initialInvestment: number,
  targetROI: number
): number {
  return roundToCents(initialInvestment * (1 + targetROI / 100))
}

/**
 * Calculate required initial investment for target profit
 */
export function calculateRequiredInvestment(
  targetProfit: number,
  targetROI: number
): number {
  if (targetROI === 0) return 0
  return roundToCents((targetProfit / targetROI) * 100)
}
