import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { categories } from '@/config/categories'
import {
  DollarSign,
  Heart,
  Calculator as CalculatorIcon,
  ArrowLeftRight,
  Clock,
  Hammer,
  BarChart3,
} from 'lucide-react'

// Icon mapping for categories
const iconMap = {
  DollarSign,
  Heart,
  Calculator: CalculatorIcon,
  ArrowLeftRight,
  Clock,
  Hammer,
  BarChart3,
}

/**
 * Main navigation component
 * Displays calculator category links
 */
export async function Navigation() {
  const t = await getTranslations('categories')

  return (
    <nav className="border-b bg-muted/40">
      <div className="container">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap]

            return (
              <Link
                key={category.id}
                href={`/calculators/${category.slug}`}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground whitespace-nowrap"
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{t(category.translationKey)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
