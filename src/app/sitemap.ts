import { MetadataRoute } from 'next'
import { locales } from '@/i18n/locales'
import { categories } from '@/config/categories'
import { calculators } from '@/config/calculators'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'

export const dynamic = 'force-static'

/**
 * Generate sitemap for SEO
 * Includes all localized pages, categories, and calculators
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const sitemap: MetadataRoute.Sitemap = []

  // Add home page for each locale
  locales.forEach((locale) => {
    sitemap.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}`])
        ),
      },
    })

    // Add calculators index page
    sitemap.push({
      url: `${baseUrl}/${locale}/calculators`,
      lastModified: new Date(),
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${baseUrl}/${loc}/calculators`])
        ),
      },
    })

    // Add category pages
    categories.forEach((category) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/calculators/${category.slug}`,
        lastModified: new Date(),
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              `${baseUrl}/${loc}/calculators/${category.slug}`,
            ])
          ),
        },
      })
    })

    // Add individual calculator pages
    calculators.forEach((calculator) => {
      sitemap.push({
        url: `${baseUrl}/${locale}/calculators/${calculator.category}/${calculator.slug}`,
        lastModified: calculator.lastModified ? new Date(calculator.lastModified) : new Date(),
        changeFrequency: 'monthly',
        priority: calculator.featured ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              `${baseUrl}/${loc}/calculators/${calculator.category}/${calculator.slug}`,
            ])
          ),
        },
      })
    })
  })

  return sitemap
}
