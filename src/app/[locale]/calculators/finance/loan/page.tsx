import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { LoanCalculator } from '@/features/finance/loan/LoanCalculator'
import { LoanSEOContent } from '@/features/finance/loan/LoanSEOContent'
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
  const t = await getTranslations({ locale, namespace: 'calculators.finance.loan' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/finance/loan`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/finance/loan`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/finance/loan`,
    },
  }
}

export default async function LoanCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.finance.loan' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/finance/loan`

  // Get currency based on locale (language = country assumption)
  const currency = getCurrencyForLocale(locale)

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/finance/loan`,
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
    loanAmount: t('inputs.loanAmount'),
    interestRate: t('inputs.interestRate'),
    loanTerm: t('inputs.loanTerm'),
    paymentFrequency: t('inputs.paymentFrequency'),
    monthlyPayment: t('outputs.monthlyPayment'),
    biweeklyPayment: t('outputs.biweeklyPayment'),
    weeklyPayment: t('outputs.weeklyPayment'),
    totalPayment: t('outputs.totalPayment'),
    totalInterest: t('outputs.totalInterest'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    monthly: t('frequency.monthly'),
    biweekly: t('frequency.biweekly'),
    weekly: t('frequency.weekly'),
    years: t('units.years'),
    months: t('units.months'),
    amortizationSchedule: t('outputs.amortizationSchedule'),
    period: t('table.period'),
    payment: t('table.payment'),
    principal: t('table.principal'),
    interest: t('table.interest'),
    balance: t('table.balance'),
    payoffDate: t('outputs.payoffDate'),
    showSchedule: t('actions.showSchedule'),
    hideSchedule: t('actions.hideSchedule'),
    loanSummary: t('outputs.loanSummary'),
    // Advanced options (fees & insurance)
    advancedOptions: t('advanced.title'),
    originationFee: t('advanced.originationFee'),
    monthlyFee: t('advanced.monthlyFee'),
    insuranceCost: t('advanced.insuranceCost'),
    otherFees: t('advanced.otherFees'),
    totalFees: t('advanced.totalFees'),
    totalMonths: t('advanced.totalMonths'),
    // Pagination
    page: t('pagination.page'),
    of: t('pagination.of'),
    // Conversational summary - use t.raw() to get raw template strings without interpolation
    summary: {
      title: t('summary.title'),
      loanReceived: t.raw('summary.loanReceived'),
      loanReceivedNoFee: t.raw('summary.loanReceivedNoFee'),
      periodicPayment: t.raw('summary.periodicPayment'),
      totalPayment: t.raw('summary.totalPayment'),
      effectiveRate: t.raw('summary.effectiveRate'),
      paidOffBy: t.raw('summary.paidOffBy'),
      viewBreakdown: t('summary.viewBreakdown'),
      hideBreakdown: t('summary.hideBreakdown'),
    },
    // Rate type selector translations
    rateType: {
      question: t('rateType.question'),
      nominal: t('rateType.nominal'),
      nominalDescription: t('rateType.nominalDescription'),
      apr: t('rateType.apr'),
      aprDescription: t('rateType.aprDescription'),
      both: t('rateType.both'),
      bothDescription: t('rateType.bothDescription'),
      unknown: t('rateType.unknown'),
      unknownDescription: t('rateType.unknownDescription'),
      usingEstimatedRate: t('rateType.usingEstimatedRate'),
      calculatedNominal: t('rateType.calculatedNominal'),
      calculatedEffective: t('rateType.calculatedEffective'),
    },
    // Input labels
    nominalRate: t('inputs.nominalRate'),
    effectiveRate: t('inputs.effectiveRate'),
  }

  // Disclaimer translations
  const disclaimerTranslations = {
    text: t('disclaimer.text'),
    note: t('disclaimer.note'),
  }

  // SEO content translations - expanded with new sections
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
    loanTypesTitle: t('seo.loanTypesTitle'),
    loanTypes: [
      t('seo.loanTypePersonal'),
      t('seo.loanTypeAuto'),
      t('seo.loanTypeMortgage'),
      t('seo.loanTypeStudent'),
      t('seo.loanTypeBusiness'),
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
      t('seo.resultsTotalPayment'),
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

  // Generate Breadcrumb schema
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      { name: tCategories('finance'), url: `/${locale}/calculators/finance` },
      { name: t('title') },
    ],
    siteUrl
  )

  // Sources for the widget - International best practice guidance (not country-specific)
  const sources = [
    { title: 'Investopedia - Loan Amortization', url: 'https://www.investopedia.com/terms/a/amortization.asp' },
    { title: 'Khan Academy - Interest Basics', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial' },
    { title: 'OECD - Financial Education', url: 'https://www.oecd.org/financial/education/' },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('loan')
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
            initialHelpful={1243}
          />
        }
        seoContent={<LoanSEOContent translations={seoTranslations} />}
      >
        <LoanCalculator
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
