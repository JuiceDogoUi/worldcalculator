import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { SavingsGoalCalculator } from '@/features/finance/savings-goal/SavingsGoalCalculator'
import { SavingsGoalSEOContent } from '@/features/finance/savings-goal/SavingsGoalSEOContent'
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
    namespace: 'calculators.finance.savings-goal',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/finance/savings-goal`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/finance/savings-goal`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/finance/savings-goal`,
    },
  }
}

export default async function SavingsGoalCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.finance.savings-goal',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/finance/savings-goal`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/finance/savings-goal`,
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
    savingsGoal: t('inputs.savingsGoal'),
    currentSavings: t('inputs.currentSavings'),
    annualRate: t('inputs.annualRate'),
    timeframe: t('inputs.timeframe'),
    depositAmount: t('inputs.depositAmount'),
    depositFrequency: t('inputs.depositFrequency'),
    modeLabel: t('modes.label'),
    modeRequiredDeposit: t('modes.requiredDeposit'),
    modeTimeToGoal: t('modes.timeToGoal'),
    modeFinalBalance: t('modes.finalBalance'),
    frequencyWeekly: t('frequency.weekly'),
    frequencyBiweekly: t('frequency.biweekly'),
    frequencyMonthly: t('frequency.monthly'),
    frequencyQuarterly: t('frequency.quarterly'),
    frequencyAnnually: t('frequency.annually'),
    resultRequiredDeposit: t('results.requiredDeposit', { frequency: '' }),
    resultTimeToGoal: t('results.timeToGoal'),
    resultFinalBalance: t('results.finalBalance'),
    resultTotalDeposits: t('results.totalDeposits'),
    resultTotalInterest: t('results.totalInterest'),
    resultCurrentSavings: t('results.currentSavings'),
    resultSavingsGoal: t('results.savingsGoal'),
    years: t('results.years'),
    months: t('results.months'),
    reset: t('actions.reset'),
    calculate: t('actions.calculate'),
    showBreakdown: t('actions.showBreakdown'),
    hideBreakdown: t('actions.hideBreakdown'),
    fixErrors: t('actions.fixErrors'),
    tableYear: t('table.year'),
    tableStartingBalance: t('table.startingBalance'),
    tableDeposits: t('table.deposits'),
    tableInterestEarned: t('table.interestEarned'),
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
      title: 'Investor.gov - Savings Goal Calculator',
      url: 'https://www.investor.gov/financial-tools-calculators/calculators/savings-goal-calculator',
    },
    {
      title: 'NerdWallet - Savings Calculator',
      url: 'https://www.nerdwallet.com/calculator/savings-calculator',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('savings-goal')
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
            initialLikes={89}
            initialHelpful={1847}
          />
        }
        seoContent={<SavingsGoalSEOContent translations={seoTranslations} />}
      >
        <SavingsGoalCalculator
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
