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
 * Displays all calculator categories with client-side search
 */
export default async function CalculatorsPage({ params }: CalculatorsPageProps) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const tSite = await getTranslations({ locale, namespace: 'site' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  return (
    <CalculatorsClient
      locale={locale}
      siteName={tSite('name')}
      siteDescription={tSite('description')}
      translations={{
        noResults: 'No calculators found for',
        browseAll: 'Browse all categories',
        searchResults: 'Search Results',
        found: 'Found',
        calculators: 'calculators',
      }}
      categoryTranslations={Object.fromEntries(
        await Promise.all(
          ['finance', 'health', 'math', 'conversion', 'timeDate', 'construction'].map(async (key) => [
            key,
            tCategories(key as 'finance' | 'health' | 'math' | 'conversion' | 'timeDate' | 'construction'),
          ])
        )
      )}
    />
  )
}

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
