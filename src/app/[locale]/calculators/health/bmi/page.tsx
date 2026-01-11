import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { BMICalculator } from '@/features/health/bmi/BMICalculator'
import { BMISEOContent } from '@/features/health/bmi/BMISEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.health.bmi' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/health/bmi`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/health/bmi`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/health/bmi`,
    },
  }
}

export default async function BMICalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.health.bmi' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/health/bmi`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/health/bmi`,
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
    height: t('inputs.height'),
    heightCm: t('inputs.heightCm'),
    heightFeet: t('inputs.heightFeet'),
    heightInches: t('inputs.heightInches'),
    weight: t('inputs.weight'),
    weightKg: t('inputs.weightKg'),
    weightLbs: t('inputs.weightLbs'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      bmiValue: t('results.bmiValue'),
      category: t('results.category'),
      healthyRange: t('results.healthyRange'),
      distanceFromNormal: t('results.distanceFromNormal'),
      underweight: t('results.underweight'),
      overweight: t('results.overweight'),
      withinRange: t('results.withinRange'),
    },
    categories: {
      underweight: t('categories.underweight'),
      normal: t('categories.normal'),
      overweight: t('categories.overweight'),
      'obese-class-1': t('categories.obese-class-1'),
      'obese-class-2': t('categories.obese-class-2'),
      'obese-class-3': t('categories.obese-class-3'),
    },
    scale: {
      underweight: t('scale.underweight'),
      normal: t('scale.normal'),
      overweight: t('scale.overweight'),
      obese: t('scale.obese'),
    },
    units: {
      cm: t('units.cm'),
      ft: t('units.ft'),
      in: t('units.in'),
      kg: t('units.kg'),
      lbs: t('units.lbs'),
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
    howToCalculateFormula: t('seo.howToCalculateFormula'),
    categoriesTitle: t('seo.categoriesTitle'),
    categories: [
      {
        name: t('categories.underweight'),
        range: '< 18.5',
        description: t('seo.categoryDescUnderweight'),
      },
      {
        name: t('categories.normal'),
        range: '18.5 - 24.9',
        description: t('seo.categoryDescNormal'),
      },
      {
        name: t('categories.overweight'),
        range: '25 - 29.9',
        description: t('seo.categoryDescOverweight'),
      },
      {
        name: t('categories.obese-class-1'),
        range: '30 - 34.9',
        description: t('seo.categoryDescObeseClass1'),
      },
      {
        name: t('categories.obese-class-2'),
        range: '35 - 39.9',
        description: t('seo.categoryDescObeseClass2'),
      },
      {
        name: t('categories.obese-class-3'),
        range: '>= 40',
        description: t('seo.categoryDescObeseClass3'),
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
    { title: 'WHO - BMI Classification', url: 'https://www.who.int/europe/news-room/fact-sheets/item/a-healthy-lifestyle---who-recommendations' },
    { title: 'CDC - BMI for Adults', url: 'https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html' },
    { title: 'NIH - BMI Tables', url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmi_tbl.htm' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('bmi')
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
            initialLikes={89}
            initialHelpful={1056}
          />
        }
        seoContent={<BMISEOContent translations={seoTranslations} />}
      >
        <BMICalculator
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
