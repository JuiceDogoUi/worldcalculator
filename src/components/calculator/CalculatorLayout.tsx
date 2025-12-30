import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { StickyBanner } from '@/components/ads/StickyBanner'
import { NativeBanner } from '@/components/ads/NativeBanner'

interface CalculatorLayoutProps {
  /**
   * Calculator title (translated)
   */
  title: string

  /**
   * Calculator description (translated)
   */
  description: string

  /**
   * Category slug for breadcrumb
   */
  categorySlug: string

  /**
   * Category name (translated)
   */
  categoryName: string

  /**
   * Last updated date
   */
  lastUpdated?: string

  /**
   * Widget component (sources, likes, share)
   */
  widget?: ReactNode

  /**
   * Main calculator interface
   */
  children: ReactNode

  /**
   * SEO content section (below calculator)
   */
  seoContent?: ReactNode

  /**
   * Optional related calculators section
   */
  relatedCalculators?: ReactNode
}

/**
 * CalculatorLayout component
 * Provides consistent layout for all calculator pages
 * Structure: breadcrumb > last updated > title > widget > calculator > SEO content
 */
export async function CalculatorLayout({
  title,
  description,
  categorySlug,
  categoryName,
  lastUpdated,
  widget,
  children,
  seoContent,
  relatedCalculators,
}: CalculatorLayoutProps) {
  const t = await getTranslations('calculator')

  return (
    <>
      {/* Sticky Side Banners - Only visible on xl screens (1280px+) */}
      <StickyBanner position="left" />
      <StickyBanner position="right" />

      <div className="container py-6 md:py-8">
      {/* Native Banner - Above breadcrumb */}
      <NativeBanner className="mb-6" />

      {/* Breadcrumbs with structured data */}
      <Breadcrumbs
        homeLabel={t('home')}
        items={[
          {
            label: categoryName,
            href: `/calculators/${categorySlug}`,
          },
          {
            label: title,
          },
        ]}
        className="mb-6"
      />

      {/* Title Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-muted-foreground text-lg">
            {description}
          </p>
        )}
        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
            <Clock className="h-4 w-4" aria-hidden="true" />
            <span>{t('lastUpdated')}: {lastUpdated}</span>
          </div>
        )}
      </div>

      {/* Main Calculator Block - Full Width */}
      <Card className="mb-6">
        <CardContent className="pt-0 px-6 pb-6">
          {children}
        </CardContent>
      </Card>

      {/* Widget Section (sources, likes, share) - Below calculator */}
      {widget && (
        <div className="mb-8 border-b pb-4">
          {widget}
        </div>
      )}


      {/* SEO Content Section */}
      {seoContent && (
        <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
          {seoContent}
        </div>
      )}

      {/* Related Calculators */}
      {relatedCalculators && (
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">{t('relatedCalculators')}</h2>
          {relatedCalculators}
        </div>
      )}
      </div>
    </>
  )
}
