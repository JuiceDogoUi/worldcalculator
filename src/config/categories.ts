import { Category } from '@/types/category'

/**
 * Main calculator categories based on market research
 * Priority order: 1 (highest) to 6 (lowest)
 *
 * Categories selected for:
 * - Global appeal and high search volume
 * - Daily practical use cases
 * - Mobile-first optimization
 * - Broad audience reach
 */
export const categories: Category[] = [
  {
    id: 'finance',
    slug: 'finance',
    translationKey: 'finance',
    icon: 'DollarSign',
    color: 'blue',
    priority: 1, // Highest - mortgage, loans, savings (high commercial intent)
  },
  {
    id: 'health',
    slug: 'health',
    translationKey: 'health',
    icon: 'Heart',
    color: 'red',
    priority: 2, // Very High - BMI, calorie, fitness (mobile-first, wellness trend)
  },
  {
    id: 'math',
    slug: 'math',
    translationKey: 'math',
    icon: 'Calculator',
    color: 'green',
    priority: 3, // Very High - percentage, fractions, GPA (universal daily use)
  },
  {
    id: 'conversion',
    slug: 'conversion',
    translationKey: 'conversion',
    icon: 'ArrowLeftRight',
    color: 'purple',
    priority: 4, // High - units, currency, temperature (mobile-critical, global)
  },
  {
    id: 'statistics',
    slug: 'statistics',
    translationKey: 'statistics',
    icon: 'BarChart3',
    color: 'cyan',
    priority: 5, // High - standard deviation, mean, variance (educational, research)
  },
  // TEMPORARILY HIDDEN - Empty categories (no calculators yet)
  // Re-enable when calculators are added
  // {
  //   id: 'time-date',
  //   slug: 'time-date',
  //   translationKey: 'timeDate',
  //   icon: 'Clock',
  //   color: 'orange',
  //   priority: 6, // Medium-High - age, date calculator, countdown (utility)
  // },
  // {
  //   id: 'construction',
  //   slug: 'construction',
  //   translationKey: 'construction',
  //   icon: 'Hammer',
  //   color: 'amber',
  //   priority: 7, // Medium-High - square footage, materials (commercial potential)
  // },
]

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug)
}

export function getCategoriesByPriority(): Category[] {
  return [...categories].sort((a, b) => a.priority - b.priority)
}

export function getFeaturedCategories(limit: number = 3): Category[] {
  return getCategoriesByPriority().slice(0, limit)
}
