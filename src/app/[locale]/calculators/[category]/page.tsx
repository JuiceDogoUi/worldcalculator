import { notFound } from 'next/navigation'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { categories, getCategoryBySlug } from '@/config/categories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import type { Metadata } from 'next'
import { locales } from '@/i18n/locales'

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

  const tCategory = await getTranslations({ locale, namespace: 'categories' })
  const tH1 = await getTranslations({ locale, namespace: 'categoryH1' })
  const tSite = await getTranslations({ locale, namespace: 'site' })

  const key = category.translationKey as
    | 'finance'
    | 'health'
    | 'math'
    | 'conversion'
    | 'timeDate'
    | 'construction'

  const title = tH1(key)
  const description = `Browse all ${tCategory(key).toLowerCase()} calculators. Free online tools for ${tCategory(key).toLowerCase()} calculations.`

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
  const tCalculator = await getTranslations({ locale, namespace: 'calculator' })

  // Get the translation key
  const key = category.translationKey as
    | 'finance'
    | 'health'
    | 'math'
    | 'conversion'
    | 'timeDate'
    | 'construction'

  // TODO: Fetch calculators for this category from registry
  // const categoryCalculators = calculators.filter(
  //   (calc) => calc.category === categorySlug
  // )

  return (
    <div className="container py-8">
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

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          {tH1(key)}
        </h1>
        <p className="text-lg text-muted-foreground">
          Browse all calculators in this category
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Calculators for the {tCategory(key)} category will be added here.
            </p>
          </CardContent>
        </Card>
      </div>
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
