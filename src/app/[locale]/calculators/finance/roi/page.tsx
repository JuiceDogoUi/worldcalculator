import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { ROICalculator } from '@/features/finance/roi/ROICalculator'
import { ROISEOContent } from '@/features/finance/roi/ROISEOContent'
import { locales } from '@/i18n/locales'
import { getCurrencyForLocale } from '@/lib/formatters'
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
  const t = await getTranslations({ locale, namespace: 'calculators.finance.roi' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/finance/roi`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/finance/roi`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/finance/roi`,
    },
  }
}

export default async function ROICalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.finance.roi' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/finance/roi`

  // Get currency based on locale
  const currency = getCurrencyForLocale(locale)

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/finance/roi`,
      applicationCategory: 'FinanceApplication',
      offers: {
        price: '0',
        priceCurrency: currency,
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
    initialInvestment: t('inputs.initialInvestment'),
    finalValue: t('inputs.finalValue'),
    investmentPeriod: t('inputs.investmentPeriod'),
    roiPercentage: t('outputs.roiPercentage'),
    profitLoss: t('outputs.profitLoss'),
    annualizedReturn: t('outputs.annualizedReturn'),
    totalInvested: t('outputs.totalInvested'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    years: t('units.years'),
    optional: t('units.optional'),
    profit: t('outputs.profit'),
    loss: t('outputs.loss'),
    // Category labels
    categorySignificantLoss: t('categories.significantLoss'),
    categoryLoss: t('categories.loss'),
    categoryBreakEven: t('categories.breakEven'),
    categoryLow: t('categories.low'),
    categoryModerate: t('categories.moderate'),
    categoryHigh: t('categories.high'),
    categoryExceptional: t('categories.exceptional'),
    // Summary
    summaryTitle: t('summary.title'),
    summaryProfit: t('summary.profit'),
    summaryLoss: t('summary.loss'),
    summaryBreakEven: t('summary.breakEven'),
    // Validation
    validationError: t('actions.validationError'),
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
    whenToUseTitle: t('seo.whenToUseTitle'),
    whenToUseIntro: t('seo.whenToUseIntro'),
    whenToUsePoints: [
      t('seo.whenToUsePoint1'),
      t('seo.whenToUsePoint2'),
      t('seo.whenToUsePoint3'),
      t('seo.whenToUsePoint4'),
      t('seo.whenToUsePoint5'),
    ],
    investmentTypesTitle: t('seo.investmentTypesTitle'),
    investmentTypes: [
      t('seo.investmentType1'),
      t('seo.investmentType2'),
      t('seo.investmentType3'),
      t('seo.investmentType4'),
      t('seo.investmentType5'),
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
    resultsTitle: t('seo.resultsTitle'),
    resultsExplanations: [
      t('seo.resultsROI'),
      t('seo.resultsProfitLoss'),
      t('seo.resultsAnnualized'),
      t('seo.resultsCategory'),
    ],
    formulaTitle: t('seo.formulaTitle'),
    formulaContent: t('seo.formulaContent'),
    formulaAnnualized: t('seo.formulaAnnualized'),
    formulaExample: t('seo.formulaExample'),
    tipsTitle: t('seo.tipsTitle'),
    tips: [
      t('seo.tip1'),
      t('seo.tip2'),
      t('seo.tip3'),
      t('seo.tip4'),
      t('seo.tip5'),
      t('seo.tip6'),
      t('seo.tip7'),
      t('seo.tip8'),
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
      { question: t('seo.faq9Question'), answer: t('seo.faq9Answer') },
      { question: t('seo.faq10Question'), answer: t('seo.faq10Answer') },
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
      { name: tCategories('finance'), url: `/${locale}/calculators/finance` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget
  const sources = [
    { title: 'Investopedia - ROI', url: 'https://www.investopedia.com/terms/r/returnoninvestment.asp' },
    { title: 'Corporate Finance Institute - ROI Formula', url: 'https://corporatefinanceinstitute.com/resources/accounting/return-on-investment-roi-formula/' },
    { title: 'Fidelity - How to Calculate ROI', url: 'https://www.fidelity.com/learning-center/smart-money/how-to-calculate-ROI' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('roi')
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
        categorySlug="finance"
        categoryName={tCategories('finance')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={0}
            initialHelpful={0}
          />
        }
        seoContent={<ROISEOContent translations={seoTranslations} />}
      >
        <ROICalculator
          locale={locale}
          currency={currency}
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
