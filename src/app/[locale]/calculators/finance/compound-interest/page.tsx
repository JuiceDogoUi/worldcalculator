import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { CompoundInterestCalculator } from '@/features/finance/compound-interest/CompoundInterestCalculator'
import { CompoundInterestSEOContent } from '@/features/finance/compound-interest/CompoundInterestSEOContent'
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
    namespace: 'calculators.finance.compound-interest',
  })
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/finance/compound-interest`,
      languages: Object.fromEntries(
        locales.map((loc) => [
          loc,
          `${siteUrl}/${loc}/calculators/finance/compound-interest`,
        ])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/finance/compound-interest`,
    },
  }
}

export default async function CompoundInterestCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({
    locale,
    namespace: 'calculators.finance.compound-interest',
  })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/finance/compound-interest`

  // Generate structured data
  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/finance/compound-interest`,
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
    principal: t('inputs.principal'),
    annualRate: t('inputs.annualRate'),
    years: t('inputs.years'),
    compoundingFrequency: t('inputs.compoundingFrequency'),
    contributionAmount: t('inputs.contributionAmount'),
    contributionFrequency: t('inputs.contributionFrequency'),
    annually: t('compounding.annually'),
    semiannually: t('compounding.semiannually'),
    quarterly: t('compounding.quarterly'),
    monthly: t('compounding.monthly'),
    daily: t('compounding.daily'),
    noContributions: t('contributions.none'),
    monthlyContributions: t('contributions.monthly'),
    quarterlyContributions: t('contributions.quarterly'),
    annualContributions: t('contributions.annually'),
    finalBalance: t('results.finalBalance'),
    totalContributions: t('results.totalContributions'),
    totalInterest: t('results.totalInterest'),
    effectiveRate: t('results.effectiveRate'),
    interestOnPrincipal: t('results.interestOnPrincipal'),
    principalLabel: t('results.principal'),
    reset: t('actions.reset'),
    showBreakdown: t('actions.showBreakdown'),
    hideBreakdown: t('actions.hideBreakdown'),
    year: t('table.year'),
    startingBalance: t('table.startingBalance'),
    contributions: t('table.contributions'),
    interestEarned: t('table.interestEarned'),
    endingBalance: t('table.endingBalance'),
    regularContributions: t('advanced.regularContributions'),
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
    formulaTitle: t('seo.formulaTitle'),
    formulaBasic: t('seo.formulaBasic'),
    formulaBasicDesc: t('seo.formulaBasicDesc'),
    formulaWithContributions: t('seo.formulaWithContributions'),
    formulaWithContributionsDesc: t('seo.formulaWithContributionsDesc'),
    variablesTitle: t('seo.variablesTitle'),
    variables: [
      { symbol: 'A', meaning: t('seo.variableA') },
      { symbol: 'P', meaning: t('seo.variableP') },
      { symbol: 'r', meaning: t('seo.variableR') },
      { symbol: 'n', meaning: t('seo.variableN') },
      { symbol: 't', meaning: t('seo.variableT') },
      { symbol: 'PMT', meaning: t('seo.variablePMT') },
    ],
    compoundingTitle: t('seo.compoundingTitle'),
    compoundingIntro: t('seo.compoundingIntro'),
    compoundingOptions: [
      {
        frequency: t('compounding.daily'),
        description: t('seo.compoundingDaily'),
      },
      {
        frequency: t('compounding.monthly'),
        description: t('seo.compoundingMonthly'),
      },
      {
        frequency: t('compounding.quarterly'),
        description: t('seo.compoundingQuarterly'),
      },
      {
        frequency: t('compounding.annually'),
        description: t('seo.compoundingAnnually'),
      },
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

  // Generate HowTo schema for rich snippets (with SEO-optimized step names)
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
      title: 'SEC - Compound Interest Calculator',
      url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator',
    },
    {
      title: 'Investopedia - Compound Interest',
      url: 'https://www.investopedia.com/terms/c/compoundinterest.asp',
    },
  ]

  // Get last modified date from calculator config
  const calculatorConfig = getCalculatorBySlug('compound-interest')
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
            initialLikes={156}
            initialHelpful={2341}
          />
        }
        seoContent={<CompoundInterestSEOContent translations={seoTranslations} />}
      >
        <CompoundInterestCalculator
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
