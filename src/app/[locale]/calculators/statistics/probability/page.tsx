import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { ProbabilityCalculator } from '@/features/statistics/probability/ProbabilityCalculator'
import { ProbabilitySEOContent } from '@/features/statistics/probability/ProbabilitySEOContent'
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
  const t = await getTranslations({
    locale,
    namespace: 'calculators.statistics.probability',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/statistics/probability`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/statistics/probability`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/statistics/probability`,
    },
  }
}

export default async function ProbabilityCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.statistics.probability',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/statistics/probability`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/statistics/probability`,
      applicationCategory: 'EducationalApplication',
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
    inputs: {
      mode: t('inputs.mode'),
      modeSingle: t('inputs.modeSingle'),
      modeSingleDescription: t('inputs.modeSingleDescription'),
      modeAnd: t('inputs.modeAnd'),
      modeAndDescription: t('inputs.modeAndDescription'),
      modeOr: t('inputs.modeOr'),
      modeOrDescription: t('inputs.modeOrDescription'),
      modeConditional: t('inputs.modeConditional'),
      modeConditionalDescription: t('inputs.modeConditionalDescription'),
      favorableOutcomes: t('inputs.favorableOutcomes'),
      favorableOutcomesPlaceholder: t('inputs.favorableOutcomesPlaceholder'),
      totalOutcomes: t('inputs.totalOutcomes'),
      totalOutcomesPlaceholder: t('inputs.totalOutcomesPlaceholder'),
      probabilityA: t('inputs.probabilityA'),
      probabilityAPlaceholder: t('inputs.probabilityAPlaceholder'),
      probabilityB: t('inputs.probabilityB'),
      probabilityBPlaceholder: t('inputs.probabilityBPlaceholder'),
      relationship: t('inputs.relationship'),
      independent: t('inputs.independent'),
      independentDescription: t('inputs.independentDescription'),
      dependent: t('inputs.dependent'),
      dependentDescription: t('inputs.dependentDescription'),
      probabilityBGivenA: t('inputs.probabilityBGivenA'),
      probabilityBGivenAPlaceholder: t('inputs.probabilityBGivenAPlaceholder'),
      probabilityAAndB: t('inputs.probabilityAAndB'),
      probabilityAAndBPlaceholder: t('inputs.probabilityAAndBPlaceholder'),
      decimalPrecision: t('inputs.decimalPrecision'),
      decimals: t('inputs.decimals'),
    },
    results: {
      probability: t('results.probability'),
      probabilityPercent: t('results.probabilityPercent'),
      complement: t('results.complement'),
      complementPercent: t('results.complementPercent'),
      oddsFor: t('results.oddsFor'),
      oddsAgainst: t('results.oddsAgainst'),
      fraction: t('results.fraction'),
      formula: t('results.formula'),
      stepsTitle: t('results.stepsTitle'),
      showSteps: t('results.showSteps'),
      hideSteps: t('results.hideSteps'),
    },
    reset: t('reset'),
    tryExample: t('tryExample'),
    calc: {
      stepIdentifyValues: t('calc.stepIdentifyValues'),
      stepApplyFormula: t('calc.stepApplyFormula'),
      stepCalculateResult: t('calc.stepCalculateResult'),
      stepConvertToPercent: t('calc.stepConvertToPercent'),
      stepCalculateComplement: t('calc.stepCalculateComplement'),
      stepCalculateOdds: t('calc.stepCalculateOdds'),
      formulaSingleEvent: t('calc.formulaSingleEvent'),
      formulaAndIndependent: t('calc.formulaAndIndependent'),
      formulaAndDependent: t('calc.formulaAndDependent'),
      formulaOrMutuallyExclusive: t('calc.formulaOrMutuallyExclusive'),
      formulaOrGeneral: t('calc.formulaOrGeneral'),
      formulaConditional: t('calc.formulaConditional'),
      favorableOutcomes: t('calc.favorableOutcomes'),
      totalOutcomes: t('calc.totalOutcomes'),
      probabilityOfA: t('calc.probabilityOfA'),
      probabilityOfB: t('calc.probabilityOfB'),
      probabilityOfAAndB: t('calc.probabilityOfAAndB'),
      probabilityOfAOrB: t('calc.probabilityOfAOrB'),
      probabilityOfAGivenB: t('calc.probabilityOfAGivenB'),
      probabilityOfBGivenA: t('calc.probabilityOfBGivenA'),
      result: t('calc.result'),
      percent: t('calc.percent'),
      complement: t('calc.complement'),
      oddsFor: t('calc.oddsFor'),
      oddsAgainst: t('calc.oddsAgainst'),
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
    typesTitle: t('seo.typesTitle'),
    typesContent: t('seo.typesContent'),
    formulasTitle: t('seo.formulasTitle'),
    formulasContent: t('seo.formulasContent'),
    examplesTitle: t('seo.examplesTitle'),
    examplesContent: t('seo.examplesContent'),
    tipsTitle: t('seo.tipsTitle'),
    tipsContent: t('seo.tipsContent'),
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
  const howToSteps = [
    t('seo.howToStep1'),
    t('seo.howToStep2'),
    t('seo.howToStep3'),
    t('seo.howToStep4'),
    t('seo.howToStep5'),
  ]
  const howToSchema = generateHowToSchema(
    t('seo.howToTitle'),
    t('description'),
    howToSteps.map((step, i) => ({
      name: `Step ${i + 1}`,
      text: step,
    }))
  )

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      { name: tCategories('statistics'), url: `/${locale}/calculators/statistics` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    {
      title: 'Khan Academy - Probability',
      url: 'https://www.khanacademy.org/math/statistics-probability/probability-library',
    },
    {
      title: 'Math is Fun - Probability',
      url: 'https://www.mathsisfun.com/data/probability.html',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('probability')
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
        categorySlug="statistics"
        categoryName={tCategories('statistics')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={45}
            initialHelpful={856}
          />
        }
        seoContent={<ProbabilitySEOContent translations={seoTranslations} />}
      >
        <ProbabilityCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
