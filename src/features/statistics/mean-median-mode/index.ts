/**
 * Mean/Median/Mode Calculator
 * Barrel exports for easy importing
 */

// Components
export { MeanMedianModeCalculator } from './MeanMedianModeCalculator'
export { MeanMedianModeSEOContent } from './MeanMedianModeSEOContent'

// Calculations
export {
  parseDataInput,
  validateCentralTendencyInputs,
  calculateArithmeticMean,
  calculateGeometricMean,
  calculateHarmonicMean,
  calculateWeightedMean,
  calculateMedian,
  calculateMode,
  calculateQuartiles,
  calculateVarianceAndSD,
  generateMeanSteps,
  generateMedianSteps,
  generateModeSteps,
  calculateCentralTendency,
} from './calculations'

// Types
export type {
  MeanType,
  ModeType,
  CentralTendencyInputs,
  ParsedData,
  FrequencyItem,
  ModeResult,
  MedianDetails,
  MeanDetails,
  QuartileResult,
  CalculationStep,
  CentralTendencyResult,
  CentralTendencyValidation,
  CalcTranslations,
} from './types'

// Validation (Zod schemas)
export {
  parseWeightsInput,
  detectEdgeCases,
  validateForCalculationType,
  roundToDecimals,
  sanitizeData,
  dataInputSchema,
  weightsInputSchema,
  precisionSchema,
  centralTendencyInputSchema,
  type ParseDataResult,
  type ValidationErrors,
  type ValidationResult,
  type EdgeCaseWarnings,
  type CentralTendencyInputs as CentralTendencyValidationInputs,
} from './validation'
