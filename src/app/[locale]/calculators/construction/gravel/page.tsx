import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { GravelCalculator } from '@/features/construction/gravel/GravelCalculator'
import { GravelSEOContent } from '@/features/construction/gravel/GravelSEOContent'
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
    namespace: 'calculators.construction.gravel',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/construction/gravel`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/construction/gravel`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/construction/gravel`,
    },
  }
}

export default async function GravelCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.construction.gravel',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/construction/gravel`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/construction/gravel`,
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
    unitSystem: t('inputs.unitSystem'),
    units: {
      imperial: t('units.imperial'),
      metric: t('units.metric'),
      ft: t('units.ft'),
      m: t('units.m'),
      inches: t('units.inches'),
      cm: t('units.cm'),
      sqft: t('units.sqft'),
      sqm: t('units.sqm'),
      cuft: t('units.cuft'),
      cuyd: t('units.cuyd'),
      cum: t('units.cum'),
      lbs: t('units.lbs'),
      tons: t('units.tons'),
      kg: t('units.kg'),
      metricTons: t('units.metricTons'),
      bags: t('units.bags'),
    },
    inputs: {
      length: t('inputs.length'),
      width: t('inputs.width'),
      depth: t('inputs.depth'),
      gravelType: t('inputs.gravelType'),
      compactionFactor: t('inputs.compactionFactor'),
    },
    gravelTypes: {
      'pea-gravel': t('gravelTypes.pea-gravel'),
      'crushed-stone': t('gravelTypes.crushed-stone'),
      'river-rock': t('gravelTypes.river-rock'),
      'decomposed-granite': t('gravelTypes.decomposed-granite'),
      'lava-rock': t('gravelTypes.lava-rock'),
      'base-gravel': t('gravelTypes.base-gravel'),
    },
    actions: {
      calculate: t('actions.calculate'),
      reset: t('actions.reset'),
    },
    results: {
      title: t('results.title'),
      area: t('results.area'),
      volume: t('results.volume'),
      weight: t('results.weight'),
      bags50lb: t('results.bags50lb'),
      estimatedCost: t('results.estimatedCost'),
      materialCost: t('results.materialCost'),
      deliveryCost: t('results.deliveryCost'),
      totalCost: t('results.totalCost'),
    },
    validation: {
      lengthRequired: t('validation.lengthRequired'),
      widthRequired: t('validation.widthRequired'),
      depthRequired: t('validation.depthRequired'),
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
    formula1Name: t('seo.formula1Name'),
    formula1: t('seo.formula1'),
    formula1Desc: t('seo.formula1Desc'),
    formula2Name: t('seo.formula2Name'),
    formula2: t('seo.formula2'),
    formula2Desc: t('seo.formula2Desc'),
    formula3Name: t('seo.formula3Name'),
    formula3: t('seo.formula3'),
    formula3Desc: t('seo.formula3Desc'),
    typesTitle: t('seo.typesTitle'),
    type1Name: t('seo.type1Name'),
    type1Desc: t('seo.type1Desc'),
    type2Name: t('seo.type2Name'),
    type2Desc: t('seo.type2Desc'),
    type3Name: t('seo.type3Name'),
    type3Desc: t('seo.type3Desc'),
    type4Name: t('seo.type4Name'),
    type4Desc: t('seo.type4Desc'),
    type5Name: t('seo.type5Name'),
    type5Desc: t('seo.type5Desc'),
    type6Name: t('seo.type6Name'),
    type6Desc: t('seo.type6Desc'),
    howToTitle: t('seo.howToTitle'),
    howToStep1: t('seo.howToStep1'),
    howToStep2: t('seo.howToStep2'),
    howToStep3: t('seo.howToStep3'),
    howToStep4: t('seo.howToStep4'),
    howToStep5: t('seo.howToStep5'),
    tipsTitle: t('seo.tipsTitle'),
    tip1: t('seo.tip1'),
    tip2: t('seo.tip2'),
    tip3: t('seo.tip3'),
    tip4: t('seo.tip4'),
    tip5: t('seo.tip5'),
    faqTitle: t('seo.faqTitle'),
    faq1Question: t('seo.faq1Question'),
    faq1Answer: t('seo.faq1Answer'),
    faq2Question: t('seo.faq2Question'),
    faq2Answer: t('seo.faq2Answer'),
    faq3Question: t('seo.faq3Question'),
    faq3Answer: t('seo.faq3Answer'),
    faq4Question: t('seo.faq4Question'),
    faq4Answer: t('seo.faq4Answer'),
    faq5Question: t('seo.faq5Question'),
    faq5Answer: t('seo.faq5Answer'),
    faq6Question: t('seo.faq6Question'),
    faq6Answer: t('seo.faq6Answer'),
    faq7Question: t('seo.faq7Question'),
    faq7Answer: t('seo.faq7Answer'),
    faq8Question: t('seo.faq8Question'),
    faq8Answer: t('seo.faq8Answer'),
  }

  // Generate FAQ schema
  const faqs = [
    { question: t('seo.faq1Question'), answer: t('seo.faq1Answer') },
    { question: t('seo.faq2Question'), answer: t('seo.faq2Answer') },
    { question: t('seo.faq3Question'), answer: t('seo.faq3Answer') },
    { question: t('seo.faq4Question'), answer: t('seo.faq4Answer') },
    { question: t('seo.faq5Question'), answer: t('seo.faq5Answer') },
    { question: t('seo.faq6Question'), answer: t('seo.faq6Answer') },
    { question: t('seo.faq7Question'), answer: t('seo.faq7Answer') },
    { question: t('seo.faq8Question'), answer: t('seo.faq8Answer') },
  ]
  const faqSchema = generateFAQSchema(faqs)

  // Generate HowTo schema
  const howToSteps = [
    t('seo.howToStep1'),
    t('seo.howToStep2'),
    t('seo.howToStep3'),
    t('seo.howToStep4'),
    t('seo.howToStep5'),
  ]
  const howToSchema = generateHowToSchema(
    t('seo.howToTitle'),
    t('description'),
    howToSteps.map((step, i) => ({
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
      title: 'Landscape Materials Association',
      url: 'https://www.landscapematerialsassociation.org/',
    },
    {
      title: 'U.S. Geological Survey - Aggregates',
      url: 'https://www.usgs.gov/centers/national-minerals-information-center/crushed-stone-statistics-and-information',
    },
  ]

  // Get last modified date
  const calculatorConfig = getCalculatorBySlug('gravel')
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
            initialLikes={38}
            initialHelpful={792}
          />
        }
        seoContent={<GravelSEOContent translations={seoTranslations} />}
      >
        <GravelCalculator
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
