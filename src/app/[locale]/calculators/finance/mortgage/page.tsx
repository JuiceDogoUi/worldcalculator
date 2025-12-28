import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { MortgageCalculator } from '@/features/finance/mortgage/MortgageCalculator'
import { MortgageSEOContent } from '@/features/finance/mortgage/MortgageSEOContent'
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
  const t = await getTranslations({
    locale,
    namespace: 'calculators.finance.mortgage',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/finance/mortgage`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/finance/mortgage`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/finance/mortgage`,
    },
  }
}

export default async function MortgageCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.finance.mortgage',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/finance/mortgage`

  // Get currency based on locale
  const currency = getCurrencyForLocale(locale)

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/finance/mortgage`,
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

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      { name: tCategories('finance'), url: `/${locale}/calculators/finance` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Calculator translations
  const calculatorTranslations = {
    homePrice: t('inputs.homePrice'),
    downPayment: t('inputs.downPayment'),
    downPaymentType: t('inputs.downPaymentType'),
    downPaymentPercentage: t('inputs.downPaymentPercentage'),
    downPaymentAmount: t('inputs.downPaymentAmount'),
    interestRate: t('inputs.interestRate'),
    loanTerm: t('inputs.loanTerm'),
    paymentFrequency: t('inputs.paymentFrequency'),
    propertyTax: t('inputs.propertyTax'),
    homeInsurance: t('inputs.homeInsurance'),
    hoaFees: t('inputs.hoaFees'),
    pmiRate: t('inputs.pmiRate'),
    monthly: t('options.monthly'),
    biweekly: t('options.biweekly'),
    weekly: t('options.weekly'),
    percentage: t('options.percentage'),
    amount: t('options.amount'),
    years: t('options.years'),
    totalMonthlyPayment: t('outputs.totalMonthlyPayment'),
    loanAmount: t('outputs.loanAmount'),
    downPaymentLabel: t('outputs.downPayment'),
    totalInterest: t('outputs.totalInterest'),
    totalCost: t('outputs.totalCost'),
    payoffDate: t('outputs.payoffDate'),
    paymentBreakdown: t('outputs.paymentBreakdown'),
    principalInterest: t('outputs.principalInterest'),
    propertyTaxLabel: t('outputs.propertyTax'),
    homeInsuranceLabel: t('outputs.homeInsurance'),
    pmiLabel: t('outputs.pmi'),
    hoaFeesLabel: t('outputs.hoaFees'),
    pmiRequired: t('outputs.pmiRequired'),
    pmiNotRequired: t('outputs.pmiNotRequired'),
    pmiRemovalInfo: t.raw('outputs.pmiRemovalInfo'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    showSchedule: t('actions.showSchedule'),
    hideSchedule: t('actions.hideSchedule'),
    advancedOptions: t('actions.advancedOptions'),
    showMore: t('actions.showMore'),
    showLess: t('actions.showLess'),
    amortizationSchedule: t('amortization.title'),
    period: t('amortization.period'),
    payment: t('amortization.payment'),
    principal: t('amortization.principal'),
    interest: t('amortization.interest'),
    balance: t('amortization.balance'),
    pmi: t('amortization.pmi'),
    page: t('amortization.page'),
    of: t('amortization.of'),
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
    mortgageTypesTitle: t('seo.mortgageTypesTitle'),
    mortgageTypes: [
      t('seo.mortgageTypeFixed'),
      t('seo.mortgageTypeVariable'),
      t('seo.mortgageTypeInterestOnly'),
      t('seo.mortgageTypeFHA'),
      t('seo.mortgageTypeVA'),
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
      t('seo.resultsPayment'),
      t('seo.resultsTotalCost'),
      t('seo.resultsTotalInterest'),
      t('seo.resultsAmortization'),
    ],
    formulaTitle: t('seo.formulaTitle'),
    formulaContent: t('seo.formulaContent'),
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

  // Sources for the widget - International mortgage best practices
  const sources = [
    { title: 'Investopedia - Mortgage Basics', url: 'https://www.investopedia.com/mortgage-4689703' },
    { title: 'Consumer Financial Protection Bureau', url: 'https://www.consumerfinance.gov/owning-a-home/' },
    { title: 'OECD - Housing Finance', url: 'https://www.oecd.org/housing/' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('mortgage')
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
            initialHelpful={842}
          />
        }
        seoContent={<MortgageSEOContent translations={seoTranslations} />}
      >
        <MortgageCalculator
          locale={locale}
          currency={currency}
          translations={calculatorTranslations}
        />
        <CalculatorDisclaimer
          disclaimer={t('disclaimer.text')}
          additionalNotes={t('disclaimer.note')}
        />
      </CalculatorLayout>
    </>
  )
}
