import { notFound } from 'next/navigation'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'
import { calculators, getAllCalculatorSlugs } from '@/config/calculators'
import { locales } from '@/i18n/locales'

interface CalculatorMeta {
  title: string
  description: string
  keywords?: string
}

export const dynamic = 'force-static'
export const dynamicParams = false

/**
 * Generate static params for all calculator pages
 */
export function generateStaticParams() {
  const slugs = getAllCalculatorSlugs()

  // Generate params for all locales × all calculators
  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      category: slug.category,
      slug: slug.slug,
    }))
  )
}

/**
 * Get calculator-specific translations
 */
async function getCalculatorTranslations(
  locale: string,
  category: string,
  slug: string
): Promise<{ title: string; description: string; meta?: CalculatorMeta } | null> {
  try {
    const messages = await getMessages({ locale })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calculatorMessages = (messages as any)?.calculators?.[category]?.[slug]
    if (calculatorMessages) {
      return {
        title: calculatorMessages.title || `${slug.charAt(0).toUpperCase() + slug.slice(1)} Calculator`,
        description: calculatorMessages.description || `Free online ${slug} calculator.`,
        meta: calculatorMessages.meta,
      }
    }
  } catch {
    // Fall back to generic title
  }
  return null
}

/**
 * Generate metadata for calculator page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>
}): Promise<Metadata> {
  const { locale, category, slug } = await params
  const calculator = calculators.find((calc) => calc.slug === slug)

  if (!calculator) {
    return {
      title: 'Calculator Not Found',
    }
  }

  // Get translated metadata
  const calcTranslations = await getCalculatorTranslations(locale, category, slug)
  const meta = calcTranslations?.meta

  // Use SEO-optimized title/description from translations, or fall back to generic
  const title = meta?.title || calcTranslations?.title || `${slug.charAt(0).toUpperCase() + slug.slice(1)} Calculator`
  const description = meta?.description || calcTranslations?.description || `Free online ${slug} calculator. Calculate ${slug} quickly and easily.`

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title,
    description,
    keywords: meta?.keywords,
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/${calculator.category}/${slug}`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/${calculator.category}/${slug}`,
        ])
      ),
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${locale}/calculators/${calculator.category}/${slug}`,
      siteName: 'World Calculator',
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
 * Calculator detail page
 */
export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale, category, slug } = await params

  // Find calculator in registry
  const calculator = calculators.find((calc) => calc.slug === slug)

  // 404 if calculator not found
  if (!calculator) {
    notFound()
  }

  // Validate category matches
  if (calculator.category !== category) {
    notFound()
  }

  // All calculators should have their own specific page.tsx file
  // (e.g., finance/loan/page.tsx, health/bmi/page.tsx)
  // If we reach this fallback, return 404 to avoid showing empty content
  notFound()
}
