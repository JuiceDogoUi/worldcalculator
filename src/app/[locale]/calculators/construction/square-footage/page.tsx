import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { SquareFootageCalculator } from '@/features/construction/square-footage/SquareFootageCalculator'
import { SquareFootageSEOContent } from '@/features/construction/square-footage/SquareFootageSEOContent'
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.construction.square-footage',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/construction/square-footage`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/construction/square-footage`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/construction/square-footage`,
    },
  }
}

export default async function SquareFootageCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.construction.square-footage',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/construction/square-footage`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/construction/square-footage`,
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
    shape: t('inputs.shape'),
    shapes: {
      rectangle: t('shapes.rectangle'),
      circle: t('shapes.circle'),
      triangle: t('shapes.triangle'),
      'l-shape': t('shapes.l-shape'),
      trapezoid: t('shapes.trapezoid'),
    },
    unitSystem: t('inputs.unitSystem'),
    units: {
      imperial: t('units.imperial'),
      metric: t('units.metric'),
      ft: t('units.ft'),
      m: t('units.m'),
      sqft: t('units.sqft'),
      sqm: t('units.sqm'),
      sqyd: t('units.sqyd'),
      acres: t('units.acres'),
      gallons: t('units.gallons'),
      liters: t('units.liters'),
    },
    inputs: {
      length: t('inputs.length'),
      width: t('inputs.width'),
      diameter: t('inputs.diameter'),
      base: t('inputs.base'),
      height: t('inputs.height'),
      length1: t('inputs.length1'),
      width1: t('inputs.width1'),
      length2: t('inputs.length2'),
      width2: t('inputs.width2'),
      base1: t('inputs.base1'),
      base2: t('inputs.base2'),
    },
    actions: {
      calculate: t('actions.calculate'),
      reset: t('actions.reset'),
    },
    results: {
      title: t('results.title'),
      squareFeet: t('results.squareFeet'),
      squareMeters: t('results.squareMeters'),
      squareYards: t('results.squareYards'),
      acres: t('results.acres'),
      materials: t('results.materials'),
      paint: t('results.paint'),
      paintNote: t('results.paintNote'),
      flooring: t('results.flooring'),
      flooringNote: t('results.flooringNote'),
    },
    validation: {
      shapeRequired: t('validation.shapeRequired'),
      lengthRequired: t('validation.lengthRequired'),
      widthRequired: t('validation.widthRequired'),
      diameterRequired: t('validation.diameterRequired'),
      baseRequired: t('validation.baseRequired'),
      heightRequired: t('validation.heightRequired'),
      length1Required: t('validation.length1Required'),
      width1Required: t('validation.width1Required'),
      length2Required: t('validation.length2Required'),
      width2Required: t('validation.width2Required'),
      base1Required: t('validation.base1Required'),
      base2Required: t('validation.base2Required'),
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
        formula: t('seo.formula1'),
        description: t('seo.formula1Desc'),
      },
      {
        name: t('seo.formula2Name'),
        formula: t('seo.formula2'),
        description: t('seo.formula2Desc'),
      },
      {
        name: t('seo.formula3Name'),
        formula: t('seo.formula3'),
        description: t('seo.formula3Desc'),
      },
      {
        name: t('seo.formula4Name'),
        formula: t('seo.formula4'),
        description: t('seo.formula4Desc'),
      },
    ],
    useCasesTitle: t('seo.useCasesTitle'),
    useCases: [
      t('seo.useCase1'),
      t('seo.useCase2'),
      t('seo.useCase3'),
      t('seo.useCase4'),
      t('seo.useCase5'),
    ],
    howToTitle: t('seo.howToTitle'),
    howToSteps: [
      t('seo.howToStep1'),
      t('seo.howToStep2'),
      t('seo.howToStep3'),
      t('seo.howToStep4'),
      t('seo.howToStep5'),
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

  // Generate FAQ schema
  const faqSchema = generateFAQSchema(seoTranslations.faqs)

  // Generate HowTo schema
  const howToSchema = generateHowToSchema(
    t('seo.howToTitle'),
    t('description'),
    seoTranslations.howToSteps.map((step, i) => ({
      name: `Step ${i + 1}`,
      text: step,
    }))
  )

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      {
        name: tCategories('construction'),
        url: `/${locale}/calculators/construction`,
      },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources
  const sources = [
    {
      title: 'NIST - Units of Measurement',
      url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion',
    },
    {
      title: 'EPA - Construction Calculator',
      url: 'https://www.epa.gov/smm/tools-construction-and-demolition-materials',
    },
  ]

  // Get last modified date
  const calculatorConfig = getCalculatorBySlug('square-footage')
  const lastUpdated = calculatorConfig?.lastModified
    ? new Date(calculatorConfig.lastModified).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  // Combine schemas
  const structuredData = [
    calculatorSchema,
    faqSchema,
    howToSchema,
    breadcrumbSchema,
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <CalculatorLayout
        title={t('title')}
        description={t('description')}
        categorySlug="construction"
        categoryName={tCategories('construction')}
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
        seoContent={<SquareFootageSEOContent translations={seoTranslations} />}
      >
        <SquareFootageCalculator
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
