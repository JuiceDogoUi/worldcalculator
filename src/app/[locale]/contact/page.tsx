import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react'
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
  const t = await getTranslations({ locale, namespace: 'contact' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'contact' })

  const email = 'minted.78spots@icloud.com'
  const subject = encodeURIComponent('World Calculator - Contact')

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

      <div className="prose prose-slate max-w-none">
        {/* Intro */}
        <section className="mb-12">
          <p className="text-lg leading-relaxed">
            {t('intro')}
          </p>
        </section>

        {/* Email CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">{t('email.title')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('email.description')}
            </p>
            <a
              href={`mailto:${email}?subject=${subject}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-lg"
            >
              <Mail className="h-5 w-5" />
              {t('email.button')}
            </a>
          </div>
        </section>

        {/* What to Contact About */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('help.title')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-muted p-6 rounded-xl text-center">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('help.questions.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('help.questions.description')}
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl text-center">
              <Bug className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('help.bugs.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('help.bugs.description')}
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl text-center">
              <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t('help.features.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('help.features.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="text-center text-muted-foreground">
          <p className="whitespace-pre-line">
            {t('thanks')}
          </p>
        </section>
      </div>
    </div>
  )
}
