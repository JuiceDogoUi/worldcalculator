import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { PercentageCalculator } from '@/features/math/percentage/PercentageCalculator'
import { PercentageSEOContent } from '@/features/math/percentage/PercentageSEOContent'
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
    namespace: 'calculators.math.percentage',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/math/percentage`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/math/percentage`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/math/percentage`,
    },
  }
}

export default async function PercentageCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.math.percentage',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/math/percentage`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/math/percentage`,
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
      whatIsPercentOf: {
        label: t('modes.whatIsPercentOf.label'),
        description: t('modes.whatIsPercentOf.description'),
      },
      isWhatPercentOf: {
        label: t('modes.isWhatPercentOf.label'),
        description: t('modes.isWhatPercentOf.description'),
      },
      isPercentOfWhat: {
        label: t('modes.isPercentOfWhat.label'),
        description: t('modes.isPercentOfWhat.description'),
      },
      percentChange: {
        label: t('modes.percentChange.label'),
        description: t('modes.percentChange.description'),
      },
      percentDifference: {
        label: t('modes.percentDifference.label'),
        description: t('modes.percentDifference.description'),
      },
    },
    inputs: {
      percentValue: t('inputs.percentValue'),
      baseValue: t('inputs.baseValue'),
      partValue: t('inputs.partValue'),
      wholeValue: t('inputs.wholeValue'),
      resultValue: t('inputs.resultValue'),
      percentOfWhole: t('inputs.percentOfWhole'),
      initialValue: t('inputs.initialValue'),
      finalValue: t('inputs.finalValue'),
      value1: t('inputs.value1'),
      value2: t('inputs.value2'),
    },
    result: t('result'),
    formula: t('formula'),
    explanation: t('explanation'),
    absoluteDifference: t('absoluteDifference'),
    increase: t('increase'),
    decrease: t('decrease'),
    noChange: t('noChange'),
    reset: t('reset'),
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
    modesTitle: t('seo.modesTitle'),
    modesIntro: t('seo.modesIntro'),
    modes: [
      t('seo.mode1'),
      t('seo.mode2'),
      t('seo.mode3'),
      t('seo.mode4'),
      t('seo.mode5'),
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
      {
        name: t('seo.formula5Name'),
        formula: t('seo.formula5'),
        example: t('seo.formula5Example'),
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
      title: 'Khan Academy - Percentages',
      url: 'https://www.khanacademy.org/math/cc-sixth-grade-math/cc-6th-ratios-prop-topic/cc-6th-percent-intro/v/describing-the-meaning-of-percent',
    },
    {
      title: 'Math is Fun - Percentages',
      url: 'https://www.mathsisfun.com/percentage.html',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('percentage')
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
            initialLikes={89}
            initialHelpful={1156}
          />
        }
        seoContent={<PercentageSEOContent translations={seoTranslations} />}
      >
        <PercentageCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
