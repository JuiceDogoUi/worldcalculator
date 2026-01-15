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
    relatedCalculators: ['mortgage', 'compound-interest'],
    lastModified: '2025-12-16',
  },
  {
    id: 'mortgage-calculator',
    slug: 'mortgage',
    category: 'finance',
    translationKey: 'calculators.finance.mortgage',
    icon: 'Home',
    featured: true,
    difficulty: 'medium',
    estimatedTime: 180,
    relatedCalculators: ['loan', 'affordability', 'property-tax'],
    lastModified: '2025-12-28',
  },
  {
    id: 'compound-interest-calculator',
    slug: 'compound-interest',
    category: 'finance',
    translationKey: 'calculators.finance.compound-interest',
    icon: 'TrendingUp',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 120,
    relatedCalculators: ['loan', 'mortgage', 'savings-goal'],
    lastModified: '2025-12-29',
  },
  {
    id: 'savings-goal-calculator',
    slug: 'savings-goal',
    category: 'finance',
    translationKey: 'calculators.finance.savings-goal',
    icon: 'Target',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 120,
    relatedCalculators: ['compound-interest', 'loan', 'mortgage'],
    lastModified: '2025-12-29',
  },
  {
    id: 'roi-calculator',
    slug: 'roi',
    category: 'finance',
    translationKey: 'calculators.finance.roi',
    icon: 'TrendingUp',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 90,
    relatedCalculators: ['compound-interest', 'savings-goal', 'loan'],
    lastModified: '2025-12-30',
  },
  {
    id: 'retirement-calculator',
    slug: 'retirement',
    category: 'finance',
    translationKey: 'calculators.finance.retirement',
    icon: 'PiggyBank',
    featured: true,
    difficulty: 'medium',
    estimatedTime: 180,
    relatedCalculators: ['savings-goal', 'compound-interest', 'roi'],
    lastModified: '2026-01-06',
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
    relatedCalculators: ['loan', 'mortgage', 'fraction'],
    lastModified: '2025-12-29',
  },
  {
    id: 'fraction-calculator',
    slug: 'fraction',
    category: 'math',
    translationKey: 'calculators.math.fraction',
    icon: 'Divide',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['percentage'],
    lastModified: '2025-12-31',
  },

  // Statistics Calculators
  {
    id: 'standard-deviation-calculator',
    slug: 'standard-deviation',
    category: 'statistics',
    translationKey: 'calculators.statistics.standard-deviation',
    icon: 'BarChart3',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['percentage', 'fraction', 'gcd'],
    lastModified: '2025-12-31',
  },
  {
    id: 'gcd-calculator',
    slug: 'gcd',
    category: 'math',
    translationKey: 'calculators.math.gcd',
    icon: 'Calculator',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['fraction', 'percentage', 'standard-deviation'],
    lastModified: '2025-12-31',
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific',
    category: 'math',
    translationKey: 'calculators.math.scientific',
    icon: 'Calculator',
    featured: true,
    difficulty: 'medium',
    estimatedTime: 300,
    relatedCalculators: ['percentage', 'fraction', 'gcd'],
    lastModified: '2026-01-03',
  },
  {
    id: 'square-root-calculator',
    slug: 'square-root',
    category: 'math',
    translationKey: 'calculators.math.square-root',
    icon: 'Radical',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['percentage', 'fraction', 'scientific'],
    lastModified: '2026-01-06',
  },
  {
    id: 'ratio-calculator',
    slug: 'ratio',
    category: 'math',
    translationKey: 'calculators.math.ratio',
    icon: 'Scale',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['percentage', 'fraction', 'gcd'],
    lastModified: '2026-01-07',
  },
  {
    id: 'mean-median-mode-calculator',
    slug: 'mean-median-mode',
    category: 'statistics',
    translationKey: 'calculators.statistics.mean-median-mode',
    icon: 'BarChart3',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['standard-deviation', 'percentage', 'fraction'],
    lastModified: '2026-01-07',
  },
  {
    id: 'probability-calculator',
    slug: 'probability',
    category: 'statistics',
    translationKey: 'calculators.statistics.probability',
    icon: 'Dice5',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['standard-deviation', 'mean-median-mode', 'percentage'],
    lastModified: '2026-01-08',
  },
  {
    id: 'z-score-calculator',
    slug: 'z-score',
    category: 'statistics',
    translationKey: 'calculators.statistics.z-score',
    icon: 'TrendingUp',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['standard-deviation', 'mean-median-mode', 'probability'],
    lastModified: '2026-01-08',
  },
  {
    id: 'correlation-calculator',
    slug: 'correlation',
    category: 'statistics',
    translationKey: 'calculators.statistics.correlation',
    icon: 'TrendingUp',
    featured: true,
    difficulty: 'medium',
    estimatedTime: 120,
    relatedCalculators: ['standard-deviation', 'mean-median-mode', 'z-score'],
    lastModified: '2026-01-08',
  },
  {
    id: 'sample-size-calculator',
    slug: 'sample-size',
    category: 'statistics',
    translationKey: 'calculators.statistics.sample-size',
    icon: 'Users',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['standard-deviation', 'probability', 'z-score'],
    lastModified: '2026-01-09',
  },

  // Health Calculators
  {
    id: 'bmi-calculator',
    slug: 'bmi',
    category: 'health',
    translationKey: 'calculators.health.bmi',
    icon: 'Scale',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['tdee', 'ideal-weight', 'heart-rate'],
    lastModified: '2026-01-11',
  },
  {
    id: 'tdee-calculator',
    slug: 'tdee',
    category: 'health',
    translationKey: 'calculators.health.tdee',
    icon: 'Flame',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 120,
    relatedCalculators: ['bmi', 'ideal-weight', 'heart-rate'],
    lastModified: '2026-01-11',
  },
  {
    id: 'heart-rate-calculator',
    slug: 'heart-rate',
    category: 'health',
    translationKey: 'calculators.health.heart-rate',
    icon: 'Heart',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['bmi', 'tdee', 'ideal-weight'],
    lastModified: '2026-01-15',
  },
  {
    id: 'ideal-weight-calculator',
    slug: 'ideal-weight',
    category: 'health',
    translationKey: 'calculators.health.ideal-weight',
    icon: 'Target',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 90,
    relatedCalculators: ['bmi', 'tdee', 'macro'],
    lastModified: '2026-01-15',
  },
  {
    id: 'macro-calculator',
    slug: 'macro',
    category: 'health',
    translationKey: 'calculators.health.macro',
    icon: 'Utensils',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 120,
    relatedCalculators: ['tdee', 'bmi', 'ideal-weight'],
    lastModified: '2026-01-15',
  },
  {
    id: 'body-fat-calculator',
    slug: 'body-fat',
    category: 'health',
    translationKey: 'calculators.health.body-fat',
    icon: 'Percent',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 120,
    relatedCalculators: ['bmi', 'tdee', 'ideal-weight'],
    lastModified: '2026-01-15',
  },

  // Conversion Calculators
  {
    id: 'temperature-converter',
    slug: 'temperature',
    category: 'conversion',
    translationKey: 'calculators.conversion.temperature',
    icon: 'Thermometer',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 30,
    relatedCalculators: ['length', 'weight', 'volume'],
    lastModified: '2026-01-15',
  },
  {
    id: 'length-converter',
    slug: 'length',
    category: 'conversion',
    translationKey: 'calculators.conversion.length',
    icon: 'Ruler',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['temperature', 'weight', 'area'],
    lastModified: '2026-01-15',
  },
  {
    id: 'weight-converter',
    slug: 'weight',
    category: 'conversion',
    translationKey: 'calculators.conversion.weight',
    icon: 'Scale',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 30,
    relatedCalculators: ['length', 'temperature', 'volume'],
    lastModified: '2026-01-15',
  },
  {
    id: 'area-converter',
    slug: 'area',
    category: 'conversion',
    translationKey: 'calculators.conversion.area',
    icon: 'Square',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['length', 'weight', 'percentage'],
    lastModified: '2026-01-15',
  },
  {
    id: 'speed-converter',
    slug: 'speed',
    category: 'conversion',
    translationKey: 'calculators.conversion.speed',
    icon: 'Gauge',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['length', 'weight', 'area'],
    lastModified: '2026-01-15',
  },
  {
    id: 'volume-converter',
    slug: 'volume',
    category: 'conversion',
    translationKey: 'calculators.conversion.volume',
    icon: 'Beaker',
    featured: true,
    difficulty: 'easy',
    estimatedTime: 60,
    relatedCalculators: ['weight', 'length', 'area'],
    lastModified: '2026-01-15',
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
