import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { TemperatureConverter } from '@/features/conversion/temperature/TemperatureConverter'
import { TemperatureSEOContent } from '@/features/conversion/temperature/TemperatureSEOContent'
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
    namespace: 'calculators.conversion.temperature',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/conversion/temperature`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/conversion/temperature`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/conversion/temperature`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function TemperatureConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.conversion.temperature',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/conversion/temperature`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/conversion/temperature`,
      applicationCategory: 'UtilitiesApplication',
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
    celsius: t('inputs.celsius'),
    fahrenheit: t('inputs.fahrenheit'),
    kelvin: t('inputs.kelvin'),
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      celsius: t('results.celsius'),
      fahrenheit: t('results.fahrenheit'),
      kelvin: t('results.kelvin'),
    },
    units: {
      celsius: t('units.celsius'),
      fahrenheit: t('units.fahrenheit'),
      kelvin: t('units.kelvin'),
    },
    referencePoints: {
      title: t('referencePoints.title'),
      absoluteZero: t('referencePoints.absoluteZero'),
      waterFreezing: t('referencePoints.waterFreezing'),
      roomTemperature: t('referencePoints.roomTemperature'),
      bodyTemperature: t('referencePoints.bodyTemperature'),
      waterBoiling: t('referencePoints.waterBoiling'),
    },
    validation: {
      required: t('validation.required'),
      invalid: t('validation.invalid'),
      belowAbsoluteZero: t('validation.belowAbsoluteZero'),
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
    formulasTitle: t('seo.formulasTitle'),
    formulas: [
      {
        name: t('seo.formula1Name'),
        formula: t('seo.formula1Formula'),
        description: t('seo.formula1Description'),
      },
      {
        name: t('seo.formula2Name'),
        formula: t('seo.formula2Formula'),
        description: t('seo.formula2Description'),
      },
      {
        name: t('seo.formula3Name'),
        formula: t('seo.formula3Formula'),
        description: t('seo.formula3Description'),
      },
    ],
    scalesTitle: t('seo.scalesTitle'),
    scales: [
      {
        name: t('seo.scale1Name'),
        description: t('seo.scale1Description'),
        usedIn: t('seo.scale1UsedIn'),
      },
      {
        name: t('seo.scale2Name'),
        description: t('seo.scale2Description'),
        usedIn: t('seo.scale2UsedIn'),
      },
      {
        name: t('seo.scale3Name'),
        description: t('seo.scale3Description'),
        usedIn: t('seo.scale3UsedIn'),
      },
    ],
    howToUseTitle: t('seo.howToUseTitle'),
    howToUseSteps: [
      t('seo.howToUseStep1'),
      t('seo.howToUseStep2'),
      t('seo.howToUseStep3'),
      t('seo.howToUseStep4'),
      t('seo.howToUseStep5'),
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
  const howToStepNames = [
    t('seo.howToStepName1'),
    t('seo.howToStepName2'),
    t('seo.howToStepName3'),
    t('seo.howToStepName4'),
    t('seo.howToStepName5'),
  ]
  const howToSchema = generateHowToSchema(
    t('seo.howToUseTitle'),
    t('description'),
    seoTranslations.howToUseSteps.map((step, i) => ({
      name: howToStepNames[i],
      text: step,
    }))
  )

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      { name: tCategories('conversion'), url: `/${locale}/calculators/conversion` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    {
      title: 'NIST - Temperature Conversion',
      url: 'https://www.nist.gov/pml/owm/metric-si/si-units-temperature',
    },
    {
      title: 'Bureau of Weights and Measures',
      url: 'https://www.bipm.org/en/measurement-units/si-derived-units',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('temperature')
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
        categorySlug="conversion"
        categoryName={tCategories('conversion')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={42}
            initialHelpful={856}
          />
        }
        seoContent={<TemperatureSEOContent translations={seoTranslations} />}
      >
        <TemperatureConverter
          locale={locale}
          translations={calculatorTranslations}
        />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
