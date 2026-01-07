import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { RatioCalculator } from '@/features/math/ratio/RatioCalculator'
import { RatioSEOContent } from '@/features/math/ratio/RatioSEOContent'
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
    namespace: 'calculators.math.ratio',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/math/ratio`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/math/ratio`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/math/ratio`,
    },
  }
}

export default async function RatioCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.math.ratio',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/math/ratio`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/math/ratio`,
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
    modes: {
      simplify: {
        label: t('modes.simplify.label'),
        description: t('modes.simplify.description'),
      },
      scale: {
        label: t('modes.scale.label'),
        description: t('modes.scale.description'),
      },
      findMissing: {
        label: t('modes.findMissing.label'),
        description: t('modes.findMissing.description'),
      },
      convert: {
        label: t('modes.convert.label'),
        description: t('modes.convert.description'),
      },
      compare: {
        label: t('modes.compare.label'),
        description: t('modes.compare.description'),
      },
    },
    inputs: {
      antecedent: t('inputs.antecedent'),
      consequent: t('inputs.consequent'),
      scaleTargetValue: t('inputs.scaleTargetValue'),
      scaleTargetPosition: t('inputs.scaleTargetPosition'),
      antecedentOption: t('inputs.antecedentOption'),
      consequentOption: t('inputs.consequentOption'),
      knownValue: t('inputs.knownValue'),
      knownPosition: t('inputs.knownPosition'),
      secondAntecedent: t('inputs.secondAntecedent'),
      secondConsequent: t('inputs.secondConsequent'),
    },
    results: {
      result: t('results.result'),
      simplifiedRatio: t('results.simplifiedRatio'),
      scaledRatio: t('results.scaledRatio'),
      missingValue: t('results.missingValue'),
      fraction: t('results.fraction'),
      decimal: t('results.decimal'),
      percentage: t('results.percentage'),
      partsNotation: t('results.partsNotation'),
      partsTo: t.raw('results.partsTo'),
      partSingular: t('results.partSingular'),
      partPlural: t('results.partPlural'),
      comparison: t('results.comparison'),
      equal: t('results.equal'),
      greater: t('results.greater'),
      less: t('results.less'),
      difference: t('results.difference'),
    },
    errors: {
      consequentZero: t('errors.consequentZero'),
      scaleTargetRequired: t('errors.scaleTargetRequired'),
      scaleTargetPositive: t('errors.scaleTargetPositive'),
      knownValueRequired: t('errors.knownValueRequired'),
      knownValuePositive: t('errors.knownValuePositive'),
      compareRatioRequired: t('errors.compareRatioRequired'),
      compareConsequentZero: t('errors.compareConsequentZero'),
    },
    steps: t('steps'),
    formula: t('formula'),
    explanation: t('explanation'),
    reset: t('reset'),
    calc: {
      originalRatio: t.raw('calc.originalRatio'),
      findGcd: t.raw('calc.findGcd'),
      gcdEquals: t.raw('calc.gcdEquals'),
      divideBothByGcd: t.raw('calc.divideBothByGcd'),
      simplifyFormula: t.raw('calc.simplifyFormula'),
      simplifiedExplanation: t.raw('calc.simplifiedExplanation'),
      alreadySimplest: t.raw('calc.alreadySimplest'),
      calculateScaleFactor: t.raw('calc.calculateScaleFactor'),
      multiplyByScaleFactor: t.raw('calc.multiplyByScaleFactor'),
      scaleFormula: t.raw('calc.scaleFormula'),
      scaledExplanation: t.raw('calc.scaledExplanation'),
      setupProportion: t.raw('calc.setupProportion'),
      crossMultiply: t.raw('calc.crossMultiply'),
      solveForUnknown: t.raw('calc.solveForUnknown'),
      proportionFormula: t.raw('calc.proportionFormula'),
      missingExplanation: t.raw('calc.missingExplanation'),
      simplifyFirst: t.raw('calc.simplifyFirst'),
      convertToFraction: t.raw('calc.convertToFraction'),
      convertToDecimal: t.raw('calc.convertToDecimal'),
      convertToPercentage: t.raw('calc.convertToPercentage'),
      convertFormula: t.raw('calc.convertFormula'),
      convertExplanation: t.raw('calc.convertExplanation'),
      convertFirstRatio: t.raw('calc.convertFirstRatio'),
      convertSecondRatio: t.raw('calc.convertSecondRatio'),
      compareDecimals: t.raw('calc.compareDecimals'),
      ratiosAreEqual: t.raw('calc.ratiosAreEqual'),
      differenceIs: t.raw('calc.differenceIs'),
      compareFormula: t.raw('calc.compareFormula'),
      equivalentExplanation: t.raw('calc.equivalentExplanation'),
      greaterExplanation: t.raw('calc.greaterExplanation'),
      lessExplanation: t.raw('calc.lessExplanation'),
      firstTerm: t.raw('calc.firstTerm'),
      secondTerm: t.raw('calc.secondTerm'),
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
    modesTitle: t('seo.modesTitle'),
    modesIntro: t('seo.modesIntro'),
    modes: [
      t('seo.mode1'),
      t('seo.mode2'),
      t('seo.mode3'),
      t('seo.mode4'),
      t('seo.mode5'),
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
      {
        name: t('seo.formula5Name'),
        formula: t('seo.formula5'),
        example: t('seo.formula5Example'),
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
      { name: tCategories('math'), url: `/${locale}/calculators/math` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    {
      title: 'Khan Academy - Ratios and Proportions',
      url: 'https://www.khanacademy.org/math/pre-algebra/pre-algebra-ratios-rates',
    },
    {
      title: 'Math is Fun - Ratios',
      url: 'https://www.mathsisfun.com/numbers/ratio.html',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('ratio')
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
        categorySlug="math"
        categoryName={tCategories('math')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={42}
            initialHelpful={856}
          />
        }
        seoContent={<RatioSEOContent translations={seoTranslations} />}
      >
        <RatioCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
