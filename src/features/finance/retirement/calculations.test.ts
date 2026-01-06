/**
 * Retirement Calculator Unit Tests
 *
 * Run with: npx tsx src/features/finance/retirement/calculations.test.ts
 */

import { calculateRetirement, validateRetirementInputs } from './calculations'
import type { RetirementInputs } from './types'

// Test utilities
let passed = 0
let failed = 0

function test(name: string, fn: () => void) {
  try {
    fn()
    passed++
    console.log(`✓ ${name}`)
  } catch (error) {
    failed++
    console.log(`✗ ${name}`)
    console.log(`  Error: ${error instanceof Error ? error.message : error}`)
  }
}

function expect(actual: unknown) {
  return {
    toBe(expected: unknown) {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`)
      }
    },
    toBeCloseTo(expected: number, precision = 2) {
      const diff = Math.abs((actual as number) - expected)
      const epsilon = Math.pow(10, -precision) / 2
      if (diff > epsilon) {
        throw new Error(`Expected ~${expected}, got ${actual} (diff: ${diff})`)
      }
    },
    toBeGreaterThan(expected: number) {
      if ((actual as number) <= expected) {
        throw new Error(`Expected > ${expected}, got ${actual}`)
      }
    },
    toBeLessThan(expected: number) {
      if ((actual as number) >= expected) {
        throw new Error(`Expected < ${expected}, got ${actual}`)
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`Expected null, got ${actual}`)
      }
    },
    not: {
      toBeNull() {
        if (actual === null) {
          throw new Error(`Expected non-null value`)
        }
      },
    },
  }
}

// Default test inputs
const defaultInputs: RetirementInputs = {
  currentAge: 30,
  retirementAge: 65,
  lifeExpectancy: 90,
  currentSavings: 50000,
  monthlyContribution: 500,
  preRetirementReturn: 7,
  postRetirementReturn: 5,
  inflationRate: 2.5,
  withdrawalRate: 4,
}

console.log('\n=== Retirement Calculator Tests ===\n')

// Validation Tests
console.log('--- Validation Tests ---')

test('rejects current age < 18', () => {
  const result = validateRetirementInputs({ ...defaultInputs, currentAge: 17 })
  expect(result.valid).toBe(false)
})

test('rejects retirement age <= current age', () => {
  const result = validateRetirementInputs({ ...defaultInputs, currentAge: 65, retirementAge: 65 })
  expect(result.valid).toBe(false)
})

test('rejects life expectancy <= retirement age', () => {
  const result = validateRetirementInputs({ ...defaultInputs, retirementAge: 90, lifeExpectancy: 90 })
  expect(result.valid).toBe(false)
})

test('rejects negative current savings', () => {
  const result = validateRetirementInputs({ ...defaultInputs, currentSavings: -1000 })
  expect(result.valid).toBe(false)
})

test('rejects withdrawal rate of 0', () => {
  const result = validateRetirementInputs({ ...defaultInputs, withdrawalRate: 0 })
  expect(result.valid).toBe(false)
})

test('accepts valid inputs', () => {
  const result = validateRetirementInputs(defaultInputs)
  expect(result.valid).toBe(true)
})

// Calculation Tests
console.log('\n--- Calculation Tests ---')

test('calculates zero interest correctly', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 100000,
    monthlyContribution: 1000,
    preRetirementReturn: 0,
    postRetirementReturn: 0,
    inflationRate: 0,
  }
  const result = calculateRetirement(inputs)

  // 35 years * 12 months * $1000 = $420,000 + $100,000 initial = $520,000
  const expected = 100000 + 1000 * 12 * 35
  expect(result.accumulationSummary.balanceAtRetirement).toBe(expected)
})

test('handles zero initial savings', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 0,
  }
  const result = calculateRetirement(inputs)

  expect(result.accumulationSummary.balanceAtRetirement).toBeGreaterThan(0)
  expect(result.accumulationSummary.totalContributions).toBe(500 * 12 * 35)
})

test('handles zero monthly contributions', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 100000,
    monthlyContribution: 0,
  }
  const result = calculateRetirement(inputs)

  // Should only grow from compound interest
  expect(result.accumulationSummary.balanceAtRetirement).toBeGreaterThan(100000)
  expect(result.accumulationSummary.totalContributions).toBe(100000) // Just initial savings
})

test('calculates compound growth correctly', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 100000,
    monthlyContribution: 0,
    preRetirementReturn: 7,
    inflationRate: 0,
  }
  const result = calculateRetirement(inputs)

  // $100K at 7% for 35 years should be roughly $1.07M
  // Using monthly compounding: 100000 * (1 + 0.07/12)^(35*12) ≈ $1,114,000
  expect(result.accumulationSummary.balanceAtRetirement).toBeGreaterThan(1000000)
  expect(result.accumulationSummary.balanceAtRetirement).toBeLessThan(1200000)
})

test('calculates monthly income using 4% rule', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    withdrawalRate: 4,
  }
  const result = calculateRetirement(inputs)

  // Monthly income should be (balance * 4%) / 12
  const expectedMonthly = (result.accumulationSummary.balanceAtRetirement * 0.04) / 12
  expect(result.retirementSummary.sustainableMonthlyIncome).toBeCloseTo(expectedMonthly, 0)
})

test('real balance accounts for inflation', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    inflationRate: 3,
  }
  const result = calculateRetirement(inputs)

  // Real balance should be less than nominal balance
  expect(result.accumulationSummary.realBalanceAtRetirement).toBeLessThan(
    result.accumulationSummary.balanceAtRetirement
  )
})

// Milestone Tests
console.log('\n--- Milestone Tests ---')

test('detects $100K milestone when starting below', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 50000,
  }
  const result = calculateRetirement(inputs)

  // Should reach $100K within projections
  expect(result.milestones.age100K).not.toBeNull()
  expect(result.milestones.age100K).toBeGreaterThan(30)
})

test('does not set $100K milestone when starting above', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 150000,
  }
  const result = calculateRetirement(inputs)

  // Already past $100K, should not set milestone
  expect(result.milestones.age100K).toBeNull()
})

// Savings Longevity Tests
console.log('\n--- Savings Longevity Tests ---')

test('savings last through retirement with conservative withdrawal', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    withdrawalRate: 3,
    postRetirementReturn: 5,
  }
  const result = calculateRetirement(inputs)

  expect(result.retirementSummary.savingsLastsThroughRetirement).toBe(true)
})

test('savings deplete with aggressive withdrawal', () => {
  const inputs: RetirementInputs = {
    ...defaultInputs,
    currentSavings: 100000,
    monthlyContribution: 100,
    withdrawalRate: 10,
    postRetirementReturn: 2,
  }
  const result = calculateRetirement(inputs)

  expect(result.retirementSummary.savingsLastsThroughRetirement).toBe(false)
  expect(result.retirementSummary.ageWhenDepleted).not.toBeNull()
})

// Projection Consistency Tests
console.log('\n--- Projection Consistency Tests ---')

test('accumulation projections end balance matches summary', () => {
  const result = calculateRetirement(defaultInputs)

  const lastProjection = result.accumulationProjections[result.accumulationProjections.length - 1]
  expect(lastProjection.endingBalance).toBeCloseTo(
    result.accumulationSummary.balanceAtRetirement,
    0
  )
})

test('years to retirement matches projection count', () => {
  const result = calculateRetirement(defaultInputs)

  expect(result.accumulationProjections.length).toBe(
    result.accumulationSummary.yearsToRetirement
  )
})

// Summary
console.log('\n=== Results ===')
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
console.log(`Total:  ${passed + failed}`)

if (failed > 0) {
  process.exit(1)
}
