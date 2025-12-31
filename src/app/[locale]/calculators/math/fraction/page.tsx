import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { FractionCalculator } from '@/features/math/fraction/FractionCalculator'
import { FractionSEOContent } from '@/features/math/fraction/FractionSEOContent'
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

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.math.fraction',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/math/fraction`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/math/fraction`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/math/fraction`,
    },
  }
}

export default async function FractionCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.math.fraction',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/math/fraction`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/math/fraction`,
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
    modes: {
      add: {
        label: t('modes.add.label'),
        description: t('modes.add.description'),
      },
      subtract: {
        label: t('modes.subtract.label'),
        description: t('modes.subtract.description'),
      },
      multiply: {
        label: t('modes.multiply.label'),
        description: t('modes.multiply.description'),
      },
      divide: {
        label: t('modes.divide.label'),
        description: t('modes.divide.description'),
      },
      simplify: {
        label: t('modes.simplify.label'),
        description: t('modes.simplify.description'),
      },
      convert: {
        label: t('modes.convert.label'),
        description: t('modes.convert.description'),
      },
    },
    inputs: {
      fraction1: t('inputs.fraction1'),
      fraction2: t('inputs.fraction2'),
      numerator: t('inputs.numerator'),
      denominator: t('inputs.denominator'),
      wholeNumber: t('inputs.wholeNumber'),
      convertTo: t('inputs.convertTo'),
    },
    conversionFormats: {
      decimal: t('conversionFormats.decimal'),
      percentage: t('conversionFormats.percentage'),
      mixed: t('conversionFormats.mixed'),
      improper: t('conversionFormats.improper'),
    },
    result: t('result'),
    decimalValue: t('decimalValue'),
    percentageValue: t('percentageValue'),
    steps: t('steps'),
    formula: t('formula'),
    explanation: t('explanation'),
    reset: t('reset'),
    conversionResults: t('conversionResults'),
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
    operationsTitle: t('seo.operationsTitle'),
    operationsIntro: t('seo.operationsIntro'),
    operations: [
      t('seo.operation1'),
      t('seo.operation2'),
      t('seo.operation3'),
      t('seo.operation4'),
      t('seo.operation5'),
      t('seo.operation6'),
    ],
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
      {
        name: t('seo.formula3Name'),
        formula: t('seo.formula3'),
        example: t('seo.formula3Example'),
      },
      {
        name: t('seo.formula4Name'),
        formula: t('seo.formula4'),
        example: t('seo.formula4Example'),
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
      { name: tCategories('math'), url: `/${locale}/calculators/math` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    {
      title: 'Khan Academy - Fractions',
      url: 'https://www.khanacademy.org/math/arithmetic/fraction-arithmetic',
    },
    {
      title: 'Math is Fun - Fractions',
      url: 'https://www.mathsisfun.com/fractions.html',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('fraction')
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
        categorySlug="math"
        categoryName={tCategories('math')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={72}
            initialHelpful={948}
          />
        }
        seoContent={<FractionSEOContent translations={seoTranslations} />}
      >
        <FractionCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
