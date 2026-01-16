import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { ConcreteCalculator } from '@/features/construction/concrete/ConcreteCalculator'
import { ConcreteSEOContent } from '@/features/construction/concrete/ConcreteSEOContent'
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
    namespace: 'calculators.construction.concrete',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/construction/concrete`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/construction/concrete`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/construction/concrete`,
    },
  }
}

export default async function ConcreteCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.construction.concrete',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/construction/concrete`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/construction/concrete`,
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
    projectType: t('inputs.projectType'),
    projectTypes: {
      slab: t('projectTypes.slab'),
      footing: t('projectTypes.footing'),
      column: t('projectTypes.column'),
      stairs: t('projectTypes.stairs'),
      custom: t('projectTypes.custom'),
    },
    unitSystem: t('inputs.unitSystem'),
    units: {
      imperial: t('units.imperial'),
      metric: t('units.metric'),
      ft: t('units.ft'),
      m: t('units.m'),
      in: t('units.in'),
      cm: t('units.cm'),
      cubicFeet: t('units.cubicFeet'),
      cubicYards: t('units.cubicYards'),
      cubicMeters: t('units.cubicMeters'),
      bags: t('units.bags'),
      lbs: t('units.lbs'),
    },
    inputs: {
      length: t('inputs.length'),
      width: t('inputs.width'),
      thickness: t('inputs.thickness'),
      depth: t('inputs.depth'),
      diameter: t('inputs.diameter'),
      height: t('inputs.height'),
      quantity: t('inputs.quantity'),
      platformWidth: t('inputs.platformWidth'),
      platformDepth: t('inputs.platformDepth'),
      riseHeight: t('inputs.riseHeight'),
      runDepth: t('inputs.runDepth'),
      stepWidth: t('inputs.stepWidth'),
      numberOfSteps: t('inputs.numberOfSteps'),
      volume: t('inputs.volume'),
      wastePercent: t('inputs.wastePercent'),
    },
    actions: {
      calculate: t('actions.calculate'),
      reset: t('actions.reset'),
    },
    results: {
      title: t('results.title'),
      volume: t('results.volume'),
      volumeWithWaste: t('results.volumeWithWaste'),
      bags: t('results.bags'),
      bagOption: t('results.bagOption'),
      bagsNeeded: t('results.bagsNeeded'),
      totalWeight: t('results.totalWeight'),
      preMixed: t('results.preMixed'),
      truckLoads: t('results.truckLoads'),
      recommendation: t('results.recommendation'),
      smallProject: t('results.smallProject'),
      largeProject: t('results.largeProject'),
    },
    validation: {
      projectTypeRequired: t('validation.projectTypeRequired'),
      lengthRequired: t('validation.lengthRequired'),
      widthRequired: t('validation.widthRequired'),
      thicknessRequired: t('validation.thicknessRequired'),
      depthRequired: t('validation.depthRequired'),
      diameterRequired: t('validation.diameterRequired'),
      heightRequired: t('validation.heightRequired'),
      quantityRequired: t('validation.quantityRequired'),
      platformWidthRequired: t('validation.platformWidthRequired'),
      platformDepthRequired: t('validation.platformDepthRequired'),
      riseHeightRequired: t('validation.riseHeightRequired'),
      runDepthRequired: t('validation.runDepthRequired'),
      stepWidthRequired: t('validation.stepWidthRequired'),
      numberOfStepsRequired: t('validation.numberOfStepsRequired'),
      volumeRequired: t('validation.volumeRequired'),
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
    ],
    typesTitle: t('seo.typesTitle'),
    types: [
      { name: t('seo.type1Name'), description: t('seo.type1Desc') },
      { name: t('seo.type2Name'), description: t('seo.type2Desc') },
      { name: t('seo.type3Name'), description: t('seo.type3Desc') },
      { name: t('seo.type4Name'), description: t('seo.type4Desc') },
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
      title: 'Portland Cement Association',
      url: 'https://www.cement.org/',
    },
    {
      title: 'ASTM International - Concrete Standards',
      url: 'https://www.astm.org/products-services/standards-and-publications/standards/concrete-standards.html',
    },
  ]

  // Get last modified date
  const calculatorConfig = getCalculatorBySlug('concrete')
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
            initialHelpful={742}
          />
        }
        seoContent={<ConcreteSEOContent translations={seoTranslations} />}
      >
        <ConcreteCalculator
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
