import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CalculatorLayout } from '@/components/calculator/CalculatorLayout'
import { CalculatorWidget } from '@/components/calculator/widget'
import { CalculatorDisclaimer } from '@/components/calculator/CalculatorDisclaimer'
import { AgeCalculator } from '@/features/time-date/age/AgeCalculator'
import { AgeSEOContent } from '@/features/time-date/age/AgeSEOContent'
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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.timeDate.age' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    alternates: {
      canonical: `${siteUrl}/${locale}/calculators/time-date/age`,
      languages: Object.fromEntries(
        locales.map((loc) => [loc, `${siteUrl}/${loc}/calculators/time-date/age`])
      ),
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
      url: `${siteUrl}/${locale}/calculators/time-date/age`,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  }
}

export default async function AgeCalculatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'calculators.timeDate.age' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldcalculator.org'
  const calculatorUrl = `${siteUrl}/${locale}/calculators/time-date/age`

  const calculatorSchema = generateCalculatorSchema(
    {
      name: t('title'),
      description: t('meta.description'),
      url: `/${locale}/calculators/time-date/age`,
      applicationCategory: 'UtilityApplication',
      offers: { price: '0', priceCurrency: 'USD' },
    },
    { siteName: 'World Calculator', siteUrl, locale }
  )

  const calculatorTranslations = {
    birthDate: t('inputs.birthDate'),
    targetDate: t('inputs.targetDate'),
    useToday: t('inputs.useToday'),
    calculate: t('actions.calculate'),
    reset: t('actions.reset'),
    results: {
      title: t('results.title'),
      age: t('results.age'),
      years: t('results.years'),
      months: t('results.months'),
      days: t('results.days'),
      nextBirthday: t('results.nextBirthday'),
      daysUntil: t('results.daysUntil'),
      willTurn: t('results.willTurn'),
      bornOn: t('results.bornOn'),
      zodiacSign: t('results.zodiacSign'),
      generation: t('results.generation'),
      totalDays: t('results.totalDays'),
      totalWeeks: t('results.totalWeeks'),
      totalMonths: t('results.totalMonths'),
      totalHours: t('results.totalHours'),
      totalMinutes: t('results.totalMinutes'),
      birthdayToday: t('results.birthdayToday'),
    },
    zodiacSigns: {
      aries: t('zodiacSigns.aries'),
      taurus: t('zodiacSigns.taurus'),
      gemini: t('zodiacSigns.gemini'),
      cancer: t('zodiacSigns.cancer'),
      leo: t('zodiacSigns.leo'),
      virgo: t('zodiacSigns.virgo'),
      libra: t('zodiacSigns.libra'),
      scorpio: t('zodiacSigns.scorpio'),
      sagittarius: t('zodiacSigns.sagittarius'),
      capricorn: t('zodiacSigns.capricorn'),
      aquarius: t('zodiacSigns.aquarius'),
      pisces: t('zodiacSigns.pisces'),
    },
    generations: {
      silent: t('generations.silent'),
      'baby-boomer': t('generations.babyBoomer'),
      'gen-x': t('generations.genX'),
      millennial: t('generations.millennial'),
      'gen-z': t('generations.genZ'),
      'gen-alpha': t('generations.genAlpha'),
    },
    daysOfWeek: {
      sunday: t('daysOfWeek.sunday'),
      monday: t('daysOfWeek.monday'),
      tuesday: t('daysOfWeek.tuesday'),
      wednesday: t('daysOfWeek.wednesday'),
      thursday: t('daysOfWeek.thursday'),
      friday: t('daysOfWeek.friday'),
      saturday: t('daysOfWeek.saturday'),
    },
    validation: {
      birthDateRequired: t('validation.birthDateRequired'),
      birthDateInvalid: t('validation.birthDateInvalid'),
      birthDateFuture: t('validation.birthDateFuture'),
      birthDateTooOld: t('validation.birthDateTooOld'),
      targetDateInvalid: t('validation.targetDateInvalid'),
    },
  }

  const disclaimerTranslations = {
    text: t('disclaimer.text'),
    note: t('disclaimer.note'),
  }

  const seoTranslations = {
    whatIsTitle: t('seo.whatIsTitle'),
    whatIsContent: t('seo.whatIsContent'),
    howItWorksTitle: t('seo.howItWorksTitle'),
    howItWorksContent: t('seo.howItWorksContent'),
    featuresTitle: t('seo.featuresTitle'),
    features: [
      t('seo.feature1'),
      t('seo.feature2'),
      t('seo.feature3'),
      t('seo.feature4'),
    ],
    useCasesTitle: t('seo.useCasesTitle'),
    useCases: [
      t('seo.useCase1'),
      t('seo.useCase2'),
      t('seo.useCase3'),
      t('seo.useCase4'),
    ],
    tipsTitle: t('seo.tipsTitle'),
    tips: [
      t('seo.tip1'),
      t('seo.tip2'),
      t('seo.tip3'),
      t('seo.tip4'),
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

  const faqSchema = generateFAQSchema(seoTranslations.faqs)

  const howToStepNames = [
    t('seo.howToStepName1'),
    t('seo.howToStepName2'),
    t('seo.howToStepName3'),
    t('seo.howToStepName4'),
    t('seo.howToStepName5'),
  ]
  const howToSchema = generateHowToSchema(
    t('seo.howToTitle'),
    t('description'),
    [
      t('seo.howToStep1'),
      t('seo.howToStep2'),
      t('seo.howToStep3'),
      t('seo.howToStep4'),
      t('seo.howToStep5'),
    ].map((step, i) => ({ name: howToStepNames[i], text: step }))
  )

  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `/${locale}` },
      { name: tCategories('timeDate'), url: `/${locale}/calculators/time-date` },
      { name: t('title') },
    ],
    siteUrl
  )

  const sources = [
    { title: 'ISO 8601 - Date and time format', url: 'https://www.iso.org/iso-8601-date-and-time-format.html' },
  ]

  const calculatorConfig = getCalculatorBySlug('age')
  const lastUpdated = calculatorConfig?.lastModified
    ? new Date(calculatorConfig.lastModified).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : undefined

  const structuredData = [calculatorSchema, faqSchema, howToSchema, breadcrumbSchema]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorLayout
        title={t('title')}
        description={t('description')}
        categorySlug="time-date"
        categoryName={tCategories('timeDate')}
        lastUpdated={lastUpdated}
        widget={
          <CalculatorWidget
            calculatorName={t('title')}
            calculatorUrl={calculatorUrl}
            sources={sources}
            initialLikes={42}
            initialHelpful={538}
          />
        }
        seoContent={<AgeSEOContent translations={seoTranslations} />}
      >
        <AgeCalculator locale={locale} translations={calculatorTranslations} />
        <CalculatorDisclaimer
          disclaimer={disclaimerTranslations.text}
          additionalNotes={disclaimerTranslations.note}
        />
      </CalculatorLayout>
    </>
  )
}
