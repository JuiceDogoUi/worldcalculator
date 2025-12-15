import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { categories } from '@/config/categories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DollarSign,
  Heart,
  Calculator as CalculatorIcon,
  ArrowLeftRight,
  Clock,
  Hammer,
} from 'lucide-react'
import type { Metadata } from 'next'
import { locales } from '@/i18n/locales'

const iconMap = {
  DollarSign,
  Heart,
  Calculator: CalculatorIcon,
  ArrowLeftRight,
  Clock,
  Hammer,
}

/**
 * Generate metadata for calculators listing page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })

  const title = `All Calculators | ${t('name')}`
  const description = `Browse all calculator categories including finance, health, math, conversion, time & date, and construction tools.`

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/calculators`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `/${loc}/calculators`])
      ),
    },
    openGraph: {
      title,
      description,
      url: `/${locale}/calculators`,
      siteName: t('name'),
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
 * Calculators index page
 * Displays all calculator categories
 */
export default async function CalculatorsPage() {
  const tSite = await getTranslations('site')
  const tCategories = await getTranslations('categories')

  return (
    <div className="container py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {tSite('name')}
        </h1>
        <p className="text-lg text-muted-foreground">{tSite('description')}</p>
      </div>

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
                      {tCategories(category.translationKey)}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explore calculators in this category
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
