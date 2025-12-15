import { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/Breadcrumbs'

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
   * Main calculator interface
   */
  children: ReactNode

  /**
   * Optional related calculators section
   */
  relatedCalculators?: ReactNode
}

/**
 * CalculatorLayout component
 * Provides consistent layout for all calculator pages
 * with breadcrumbs, title, description, and content area
 */
export async function CalculatorLayout({
  title,
  description,
  categorySlug,
  categoryName,
  children,
  relatedCalculators,
}: CalculatorLayoutProps) {
  const t = await getTranslations('calculator')

  return (
    <div className="container py-6 md:py-8">
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
        className="mb-4"
      />

      {/* Title Section */}
      <div className="mb-6 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      {/* Calculator Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Calculator Card */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
          </Card>
        </div>

        {/* Sidebar - Related Calculators or Info */}
        {relatedCalculators && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {t('relatedCalculators')}
                </CardTitle>
              </CardHeader>
              <CardContent>{relatedCalculators}</CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
