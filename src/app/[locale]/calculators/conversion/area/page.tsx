import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { AreaConverter } from '@/features/conversion/area/AreaConverter'
import { AreaSEOContent } from '@/features/conversion/area/AreaSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.area' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/conversion/area`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/conversion/area`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/conversion/area`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function AreaConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.area' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/conversion/area`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/conversion/area`,
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
    result: t('results.result'),
    allConversions: t('results.allConversions'),
    metricUnits: t('units.metricUnits'),
    imperialUnits: t('units.imperialUnits'),
    swap: t('actions.swap'),
    reset: t('actions.reset'),
    formula: t('results.formula'),
    conversionFactor: t('results.conversionFactor'),
    realEstateContext: t('results.realEstateContext'),
    landMeasurement: t('results.landMeasurement'),
    units: {
      mm2: { name: t('units.mm2.name'), abbr: t('units.mm2.abbr') },
      cm2: { name: t('units.cm2.name'), abbr: t('units.cm2.abbr') },
      m2: { name: t('units.m2.name'), abbr: t('units.m2.abbr') },
      km2: { name: t('units.km2.name'), abbr: t('units.km2.abbr') },
      hectare: { name: t('units.hectare.name'), abbr: t('units.hectare.abbr') },
      in2: { name: t('units.in2.name'), abbr: t('units.in2.abbr') },
      ft2: { name: t('units.ft2.name'), abbr: t('units.ft2.abbr') },
      yd2: { name: t('units.yd2.name'), abbr: t('units.yd2.abbr') },
      acre: { name: t('units.acre.name'), abbr: t('units.acre.abbr') },
      mi2: { name: t('units.mi2.name'), abbr: t('units.mi2.abbr') },
    },
    validation: {
      valueRequired: t('validation.valueRequired'),
      valueNegative: t('validation.valueNegative'),
      valueInvalid: t('validation.valueInvalid'),
      valueMax: t('validation.valueMax'),
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
    whenToUseTitle: t('seo.whenToUseTitle'),
    whenToUseIntro: t('seo.whenToUseIntro'),
    whenToUsePoints: [
      t('seo.whenToUsePoint1'),
      t('seo.whenToUsePoint2'),
      t('seo.whenToUsePoint3'),
      t('seo.whenToUsePoint4'),
      t('seo.whenToUsePoint5'),
    ],
    unitTypesTitle: t('seo.unitTypesTitle'),
    unitTypes: [
      t('seo.unitTypeMetric'),
      t('seo.unitTypeImperial'),
      t('seo.unitTypeRealEstate'),
      t('seo.unitTypeLand'),
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
    commonConversionsTitle: t('seo.commonConversionsTitle'),
    commonConversions: [
      t('seo.commonConversion1'),
      t('seo.commonConversion2'),
      t('seo.commonConversion3'),
      t('seo.commonConversion4'),
    ],
    realEstateTitle: t('seo.realEstateTitle'),
    realEstateContent: t('seo.realEstateContent'),
    formulaTitle: t('seo.formulaTitle'),
    formulaContent: t('seo.formulaContent'),
    formulaExample: t('seo.formulaExample'),
    tipsTitle: t('seo.tipsTitle'),
    tips: [
      t('seo.tip1'),
      t('seo.tip2'),
      t('seo.tip3'),
      t('seo.tip4'),
      t('seo.tip5'),
      t('seo.tip6'),
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
    { title: 'NIST - SI Units', url: 'https://www.nist.gov/pml/owm/metric-si-prefixes' },
    { title: 'BIPM - SI Brochure', url: 'https://www.bipm.org/en/publications/si-brochure' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('area')
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
            initialHelpful={742}
          />
        }
        seoContent={<AreaSEOContent translations={seoTranslations} />}
      >
        <AreaConverter
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
