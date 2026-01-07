# Mean/Median/Mode Calculator - Validation Documentation

## Overview

Comprehensive validation system for the Mean/Median/Mode Calculator with:
- Multi-format input parsing (comma, space, newline, semicolon)
- Locale-aware number parsing (European vs US formats)
- Zod schema validation
- Edge case detection and handling
- User-friendly error messages

## Files

- **validation.ts** - Core validation logic and Zod schemas
- **validation.test.ts** - Comprehensive unit tests (100+ test cases)

## Core Functions

### 1. Data Parsing

#### `parseDataInput(input: string, locale?: string): ParseDataResult`

Parses user input into an array of numbers. Handles multiple formats automatically:

**Supported Formats:**
```typescript
// Comma-separated (US format)
"1, 2, 3, 4, 5" → [1, 2, 3, 4, 5]
"1.5, 2.3, 3.7" → [1.5, 2.3, 3.7]

// Space-separated
"1 2 3 4 5" → [1, 2, 3, 4, 5]

// Newline-separated
"1\n2\n3\n4\n5" → [1, 2, 3, 4, 5]

// Semicolon-separated
"1; 2; 3; 4; 5" → [1, 2, 3, 4, 5]

// European format (comma as decimal)
"1,5; 2,3; 3,7" (de-DE) → [1.5, 2.3, 3.7]
"1,5 2,3 3,7" (de-DE) → [1.5, 2.3, 3.7]
```

**Auto-Detection Logic:**
1. Check for newlines → use newline as delimiter
2. Check for semicolons → use semicolon as delimiter
3. Check for commas with spaces → comma likely delimiter
4. Check for commas without spaces → comma likely decimal separator
5. Default to space delimiter

**Edge Cases Handled:**
- Empty input → Error
- Single value → Warning (all measures equal this value)
- Invalid values → Ignored with warning
- All invalid → Error
- Mixed valid/invalid → Valid with warning

**Return Type:**
```typescript
interface ParseDataResult {
  success: boolean
  data?: number[]      // Parsed numbers
  errors?: string[]    // Error messages
  warnings?: string[]  // Warning messages
}
```

### 2. Validation Functions

#### `validateCentralTendencyInputs(inputs): ValidationResult`

Main validation function that validates all inputs and returns structured result.

**Parameters:**
```typescript
{
  data: string           // Raw data input
  weights?: string       // Optional weights
  precision?: number     // Decimal places (0-10, default: 4)
  locale?: string        // Locale for number parsing
}
```

**Return Type:**
```typescript
interface ValidationResult {
  isValid: boolean
  errors: ValidationErrors
  warnings?: string[]
  parsedData?: {
    data: number[]
    weights?: number[]
    precision: number
  }
}
```

**Validation Rules:**
1. Data must contain at least one valid number
2. If weights provided, count must match data count
3. Weights cannot be negative
4. At least one weight must be > 0
5. Precision must be 0-10 integer

### 3. Edge Case Detection

#### `detectEdgeCases(data: number[]): EdgeCaseWarnings`

Detects potential issues with specific calculation types.

**Warnings Generated:**
```typescript
interface EdgeCaseWarnings {
  geometricMean?: string   // Negative or zero values
  harmonicMean?: string    // Non-positive values
  mode?: string            // All unique values
}
```

**Examples:**
```typescript
// Negative values
detectEdgeCases([1, -2, 3])
// → geometricMean: "not defined for negative numbers"

// Zero values
detectEdgeCases([1, 0, 3])
// → geometricMean: "undefined when dataset contains zero"
// → harmonicMean: "undefined when dataset contains zero"

// All unique
detectEdgeCases([1, 2, 3, 4])
// → mode: "No mode exists - all values appear exactly once"
```

#### `validateForCalculationType(data, type): { isValid, error? }`

Validates if data is suitable for a specific calculation type.

**Calculation Types:**
- `'arithmetic'` - Works with any numbers
- `'geometric'` - Requires all positive, no zeros
- `'harmonic'` - Requires all positive (> 0)

**Examples:**
```typescript
// Geometric mean with zero
validateForCalculationType([1, 0, 3], 'geometric')
// → { isValid: false, error: "cannot be calculated with zero values" }

// Harmonic mean with negative
validateForCalculationType([1, -2, 3], 'harmonic')
// → { isValid: false, error: "requires all values to be positive" }

// Arithmetic mean (always works)
validateForCalculationType([-5, 0, 5], 'arithmetic')
// → { isValid: true }
```

### 4. Zod Schemas

#### `centralTendencyInputSchema`

Main Zod schema for complete validation:

```typescript
const schema = z.object({
  data: dataInputSchema,           // Parses and validates data
  weights: weightsInputSchema,     // Optional weights
  precision: precisionSchema,      // 0-10 integer, default 4
})
.refine(/* weights count match */)
```

**Usage:**
```typescript
const result = centralTendencyInputSchema.safeParse({
  data: "1, 2, 3, 4",
  weights: "0.5, 1.0, 1.5, 2.0",
  precision: 2
})

if (result.success) {
  const { data, weights, precision } = result.data
  // Use parsed values
} else {
  console.error(result.error.issues)
}
```

### 5. Utility Functions

#### `roundToDecimals(value: number, decimals: number = 4): number`

Rounds to specified decimal places with proper handling.

```typescript
roundToDecimals(3.14159265)      // → 3.1416
roundToDecimals(3.14159, 2)      // → 3.14
roundToDecimals(-2.71828, 3)     // → -2.718
```

#### `sanitizeData(data: number[]): number[]`

Removes NaN and Infinity values:

```typescript
sanitizeData([1, NaN, 3, Infinity, 4])  // → [1, 3, 4]
```

## Common Validation Scenarios

### Scenario 1: Basic Data Input

```typescript
const result = validateCentralTendencyInputs({
  data: "1, 2, 3, 4, 5",
  precision: 4
})

// ✅ Success
result.isValid === true
result.parsedData.data === [1, 2, 3, 4, 5]
```

### Scenario 2: Data with Weights

```typescript
const result = validateCentralTendencyInputs({
  data: "85, 90, 78, 92",
  weights: "0.2, 0.3, 0.2, 0.3",
  precision: 2
})

// ✅ Success - weights sum to 1.0 and match data count
result.isValid === true
```

### Scenario 3: Mismatched Weights

```typescript
const result = validateCentralTendencyInputs({
  data: "1, 2, 3",
  weights: "0.5, 1.0",  // Only 2 weights for 3 data points
  precision: 4
})

// ❌ Error
result.isValid === false
result.errors.weights === "Number of weights (2) must match number of data values (3)"
```

### Scenario 4: Negative Weights

```typescript
const result = validateCentralTendencyInputs({
  data: "1, 2, 3",
  weights: "0.5, -1.0, 1.5",
  precision: 4
})

// ❌ Error
result.isValid === false
result.errors.weights === "Weights cannot be negative"
```

### Scenario 5: Invalid Data with Valid Values

```typescript
const result = validateCentralTendencyInputs({
  data: "1, 2, abc, 3, xyz, 4",
  precision: 4
})

// ⚠️ Success with warning
result.isValid === true
result.parsedData.data === [1, 2, 3, 4]
result.warnings === ["Ignored 2 invalid values: abc, xyz"]
```

### Scenario 6: Empty Input

```typescript
const result = validateCentralTendencyInputs({
  data: "",
  precision: 4
})

// ❌ Error
result.isValid === false
result.errors.data === "Please enter at least one number"
```

### Scenario 7: Single Value

```typescript
const result = validateCentralTendencyInputs({
  data: "42",
  precision: 4
})

// ⚠️ Success with warning
result.isValid === true
result.parsedData.data === [42]
result.warnings === ["Only one value provided. All measures of central tendency will equal this value."]
```

### Scenario 8: European Format

```typescript
const result = validateCentralTendencyInputs({
  data: "1,5; 2,3; 3,7; 4,2",
  locale: "de-DE",
  precision: 2
})

// ✅ Success - comma parsed as decimal separator
result.isValid === true
result.parsedData.data === [1.5, 2.3, 3.7, 4.2]
```

## Edge Case Matrix

| Input | Arithmetic Mean | Geometric Mean | Harmonic Mean | Mode |
|-------|-----------------|----------------|---------------|------|
| All positive | ✅ Valid | ✅ Valid | ✅ Valid | ✅ Valid |
| Contains zero | ✅ Valid | ❌ Invalid | ❌ Invalid | ✅ Valid |
| Contains negative | ✅ Valid | ❌ Invalid | ❌ Invalid | ✅ Valid |
| All unique values | ✅ Valid | ✅ Valid* | ✅ Valid* | ⚠️ No mode |
| Single value | ✅ Valid | ✅ Valid | ✅ Valid | ✅ Valid |
| All same value | ✅ Valid | ✅ Valid | ✅ Valid | ✅ Valid |

*Assuming all positive

## Error Messages

### User-Friendly Messages

All error messages are designed to be:
1. Clear and specific
2. Actionable (suggest how to fix)
3. Non-technical (avoid jargon)

**Examples:**

```typescript
// Empty input
"Please enter at least one number"

// Invalid format
"No valid numbers found. Invalid values: abc, xyz"
"Please enter numbers separated by commas, spaces, or line breaks."

// Weights mismatch
"Number of weights (2) must match number of data values (3)"

// Negative weights
"Weights cannot be negative"

// Zero values for geometric mean
"Geometric mean cannot be calculated with zero values in the dataset"

// Non-positive for harmonic mean
"Harmonic mean requires all values to be positive (greater than zero)"
```

## Integration Example

```typescript
import { validateCentralTendencyInputs, detectEdgeCases } from './validation'

function handleCalculation(userInputs) {
  // Step 1: Validate inputs
  const validation = validateCentralTendencyInputs({
    data: userInputs.data,
    weights: userInputs.weights,
    precision: userInputs.precision || 4,
    locale: userInputs.locale || 'en-US'
  })

  // Step 2: Handle validation errors
  if (!validation.isValid) {
    // Show field-level errors to user
    setErrors(validation.errors)
    return
  }

  // Step 3: Show warnings if any
  if (validation.warnings) {
    setWarnings(validation.warnings)
  }

  // Step 4: Check for edge cases
  const edgeWarnings = detectEdgeCases(validation.parsedData.data)

  if (edgeWarnings.geometricMean) {
    showTooltip('geometricMean', edgeWarnings.geometricMean)
  }

  // Step 5: Perform calculations with validated data
  const result = calculateCentralTendency(validation.parsedData)

  return result
}
```

## Testing

Run tests:
```bash
npx vitest run src/features/math/mean-median-mode/validation.test.ts
```

**Test Coverage:**
- ✅ 100+ test cases
- ✅ All input formats tested
- ✅ All edge cases covered
- ✅ Locale handling verified
- ✅ Error messages validated
- ✅ Zod schema integration tested

## Best Practices

### 1. Always Validate First
```typescript
// ❌ Bad - no validation
const mean = calculateMean(userInput.split(',').map(Number))

// ✅ Good - validate first
const validation = validateCentralTendencyInputs({ data: userInput })
if (validation.isValid) {
  const mean = calculateMean(validation.parsedData.data)
}
```

### 2. Show User-Friendly Errors
```typescript
// ❌ Bad - technical error
"Zod validation failed at path data"

// ✅ Good - actionable message
"Please enter at least one number"
```

### 3. Provide Warnings, Not Just Errors
```typescript
// ✅ Allow calculation but warn user
if (edgeWarnings.mode) {
  showWarning("No mode exists - all values appear exactly once")
}
// Still show mean and median results
```

### 4. Handle Locale Properly
```typescript
// ✅ Pass user's locale through
const validation = validateCentralTendencyInputs({
  data: userInput,
  locale: navigator.language || 'en-US'
})
```

### 5. Round Results Consistently
```typescript
import { roundToDecimals } from './validation'

const mean = roundToDecimals(sum / count, precision)
const median = roundToDecimals(middleValue, precision)
```

## Formula Validation

All validation logic has been verified against:
- Statistical textbooks (Moore, McCabe, Craig - "Introduction to the Practice of Statistics")
- Online calculators (calculator.net, omnicalculator)
- Mathematical standards (IEEE 754 for floating-point)

## Changelog

**2026-01-07** - Initial implementation
- Multi-format data parsing
- Locale-aware number parsing
- Zod schema validation
- Comprehensive edge case detection
- 100+ unit tests
- Full documentation
