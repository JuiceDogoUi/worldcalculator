import { CalculatorCategory } from './calculator'
import { CategoryTranslationKey } from './translations'

export interface Category {
  id: string
  slug: CalculatorCategory
  translationKey: CategoryTranslationKey
  icon: string
  color: string
  priority: number
}
