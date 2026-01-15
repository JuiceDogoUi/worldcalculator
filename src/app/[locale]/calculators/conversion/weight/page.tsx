import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { WeightConverter } from '@/features/conversion/weight/WeightConverter'
import { WeightSEOContent } from '@/features/conversion/weight/WeightSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.weight' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/conversion/weight`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/conversion/weight`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/conversion/weight`,
    },
  }
}

export default async function WeightConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.weight' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/conversion/weight`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/conversion/weight`,
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
    title: t('title'),
    description: t('description'),
    fromValue: t('inputs.fromValue'),
    fromUnit: t('inputs.fromUnit'),
    toUnit: t('inputs.toUnit'),
    result: t('outputs.result'),
    swap: t('actions.swap'),
    reset: t('actions.reset'),
    copy: t('actions.copy'),
    copied: t('actions.copied'),
    commonConversions: t('sections.commonConversions'),
    metricUnits: t('sections.metricUnits'),
    imperialUnits: t('sections.imperialUnits'),
    units: {
      mg: { name: t('units.mg.name'), abbr: t('units.mg.abbr') },
      g: { name: t('units.g.name'), abbr: t('units.g.abbr') },
      kg: { name: t('units.kg.name'), abbr: t('units.kg.abbr') },
      tonne: { name: t('units.tonne.name'), abbr: t('units.tonne.abbr') },
      oz: { name: t('units.oz.name'), abbr: t('units.oz.abbr') },
      lb: { name: t('units.lb.name'), abbr: t('units.lb.abbr') },
      stone: { name: t('units.stone.name'), abbr: t('units.stone.abbr') },
      ton: { name: t('units.ton.name'), abbr: t('units.ton.abbr') },
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
    howToUseTitle: t('seo.howToUseTitle'),
    howToUseSteps: [
      t('seo.howToUseStep1'),
      t('seo.howToUseStep2'),
      t('seo.howToUseStep3'),
      t('seo.howToUseStep4'),
      t('seo.howToUseStep5'),
    ],
    metricSystemTitle: t('seo.metricSystemTitle'),
    metricSystemContent: t('seo.metricSystemContent'),
    metricUnits: [
      t('seo.metricUnit1'),
      t('seo.metricUnit2'),
      t('seo.metricUnit3'),
      t('seo.metricUnit4'),
    ],
    imperialSystemTitle: t('seo.imperialSystemTitle'),
    imperialSystemContent: t('seo.imperialSystemContent'),
    imperialUnits: [
      t('seo.imperialUnit1'),
      t('seo.imperialUnit2'),
      t('seo.imperialUnit3'),
      t('seo.imperialUnit4'),
    ],
    conversionTipsTitle: t('seo.conversionTipsTitle'),
    conversionTips: [
      t('seo.conversionTip1'),
      t('seo.conversionTip2'),
      t('seo.conversionTip3'),
      t('seo.conversionTip4'),
      t('seo.conversionTip5'),
    ],
    commonUseCasesTitle: t('seo.commonUseCasesTitle'),
    commonUseCases: [
      t('seo.commonUseCase1'),
      t('seo.commonUseCase2'),
      t('seo.commonUseCase3'),
      t('seo.commonUseCase4'),
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
    { title: 'NIST - SI Units', url: 'https://www.nist.gov/pml/owm/metric-si/si-units' },
    { title: 'Wikipedia - Mass', url: 'https://en.wikipedia.org/wiki/Mass' },
    { title: 'Unit Converter Guide', url: 'https://www.unitconverters.net/weight-and-mass-converter.html' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('weight')
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
            initialHelpful={387}
          />
        }
        seoContent={<WeightSEOContent translations={seoTranslations} />}
      >
        <WeightConverter
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
