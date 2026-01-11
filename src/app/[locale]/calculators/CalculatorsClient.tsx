'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/routing'
import { categories } from '@/config/categories'
import { calculators } from '@/config/calculators'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  Heart,
  Calculator as CalculatorIcon,
  ArrowLeftRight,
  Clock,
  Hammer,
  BarChart3,
} from 'lucide-react'

const iconMap = {
  DollarSign,
  Heart,
  Calculator: CalculatorIcon,
  ArrowLeftRight,
  Clock,
  Hammer,
  BarChart3,
}

interface CalculatorsClientProps {
  translations: {
    noResults: string
    browseAll: string
    searchResults: string
    found: string
    calculators: string
  }
  hubTranslations: {
    title: string
    subtitle: string
    introduction: string
    browseByCategory: string
    browseDescription: string
    whyUseOurCalculators: string
    whyDescription: string
    features: {
      accurate: { title: string; description: string }
      free: { title: string; description: string }
      private: { title: string; description: string }
      multilingual: { title: string; description: string }
    }
  }
  categoryTranslations: Record<string, string>
  categoryDescriptions: Record<string, string>
  calculatorNames: Record<string, string>
}

export function CalculatorsClient({
  translations,
  hubTranslations,
  categoryTranslations,
  categoryDescriptions,
  calculatorNames,
}: CalculatorsClientProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  // Filter calculators based on search query
  const filteredCalculators = useMemo(() => {
    if (!searchQuery) return []

    const query = searchQuery.toLowerCase().trim()
    return calculators.filter((calc) => {
      const calcName = calculatorNames[calc.slug]?.toLowerCase() || ''
      const categoryName = categoryTranslations[calc.category]?.toLowerCase() || ''

      return (
        calc.slug.toLowerCase().includes(query) ||
        calc.category.toLowerCase().includes(query) ||
        calcName.includes(query) ||
        categoryName.includes(query) ||
        calc.slug.replace(/-/g, ' ').toLowerCase().includes(query)
      )
    })
  }, [searchQuery, calculatorNames, categoryTranslations])

  return (
    <div className="container py-8">
      {/* Header Section */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {searchQuery ? `${translations.searchResults}: "${searchQuery}"` : hubTranslations.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {searchQuery
            ? `${translations.found} ${filteredCalculators.length} ${translations.calculators}`
            : hubTranslations.subtitle
          }
        </p>
      </div>

      {/* Introduction Section - Only show when not searching */}
      {!searchQuery && (
        <>
          <div className="mb-12 prose prose-slate dark:prose-invert max-w-none">
            <p className="text-base leading-relaxed text-muted-foreground">
              {hubTranslations.introduction}
            </p>
          </div>

          {/* Why Use Our Calculators Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-4">
              {hubTranslations.whyUseOurCalculators}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-6">
              {hubTranslations.whyDescription}
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {Object.entries(hubTranslations.features).map(([key, feature]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Browse by Category Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight mb-2">
              {hubTranslations.browseByCategory}
            </h2>
            <p className="text-base text-muted-foreground mb-6">
              {hubTranslations.browseDescription}
            </p>
          </div>
        </>
      )}

      {searchQuery && filteredCalculators.length > 0 ? (
        // Search results - show calculators
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCalculators.map((calculator) => {
            const category = categories.find(c => c.slug === calculator.category)
            const Icon = category ? iconMap[category.icon as keyof typeof iconMap] : CalculatorIcon

            return (
              <Link
                key={calculator.id}
                href={`/calculators/${calculator.category}/${calculator.slug}`}
              >
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">
                        {calculatorNames[calculator.slug] || calculator.slug.charAt(0).toUpperCase() + calculator.slug.slice(1).replace(/-/g, ' ')}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {categoryTranslations[calculator.category] || calculator.category}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : searchQuery && filteredCalculators.length === 0 ? (
        // No search results
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            {translations.noResults} &ldquo;{searchQuery}&rdquo;
          </p>
          <Link
            href="/calculators"
            className="text-primary hover:underline"
          >
            {translations.browseAll}
          </Link>
        </div>
      ) : (
        // Default view - show categories
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap]

            return (
              <Link key={category.id} href={`/calculators/${category.slug}`}>
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">
                        {categoryTranslations[category.slug] || category.slug}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {categoryDescriptions[category.slug] || 'Explore calculators in this category'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
