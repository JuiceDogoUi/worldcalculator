import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { FlooringCalculator } from '@/features/construction/flooring/FlooringCalculator'
import { FlooringSEOContent } from '@/features/construction/flooring/FlooringSEOContent'
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
    namespace: 'calculators.construction.flooring',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/construction/flooring`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/construction/flooring`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/construction/flooring`,
    },
  }
}

export default async function FlooringCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.construction.flooring',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/construction/flooring`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/construction/flooring`,
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
      sqft: t('units.sqft'),
      sqm: t('units.sqm'),
      boxes: t('units.boxes'),
    },
    inputs: {
      roomLength: t('inputs.roomLength'),
      roomWidth: t('inputs.roomWidth'),
      flooringType: t('inputs.flooringType'),
      wastePercent: t('inputs.wastePercent'),
    },
    flooringTypes: {
      hardwood: t('flooringTypes.hardwood'),
      laminate: t('flooringTypes.laminate'),
      vinyl: t('flooringTypes.vinyl'),
      tile: t('flooringTypes.tile'),
      carpet: t('flooringTypes.carpet'),
    },
    actions: {
      calculate: t('actions.calculate'),
      reset: t('actions.reset'),
    },
    results: {
      title: t('results.title'),
      floorArea: t('results.floorArea'),
      wasteArea: t('results.wasteArea'),
      totalArea: t('results.totalArea'),
      boxesNeeded: t('results.boxesNeeded'),
      coveragePerBox: t('results.coveragePerBox'),
      materialCost: t('results.materialCost'),
      installationCost: t('results.installationCost'),
      costRange: t('results.costRange'),
    },
    validation: {
      roomLengthRequired: t('validation.roomLengthRequired'),
      roomWidthRequired: t('validation.roomWidthRequired'),
      flooringTypeRequired: t('validation.flooringTypeRequired'),
      wastePercentInvalid: t('validation.wastePercentInvalid'),
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
      title: 'National Wood Flooring Association',
      url: 'https://www.nwfa.org/',
    },
    {
      title: 'Floor Covering Weekly',
      url: 'https://www.floorcoveringweekly.com/',
    },
  ]

  // Get last modified date
  const calculatorConfig = getCalculatorBySlug('flooring')
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
            initialLikes={52}
            initialHelpful={1024}
          />
        }
        seoContent={<FlooringSEOContent translations={seoTranslations} />}
      >
        <FlooringCalculator
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
