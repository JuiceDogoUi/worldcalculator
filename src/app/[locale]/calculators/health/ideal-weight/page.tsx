import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { IdealWeightCalculator } from '@/features/health/ideal-weight/IdealWeightCalculator'
import { IdealWeightSEOContent } from '@/features/health/ideal-weight/IdealWeightSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.health.ideal-weight' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/health/ideal-weight`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/health/ideal-weight`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/health/ideal-weight`,
    },
  }
}

export default async function IdealWeightCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.health.ideal-weight' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/health/ideal-weight`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/health/ideal-weight`,
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
    unitSystem: t('inputs.unitSystem'),
    metric: t('inputs.metric'),
    imperial: t('inputs.imperial'),
    gender: t('inputs.gender'),
    male: t('inputs.male'),
    female: t('inputs.female'),
    height: t('inputs.height'),
    heightCm: t('inputs.heightCm'),
    heightFeet: t('inputs.heightFeet'),
    heightInches: t('inputs.heightInches'),
    currentWeight: t('inputs.currentWeight'),
    currentWeightKg: t('inputs.currentWeightKg'),
    currentWeightLbs: t('inputs.currentWeightLbs'),
    currentWeightOptional: t('inputs.currentWeightOptional'),
    bodyFrame: t('inputs.bodyFrame'),
    frameSmall: t('inputs.frameSmall'),
    frameMedium: t('inputs.frameMedium'),
    frameLarge: t('inputs.frameLarge'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      averageIdealWeight: t('results.averageIdealWeight'),
      bmiBasedRange: t('results.bmiBasedRange'),
      weightToLose: t('results.weightToLose'),
      weightToGain: t('results.weightToGain'),
      atIdealWeight: t('results.atIdealWeight'),
      formulaComparison: t('results.formulaComparison'),
      adjustedForFrame: t('results.adjustedForFrame'),
    },
    formulas: {
      devine: t('formulas.devine'),
      robinson: t('formulas.robinson'),
      miller: t('formulas.miller'),
      hamwi: t('formulas.hamwi'),
    },
    formulaDescriptions: {
      devine: t('formulaDescriptions.devine'),
      robinson: t('formulaDescriptions.robinson'),
      miller: t('formulaDescriptions.miller'),
      hamwi: t('formulaDescriptions.hamwi'),
    },
    units: {
      cm: t('units.cm'),
      ft: t('units.ft'),
      in: t('units.in'),
      kg: t('units.kg'),
      lbs: t('units.lbs'),
    },
    validation: {
      genderRequired: t('validation.genderRequired'),
      heightRequired: t('validation.heightRequired'),
      heightInvalid: t('validation.heightInvalid'),
      heightPositive: t('validation.heightPositive'),
      heightTooLow: t('validation.heightTooLow'),
      heightTooHigh: t('validation.heightTooHigh'),
      heightFeetRequired: t('validation.heightFeetRequired'),
      heightFeetInvalid: t('validation.heightFeetInvalid'),
      heightFeetPositive: t('validation.heightFeetPositive'),
      heightFeetTooLow: t('validation.heightFeetTooLow'),
      heightFeetTooHigh: t('validation.heightFeetTooHigh'),
      heightInchesRequired: t('validation.heightInchesRequired'),
      heightInchesInvalid: t('validation.heightInchesInvalid'),
      heightInchesPositive: t('validation.heightInchesPositive'),
      heightInchesTooHigh: t('validation.heightInchesTooHigh'),
      weightInvalid: t('validation.weightInvalid'),
      weightPositive: t('validation.weightPositive'),
      weightTooLow: t('validation.weightTooLow'),
      weightTooHigh: t('validation.weightTooHigh'),
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
        name: t('formulas.devine'),
        description: t('seo.devineDescription'),
        formula: t('seo.devineFormula'),
      },
      {
        name: t('formulas.robinson'),
        description: t('seo.robinsonDescription'),
        formula: t('seo.robinsonFormula'),
      },
      {
        name: t('formulas.miller'),
        description: t('seo.millerDescription'),
        formula: t('seo.millerFormula'),
      },
      {
        name: t('formulas.hamwi'),
        description: t('seo.hamwiDescription'),
        formula: t('seo.hamwiFormula'),
      },
    ],
    howToUseTitle: t('seo.howToUseTitle'),
    howToUseSteps: [
      t('seo.howToUseStep1'),
      t('seo.howToUseStep2'),
      t('seo.howToUseStep3'),
      t('seo.howToUseStep4'),
      t('seo.howToUseStep5'),
    ],
    bodyFrameTitle: t('seo.bodyFrameTitle'),
    bodyFrameContent: t('seo.bodyFrameContent'),
    bodyFrames: [
      { name: t('inputs.frameSmall'), description: t('seo.frameSmallDesc') },
      { name: t('inputs.frameMedium'), description: t('seo.frameMediumDesc') },
      { name: t('inputs.frameLarge'), description: t('seo.frameLargeDesc') },
    ],
    limitationsTitle: t('seo.limitationsTitle'),
    limitations: [
      t('seo.limitation1'),
      t('seo.limitation2'),
      t('seo.limitation3'),
      t('seo.limitation4'),
      t('seo.limitation5'),
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
    { title: 'Devine Formula (1974)', url: 'https://pubmed.ncbi.nlm.nih.gov/4880075/' },
    { title: 'Robinson Formula (1983)', url: 'https://pubmed.ncbi.nlm.nih.gov/6849272/' },
    { title: 'WHO BMI Classification', url: 'https://www.who.int/europe/news-room/fact-sheets/item/a-healthy-lifestyle---who-recommendations' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('ideal-weight')
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
        seoContent={<IdealWeightSEOContent translations={seoTranslations} />}
      >
        <IdealWeightCalculator
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
