import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { MeanMedianModeCalculator } from '@/features/statistics/mean-median-mode/MeanMedianModeCalculator'
import { MeanMedianModeSEOContent } from '@/features/statistics/mean-median-mode/MeanMedianModeSEOContent'
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
    namespace: 'calculators.statistics.mean-median-mode',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/statistics/mean-median-mode`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/statistics/mean-median-mode`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/statistics/mean-median-mode`,
    },
  }
}

export default async function MeanMedianModeCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.statistics.mean-median-mode',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/statistics/mean-median-mode`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/statistics/mean-median-mode`,
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

  // Calculator translations - matching MeanMedianModeCalculatorTranslations interface
  const calculatorTranslations = {
    inputs: {
      dataInput: t('inputs.dataInput'),
      dataInputPlaceholder: t('inputs.dataInputPlaceholder'),
      dataInputHelp: t('inputs.dataInputHelp'),
      weightsInput: t('inputs.weightsInput'),
      weightsInputPlaceholder: t('inputs.weightsInputPlaceholder'),
      weightsInputHelp: t('inputs.weightsInputHelp'),
      meanType: t('inputs.meanType'),
      arithmetic: t('inputs.arithmetic'),
      arithmeticDescription: t('inputs.arithmeticDescription'),
      geometric: t('inputs.geometric'),
      geometricDescription: t('inputs.geometricDescription'),
      harmonic: t('inputs.harmonic'),
      harmonicDescription: t('inputs.harmonicDescription'),
      weighted: t('inputs.weighted'),
      weightedDescription: t('inputs.weightedDescription'),
      decimalPrecision: t('inputs.decimalPrecision'),
      decimals: t('inputs.decimals'),
    },
    results: {
      mean: t('results.mean'),
      median: t('results.median'),
      mode: t('results.mode'),
      noMode: t('results.noMode'),
      unimodal: t('results.unimodal'),
      bimodal: t('results.bimodal'),
      multimodal: t('results.multimodal'),
      count: t('results.count'),
      sum: t('results.sum'),
      range: t('results.range'),
      min: t('results.min'),
      max: t('results.max'),
      variance: t('results.variance'),
      standardDeviation: t('results.standardDeviation'),
      quartiles: t('results.quartiles'),
      q1: t('results.q1'),
      q2: t('results.q2'),
      q3: t('results.q3'),
      iqr: t('results.iqr'),
      frequency: t('results.frequency'),
      percentage: t('results.percentage'),
      value: t('results.value'),
      additionalStats: t('results.additionalStats'),
      frequencyDistribution: t('results.frequencyDistribution'),
      modeValues: t('results.modeValues'),
      selectedMean: t('results.selectedMean'),
      allMeans: t('results.allMeans'),
      arithmeticMean: t('results.arithmeticMean'),
      geometricMean: t('results.geometricMean'),
      harmonicMean: t('results.harmonicMean'),
      weightedMean: t('results.weightedMean'),
      notAvailable: t('results.notAvailable'),
    },
    steps: {
      meanStepsTitle: t('steps.meanStepsTitle'),
      medianStepsTitle: t('steps.medianStepsTitle'),
      modeStepsTitle: t('steps.modeStepsTitle'),
      showSteps: t('steps.showSteps'),
      hideSteps: t('steps.hideSteps'),
    },
    valuesDetected: t.raw('valuesDetected'),
    weightsDetected: t.raw('weightsDetected'),
    reset: t('reset'),
    tryExample: t('tryExample'),
    paginate: t('paginate'),
    showAll: t('showAll'),
    calc: {
      sumAllValues: t('calc.sumAllValues'),
      divideByCount: t('calc.divideByCount'),
      arithmeticFormula: t('calc.arithmeticFormula'),
      multiplyAllValues: t('calc.multiplyAllValues'),
      takeNthRoot: t('calc.takeNthRoot'),
      geometricFormula: t('calc.geometricFormula'),
      sumReciprocals: t('calc.sumReciprocals'),
      divideCountBySum: t('calc.divideCountBySum'),
      harmonicFormula: t('calc.harmonicFormula'),
      multiplyValuesByWeights: t('calc.multiplyValuesByWeights'),
      sumWeightedValues: t('calc.sumWeightedValues'),
      divideByWeightSum: t('calc.divideByWeightSum'),
      weightedFormula: t('calc.weightedFormula'),
      cannotCalculateGeometric: t('calc.cannotCalculateGeometric'),
      cannotCalculateHarmonic: t('calc.cannotCalculateHarmonic'),
      sortValues: t('calc.sortValues'),
      findMiddlePosition: t('calc.findMiddlePosition'),
      middleValueIs: t('calc.middleValueIs'),
      averageMiddleValues: t('calc.averageMiddleValues'),
      medianFormula: t('calc.medianFormula'),
      sortedValuesAre: t.raw('calc.sortedValuesAre'),
      countFrequencies: t('calc.countFrequencies'),
      findHighestFrequency: t('calc.findHighestFrequency'),
      identifyModeValues: t('calc.identifyModeValues'),
      noModeAllEqual: t('calc.noModeAllEqual'),
      noModeAllDifferent: t('calc.noModeAllDifferent'),
      unimodalResult: t.raw('calc.unimodalResult'),
      bimodalResult: t.raw('calc.bimodalResult'),
      multimodalResult: t.raw('calc.multimodalResult'),
      modeFormula: t('calc.modeFormula'),
      frequencyOf: t.raw('calc.frequencyOf'),
      appearsNTimes: t.raw('calc.appearsNTimes'),
      valueLabel: t('calc.valueLabel'),
      frequencyLabel: t('calc.frequencyLabel'),
      percentageLabel: t('calc.percentageLabel'),
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
    measuresTitle: t('seo.measuresTitle'),
    measuresIntro: t('seo.measuresIntro'),
    measures: [
      { name: t('seo.measure1Name'), description: t('seo.measure1Desc') },
      { name: t('seo.measure2Name'), description: t('seo.measure2Desc') },
      { name: t('seo.measure3Name'), description: t('seo.measure3Desc') },
    ],
    whenToUseTitle: t('seo.whenToUseTitle'),
    whenToUseIntro: t('seo.whenToUseIntro'),
    useCases: [
      t('seo.useCase1'),
      t('seo.useCase2'),
      t('seo.useCase3'),
      t('seo.useCase4'),
      t('seo.useCase5'),
    ],
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
    formulasTitle: t('seo.formulasTitle'),
    formulas: [
      {
        name: t('seo.formula1Name'),
        formula: t('seo.formula1'),
        example: t('seo.formula1Example'),
      },
      {
        name: t('seo.formula2Name'),
        formula: t('seo.formula2'),
        example: t('seo.formula2Example'),
      },
      {
        name: t('seo.formula3Name'),
        formula: t('seo.formula3'),
        example: t('seo.formula3Example'),
      },
      {
        name: t('seo.formula4Name'),
        formula: t('seo.formula4'),
        example: t('seo.formula4Example'),
      },
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
      { name: tCategories('statistics'), url: `/${locale}/calculators/statistics` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    {
      title: 'Khan Academy - Mean, Median, Mode',
      url: 'https://www.khanacademy.org/math/statistics-probability/summarizing-quantitative-data',
    },
    {
      title: 'Math is Fun - Mean, Median, Mode',
      url: 'https://www.mathsisfun.com/data/central-measures.html',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('mean-median-mode')
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
            initialLikes={38}
            initialHelpful={742}
          />
        }
        seoContent={<MeanMedianModeSEOContent translations={seoTranslations} />}
      >
        <MeanMedianModeCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
