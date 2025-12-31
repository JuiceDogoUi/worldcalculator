import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Calculator, Code, Brain, Sparkles } from 'lucide-react'
import { locales } from '@/i18n/locales'

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
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

      <div className="prose prose-slate max-w-none">
        {/* Mission */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Calculator className="h-7 w-7 text-blue-600" />
              {t('mission.title')}
            </h2>
            <p className="text-lg leading-relaxed">
              {t('mission.content')}
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <Code className="h-7 w-7 text-green-600" />
            {t('whoWeAre.title')}
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            {t('whoWeAre.content1')}
          </p>
          <p className="leading-relaxed">
            {t('whoWeAre.content2')}
          </p>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('different.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">{t('different.free.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('different.free.description')}
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">{t('different.privacy.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('different.privacy.description')}
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">{t('different.precision.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('different.precision.description')}
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">{t('different.everywhere.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('different.everywhere.description')}
              </p>
            </div>
          </div>
        </section>

        {/* The Future */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Brain className="h-7 w-7 text-purple-600" />
              {t('future.title')}
            </h2>
            <p className="leading-relaxed mb-4">
              {t('future.content')}
            </p>
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">{t('future.comingSoon')}</span>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <p className="text-muted-foreground mb-4">
            {t('cta.text')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t('cta.button')}
          </Link>
        </section>
      </div>
    </div>
  )
}
