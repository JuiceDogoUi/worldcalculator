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
    </div>
  )
}
