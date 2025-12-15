import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { locales } from '@/i18n/locales'

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

export default async function HomePage() {
  const t = await getTranslations('site')

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 md:text-5xl">{t('h1')}</h1>
        <p className="text-xl text-muted-foreground mb-8">{t('tagline')}</p>
        <p className="text-lg">{t('description')}</p>
      </div>
    </div>
  )
}
