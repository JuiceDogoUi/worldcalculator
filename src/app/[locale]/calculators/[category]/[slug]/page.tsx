import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { calculators, getAllCalculatorSlugs } from '@/config/calculators'
import { locales } from '@/i18n/locales'
import { generateCalculatorSchema } from '@/lib/structuredData'

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
 * Generate metadata for calculator page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const calculator = calculators.find((calc) => calc.slug === slug)

  if (!calculator) {
    return {
      title: 'Calculator Not Found',
    }
  }

  return {
    title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} Calculator`,
    description: `Free online ${slug} calculator. Calculate ${slug} quickly and easily.`,
    alternates: {
      canonical: `/${locale}/calculators/${calculator.category}/${slug}`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `/${loc}/calculators/${calculator.category}/${slug}`,
        ])
      ),
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

  const tCalculator = await getTranslations({ locale, namespace: 'calculator' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  // Get category translation key
  const categoryKey = calculator.category as
    | 'finance'
    | 'health'
    | 'math'
    | 'conversion'
    | 'timeDate'
    | 'construction'

  // Generate structured data for calculator
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'
  const calculatorName = `${slug.charAt(0).toUpperCase() + slug.slice(1)} Calculator`
  const calculatorDescription = `Free online ${slug} calculator. Calculate ${slug} quickly and easily with our free online calculator.`

  const calculatorSchema = generateCalculatorSchema(
    {
      name: calculatorName,
      description: calculatorDescription,
      url: `/${locale}/calculators/${calculator.category}/${slug}`,
      applicationCategory: 'UtilityApplication',
      offers: {
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      siteName: 'World Calculator',
      siteUrl,
      locale,
    }
  )

  return (
    <>
      {/* Structured data for calculator */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />

      <CalculatorLayout
      title={`${slug.charAt(0).toUpperCase() + slug.slice(1)} Calculator`}
      description={`Calculate ${slug} quickly and easily with our free online calculator.`}
      categorySlug={category}
      categoryName={tCategories(categoryKey)}
    >
      {/* Mock calculator content */}
      <div className="space-y-8">
        {/* Calculator Input Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Input Values</h2>
          <p className="text-muted-foreground">
            This is a mock calculator page for testing routing. Actual
            calculator implementations will be added here.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="value1"
                className="block text-sm font-medium mb-2"
              >
                Value 1
              </label>
              <input
                type="number"
                id="value1"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter value..."
              />
            </div>

            <div>
              <label
                htmlFor="value2"
                className="block text-sm font-medium mb-2"
              >
                Value 2
              </label>
              <input
                type="number"
                id="value2"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter value..."
              />
            </div>

            <button className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Calculate
            </button>
          </div>
        </div>

        {/* Calculator Output Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Result</h2>
          <div className="text-3xl font-bold text-primary">--</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Result will appear here after calculation
          </p>
        </div>

        {/* How to Use Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">
            {tCalculator('howToUse')}
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Enter your first value in the input field</li>
            <li>Enter your second value in the input field</li>
            <li>Click the Calculate button to see the result</li>
            <li>Use the result for your calculations</li>
          </ol>
        </div>

        {/* FAQ Section */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">{tCalculator('faq')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">
                What is this calculator used for?
              </h3>
              <p className="text-sm text-muted-foreground">
                This is a mock calculator for testing the routing system. Real
                calculators will have detailed FAQs here.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">Is this calculator accurate?</h3>
              <p className="text-sm text-muted-foreground">
                This is a demonstration page. Real calculator implementations
                will use precise formulas and validations.
              </p>
            </div>
          </div>
        </div>
      </div>
      </CalculatorLayout>
    </>
  )
}
