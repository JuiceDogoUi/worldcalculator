import Link from 'next/link'
import {
  DollarSign,
  Heart,
  Calculator,
  ArrowLeftRight,
  Clock,
  Hammer,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  Heart,
  Calculator,
  ArrowLeftRight,
  Clock,
  Hammer,
}

const colorMap: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    icon: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:border-blue-200 dark:hover:border-blue-800',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/30',
    icon: 'text-red-600 dark:text-red-400',
    hover: 'hover:border-red-200 dark:hover:border-red-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    icon: 'text-green-600 dark:text-green-400',
    hover: 'hover:border-green-200 dark:hover:border-green-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    icon: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:border-purple-200 dark:hover:border-purple-800',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    icon: 'text-orange-600 dark:text-orange-400',
    hover: 'hover:border-orange-200 dark:hover:border-orange-800',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    icon: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:border-amber-200 dark:hover:border-amber-800',
  },
}

interface CategoryCardProps {
  slug: string
  icon: string
  color: string
  title: string
  description: string
  locale: string
}

export function CategoryCard({
  slug,
  icon,
  color,
  title,
  description,
  locale,
}: CategoryCardProps) {
  const Icon = iconMap[icon] || Calculator
  const colors = colorMap[color] || colorMap.blue

  return (
    <Link
      href={`/${locale}/calculators/${slug}`}
      className={cn(
        'group relative flex flex-col p-6 rounded-2xl border-2 border-border bg-card transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        colors.hover
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center w-14 h-14 rounded-xl mb-4',
          colors.bg
        )}
      >
        <Icon className={cn('h-7 w-7', colors.icon)} />
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="flex items-center mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-4 w-4 ml-auto transform group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  )
}
