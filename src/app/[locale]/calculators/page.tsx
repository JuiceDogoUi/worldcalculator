import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CalculatorsClient } from './CalculatorsClient'
import type { Metadata } from 'next'
import { locales } from '@/i18n/locales'

export const dynamic = 'force-static'
export const dynamicParams = false

interface CalculatorsPageProps {
  params: Promise<{ locale: string }>
}

/**
 * Generate metadata for calculators listing page
 */
export async function generateMetadata({
  params,
}: CalculatorsPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  const tHub = await getTranslations({ locale, namespace: 'calculatorsHub' })

  const title = `${tHub('title')} | ${t('name')}`
  const description = tHub('subtitle')

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
 * Displays all calculator categories with client-side search
 */
export default async function CalculatorsPage({ params }: CalculatorsPageProps) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const tCategories = await getTranslations({ locale, namespace: 'categories' })
  const tHub = await getTranslations({ locale, namespace: 'calculatorsHub' })

  // Get calculator translations
  const calculatorNames: Record<string, string> = {}
  const tFinanceLoan = await getTranslations({ locale, namespace: 'calculators.finance.loan' })
  const tFinanceMortgage = await getTranslations({ locale, namespace: 'calculators.finance.mortgage' })
  const tFinanceCompoundInterest = await getTranslations({ locale, namespace: 'calculators.finance.compound-interest' })
  const tFinanceSavingsGoal = await getTranslations({ locale, namespace: 'calculators.finance.savings-goal' })
  const tMathPercentage = await getTranslations({ locale, namespace: 'calculators.math.percentage' })

  calculatorNames['loan'] = tFinanceLoan('title')
  calculatorNames['mortgage'] = tFinanceMortgage('title')
  calculatorNames['compound-interest'] = tFinanceCompoundInterest('title')
  calculatorNames['savings-goal'] = tFinanceSavingsGoal('title')
  calculatorNames['percentage'] = tMathPercentage('title')

  return (
    <CalculatorsClient
      translations={{
        noResults: 'No calculators found for',
        browseAll: 'Browse all categories',
        searchResults: 'Search Results',
        found: 'Found',
        calculators: 'calculators',
      }}
      hubTranslations={{
        title: tHub('title'),
        subtitle: tHub('subtitle'),
        introduction: tHub('introduction'),
        browseByCategory: tHub('browseByCategory'),
        browseDescription: tHub('browseDescription'),
        whyUseOurCalculators: tHub('whyUseOurCalculators'),
        whyDescription: tHub('whyDescription'),
        features: {
          accurate: {
            title: tHub('features.accurate.title'),
            description: tHub('features.accurate.description'),
          },
          free: {
            title: tHub('features.free.title'),
            description: tHub('features.free.description'),
          },
          private: {
            title: tHub('features.private.title'),
            description: tHub('features.private.description'),
          },
          multilingual: {
            title: tHub('features.multilingual.title'),
            description: tHub('features.multilingual.description'),
          },
        },
      }}
      categoryTranslations={Object.fromEntries(
        await Promise.all(
          ['finance', 'health', 'math', 'conversion', 'timeDate', 'construction', 'statistics'].map(async (key) => [
            key,
            tCategories(key as 'finance' | 'health' | 'math' | 'conversion' | 'timeDate' | 'construction' | 'statistics'),
          ])
        )
      )}
      categoryDescriptions={{
        finance: tHub('categoryDescriptions.finance'),
        health: tHub('categoryDescriptions.health'),
        math: tHub('categoryDescriptions.math'),
        statistics: tHub('categoryDescriptions.statistics'),
        conversion: tHub('categoryDescriptions.conversion'),
        timeDate: tHub('categoryDescriptions.timeDate'),
        construction: tHub('categoryDescriptions.construction'),
      }}
      calculatorNames={calculatorNames}
    />
  )
}

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
