import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { BodyFatCalculator } from '@/features/health/body-fat/BodyFatCalculator'
import { BodyFatSEOContent } from '@/features/health/body-fat/BodyFatSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.health.body-fat' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/health/body-fat`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/health/body-fat`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/health/body-fat`,
    },
  }
}

export default async function BodyFatCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.health.body-fat' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/health/body-fat`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/health/body-fat`,
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
    gender: t('inputs.gender'),
    male: t('inputs.male'),
    female: t('inputs.female'),
    age: t('inputs.age'),
    unitSystem: t('inputs.unitSystem'),
    metric: t('inputs.metric'),
    imperial: t('inputs.imperial'),
    height: t('inputs.height'),
    heightCm: t('inputs.heightCm'),
    heightInches: t('inputs.heightInches'),
    weight: t('inputs.weight'),
    weightKg: t('inputs.weightKg'),
    weightLbs: t('inputs.weightLbs'),
    neck: t('inputs.neck'),
    neckCm: t('inputs.neckCm'),
    neckInches: t('inputs.neckInches'),
    waist: t('inputs.waist'),
    waistCm: t('inputs.waistCm'),
    waistInches: t('inputs.waistInches'),
    hip: t('inputs.hip'),
    hipCm: t('inputs.hipCm'),
    hipInches: t('inputs.hipInches'),
    hipNote: t('inputs.hipNote'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      bodyFatPercentage: t('results.bodyFatPercentage'),
      category: t('results.category'),
      bodyFatMass: t('results.bodyFatMass'),
      leanBodyMass: t('results.leanBodyMass'),
      idealRange: t('results.idealRange'),
      fatToLose: t('results.fatToLose'),
      inRange: t('results.inRange'),
    },
    categories: {
      essential: t('categories.essential'),
      athletic: t('categories.athletic'),
      fitness: t('categories.fitness'),
      acceptable: t('categories.acceptable'),
      obese: t('categories.obese'),
    },
    scale: {
      essential: t('scale.essential'),
      athletic: t('scale.athletic'),
      fitness: t('scale.fitness'),
      acceptable: t('scale.acceptable'),
      obese: t('scale.obese'),
    },
    units: {
      cm: t('units.cm'),
      in: t('units.in'),
      kg: t('units.kg'),
      lbs: t('units.lbs'),
      years: t('units.years'),
    },
    validation: {
      genderRequired: t('validation.genderRequired'),
      ageRequired: t('validation.ageRequired'),
      agePositive: t('validation.agePositive'),
      ageTooLow: t('validation.ageTooLow'),
      ageTooHigh: t('validation.ageTooHigh'),
      heightRequired: t('validation.heightRequired'),
      heightPositive: t('validation.heightPositive'),
      heightTooLow: t('validation.heightTooLow'),
      heightTooHigh: t('validation.heightTooHigh'),
      weightRequired: t('validation.weightRequired'),
      weightPositive: t('validation.weightPositive'),
      weightTooLow: t('validation.weightTooLow'),
      weightTooHigh: t('validation.weightTooHigh'),
      neckRequired: t('validation.neckRequired'),
      neckPositive: t('validation.neckPositive'),
      neckTooLow: t('validation.neckTooLow'),
      neckTooHigh: t('validation.neckTooHigh'),
      waistRequired: t('validation.waistRequired'),
      waistPositive: t('validation.waistPositive'),
      waistTooLow: t('validation.waistTooLow'),
      waistTooHigh: t('validation.waistTooHigh'),
      hipRequired: t('validation.hipRequired'),
      hipPositive: t('validation.hipPositive'),
      hipTooLow: t('validation.hipTooLow'),
      hipTooHigh: t('validation.hipTooHigh'),
      waistMustBeGreaterThanNeck: t('validation.waistMustBeGreaterThanNeck'),
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
    howToCalculateTitle: t('seo.howToCalculateTitle'),
    howToCalculateContent: t('seo.howToCalculateContent'),
    howToCalculateFormulaMen: t('seo.howToCalculateFormulaMen'),
    howToCalculateFormulaWomen: t('seo.howToCalculateFormulaWomen'),
    categoriesTitle: t('seo.categoriesTitle'),
    categoriesMenTitle: t('seo.categoriesMenTitle'),
    categoriesWomenTitle: t('seo.categoriesWomenTitle'),
    categoriesMen: [
      {
        name: t('categories.essential'),
        range: '2-5%',
        description: t('seo.categoryDescEssentialMen'),
      },
      {
        name: t('categories.athletic'),
        range: '6-13%',
        description: t('seo.categoryDescAthleticMen'),
      },
      {
        name: t('categories.fitness'),
        range: '14-17%',
        description: t('seo.categoryDescFitnessMen'),
      },
      {
        name: t('categories.acceptable'),
        range: '18-24%',
        description: t('seo.categoryDescAcceptableMen'),
      },
      {
        name: t('categories.obese'),
        range: '25%+',
        description: t('seo.categoryDescObeseMen'),
      },
    ],
    categoriesWomen: [
      {
        name: t('categories.essential'),
        range: '10-13%',
        description: t('seo.categoryDescEssentialWomen'),
      },
      {
        name: t('categories.athletic'),
        range: '14-20%',
        description: t('seo.categoryDescAthleticWomen'),
      },
      {
        name: t('categories.fitness'),
        range: '21-24%',
        description: t('seo.categoryDescFitnessWomen'),
      },
      {
        name: t('categories.acceptable'),
        range: '25-31%',
        description: t('seo.categoryDescAcceptableWomen'),
      },
      {
        name: t('categories.obese'),
        range: '32%+',
        description: t('seo.categoryDescObeseWomen'),
      },
    ],
    howToMeasureTitle: t('seo.howToMeasureTitle'),
    howToMeasureSteps: [
      t('seo.howToMeasureStep1'),
      t('seo.howToMeasureStep2'),
      t('seo.howToMeasureStep3'),
      t('seo.howToMeasureStep4'),
      t('seo.howToMeasureStep5'),
    ],
    limitationsTitle: t('seo.limitationsTitle'),
    limitations: [
      t('seo.limitation1'),
      t('seo.limitation2'),
      t('seo.limitation3'),
      t('seo.limitation4'),
      t('seo.limitation5'),
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
    { title: 'U.S. Navy Body Fat Calculator', url: 'https://www.calculator.net/body-fat-calculator.html' },
    { title: 'ACE Body Fat Categories', url: 'https://www.acefitness.org/resources/everyone/blog/112/what-are-the-guidelines-for-percentage-of-body-fat-loss/' },
    { title: 'Hodgdon & Beckett (1984)', url: 'https://pubmed.ncbi.nlm.nih.gov/6735823/' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('body-fat')
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
            initialLikes={42}
            initialHelpful={387}
          />
        }
        seoContent={<BodyFatSEOContent translations={seoTranslations} />}
      >
        <BodyFatCalculator
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
