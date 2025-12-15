import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, localeConfigs } from '@/i18n/locales'
import { Header } from '@/components/layout/Header'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
} from '@/lib/structuredData'
import type { Metadata } from 'next'

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
  const t = await getTranslations({ locale, namespace: 'site' })

  return {
    title: {
      template: `%s | ${t('name')}`,
      default: t('name'),
    },
    description: t('description'),
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((loc) => [loc, `/${loc}`])),
        'x-default': '/en',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound()
  }

  // Get messages for the locale
  const messages = await getMessages()
  const config = localeConfigs[locale as keyof typeof localeConfigs]
  const t = await getTranslations({ locale, namespace: 'site' })

  // Generate structured data for SEO
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldcalculator.com'
  const structuredDataConfig = {
    siteName: t('name'),
    siteUrl,
    locale,
  }

  const organizationSchema = generateOrganizationSchema(structuredDataConfig)
  const websiteSchema = generateWebSiteSchema(structuredDataConfig)

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="min-h-screen flex flex-col" dir={config?.direction}>
            <Header />
            <Navigation />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
