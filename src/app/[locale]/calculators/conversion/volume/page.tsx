import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { VolumeConverter } from '@/features/conversion/volume/VolumeConverter'
import { VolumeSEOContent } from '@/features/conversion/volume/VolumeSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.volume' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/conversion/volume`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/conversion/volume`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/conversion/volume`,
    },
  }
}

export default async function VolumeConverterPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.conversion.volume' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/conversion/volume`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/conversion/volume`,
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

  // Converter translations
  const converterTranslations = {
    title: t('title'),
    description: t('description'),
    fromUnit: t('inputs.fromUnit'),
    toUnit: t('inputs.toUnit'),
    value: t('inputs.value'),
    result: t('outputs.result'),
    swap: t('actions.swap'),
    reset: t('actions.reset'),
    copy: t('actions.copy'),
    copied: t('actions.copied'),
    allConversions: t('outputs.allConversions'),
    showAllConversions: t('actions.showAllConversions'),
    hideAllConversions: t('actions.hideAllConversions'),
    // Unit group labels
    metricUnits: t('unitGroups.metric'),
    usImperialUnits: t('unitGroups.usImperial'),
    ukImperialUnits: t('unitGroups.ukImperial'),
    otherUnits: t('unitGroups.other'),
    // Unit names
    units: {
      milliliter: t('units.milliliter'),
      liter: t('units.liter'),
      'cubic-meter': t('units.cubicMeter'),
      'teaspoon-us': t('units.teaspoonUs'),
      'tablespoon-us': t('units.tablespoonUs'),
      'fluid-ounce-us': t('units.fluidOunceUs'),
      'cup-us': t('units.cupUs'),
      'pint-us': t('units.pintUs'),
      'quart-us': t('units.quartUs'),
      'gallon-us': t('units.gallonUs'),
      'fluid-ounce-uk': t('units.fluidOunceUk'),
      'pint-uk': t('units.pintUk'),
      'quart-uk': t('units.quartUk'),
      'gallon-uk': t('units.gallonUk'),
      'cubic-inch': t('units.cubicInch'),
      'cubic-foot': t('units.cubicFoot'),
    },
    // Validation messages
    validation: {
      enterValue: t('validation.enterValue'),
      invalidNumber: t('validation.invalidNumber'),
      negativeValue: t('validation.negativeValue'),
      valueTooLarge: t('validation.valueTooLarge'),
    },
    // US vs UK comparison
    comparison: {
      title: t('comparison.title'),
      usGallon: t('comparison.usGallon'),
      ukGallon: t('comparison.ukGallon'),
      note: t('comparison.note'),
    },
  }

  // Disclaimer translations
  const disclaimerTranslations = {
    text: t('disclaimer.text'),
  }

  // SEO content translations
  const seoTranslations = {
    whatIsTitle: t('seo.whatIsTitle'),
    whatIsContent: t('seo.whatIsContent'),
    usVsUkTitle: t('seo.usVsUkTitle'),
    usVsUkContent: t('seo.usVsUkContent'),
    usVsUkComparison: [
      t('seo.usVsUkComparison1'),
      t('seo.usVsUkComparison2'),
      t('seo.usVsUkComparison3'),
      t('seo.usVsUkComparison4'),
    ],
    commonUsesTitle: t('seo.commonUsesTitle'),
    commonUses: [
      t('seo.commonUse1'),
      t('seo.commonUse2'),
      t('seo.commonUse3'),
      t('seo.commonUse4'),
      t('seo.commonUse5'),
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
      t('seo.conversionTip5'),
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
    { title: 'NIST Handbook 44 - Volume Units', url: 'https://www.nist.gov/pml/owm/metric-si/unit-conversion' },
    { title: 'UK Weights and Measures Act', url: 'https://www.legislation.gov.uk/ukpga/1985/72/contents' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('volume')
  const lastUpdated = calculatorConfig?.lastModified
    ? new Date(calculatorConfig.lastModified).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  // Combine all schemas into an array
  const structuredData = [calculatorSchema, faqSchema, howToSchema, breadcrumbSchema]

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
        seoContent={<VolumeSEOContent translations={seoTranslations} />}
      >
        <VolumeConverter translations={converterTranslations} locale={locale} />
        <CalculatorDisclaimer disclaimer={disclaimerTranslations.text} />
      </CalculatorLayout>
    </>
  )
}
