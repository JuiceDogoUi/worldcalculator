import { z } from 'zod'

/**
 * Zod validation schemas for calculator inputs and outputs
 * Provides runtime type safety and validation
 */

// Base number validation with common constraints
export const positiveNumber = z.number().positive('Must be a positive number')
export const nonNegativeNumber = z.number().min(0, 'Cannot be negative')
export const percentage = z.number().min(0).max(100, 'Must be between 0 and 100')

// Calculator input validation schemas
export const calculatorInputSchema = z.object({
  value: z.union([z.number(), z.string()]),
  min: z.number().optional(),
  max: z.number().optional(),
  required: z.boolean().optional(),
})

// Common validation patterns
export const validationSchemas = {
  // Financial calculators
  currency: z.number().positive('Amount must be positive'),
  interestRate: percentage,
  years: positiveNumber.int('Must be a whole number'),

  // Health calculators
  weight: positiveNumber,
  height: positiveNumber,
  age: z.number().int().min(1).max(120, 'Age must be between 1 and 120'),

  // General
  positiveInteger: positiveNumber.int(),
  percentage,
  nonNegative: nonNegativeNumber,
}

/**
 * Generic calculator result schema
 */
export const calculatorResultSchema = z.object({
  value: z.union([z.number(), z.string()]),
  unit: z.string().optional(),
  description: z.string().optional(),
  timestamp: z.date().optional(),
})

/**
 * Calculator configuration schema
 */
export const calculatorConfigSchema = z.object({
  id: z.string(),
  slug: z.string(),
  category: z.string(),
  enabled: z.boolean().default(true),
  featured: z.boolean().default(false),
})

// Export type inference
export type CalculatorInput = z.infer<typeof calculatorInputSchema>
export type CalculatorResult = z.infer<typeof calculatorResultSchema>
export type CalculatorConfig = z.infer<typeof calculatorConfigSchema>
