import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { TDEECalculator } from '@/features/health/tdee/TDEECalculator'
import { TDEESEOContent } from '@/features/health/tdee/TDEESEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.health.tdee' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/health/tdee`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/health/tdee`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/health/tdee`,
    },
  }
}

export default async function TDEECalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.health.tdee' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/health/tdee`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/health/tdee`,
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
    sex: t('inputs.sex'),
    male: t('inputs.male'),
    female: t('inputs.female'),
    age: t('inputs.age'),
    ageYears: t('inputs.ageYears'),
    height: t('inputs.height'),
    heightCm: t('inputs.heightCm'),
    heightFeet: t('inputs.heightFeet'),
    heightInches: t('inputs.heightInches'),
    weight: t('inputs.weight'),
    weightKg: t('inputs.weightKg'),
    weightLbs: t('inputs.weightLbs'),
    activityLevel: t('inputs.activityLevel'),
    formula: t('inputs.formula'),
    bodyFat: t('inputs.bodyFat'),
    bodyFatOptional: t('inputs.bodyFatOptional'),
    activity: {
      sedentary: t('activity.sedentary'),
      sedentaryDesc: t('activity.sedentaryDesc'),
      light: t('activity.light'),
      lightDesc: t('activity.lightDesc'),
      moderate: t('activity.moderate'),
      moderateDesc: t('activity.moderateDesc'),
      active: t('activity.active'),
      activeDesc: t('activity.activeDesc'),
      veryActive: t('activity.veryActive'),
      veryActiveDesc: t('activity.veryActiveDesc'),
      athlete: t('activity.athlete'),
      athleteDesc: t('activity.athleteDesc'),
    },
    formulas: {
      mifflin: t('formulas.mifflin'),
      mifflinDesc: t('formulas.mifflinDesc'),
      harris: t('formulas.harris'),
      harrisDesc: t('formulas.harrisDesc'),
      katch: t('formulas.katch'),
      katchDesc: t('formulas.katchDesc'),
    },
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      bmr: t('results.bmr'),
      bmrDesc: t('results.bmrDesc'),
      tdee: t('results.tdee'),
      tdeeDesc: t('results.tdeeDesc'),
      caloriesPerDay: t('results.caloriesPerDay'),
      calorieGoals: t('results.calorieGoals'),
      extremeLoss: t('results.extremeLoss'),
      loss: t('results.loss'),
      mildLoss: t('results.mildLoss'),
      maintain: t('results.maintain'),
      mildGain: t('results.mildGain'),
      gain: t('results.gain'),
      extremeGain: t('results.extremeGain'),
      macros: t('results.macros'),
      macrosDesc: t('results.macrosDesc'),
      protein: t('results.protein'),
      carbs: t('results.carbs'),
      fat: t('results.fat'),
      balanced: t('results.balanced'),
      lowCarb: t('results.lowCarb'),
      highProtein: t('results.highProtein'),
      lowFat: t('results.lowFat'),
      grams: t('results.grams'),
      idealWeight: t('results.idealWeight'),
    },
    units: {
      cm: t('units.cm'),
      ft: t('units.ft'),
      in: t('units.in'),
      kg: t('units.kg'),
      lbs: t('units.lbs'),
      years: t('units.years'),
      percent: t('units.percent'),
      kcal: t('units.kcal'),
      g: t('units.g'),
    },
    validation: {
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
      weightRequired: t('validation.weightRequired'),
      weightInvalid: t('validation.weightInvalid'),
      weightPositive: t('validation.weightPositive'),
      weightTooLow: t('validation.weightTooLow'),
      weightTooHigh: t('validation.weightTooHigh'),
      ageRequired: t('validation.ageRequired'),
      ageInvalid: t('validation.ageInvalid'),
      ageTooLow: t('validation.ageTooLow'),
      ageTooHigh: t('validation.ageTooHigh'),
      sexRequired: t('validation.sexRequired'),
      sexInvalid: t('validation.sexInvalid'),
      activityRequired: t('validation.activityRequired'),
      bodyFatInvalid: t('validation.bodyFatInvalid'),
      bodyFatTooLow: t('validation.bodyFatTooLow'),
      bodyFatTooHigh: t('validation.bodyFatTooHigh'),
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
    howItWorksTitle: t('seo.howItWorksTitle'),
    howItWorksContent: t('seo.howItWorksContent'),
    bmrFormulasTitle: t('seo.bmrFormulasTitle'),
    bmrFormulas: [
      {
        name: t('seo.mifflinName'),
        formula: t('seo.mifflinFormula'),
        description: t('seo.mifflinDescription'),
      },
      {
        name: t('seo.harrisName'),
        formula: t('seo.harrisFormula'),
        description: t('seo.harrisDescription'),
      },
      {
        name: t('seo.katchName'),
        formula: t('seo.katchFormula'),
        description: t('seo.katchDescription'),
      },
    ],
    activityLevelsTitle: t('seo.activityLevelsTitle'),
    activityLevels: [
      { level: t('activity.sedentary'), multiplier: '1.2', description: t('activity.sedentaryDesc') },
      { level: t('activity.light'), multiplier: '1.375', description: t('activity.lightDesc') },
      { level: t('activity.moderate'), multiplier: '1.55', description: t('activity.moderateDesc') },
      { level: t('activity.active'), multiplier: '1.725', description: t('activity.activeDesc') },
      { level: t('activity.veryActive'), multiplier: '1.9', description: t('activity.veryActiveDesc') },
      { level: t('activity.athlete'), multiplier: '2.1', description: t('activity.athleteDesc') },
    ],
    tableHeaders: {
      level: t('seo.tableHeaderLevel'),
      multiplier: t('seo.tableHeaderMultiplier'),
      description: t('seo.tableHeaderDescription'),
    },
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
    limitationsTitle: t('seo.limitationsTitle'),
    limitations: [
      t('seo.limitation1'),
      t('seo.limitation2'),
      t('seo.limitation3'),
      t('seo.limitation4'),
      t('seo.limitation5'),
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
    { title: 'Mifflin-St Jeor Study', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
    { title: 'Harris-Benedict Equation', url: 'https://pubmed.ncbi.nlm.nih.gov/6741850/' },
    { title: 'ACSM Guidelines', url: 'https://www.acsm.org/' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('tdee')
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
            initialLikes={142}
            initialHelpful={1893}
          />
        }
        seoContent={<TDEESEOContent translations={seoTranslations} />}
      >
        <TDEECalculator
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
