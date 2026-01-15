import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { SpeedConverter } from '@/features/conversion/speed/SpeedConverter'
import { SpeedSEOContent } from '@/features/conversion/speed/SpeedSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.speed' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/conversion/speed`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/conversion/speed`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/conversion/speed`,
    },
  }
}

export default async function SpeedConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.speed' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/conversion/speed`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/conversion/speed`,
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

  // Calculator translations
  const calculatorTranslations = {
    value: t('inputs.value'),
    fromUnit: t('inputs.fromUnit'),
    toUnit: t('inputs.toUnit'),
    result: t('outputs.result'),
    swap: t('actions.swap'),
    reset: t('actions.reset'),
    allConversions: t('outputs.allConversions'),
    contextTitle: t('outputs.contextTitle'),
    units: {
      kmh: t('units.kmh'),
      mph: t('units.mph'),
      ms: t('units.ms'),
      fts: t('units.fts'),
      knots: t('units.knots'),
    },
    contexts: {
      walking: t('contexts.walking'),
      running: t('contexts.running'),
      cycling: t('contexts.cycling'),
      cityDriving: t('contexts.cityDriving'),
      highwayDriving: t('contexts.highwayDriving'),
      lightWind: t('contexts.lightWind'),
      strongWind: t('contexts.strongWind'),
      commercialAircraft: t('contexts.commercialAircraft'),
      fastTrain: t('contexts.fastTrain'),
      speedOfSound: t('contexts.speedOfSound'),
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
    unitsTitle: t('seo.unitsTitle'),
    units: [
      t('seo.unitKmh'),
      t('seo.unitMph'),
      t('seo.unitMs'),
      t('seo.unitFts'),
      t('seo.unitKnots'),
    ],
    useCasesTitle: t('seo.useCasesTitle'),
    useCases: [
      t('seo.useCase1'),
      t('seo.useCase2'),
      t('seo.useCase3'),
      t('seo.useCase4'),
      t('seo.useCase5'),
    ],
    conversionTableTitle: t('seo.conversionTableTitle'),
    conversionTableHeaders: [
      t('seo.tableHeader1'),
      t('seo.tableHeader2'),
      t('seo.tableHeader3'),
      t('seo.tableHeader4'),
      t('seo.tableHeader5'),
      t('seo.tableHeader6'),
    ],
    conversionTableRows: [
      [t('seo.tableRow1Col1'), t('seo.tableRow1Col2'), t('seo.tableRow1Col3'), t('seo.tableRow1Col4'), t('seo.tableRow1Col5'), t('seo.tableRow1Col6')],
      [t('seo.tableRow2Col1'), t('seo.tableRow2Col2'), t('seo.tableRow2Col3'), t('seo.tableRow2Col4'), t('seo.tableRow2Col5'), t('seo.tableRow2Col6')],
      [t('seo.tableRow3Col1'), t('seo.tableRow3Col2'), t('seo.tableRow3Col3'), t('seo.tableRow3Col4'), t('seo.tableRow3Col5'), t('seo.tableRow3Col6')],
      [t('seo.tableRow4Col1'), t('seo.tableRow4Col2'), t('seo.tableRow4Col3'), t('seo.tableRow4Col4'), t('seo.tableRow4Col5'), t('seo.tableRow4Col6')],
      [t('seo.tableRow5Col1'), t('seo.tableRow5Col2'), t('seo.tableRow5Col3'), t('seo.tableRow5Col4'), t('seo.tableRow5Col5'), t('seo.tableRow5Col6')],
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
      { name: tCategories('conversion'), url: `/${locale}/calculators/conversion` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    { title: 'NIST - Units of Speed', url: 'https://www.nist.gov/pml/special-publication-811' },
    { title: 'International Bureau of Weights and Measures', url: 'https://www.bipm.org/' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('speed')
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
            initialLikes={89}
            initialHelpful={756}
          />
        }
        seoContent={<SpeedSEOContent translations={seoTranslations} />}
      >
        <SpeedConverter
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
