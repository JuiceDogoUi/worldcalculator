import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { categories, getCategoryBySlug } from '@/config/categories'
import { getCalculatorsByCategory } from '@/config/calculators'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ChevronRight, Banknote, Percent, Heart, Clock, Ruler, ArrowLeftRight, CheckCircle2, BarChart3 } from 'lucide-react'
import type { Metadata } from 'next'
import { locales } from '@/i18n/locales'

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Banknote,
  Percent,
  Heart,
  Clock,
  Ruler,
  ArrowLeftRight,
  BarChart3,
}

// Map category slugs to icons for related categories
const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  finance: Banknote,
  health: Heart,
  math: Percent,
  conversion: ArrowLeftRight,
  'time-date': Clock,
  construction: Ruler,
  statistics: BarChart3,
}

export const dynamic = 'force-static'
export const dynamicParams = false

interface CategoryPageProps {
  params: Promise<{
    locale: string
    category: string
  }>
}

/**
 * Generate metadata for category page
 */
export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params

  // Validate category exists
  const category = getCategoryBySlug(categorySlug)
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const tH1 = await getTranslations({ locale, namespace: 'categoryH1' })
  const tSeoDesc = await getTranslations({ locale, namespace: 'categorySeoDescription' })
  const tSite = await getTranslations({ locale, namespace: 'site' })

  const key = category.translationKey as
    | 'finance'
    | 'health'
    | 'math'
    | 'conversion'
    | 'timeDate'
    | 'construction'
    | 'statistics'

  const title = tH1(key)
  const description = tSeoDesc(key)

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/calculators/${categorySlug}`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `/${loc}/calculators/${categorySlug}`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/calculators/${categorySlug}`,
      siteName: tSite('name'),
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

/**
 * Category page - displays all calculators in a category
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category: categorySlug } = await params

  // Enable static rendering
  setRequestLocale(locale)

  // Validate category exists
  const category = getCategoryBySlug(categorySlug)
  if (!category) {
    notFound()
  }

  const tCategory = await getTranslations({ locale, namespace: 'categories' })
  const tH1 = await getTranslations({ locale, namespace: 'categoryH1' })
  const tSeoDesc = await getTranslations({ locale, namespace: 'categorySeoDescription' })
  const tCalculator = await getTranslations({ locale, namespace: 'calculator' })
  const tCategoryPage = await getTranslations({ locale, namespace: 'categoryPage' })
  const tFeatures = await getTranslations({ locale, namespace: 'categoryFeatures' })
  const tGuide = await getTranslations({ locale, namespace: 'categoryGuide' })
  const tSite = await getTranslations({ locale, namespace: 'site' })
  const tCount = await getTranslations({ locale })

  // Get the translation key
  const key = category.translationKey as
    | 'finance'
    | 'health'
    | 'math'
    | 'conversion'
    | 'timeDate'
    | 'construction'
    | 'statistics'

  // Fetch calculators for this category from registry
  const categoryCalculators = getCalculatorsByCategory(categorySlug)

  // Load translations for each calculator
  const calculatorTranslations = await Promise.all(
    categoryCalculators.map(async (calc) => {
      try {
        // Dynamic import of calculator-specific translations
        const messages = await import(
          `@/messages/${locale}/calculators/${calc.category}/${calc.slug}.json`
        )
        return {
          ...calc,
          title: messages.title || calc.slug,
          description: messages.description || '',
        }
      } catch {
        // Fallback if translation file doesn't exist
        return {
          ...calc,
          title: calc.slug.charAt(0).toUpperCase() + calc.slug.slice(1),
          description: '',
        }
      }
    })
  )

  // Get features for this category
  const features = tFeatures.raw(key) as string[]

  // Get other categories for related links
  const otherCategories = categories.filter((c) => c.slug !== categorySlug)

  // Generate JSON-LD structured data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: tH1(key),
    description: tSeoDesc(key),
    url: `${siteUrl}/${locale}/calculators/${categorySlug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: tSite('name'),
      url: siteUrl,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: calculatorTranslations.length,
      itemListElement: calculatorTranslations.map((calc, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: calc.title,
        description: calc.description,
        url: `${siteUrl}/${locale}/calculators/${calc.category}/${calc.slug}`,
      })),
    },
  }

  return (
    <div className="container py-8">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs with structured data */}
      <Breadcrumbs
        homeLabel={tCalculator('home')}
        items={[
          {
            label: tCategory(key),
          },
        ]}
        className="mb-6"
      />

      {/* Header Section */}
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {tH1(key)}
        </h1>
        <p className="text-sm text-muted-foreground mt-3">
          {tCount('categoryCalculatorCount', { count: calculatorTranslations.length })}
        </p>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {tSeoDesc(key)}
        </p>
      </div>

      {/* Category Guide Section */}
      <section className="mb-12">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-xl">
              {tGuide(`${key}.title`)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {tGuide(`${key}.content`)}
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Calculator Cards */}
      {calculatorTranslations.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">{tCategoryPage('availableTools')}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculatorTranslations.map((calc) => {
              const IconComponent = iconMap[calc.icon] || Banknote
              return (
                <Link
                  key={calc.id}
                  href={`/${locale}/calculators/${calc.category}/${calc.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 group-hover:bg-muted/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                      </div>
                      <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                        {calc.title}
                      </CardTitle>
                      {calc.description && (
                        <CardDescription className="line-clamp-2">
                          {calc.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* What You Can Calculate Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">{tCategoryPage('whatYouCanCalculate')}</h2>
        <div className="bg-muted/30 rounded-lg p-6">
          <ul className="grid gap-3 md:grid-cols-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Explore Other Categories Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">{tCategoryPage('exploreOtherCategories')}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherCategories.map((cat) => {
            const catKey = cat.translationKey as keyof typeof categoryIconMap
            const IconComponent = categoryIconMap[cat.slug] || Banknote
            return (
              <Link
                key={cat.slug}
                href={`/${locale}/calculators/${cat.slug}`}
                className="group flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <IconComponent className="h-4 w-4" />
                </div>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {tCategory(catKey)}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

/**
 * Generate static params for all locale + category combinations
 */
export function generateStaticParams() {
  const params: { locale: string; category: string }[] = []
  for (const locale of locales) {
    for (const category of categories) {
      params.push({ locale, category: category.slug })
    }
  }
  return params
}
