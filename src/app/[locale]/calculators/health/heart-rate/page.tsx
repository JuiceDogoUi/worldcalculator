import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { HeartRateCalculator } from '@/features/health/heart-rate/HeartRateCalculator'
import { HeartRateSEOContent } from '@/features/health/heart-rate/HeartRateSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.health.heart-rate' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/health/heart-rate`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/health/heart-rate`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/health/heart-rate`,
    },
  }
}

export default async function HeartRateCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.health.heart-rate' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/health/heart-rate`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/health/heart-rate`,
      applicationCategory: 'HealthApplication',
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
    age: t('inputs.age'),
    ageYears: t('inputs.ageYears'),
    restingHeartRate: t('inputs.restingHeartRate'),
    restingHRBpm: t('inputs.restingHRBpm'),
    restingHRHelp: t('inputs.restingHRHelp'),
    trainingGoal: t('inputs.trainingGoal'),
    trainingGoalOptional: t('inputs.trainingGoalOptional'),
    goals: {
      none: t('inputs.goals.none'),
      'general-fitness': t('inputs.goals.general-fitness'),
      'fat-burn': t('inputs.goals.fat-burn'),
      cardio: t('inputs.goals.cardio'),
      performance: t('inputs.goals.performance'),
    },
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      maxHeartRate: t('results.maxHeartRate'),
      heartRateReserve: t('results.heartRateReserve'),
      trainingZones: t('results.trainingZones'),
      recommendedZone: t('results.recommendedZone'),
      intensity: t('results.intensity'),
      heartRateRange: t('results.heartRateRange'),
    },
    zones: {
      zone1: {
        name: t('zones.zone1.name'),
        description: t('zones.zone1.description'),
        benefits: t('zones.zone1.benefits'),
      },
      zone2: {
        name: t('zones.zone2.name'),
        description: t('zones.zone2.description'),
        benefits: t('zones.zone2.benefits'),
      },
      zone3: {
        name: t('zones.zone3.name'),
        description: t('zones.zone3.description'),
        benefits: t('zones.zone3.benefits'),
      },
      zone4: {
        name: t('zones.zone4.name'),
        description: t('zones.zone4.description'),
        benefits: t('zones.zone4.benefits'),
      },
      zone5: {
        name: t('zones.zone5.name'),
        description: t('zones.zone5.description'),
        benefits: t('zones.zone5.benefits'),
      },
    },
    units: {
      bpm: t('units.bpm'),
      years: t('units.years'),
    },
    validation: {
      ageRequired: t('validation.ageRequired'),
      ageInvalid: t('validation.ageInvalid'),
      agePositive: t('validation.agePositive'),
      ageTooLow: t('validation.ageTooLow'),
      ageTooHigh: t('validation.ageTooHigh'),
      restingHRRequired: t('validation.restingHRRequired'),
      restingHRInvalid: t('validation.restingHRInvalid'),
      restingHRPositive: t('validation.restingHRPositive'),
      restingHRTooLow: t('validation.restingHRTooLow'),
      restingHRTooHigh: t('validation.restingHRTooHigh'),
      restingHRExceedsMax: t('validation.restingHRExceedsMax'),
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
    karvonenMethodTitle: t('seo.karvonenMethodTitle'),
    karvonenMethodContent: t('seo.karvonenMethodContent'),
    karvonenMethodFormula: t('seo.karvonenMethodFormula'),
    zonesTitle: t('seo.zonesTitle'),
    zones: [
      {
        name: t('zones.zone1.name'),
        intensity: '50-60%',
        description: t('zones.zone1.description'),
      },
      {
        name: t('zones.zone2.name'),
        intensity: '60-70%',
        description: t('zones.zone2.description'),
      },
      {
        name: t('zones.zone3.name'),
        intensity: '70-80%',
        description: t('zones.zone3.description'),
      },
      {
        name: t('zones.zone4.name'),
        intensity: '80-90%',
        description: t('zones.zone4.description'),
      },
      {
        name: t('zones.zone5.name'),
        intensity: '90-100%',
        description: t('zones.zone5.description'),
      },
    ],
    howToMeasureTitle: t('seo.howToMeasureTitle'),
    howToMeasureContent: t('seo.howToMeasureContent'),
    howToMeasureSteps: [
      t('seo.howToMeasureStep1'),
      t('seo.howToMeasureStep2'),
      t('seo.howToMeasureStep3'),
      t('seo.howToMeasureStep4'),
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
      { name: tCategories('health'), url: `/${locale}/calculators/health` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    { title: 'ACSM - Heart Rate Training Zones', url: 'https://www.acsm.org/' },
    { title: 'American Heart Association - Target Heart Rates', url: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/target-heart-rates' },
    { title: 'CDC - Physical Activity Guidelines', url: 'https://www.cdc.gov/physicalactivity/index.html' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('heart-rate')
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
        categorySlug="health"
        categoryName={tCategories('health')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={67}
            initialHelpful={892}
          />
        }
        seoContent={<HeartRateSEOContent translations={seoTranslations} />}
      >
        <HeartRateCalculator
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
