import { Calculator } from '@/types/calculator'

/**
 * Calculator Registry
 *
 * This file maintains the complete list of all calculators available in the platform.
 * Each calculator is registered with metadata for routing, SEO, and UI rendering.
 *
 * Structure to be populated with actual calculators in future development.
 */

export const calculators: Calculator[] = [
  // Finance Calculators
  {
    id: 'loan-calculator',
    slug: 'loan',
    category: 'finance',
    translationKey: 'calculators.finance.loan',
    icon: 'Banknote',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 120,
    relatedCalculators: ['mortgage', 'compound-interest', 'savings'],
    lastModified: '2025-12-16',
  },

  // Math Calculators
  {
    id: 'percentage-calculator',
    slug: 'percentage',
    category: 'math',
    translationKey: 'calculators.math.percentage',
    icon: 'Percent',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: [],
  },

  // More calculators will be added here
]

// Helper functions
export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return calculators.find((calc) => calc.slug === slug)
}

export function getCalculatorsByCategory(category: string): Calculator[] {
  return calculators.filter((calc) => calc.category === category)
}

export function getFeaturedCalculators(limit: number = 6): Calculator[] {
  return calculators.filter((calc) => calc.featured).slice(0, limit)
}

export function getRelatedCalculators(
  calculatorId: string,
  limit: number = 3
): Calculator[] {
  const calculator = calculators.find((calc) => calc.id === calculatorId)
  if (!calculator) return []

  return calculators
    .filter((calc) => calculator.relatedCalculators.includes(calc.slug))
    .slice(0, limit)
}

export function getAllCalculatorSlugs(): Array<{
  category: string
  slug: string
}> {
  return calculators.map((calc) => ({
    category: calc.category,
    slug: calc.slug,
  }))
}
