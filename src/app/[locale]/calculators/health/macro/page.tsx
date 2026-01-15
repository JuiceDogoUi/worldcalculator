import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { MacroCalculator } from '@/features/health/macro/MacroCalculator'
import { MacroSEOContent } from '@/features/health/macro/MacroSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.health.macro' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/health/macro`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/health/macro`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/health/macro`,
    },
  }
}

export default async function MacroCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.health.macro' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/health/macro`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/health/macro`,
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
    age: t('inputs.age'),
    height: t('inputs.height'),
    heightCm: t('inputs.heightCm'),
    heightFeet: t('inputs.heightFeet'),
    heightInches: t('inputs.heightInches'),
    weight: t('inputs.weight'),
    weightKg: t('inputs.weightKg'),
    weightLbs: t('inputs.weightLbs'),
    activityLevel: t('inputs.activityLevel'),
    activityLevels: {
      sedentary: t('inputs.activityLevels.sedentary'),
      lightlyActive: t('inputs.activityLevels.lightlyActive'),
      moderatelyActive: t('inputs.activityLevels.moderatelyActive'),
      veryActive: t('inputs.activityLevels.veryActive'),
      extremelyActive: t('inputs.activityLevels.extremelyActive'),
    },
    goal: t('inputs.goal'),
    goals: {
      lose: t('inputs.goals.lose'),
      maintain: t('inputs.goals.maintain'),
      gain: t('inputs.goals.gain'),
    },
    dietPreset: t('inputs.dietPreset'),
    dietPresets: {
      balanced: t('inputs.dietPresets.balanced'),
      lowCarb: t('inputs.dietPresets.lowCarb'),
      highProtein: t('inputs.dietPresets.highProtein'),
      keto: t('inputs.dietPresets.keto'),
      custom: t('inputs.dietPresets.custom'),
    },
    customMacros: {
      title: t('inputs.customMacros.title'),
      carbs: t('inputs.customMacros.carbs'),
      protein: t('inputs.customMacros.protein'),
      fat: t('inputs.customMacros.fat'),
    },
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      dailyCalories: t('results.dailyCalories'),
      bmr: t('results.bmr'),
      tdee: t('results.tdee'),
      calorieAdjustment: t('results.calorieAdjustment'),
      macroBreakdown: t('results.macroBreakdown'),
      protein: t('results.protein'),
      carbs: t('results.carbs'),
      fat: t('results.fat'),
      grams: t('results.grams'),
      calories: t('results.calories'),
    },
    units: {
      cm: t('units.cm'),
      ft: t('units.ft'),
      in: t('units.in'),
      kg: t('units.kg'),
      lbs: t('units.lbs'),
      years: t('units.years'),
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
      genderRequired: t('validation.genderRequired'),
      activityRequired: t('validation.activityRequired'),
      goalRequired: t('validation.goalRequired'),
      dietPresetRequired: t('validation.dietPresetRequired'),
      customMacrosRequired: t('validation.customMacrosRequired'),
      customMacrosSumTo100: t('validation.customMacrosSumTo100'),
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
    bmrFormula: t('seo.bmrFormula'),
    tdeeExplanation: t('seo.tdeeExplanation'),
    macroExplanation: t('seo.macroExplanation'),
    dietPresetsTitle: t('seo.dietPresetsTitle'),
    dietPresets: [
      {
        name: t('inputs.dietPresets.balanced'),
        ratios: '40% carbs, 30% protein, 30% fat',
        description: t('seo.dietPresetDescBalanced'),
      },
      {
        name: t('inputs.dietPresets.lowCarb'),
        ratios: '25% carbs, 40% protein, 35% fat',
        description: t('seo.dietPresetDescLowCarb'),
      },
      {
        name: t('inputs.dietPresets.highProtein'),
        ratios: '30% carbs, 40% protein, 30% fat',
        description: t('seo.dietPresetDescHighProtein'),
      },
      {
        name: t('inputs.dietPresets.keto'),
        ratios: '5% carbs, 25% protein, 70% fat',
        description: t('seo.dietPresetDescKeto'),
      },
    ],
    goalsTitle: t('seo.goalsTitle'),
    goals: [
      {
        name: t('inputs.goals.lose'),
        adjustment: '-500 kcal',
        description: t('seo.goalDescLose'),
      },
      {
        name: t('inputs.goals.maintain'),
        adjustment: '+0 kcal',
        description: t('seo.goalDescMaintain'),
      },
      {
        name: t('inputs.goals.gain'),
        adjustment: '+300 kcal',
        description: t('seo.goalDescGain'),
      },
    ],
    activityLevelsTitle: t('seo.activityLevelsTitle'),
    activityLevels: [
      {
        name: t('inputs.activityLevels.sedentary'),
        multiplier: '1.2',
        description: t('seo.activityDescSedentary'),
      },
      {
        name: t('inputs.activityLevels.lightlyActive'),
        multiplier: '1.375',
        description: t('seo.activityDescLightlyActive'),
      },
      {
        name: t('inputs.activityLevels.moderatelyActive'),
        multiplier: '1.55',
        description: t('seo.activityDescModeratelyActive'),
      },
      {
        name: t('inputs.activityLevels.veryActive'),
        multiplier: '1.725',
        description: t('seo.activityDescVeryActive'),
      },
      {
        name: t('inputs.activityLevels.extremelyActive'),
        multiplier: '1.9',
        description: t('seo.activityDescExtremelyActive'),
      },
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
    { title: 'Mifflin-St Jeor Equation Study', url: 'https://pubmed.ncbi.nlm.nih.gov/2305711/' },
    { title: 'Dietary Reference Intakes - USDA', url: 'https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator' },
    { title: 'Macronutrient Ratios - NIH', url: 'https://www.ncbi.nlm.nih.gov/books/NBK56068/' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('macro')
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
        seoContent={<MacroSEOContent translations={seoTranslations} />}
      >
        <MacroCalculator
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
