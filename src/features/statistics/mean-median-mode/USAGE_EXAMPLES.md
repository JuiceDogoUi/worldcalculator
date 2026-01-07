# Mean/Median/Mode Calculator - Usage Examples

## Basic Import

```typescript
import {
  validateCentralTendencyInputs,
  detectEdgeCases,
  validateForCalculationType,
  type ValidationResult,
  type EdgeCaseWarnings,
} from '@/features/math/mean-median-mode/validation'
```

## Example 1: Basic Validation

```typescript
import { validateCentralTendencyInputs } from '@/features/math/mean-median-mode/validation'

function handleFormSubmit(formData: FormData) {
  const validation = validateCentralTendencyInputs({
    data: formData.get('data') as string,
    precision: 4,
    locale: navigator.language || 'en-US'
  })

  if (!validation.isValid) {
    // Show errors to user
    setErrors({
      data: validation.errors.data,
      weights: validation.errors.weights,
      precision: validation.errors.precision,
    })
    return
  }

  // Proceed with calculation using validated data
  const { data, precision } = validation.parsedData!
  const results = calculateCentralTendency(data, precision)

  return results
}
```

## Example 2: React Component with Validation

```typescript
'use client'

import { useState } from 'react'
import { validateCentralTendencyInputs, type ValidationResult } from '@/features/math/mean-median-mode/validation'

export default function MeanCalculatorForm() {
  const [dataInput, setDataInput] = useState('')
  const [weightsInput, setWeightsInput] = useState('')
  const [precision, setPrecision] = useState(4)
  const [validation, setValidation] = useState<ValidationResult | null>(null)

  const handleValidate = () => {
    const result = validateCentralTendencyInputs({
      data: dataInput,
      weights: weightsInput,
      precision,
      locale: navigator.language || 'en-US'
    })

    setValidation(result)

    if (result.isValid) {
      // Calculate and display results
      const { data, weights } = result.parsedData!
      calculateAndDisplayResults(data, weights, precision)
    }
  }

  return (
    <form>
      {/* Data Input */}
      <div>
        <label htmlFor="data">Enter Data:</label>
        <textarea
          id="data"
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          placeholder="Enter numbers separated by commas, spaces, or line breaks"
        />
        {validation?.errors.data && (
          <p className="error">{validation.errors.data}</p>
        )}
      </div>

      {/* Weights Input (Optional) */}
      <div>
        <label htmlFor="weights">Weights (Optional):</label>
        <textarea
          id="weights"
          value={weightsInput}
          onChange={(e) => setWeightsInput(e.target.value)}
          placeholder="Enter weights (must match number of data values)"
        />
        {validation?.errors.weights && (
          <p className="error">{validation.errors.weights}</p>
        )}
      </div>

      {/* Precision */}
      <div>
        <label htmlFor="precision">Decimal Precision:</label>
        <input
          type="number"
          id="precision"
          value={precision}
          onChange={(e) => setPrecision(Number(e.target.value))}
          min={0}
          max={10}
        />
        {validation?.errors.precision && (
          <p className="error">{validation.errors.precision}</p>
        )}
      </div>

      {/* Warnings */}
      {validation?.warnings && validation.warnings.length > 0 && (
        <div className="warnings">
          {validation.warnings.map((warning, i) => (
            <p key={i} className="warning">{warning}</p>
          ))}
        </div>
      )}

      <button type="button" onClick={handleValidate}>
        Calculate
      </button>
    </form>
  )
}
```

## Example 3: Edge Case Detection with Tooltips

```typescript
import { detectEdgeCases, type EdgeCaseWarnings } from '@/features/math/mean-median-mode/validation'

function CalculatorResults({ data }: { data: number[] }) {
  const edgeWarnings = detectEdgeCases(data)

  return (
    <div className="results">
      {/* Arithmetic Mean - Always valid */}
      <div className="result-item">
        <span>Arithmetic Mean:</span>
        <span>{calculateArithmeticMean(data)}</span>
      </div>

      {/* Geometric Mean - May have warning */}
      <div className="result-item">
        <span>
          Geometric Mean:
          {edgeWarnings.geometricMean && (
            <Tooltip content={edgeWarnings.geometricMean}>
              <WarningIcon />
            </Tooltip>
          )}
        </span>
        <span>
          {edgeWarnings.geometricMean
            ? 'N/A'
            : calculateGeometricMean(data)
          }
        </span>
      </div>

      {/* Harmonic Mean - May have warning */}
      <div className="result-item">
        <span>
          Harmonic Mean:
          {edgeWarnings.harmonicMean && (
            <Tooltip content={edgeWarnings.harmonicMean}>
              <WarningIcon />
            </Tooltip>
          )}
        </span>
        <span>
          {edgeWarnings.harmonicMean
            ? 'N/A'
            : calculateHarmonicMean(data)
          }
        </span>
      </div>

      {/* Mode - May have no mode */}
      <div className="result-item">
        <span>
          Mode:
          {edgeWarnings.mode && (
            <Tooltip content={edgeWarnings.mode}>
              <InfoIcon />
            </Tooltip>
          )}
        </span>
        <span>
          {edgeWarnings.mode
            ? 'No mode'
            : calculateMode(data).join(', ')
          }
        </span>
      </div>
    </div>
  )
}
```

## Example 4: Pre-Flight Validation by Calculation Type

```typescript
import { validateForCalculationType } from '@/features/math/mean-median-mode/validation'

function calculateSpecificMean(data: number[], type: 'arithmetic' | 'geometric' | 'harmonic') {
  // Validate data is suitable for this calculation type
  const validation = validateForCalculationType(data, type)

  if (!validation.isValid) {
    throw new Error(validation.error)
  }

  switch (type) {
    case 'arithmetic':
      return data.reduce((sum, val) => sum + val, 0) / data.length

    case 'geometric':
      const product = data.reduce((prod, val) => prod * val, 1)
      return Math.pow(product, 1 / data.length)

    case 'harmonic':
      const sumReciprocals = data.reduce((sum, val) => sum + 1 / val, 0)
      return data.length / sumReciprocals

    default:
      throw new Error(`Unknown mean type: ${type}`)
  }
}

// Usage
try {
  const mean = calculateSpecificMean([1, 2, 3, 4], 'geometric')
  console.log('Geometric mean:', mean)
} catch (error) {
  console.error('Cannot calculate:', error.message)
}
```

## Example 5: Multi-Format Input Support

```typescript
import { parseDataInput } from '@/features/math/mean-median-mode/validation'

// Comma-separated
const result1 = parseDataInput("1, 2, 3, 4, 5")
console.log(result1.data) // [1, 2, 3, 4, 5]

// Space-separated
const result2 = parseDataInput("1 2 3 4 5")
console.log(result2.data) // [1, 2, 3, 4, 5]

// Newline-separated (from textarea)
const result3 = parseDataInput("1\n2\n3\n4\n5")
console.log(result3.data) // [1, 2, 3, 4, 5]

// European format (comma as decimal separator)
const result4 = parseDataInput("1,5; 2,3; 3,7", "de-DE")
console.log(result4.data) // [1.5, 2.3, 3.7]

// Mixed valid/invalid (with warning)
const result5 = parseDataInput("1, 2, abc, 3, xyz")
console.log(result5.data) // [1, 2, 3]
console.log(result5.warnings) // ["Ignored 2 invalid values: abc, xyz"]
```

## Example 6: Zod Schema Integration

```typescript
import { centralTendencyInputSchema } from '@/features/math/mean-median-mode/validation'
import { z } from 'zod'

// Server action or API route
export async function calculateMeanAction(formData: FormData) {
  // Parse and validate with Zod
  const parseResult = centralTendencyInputSchema.safeParse({
    data: formData.get('data'),
    weights: formData.get('weights') || undefined,
    precision: Number(formData.get('precision')) || 4,
  })

  if (!parseResult.success) {
    return {
      success: false,
      errors: parseResult.error.format(),
    }
  }

  // Use validated data
  const { data, weights, precision } = parseResult.data

  const results = {
    mean: calculateMean(data, weights),
    median: calculateMedian(data),
    mode: calculateMode(data),
  }

  return {
    success: true,
    results,
  }
}
```

## Example 7: Real-Time Validation (debounced)

```typescript
import { useState, useEffect } from 'react'
import { validateCentralTendencyInputs } from '@/features/math/mean-median-mode/validation'
import { debounce } from 'lodash'

function useRealtimeValidation(dataInput: string, weightsInput: string, precision: number) {
  const [validation, setValidation] = useState<ValidationResult | null>(null)

  useEffect(() => {
    // Debounce validation to avoid running on every keystroke
    const debouncedValidate = debounce(() => {
      if (dataInput.length === 0) {
        setValidation(null)
        return
      }

      const result = validateCentralTendencyInputs({
        data: dataInput,
        weights: weightsInput,
        precision,
      })

      setValidation(result)
    }, 500)

    debouncedValidate()

    return () => {
      debouncedValidate.cancel()
    }
  }, [dataInput, weightsInput, precision])

  return validation
}

// Usage in component
function MeanCalculator() {
  const [dataInput, setDataInput] = useState('')
  const [weightsInput, setWeightsInput] = useState('')
  const [precision, setPrecision] = useState(4)

  const validation = useRealtimeValidation(dataInput, weightsInput, precision)

  return (
    <div>
      <textarea
        value={dataInput}
        onChange={(e) => setDataInput(e.target.value)}
        className={validation?.errors.data ? 'error' : ''}
      />

      {/* Show real-time validation feedback */}
      {validation?.errors.data && (
        <p className="error">{validation.errors.data}</p>
      )}

      {validation?.isValid && (
        <p className="success">✓ {validation.parsedData?.data.length} values ready</p>
      )}
    </div>
  )
}
```

## Example 8: Custom Error Display

```typescript
import { validateCentralTendencyInputs, type ValidationErrors } from '@/features/math/mean-median-mode/validation'

function ErrorDisplay({ errors }: { errors: ValidationErrors }) {
  const errorMessages = Object.entries(errors)
    .filter(([_, message]) => message !== undefined)
    .map(([field, message]) => ({ field, message }))

  if (errorMessages.length === 0) return null

  return (
    <div className="error-container">
      <h3>Please fix the following errors:</h3>
      <ul>
        {errorMessages.map(({ field, message }) => (
          <li key={field}>
            <strong>{field}:</strong> {message}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Usage
function Calculator() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const handleCalculate = (inputs: any) => {
    const validation = validateCentralTendencyInputs(inputs)

    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setErrors({})
    // Proceed with calculation
  }

  return (
    <div>
      <form>
        {/* Form fields */}
      </form>

      <ErrorDisplay errors={errors} />
    </div>
  )
}
```

## Example 9: Progressive Enhancement

```typescript
import { validateCentralTendencyInputs } from '@/features/math/mean-median-mode/validation'

function ProgressiveCalculator() {
  const [step, setStep] = useState<'input' | 'validate' | 'calculate' | 'results'>('input')
  const [data, setData] = useState<number[]>([])
  const [validation, setValidation] = useState<ValidationResult | null>(null)

  const handleNext = () => {
    if (step === 'input') {
      // Validate before proceeding
      const result = validateCentralTendencyInputs({
        data: dataInput,
        precision: 4
      })

      setValidation(result)

      if (result.isValid) {
        setData(result.parsedData!.data)
        setStep('validate')
      }
    } else if (step === 'validate') {
      // Check for edge cases
      const edgeWarnings = detectEdgeCases(data)

      if (Object.keys(edgeWarnings).length > 0) {
        // Show warnings and let user confirm
        showEdgeWarnings(edgeWarnings)
      }

      setStep('calculate')
    } else if (step === 'calculate') {
      // Perform calculations
      performCalculations()
      setStep('results')
    }
  }

  return (
    <div>
      {/* Step indicator */}
      <ProgressSteps current={step} />

      {/* Conditional content based on step */}
      {step === 'input' && <InputForm />}
      {step === 'validate' && <ValidationReview validation={validation!} />}
      {step === 'calculate' && <CalculationProgress />}
      {step === 'results' && <ResultsDisplay />}

      <button onClick={handleNext}>Next</button>
    </div>
  )
}
```

## Example 10: Batch Validation for Multiple Datasets

```typescript
import { validateCentralTendencyInputs } from '@/features/math/mean-median-mode/validation'

function batchValidate(datasets: string[]): BatchValidationResult {
  const results = datasets.map((data, index) => {
    const validation = validateCentralTendencyInputs({
      data,
      precision: 4
    })

    return {
      index,
      data,
      validation,
      isValid: validation.isValid,
    }
  })

  const allValid = results.every(r => r.isValid)
  const validCount = results.filter(r => r.isValid).length

  return {
    results,
    allValid,
    validCount,
    totalCount: datasets.length,
  }
}

// Usage
const datasets = [
  "1, 2, 3, 4, 5",
  "10, 20, 30",
  "abc, def", // Invalid
  "100, 200, 300, 400",
]

const batchResults = batchValidate(datasets)
console.log(`${batchResults.validCount} of ${batchResults.totalCount} datasets are valid`)

batchResults.results.forEach(({ index, isValid, validation }) => {
  if (!isValid) {
    console.error(`Dataset ${index + 1} errors:`, validation.errors)
  }
})
```

## Testing Examples

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { validateCentralTendencyInputs } from './validation'

describe('Custom Calculator Tests', () => {
  it('should validate student grades', () => {
    const result = validateCentralTendencyInputs({
      data: '85, 90, 78, 92, 88',
      precision: 1
    })

    expect(result.isValid).toBe(true)
    expect(result.parsedData?.data).toHaveLength(5)
    expect(result.parsedData?.data).toEqual([85, 90, 78, 92, 88])
  })

  it('should validate weighted grades', () => {
    const result = validateCentralTendencyInputs({
      data: '85, 90, 78, 92',
      weights: '0.2, 0.3, 0.2, 0.3',
      precision: 2
    })

    expect(result.isValid).toBe(true)
    expect(result.parsedData?.weights).toEqual([0.2, 0.3, 0.2, 0.3])
  })

  it('should reject mismatched weights', () => {
    const result = validateCentralTendencyInputs({
      data: '85, 90, 78',
      weights: '0.5, 0.5', // Only 2 weights for 3 grades
      precision: 2
    })

    expect(result.isValid).toBe(false)
    expect(result.errors.weights).toContain('must match')
  })
})
```

## Best Practices Summary

1. **Always validate before calculating**
   - Use `validateCentralTendencyInputs()` first
   - Check `isValid` before proceeding

2. **Show user-friendly errors**
   - Display `errors` object to user
   - Provide field-level validation feedback

3. **Handle warnings gracefully**
   - Show `warnings` but allow calculation to proceed
   - Use tooltips or info boxes for warnings

4. **Support multiple input formats**
   - Let users enter data as comma, space, or newline-separated
   - Support locale-specific number formats

5. **Detect edge cases early**
   - Use `detectEdgeCases()` to warn about problematic data
   - Use `validateForCalculationType()` for specific mean types

6. **Round results consistently**
   - Use `roundToDecimals()` for all results
   - Respect user's precision preference

7. **Test thoroughly**
   - Write unit tests for validation logic
   - Test edge cases and error conditions
   - Test different input formats and locales
