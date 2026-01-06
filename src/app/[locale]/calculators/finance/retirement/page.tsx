import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { RetirementCalculator } from '@/features/finance/retirement/RetirementCalculator'
import { RetirementSEOContent } from '@/features/finance/retirement/RetirementSEOContent'
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
    namespace: 'calculators.finance.retirement',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/finance/retirement`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/finance/retirement`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/finance/retirement`,
    },
  }
}

export default async function RetirementCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.finance.retirement',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/finance/retirement`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/finance/retirement`,
      applicationCategory: 'FinanceApplication',
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
    currentAge: t('inputs.currentAge'),
    retirementAge: t('inputs.retirementAge'),
    lifeExpectancy: t('inputs.lifeExpectancy'),
    currentSavings: t('inputs.currentSavings'),
    monthlyContribution: t('inputs.monthlyContribution'),
    preRetirementReturn: t('inputs.preRetirementReturn'),
    postRetirementReturn: t('inputs.postRetirementReturn'),
    inflationRate: t('inputs.inflationRate'),
    withdrawalRate: t('inputs.withdrawalRate'),
    resultBalanceAtRetirement: t('results.balanceAtRetirement'),
    resultMonthlyIncome: t('results.monthlyIncome'),
    resultRealMonthlyIncome: t('results.realMonthlyIncome'),
    resultYearsToRetirement: t('results.yearsToRetirement'),
    resultYearsInRetirement: t('results.yearsInRetirement'),
    resultTotalContributions: t('results.totalContributions'),
    resultInvestmentGrowth: t('results.investmentGrowth'),
    resultSavingsLongevity: t('results.savingsLongevity'),
    resultFinalBalance: t('results.finalBalance'),
    years: t('results.years'),
    months: t('results.months'),
    unlimited: t('results.unlimited'),
    onTrack: t('status.onTrack'),
    needsAttention: t('status.needsAttention'),
    savingsWillLast: t('status.savingsWillLast'),
    savingsRunsOut: t('status.savingsRunsOut'),
    reset: t('actions.reset'),
    showAccumulationBreakdown: t('actions.showAccumulationBreakdown'),
    hideAccumulationBreakdown: t('actions.hideAccumulationBreakdown'),
    showRetirementBreakdown: t('actions.showRetirementBreakdown'),
    hideRetirementBreakdown: t('actions.hideRetirementBreakdown'),
    fixErrors: t('actions.fixErrors'),
    tableYear: t('table.year'),
    tableAge: t('table.age'),
    tableStartingBalance: t('table.startingBalance'),
    tableContributions: t('table.contributions'),
    tableWithdrawals: t('table.withdrawals'),
    tableGrowth: t('table.growth'),
    tableEndingBalance: t('table.endingBalance'),
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
    howItWorksIntro: t('seo.howItWorksIntro'),
    howItWorksSteps: [
      t('seo.howItWorksStep1'),
      t('seo.howItWorksStep2'),
      t('seo.howItWorksStep3'),
      t('seo.howItWorksStep4'),
      t('seo.howItWorksStep5'),
    ],
    benefitsTitle: t('seo.benefitsTitle'),
    benefits: [
      t('seo.benefit1'),
      t('seo.benefit2'),
      t('seo.benefit3'),
      t('seo.benefit4'),
      t('seo.benefit5'),
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
  const stepNames = [
    t('seo.howItWorksStepName1'),
    t('seo.howItWorksStepName2'),
    t('seo.howItWorksStepName3'),
    t('seo.howItWorksStepName4'),
    t('seo.howItWorksStepName5'),
  ]
  const howToSchema = generateHowToSchema(
    t('seo.howItWorksTitle'),
    t('description'),
    seoTranslations.howItWorksSteps.map((step, i) => ({
      name: stepNames[i],
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
    {
      title: 'Investor.gov - Retirement Calculator',
      url: 'https://www.investor.gov/financial-tools-calculators/calculators/retirement-calculator',
    },
    {
      title: 'NerdWallet - Retirement Calculator',
      url: 'https://www.nerdwallet.com/investing/calculators/retirement-calculator',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('retirement')
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
            initialLikes={127}
            initialHelpful={2341}
          />
        }
        seoContent={<RetirementSEOContent translations={seoTranslations} />}
      >
        <RetirementCalculator
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
