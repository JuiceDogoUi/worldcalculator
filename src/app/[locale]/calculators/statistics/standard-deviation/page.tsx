import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { StandardDeviationCalculator } from '@/features/statistics/standard-deviation/StandardDeviationCalculator'
import { StandardDeviationSEOContent } from '@/features/statistics/standard-deviation/StandardDeviationSEOContent'
import { locales } from '@/i18n/locales'
import { getCalculatorBySlug } from '@/config/calculators'
import {
  generateCalculatorSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateBreadcrumbSchema,
} from '@/lib/structuredData'

export const dynamic = 'force-static'
export const dynamicParams = false

// Generate static params for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// Regional locale mapping for hreflang
const localeToRegion: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  pt: 'pt-PT',
  it: 'it-IT',
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.statistics.standard-deviation',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorPath = '/calculators/statistics/standard-deviation'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}${calculatorPath}`,
      languages: {
        ...Object.fromEntries(
          locales.map((loc) => [
            localeToRegion[loc] || loc,
            `${siteUrl}/${loc}${calculatorPath}`,
          ])
        ),
        'x-default': `${siteUrl}/en${calculatorPath}`,
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}${calculatorPath}`,
      siteName: 'World Calculator',
      locale: localeToRegion[locale] || locale,
      images: [
        {
          url: `${siteUrl}/og/standard-deviation-calculator.png`,
          width: 1200,
          height: 630,
          alt: t('title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: [`${siteUrl}/og/standard-deviation-calculator.png`],
    },
  }
}

export default async function StandardDeviationCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.statistics.standard-deviation',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/statistics/standard-deviation`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/statistics/standard-deviation`,
      applicationCategory: 'EducationalApplication',
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

  // Calculator translations
  const calculatorTranslations = {
    inputs: {
      dataInput: t('inputs.dataInput'),
      dataInputPlaceholder: t('inputs.dataInputPlaceholder'),
      dataInputHelp: t('inputs.dataInputHelp'),
      calculationType: t('inputs.calculationType'),
      population: t('inputs.population'),
      populationDescription: t('inputs.populationDescription'),
      sample: t('inputs.sample'),
      sampleDescription: t('inputs.sampleDescription'),
    },
    results: {
      standardDeviation: t('results.standardDeviation'),
      variance: t('results.variance'),
      mean: t('results.mean'),
      count: t('results.count'),
      sum: t('results.sum'),
      sumOfSquares: t('results.sumOfSquares'),
      range: t('results.range'),
      min: t('results.min'),
      max: t('results.max'),
      standardError: t('results.standardError'),
      coefficientOfVariation: t('results.coefficientOfVariation'),
    },
    steps: {
      title: t('steps.title'),
      step1: t('steps.step1'),
      step2: t('steps.step2'),
      step3: t('steps.step3'),
      step4: t('steps.step4'),
      step5: t('steps.step5'),
      deviationsTable: t('steps.deviationsTable'),
      value: t('steps.value'),
      deviation: t('steps.deviation'),
      squaredDeviation: t('steps.squaredDeviation'),
    },
    formula: t('formula'),
    showSteps: t('showSteps'),
    hideSteps: t('hideSteps'),
    valuesDetected: t('valuesDetected'),
    reset: t('reset'),
    tryExample: t('tryExample'),
  }

  // Disclaimer translations
  const disclaimerTranslations = {
    text: t('disclaimer.text'),
    note: t('disclaimer.note'),
  }

  // SEO content translations
  const seoTranslations = {
    whatIsTitle: t('seo.whatIsTitle'),
    whatIsContent: t('seo.whatIsContent'),
    typesTitle: t('seo.typesTitle'),
    typesIntro: t('seo.typesIntro'),
    types: [t('seo.type1'), t('seo.type2')],
    benefitsTitle: t('seo.benefitsTitle'),
    benefits: [
      t('seo.benefit1'),
      t('seo.benefit2'),
      t('seo.benefit3'),
      t('seo.benefit4'),
      t('seo.benefit5'),
    ],
    howToUseTitle: t('seo.howToUseTitle'),
    howToUseSteps: [
      t('seo.howToUseStep1'),
      t('seo.howToUseStep2'),
      t('seo.howToUseStep3'),
      t('seo.howToUseStep4'),
      t('seo.howToUseStep5'),
    ],
    formulasTitle: t('seo.formulasTitle'),
    formulas: [
      {
        name: t('seo.formula1Name'),
        formula: t('seo.formula1'),
        example: t('seo.formula1Example'),
      },
      {
        name: t('seo.formula2Name'),
        formula: t('seo.formula2'),
        example: t('seo.formula2Example'),
      },
    ],
    tipsTitle: t('seo.tipsTitle'),
    tips: [
      t('seo.tip1'),
      t('seo.tip2'),
      t('seo.tip3'),
      t('seo.tip4'),
      t('seo.tip5'),
    ],
    faqTitle: t('seo.faqTitle'),
    faqs: [
      { question: t('seo.faq1Question'), answer: t('seo.faq1Answer') },
      { question: t('seo.faq2Question'), answer: t('seo.faq2Answer') },
      { question: t('seo.faq3Question'), answer: t('seo.faq3Answer') },
      { question: t('seo.faq4Question'), answer: t('seo.faq4Answer') },
      { question: t('seo.faq5Question'), answer: t('seo.faq5Answer') },
      { question: t('seo.faq6Question'), answer: t('seo.faq6Answer') },
      { question: t('seo.faq7Question'), answer: t('seo.faq7Answer') },
      { question: t('seo.faq8Question'), answer: t('seo.faq8Answer') },
    ],
  }

  // Generate FAQ schema for rich snippets
  const faqSchema = generateFAQSchema(seoTranslations.faqs)

  // Generate HowTo schema for rich snippets
  const howToSchema = generateHowToSchema(
    t('seo.howToUseTitle'),
    t('description'),
    seoTranslations.howToUseSteps.map((step, i) => ({
      name: `Step ${i + 1}`,
      text: step,
    }))
  )

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      { name: tCategories('statistics'), url: `/${locale}/calculators/statistics` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    {
      title: 'Khan Academy - Standard Deviation',
      url: 'https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data/variance-standard-deviation-sample/a/population-and-sample-standard-deviation-review',
    },
    {
      title: 'NIST - Standard Deviation',
      url: 'https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('standard-deviation')
  const lastUpdated = calculatorConfig?.lastModified
    ? new Date(calculatorConfig.lastModified).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  // Combine all schemas into an array
  const structuredData = [
    calculatorSchema,
    faqSchema,
    howToSchema,
    breadcrumbSchema,
  ]

  return (
    <>
      {/* Structured data - multiple schemas for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <CalculatorLayout
        title={t('title')}
        description={t('description')}
        categorySlug="statistics"
        categoryName={tCategories('statistics')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={124}
            initialHelpful={1892}
          />
        }
        seoContent={<StandardDeviationSEOContent translations={seoTranslations} />}
      >
        <StandardDeviationCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
