import { describe, it, expect } from 'vitest'
import {
  parseDataInput,
  parseWeightsInput,
  validateCentralTendencyInputs,
  detectEdgeCases,
  validateForCalculationType,
  roundToDecimals,
  sanitizeData,
  centralTendencyInputSchema,
} from './validation'

describe('Mean/Median/Mode Validation', () => {
  describe('roundToDecimals', () => {
    it('rounds to 4 decimal places by default', () => {
      expect(roundToDecimals(3.14159265)).toBe(3.1416)
      expect(roundToDecimals(2.71828182)).toBe(2.7183)
    })

    it('rounds to specified decimal places', () => {
      expect(roundToDecimals(3.14159, 2)).toBe(3.14)
      expect(roundToDecimals(3.14159, 0)).toBe(3)
      expect(roundToDecimals(3.14159, 6)).toBe(3.141590)
    })

    it('handles negative numbers', () => {
      expect(roundToDecimals(-3.14159, 2)).toBe(-3.14)
      expect(roundToDecimals(-2.71828, 3)).toBe(-2.718)
    })
  })

  describe('parseDataInput', () => {
    describe('comma-separated format', () => {
      it('parses comma-separated numbers', () => {
        const result = parseDataInput('1, 2, 3, 4, 5')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4, 5])
      })

      it('handles no spaces after commas', () => {
        const result = parseDataInput('1,2,3,4,5')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4, 5])
      })

      it('handles decimals with comma separator', () => {
        const result = parseDataInput('1.5, 2.3, 3.7, 4.2')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1.5, 2.3, 3.7, 4.2])
      })
    })

    describe('space-separated format', () => {
      it('parses space-separated numbers', () => {
        const result = parseDataInput('1 2 3 4 5')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4, 5])
      })

      it('handles multiple spaces', () => {
        const result = parseDataInput('1  2   3    4')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4])
      })
    })

    describe('newline-separated format', () => {
      it('parses newline-separated numbers', () => {
        const result = parseDataInput('1\n2\n3\n4\n5')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4, 5])
      })

      it('handles mixed newlines and spaces', () => {
        const result = parseDataInput('1\n2\n\n3\n4')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4])
      })
    })

    describe('semicolon-separated format', () => {
      it('parses semicolon-separated numbers', () => {
        const result = parseDataInput('1; 2; 3; 4; 5')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4, 5])
      })
    })

    describe('European format (comma as decimal)', () => {
      it('parses European format with semicolon separator', () => {
        const result = parseDataInput('1,5; 2,3; 3,7', 'de-DE')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1.5, 2.3, 3.7])
      })

      it('parses European format with space separator', () => {
        const result = parseDataInput('1,5 2,3 3,7', 'de-DE')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1.5, 2.3, 3.7])
      })
    })

    describe('negative numbers', () => {
      it('handles negative numbers', () => {
        const result = parseDataInput('-1, -2, -3, 4, 5')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([-1, -2, -3, 4, 5])
      })

      it('handles negative decimals', () => {
        const result = parseDataInput('-1.5, -2.3, 3.7')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([-1.5, -2.3, 3.7])
      })
    })

    describe('edge cases', () => {
      it('returns error for empty input', () => {
        const result = parseDataInput('')
        expect(result.success).toBe(false)
        expect(result.errors).toContain('Please enter at least one number')
      })

      it('returns error for whitespace-only input', () => {
        const result = parseDataInput('   \n  \t  ')
        expect(result.success).toBe(false)
        expect(result.errors).toContain('Please enter at least one number')
      })

      it('handles single value', () => {
        const result = parseDataInput('42')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([42])
        expect(result.warnings).toContain(
          'Only one value provided. All measures of central tendency will equal this value.'
        )
      })

      it('handles zero values', () => {
        const result = parseDataInput('0, 1, 2, 3')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([0, 1, 2, 3])
      })

      it('ignores invalid values and warns', () => {
        const result = parseDataInput('1, 2, abc, 3, xyz, 4')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1, 2, 3, 4])
        expect(result.warnings).toBeDefined()
        expect(result.warnings![0]).toContain('Ignored 2 invalid value')
      })

      it('returns error when all values are invalid', () => {
        const result = parseDataInput('abc, def, xyz')
        expect(result.success).toBe(false)
        expect(result.errors![0]).toContain('No valid numbers found')
      })

      it('handles very large numbers', () => {
        const result = parseDataInput('1000000, 2000000, 3000000')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([1000000, 2000000, 3000000])
      })

      it('handles very small decimals', () => {
        const result = parseDataInput('0.0001, 0.0002, 0.0003')
        expect(result.success).toBe(true)
        expect(result.data).toEqual([0.0001, 0.0002, 0.0003])
      })
    })
  })

  describe('parseWeightsInput', () => {
    it('parses weights in same format as data', () => {
      const result = parseWeightsInput('1, 2, 3, 4')
      expect(result.success).toBe(true)
      expect(result.data).toEqual([1, 2, 3, 4])
    })

    it('returns empty array for empty input', () => {
      const result = parseWeightsInput('')
      expect(result.success).toBe(true)
      expect(result.data).toEqual([])
    })

    it('handles decimal weights', () => {
      const result = parseWeightsInput('0.5, 1.0, 1.5, 2.0')
      expect(result.success).toBe(true)
      expect(result.data).toEqual([0.5, 1.0, 1.5, 2.0])
    })
  })

  describe('validateCentralTendencyInputs', () => {
    it('validates correct inputs', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3, 4, 5',
        precision: 4,
      })

      expect(result.isValid).toBe(true)
      expect(result.errors).toEqual({})
      expect(result.parsedData).toEqual({
        data: [1, 2, 3, 4, 5],
        weights: undefined,
        precision: 4,
      })
    })

    it('validates inputs with weights', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
        weights: '0.5, 1.0, 1.5',
        precision: 2,
      })

      expect(result.isValid).toBe(true)
      expect(result.parsedData?.weights).toEqual([0.5, 1.0, 1.5])
    })

    it('returns error for empty data', () => {
      const result = validateCentralTendencyInputs({
        data: '',
        precision: 4,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.data).toBeDefined()
    })

    it('returns error for mismatched weights count', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
        weights: '0.5, 1.0',
        precision: 4,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.weights).toContain('must match')
    })

    it('returns error for negative weights', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
        weights: '0.5, -1.0, 1.5',
        precision: 4,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.weights).toContain('cannot be negative')
    })

    it('returns error for all-zero weights', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
        weights: '0, 0, 0',
        precision: 4,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.weights).toContain('greater than zero')
    })

    it('returns error for invalid precision', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
        precision: -1,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.precision).toBeDefined()
    })

    it('returns error for precision > 10', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
        precision: 15,
      })

      expect(result.isValid).toBe(false)
      expect(result.errors.precision).toBeDefined()
    })

    it('uses default precision of 4', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, 3',
      })

      expect(result.isValid).toBe(true)
      expect(result.parsedData?.precision).toBe(4)
    })

    it('includes warnings from data parsing', () => {
      const result = validateCentralTendencyInputs({
        data: '1, 2, abc, 3',
        precision: 4,
      })

      expect(result.isValid).toBe(true)
      expect(result.warnings).toBeDefined()
      expect(result.warnings![0]).toContain('Ignored')
    })

    it('handles locale-specific number parsing', () => {
      const result = validateCentralTendencyInputs({
        data: '1,5; 2,3; 3,7',
        locale: 'de-DE',
        precision: 2,
      })

      expect(result.isValid).toBe(true)
      expect(result.parsedData?.data).toEqual([1.5, 2.3, 3.7])
    })
  })

  describe('detectEdgeCases', () => {
    it('warns about negative values for geometric mean', () => {
      const warnings = detectEdgeCases([1, -2, 3, 4])
      expect(warnings.geometricMean).toContain('not defined for negative')
    })

    it('warns about zero for geometric and harmonic mean', () => {
      const warnings = detectEdgeCases([1, 0, 3, 4])
      expect(warnings.geometricMean).toContain('undefined when the dataset contains zero')
      expect(warnings.harmonicMean).toContain('undefined when the dataset contains zero')
    })

    it('warns about non-positive values for harmonic mean', () => {
      const warnings = detectEdgeCases([1, -2, 3, 4])
      expect(warnings.harmonicMean).toContain('not defined for non-positive')
    })

    it('warns when all values are unique (no mode)', () => {
      const warnings = detectEdgeCases([1, 2, 3, 4, 5])
      expect(warnings.mode).toContain('No mode exists')
    })

    it('returns no warnings for valid positive data with duplicates', () => {
      const warnings = detectEdgeCases([1, 2, 2, 3, 4])
      expect(warnings.geometricMean).toBeUndefined()
      expect(warnings.harmonicMean).toBeUndefined()
      expect(warnings.mode).toBeUndefined()
    })

    it('handles all same values', () => {
      const warnings = detectEdgeCases([5, 5, 5, 5])
      expect(warnings.mode).toBeUndefined() // Mode is valid (5)
    })
  })

  describe('validateForCalculationType', () => {
    describe('arithmetic mean', () => {
      it('accepts any numbers', () => {
        const result = validateForCalculationType(
          [-5, 0, 5, 10],
          'arithmetic'
        )
        expect(result.isValid).toBe(true)
      })
    })

    describe('geometric mean', () => {
      it('rejects datasets with zero', () => {
        const result = validateForCalculationType([1, 0, 3], 'geometric')
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('zero values')
      })

      it('rejects datasets with negative numbers', () => {
        const result = validateForCalculationType([1, -2, 3], 'geometric')
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('negative numbers')
      })

      it('accepts all positive numbers', () => {
        const result = validateForCalculationType([1, 2, 3, 4], 'geometric')
        expect(result.isValid).toBe(true)
      })
    })

    describe('harmonic mean', () => {
      it('rejects datasets with zero', () => {
        const result = validateForCalculationType([1, 0, 3], 'harmonic')
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('positive')
      })

      it('rejects datasets with negative numbers', () => {
        const result = validateForCalculationType([1, -2, 3], 'harmonic')
        expect(result.isValid).toBe(false)
        expect(result.error).toContain('positive')
      })

      it('accepts all positive numbers', () => {
        const result = validateForCalculationType([1, 2, 3, 4], 'harmonic')
        expect(result.isValid).toBe(true)
      })
    })
  })

  describe('sanitizeData', () => {
    it('removes NaN values', () => {
      const result = sanitizeData([1, NaN, 3, 4])
      expect(result).toEqual([1, 3, 4])
    })

    it('removes Infinity', () => {
      const result = sanitizeData([1, Infinity, 3, -Infinity])
      expect(result).toEqual([1, 3])
    })

    it('keeps valid numbers including zero', () => {
      const result = sanitizeData([0, -1, 2, 3.5])
      expect(result).toEqual([0, -1, 2, 3.5])
    })

    it('handles empty array', () => {
      const result = sanitizeData([])
      expect(result).toEqual([])
    })
  })

  describe('centralTendencyInputSchema (Zod)', () => {
    it('validates correct schema', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '1, 2, 3, 4',
        precision: 4,
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data).toEqual([1, 2, 3, 4])
        expect(result.data.precision).toBe(4)
      }
    })

    it('validates with weights', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '1, 2, 3',
        weights: '0.5, 1.0, 1.5',
        precision: 2,
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.weights).toEqual([0.5, 1.0, 1.5])
      }
    })

    it('uses default precision', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '1, 2, 3',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.precision).toBe(4)
      }
    })

    it('rejects empty data', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '',
        precision: 4,
      })

      expect(result.success).toBe(false)
    })

    it('rejects mismatched weights', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '1, 2, 3',
        weights: '0.5, 1.0',
        precision: 4,
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('must match')
      }
    })

    it('rejects negative weights', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '1, 2, 3',
        weights: '0.5, -1.0, 1.5',
        precision: 4,
      })

      expect(result.success).toBe(false)
    })

    it('rejects invalid precision', () => {
      const result = centralTendencyInputSchema.safeParse({
        data: '1, 2, 3',
        precision: 15,
      })

      expect(result.success).toBe(false)
    })
  })
})
