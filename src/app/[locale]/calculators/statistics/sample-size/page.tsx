import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { SampleSizeCalculator } from '@/features/statistics/sample-size/SampleSizeCalculator'
import { SampleSizeSEOContent } from '@/features/statistics/sample-size/SampleSizeSEOContent'
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
    namespace: 'calculators.statistics.sample-size',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorPath = '/calculators/statistics/sample-size'

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
          url: `${siteUrl}/og/sample-size-calculator.png`,
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
      images: [`${siteUrl}/og/sample-size-calculator.png`],
    },
  }
}

export default async function SampleSizeCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.statistics.sample-size',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/statistics/sample-size`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/statistics/sample-size`,
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
      confidenceLevel: t('inputs.confidenceLevel'),
      confidenceLevelHelp: t('inputs.confidenceLevelHelp'),
      confidence90: t('inputs.confidence90'),
      confidence95: t('inputs.confidence95'),
      confidence99: t('inputs.confidence99'),
      confidenceCustom: t('inputs.confidenceCustom'),
      customConfidenceLevel: t('inputs.customConfidenceLevel'),
      marginOfError: t('inputs.marginOfError'),
      marginOfErrorHelp: t('inputs.marginOfErrorHelp'),
      populationSize: t('inputs.populationSize'),
      populationSizeHelp: t('inputs.populationSizeHelp'),
      expectedProportion: t('inputs.expectedProportion'),
      expectedProportionHelp: t('inputs.expectedProportionHelp'),
      useFinitePopulation: t('inputs.useFinitePopulation'),
    },
    results: {
      requiredSampleSize: t('results.requiredSampleSize'),
      sampleSizeInfinite: t('results.sampleSizeInfinite'),
      confidenceLevel: t('results.confidenceLevel'),
      marginOfError: t('results.marginOfError'),
      expectedProportion: t('results.expectedProportion'),
      populationSize: t('results.populationSize'),
      samplingFraction: t('results.samplingFraction'),
      finiteCorrectionApplied: t('results.finiteCorrectionApplied'),
    },
    comparison: {
      title: t('comparison.title'),
      showComparison: t('comparison.showComparison'),
      hideComparison: t('comparison.hideComparison'),
      confidenceLevel: t('comparison.confidenceLevel'),
      marginOfError: t('comparison.marginOfError'),
      sampleSize: t('comparison.sampleSize'),
    },
    formula: t('formula'),
    showFormula: t('showFormula'),
    hideFormula: t('hideFormula'),
    reset: t('reset'),
    interpretation: {
      title: t('interpretation.title'),
      description: t('interpretation.description'),
    },
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
    formulaTitle: t('seo.formulaTitle'),
    formulaIntro: t('seo.formulaIntro'),
    formula: t('seo.formula'),
    formulaExplanation: t('seo.formulaExplanation'),
    fpcTitle: t('seo.fpcTitle'),
    fpcContent: t('seo.fpcContent'),
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
      title: 'Cochran, W.G. (1977) - Sampling Techniques',
      url: 'https://www.wiley.com/en-us/Sampling+Techniques%2C+3rd+Edition-p-9780471162407',
    },
    {
      title: 'NIST - Sample Size',
      url: 'https://www.itl.nist.gov/div898/handbook/prc/section2/prc242.htm',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('sample-size')
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
            initialLikes={87}
            initialHelpful={1245}
          />
        }
        seoContent={<SampleSizeSEOContent translations={seoTranslations} />}
      >
        <SampleSizeCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
