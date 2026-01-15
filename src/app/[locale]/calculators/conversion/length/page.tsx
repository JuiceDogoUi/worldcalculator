import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { LengthConverter } from '@/features/conversion/length/LengthConverter'
import { LengthSEOContent } from '@/features/conversion/length/LengthSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.length' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/conversion/length`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/conversion/length`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/conversion/length`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function LengthConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.length' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/conversion/length`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/conversion/length`,
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

  // Converter translations
  const converterTranslations = {
    inputValue: t('inputs.value'),
    fromUnit: t('inputs.fromUnit'),
    toUnit: t('inputs.toUnit'),
    result: t('results.title'),
    swap: t('actions.swap'),
    reset: t('actions.reset'),
    allConversions: t('results.allConversions'),
    commonConversions: t('results.commonConversions'),
    metricUnits: t('unitSystems.metric'),
    imperialUnits: t('unitSystems.imperial'),
    conversionFactor: t('results.conversionFactor'),
    units: {
      mm: { name: t('units.mm.name'), abbr: t('units.mm.abbr') },
      cm: { name: t('units.cm.name'), abbr: t('units.cm.abbr') },
      m: { name: t('units.m.name'), abbr: t('units.m.abbr') },
      km: { name: t('units.km.name'), abbr: t('units.km.abbr') },
      in: { name: t('units.in.name'), abbr: t('units.in.abbr') },
      ft: { name: t('units.ft.name'), abbr: t('units.ft.abbr') },
      yd: { name: t('units.yd.name'), abbr: t('units.yd.abbr') },
      mi: { name: t('units.mi.name'), abbr: t('units.mi.abbr') },
      nmi: { name: t('units.nmi.name'), abbr: t('units.nmi.abbr') },
    },
    validation: {
      required: t('validation.required'),
      invalidNumber: t('validation.invalidNumber'),
      negativeValue: t('validation.negativeValue'),
      invalidUnit: t('validation.invalidUnit'),
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
    unitSystemsTitle: t('seo.unitSystemsTitle'),
    metricSystemTitle: t('seo.metricSystemTitle'),
    metricSystemDesc: t('seo.metricSystemDesc'),
    imperialSystemTitle: t('seo.imperialSystemTitle'),
    imperialSystemDesc: t('seo.imperialSystemDesc'),
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
    conversionTipsTitle: t('seo.conversionTipsTitle'),
    conversionTips: [
      t('seo.conversionTip1'),
      t('seo.conversionTip2'),
      t('seo.conversionTip3'),
      t('seo.conversionTip4'),
    ],
    formulaTitle: t('seo.formulaTitle'),
    formulaContent: t('seo.formulaContent'),
    formulaExample: t('seo.formulaExample'),
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

  // Generate HowTo schema for rich snippets with descriptive step names
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
    { title: 'NIST - Units and Measurement', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { title: 'SI Brochure - International Bureau of Weights and Measures', url: 'https://www.bipm.org/en/publications/si-brochure' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('length')
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
            initialHelpful={1156}
          />
        }
        seoContent={<LengthSEOContent translations={seoTranslations} />}
      >
        <LengthConverter
          locale={locale}
          translations={converterTranslations}
        />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
