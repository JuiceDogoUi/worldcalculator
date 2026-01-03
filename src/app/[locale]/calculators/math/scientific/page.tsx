import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { ScientificCalculator } from '@/features/math/scientific/ScientificCalculator'
import { ScientificSEOContent } from '@/features/math/scientific/ScientificSEOContent'
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
    namespace: 'calculators.math.scientific',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/math/scientific`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/math/scientific`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/math/scientific`,
    },
  }
}

export default async function ScientificCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.math.scientific',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/math/scientific`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/math/scientific`,
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
    display: {
      result: t('display.result'),
      expression: t('display.expression'),
      error: t('display.error'),
      memory: t('display.memory'),
      degrees: t('display.degrees'),
      radians: t('display.radians'),
    },
    buttons: {
      clear: t('buttons.clear'),
      clearEntry: t('buttons.clearEntry'),
      backspace: t('buttons.backspace'),
      equals: t('buttons.equals'),
      add: t('buttons.add'),
      subtract: t('buttons.subtract'),
      multiply: t('buttons.multiply'),
      divide: t('buttons.divide'),
      power: t('buttons.power'),
      squareRoot: t('buttons.squareRoot'),
      cubeRoot: t('buttons.cubeRoot'),
      squared: t('buttons.squared'),
      cubed: t('buttons.cubed'),
      factorial: t('buttons.factorial'),
      percent: t('buttons.percent'),
      negate: t('buttons.negate'),
      decimal: t('buttons.decimal'),
      openParen: t('buttons.openParen'),
      closeParen: t('buttons.closeParen'),
      pi: t('buttons.pi'),
      e: t('buttons.e'),
      sin: t('buttons.sin'),
      cos: t('buttons.cos'),
      tan: t('buttons.tan'),
      arcsin: t('buttons.arcsin'),
      arccos: t('buttons.arccos'),
      arctan: t('buttons.arctan'),
      log: t('buttons.log'),
      ln: t('buttons.ln'),
      exp: t('buttons.exp'),
      memoryAdd: t('buttons.memoryAdd'),
      memorySubtract: t('buttons.memorySubtract'),
      memoryRecall: t('buttons.memoryRecall'),
      memoryClear: t('buttons.memoryClear'),
      second: t('buttons.second'),
      answer: t('buttons.answer'),
      abs: t('buttons.abs'),
    },
    history: {
      title: t('history.title'),
      empty: t('history.empty'),
      clear: t('history.clear'),
      useResult: t('history.useResult'),
    },
    toggleHistory: t('toggleHistory'),
    angleMode: t('angleMode'),
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
    featuresTitle: t('seo.featuresTitle'),
    featuresIntro: t('seo.featuresIntro'),
    features: [
      t('seo.feature1'),
      t('seo.feature2'),
      t('seo.feature3'),
      t('seo.feature4'),
      t('seo.feature5'),
      t('seo.feature6'),
    ],
    operationsTitle: t('seo.operationsTitle'),
    operations: [
      {
        category: t('seo.op1Category'),
        items: [
          t('seo.op1Item1'),
          t('seo.op1Item2'),
          t('seo.op1Item3'),
          t('seo.op1Item4'),
        ],
      },
      {
        category: t('seo.op2Category'),
        items: [
          t('seo.op2Item1'),
          t('seo.op2Item2'),
          t('seo.op2Item3'),
        ],
      },
      {
        category: t('seo.op3Category'),
        items: [
          t('seo.op3Item1'),
          t('seo.op3Item2'),
          t('seo.op3Item3'),
        ],
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
      title: 'Khan Academy - Scientific Calculator',
      url: 'https://www.khanacademy.org/math',
    },
    {
      title: 'Math is Fun - Scientific Calculator',
      url: 'https://www.mathsisfun.com/scientific-calculator.html',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('scientific')
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
            initialLikes={127}
            initialHelpful={1834}
          />
        }
        seoContent={<ScientificSEOContent translations={seoTranslations} />}
      >
        <ScientificCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
