import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { locales } from '@/i18n/locales'
import { categories } from '@/config/categories'
import { SearchBar } from '@/components/home/SearchBar'
import { CategoryCard } from '@/components/home/CategoryCard'

/**
 * Generate metadata for home page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })

  return {
    title: t('h1'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((loc) => [loc, `/${loc}`])),
    },
    openGraph: {
      title: t('h1'),
      description: t('description'),
      url: `/${locale}`,
      siteName: t('name'),
      type: 'website',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: t('h1'),
      description: t('description'),
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Enable static rendering
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })
  const tCategories = await getTranslations({ locale, namespace: 'categories' })

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              {t('heroTitle')}
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {t('heroSubtitle')}
            </p>

            {/* Search bar */}
            <SearchBar
              placeholder={t('searchPlaceholder')}
              locale={locale}
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('categoriesTitle')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('categoriesSubtitle')}
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              slug={category.slug}
              icon={category.icon}
              color={category.color}
              title={tCategories(category.translationKey)}
              description={t(`categoryDescriptions.${category.translationKey}`)}
              locale={locale}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('whyChooseUs.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t('whyChooseUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Free Forever */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('whyChooseUs.features.free.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.features.free.description')}
              </p>
            </div>

            {/* Accurate & Reliable */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('whyChooseUs.features.accurate.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.features.accurate.description')}
              </p>
            </div>

            {/* Privacy */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('whyChooseUs.features.private.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.features.private.description')}
              </p>
            </div>

            {/* Multilingual */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('whyChooseUs.features.multilingual.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whyChooseUs.features.multilingual.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('howItWorks.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('howItWorks.steps.step1.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('howItWorks.steps.step1.description')}
              </p>
            </div>
            {/* Connector arrow (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-full w-full h-0.5">
              <svg
                className="absolute -left-4 -top-1 text-primary/20"
                width="100%"
                height="4"
                fill="none"
              >
                <line
                  x1="0"
                  y1="2"
                  x2="100%"
                  y2="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {t('howItWorks.steps.step2.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('howItWorks.steps.step2.description')}
              </p>
            </div>
            {/* Connector arrow (hidden on mobile) */}
            <div className="hidden md:block absolute top-8 left-full w-full h-0.5">
              <svg
                className="absolute -left-4 -top-1 text-primary/20"
                width="100%"
                height="4"
                fill="none"
              >
                <line
                  x1="0"
                  y1="2"
                  x2="100%"
                  y2="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">
              {t('howItWorks.steps.step3.title')}
            </h3>
            <p className="text-muted-foreground">
              {t('howItWorks.steps.step3.description')}
            </p>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('whatWeOffer.title')}
            </h2>
          </div>

          {/* Main description */}
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-muted-foreground text-center leading-relaxed">
              {t('whatWeOffer.description')}
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">
                {t('whatWeOffer.features.feature1.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whatWeOffer.features.feature1.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">
                {t('whatWeOffer.features.feature2.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whatWeOffer.features.feature2.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">
                {t('whatWeOffer.features.feature3.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whatWeOffer.features.feature3.description')}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-3">
                {t('whatWeOffer.features.feature4.title')}
              </h3>
              <p className="text-muted-foreground">
                {t('whatWeOffer.features.feature4.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
