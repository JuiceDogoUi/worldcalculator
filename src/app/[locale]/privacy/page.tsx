import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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
  const t = await getTranslations({ locale, namespace: 'privacy' })

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'privacy' })

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">{t('privacyTitle')}</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          {t('lastUpdated')}
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('introduction.title')}</h2>
          <p>{t('introduction.content1')}</p>
          <p>{t('introduction.content2')}</p>
        </section>

        {/* Data Controller */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('dataController.title')}</h2>
          <p>{t('dataController.intro')}</p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p><strong>{t('dataController.company')}</strong></p>
            <p>{t('dataController.address1')}</p>
            <p>{t('dataController.address2')}</p>
            <p><a href="mailto:legal@invoo.es" className="text-primary hover:underline">{t('dataController.email')}</a></p>
          </div>
        </section>

        {/* Calculator Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('calculatorPrivacy.title')}</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              {t('calculatorPrivacy.highlight')}
            </p>
            <p className="mt-2 text-blue-800 dark:text-blue-200">
              {t('calculatorPrivacy.content')}
            </p>
          </div>
        </section>

        {/* Data We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('dataCollect.title')}</h2>
          <p>{t('dataCollect.intro')}</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('dataCollect.technical.title')}</h3>
          <ul className="list-disc pl-6 space-y-2">
            {(t.raw('dataCollect.technical.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('dataCollect.cookie.title')}</h3>
          <p>{t('dataCollect.cookie.content')}</p>
        </section>

        {/* Purpose */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('purpose.title')}</h2>
          <p>{t('purpose.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('purpose.provision').split(':')[0]}:</strong>{t('purpose.provision').split(':').slice(1).join(':')}</li>
            <li><strong>{t('purpose.analytics').split(':')[0]}:</strong>{t('purpose.analytics').split(':').slice(1).join(':')}</li>
            <li><strong>{t('purpose.security').split(':')[0]}:</strong>{t('purpose.security').split(':').slice(1).join(':')}</li>
            <li><strong>{t('purpose.legal').split(':')[0]}:</strong>{t('purpose.legal').split(':').slice(1).join(':')}</li>
          </ul>
        </section>

        {/* Legal Basis */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('legalBasis.title')}</h2>
          <p>{t('legalBasis.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('legalBasis.legitimate').split(':')[0]}:</strong>{t('legalBasis.legitimate').split(':').slice(1).join(':')}</li>
            <li><strong>{t('legalBasis.consent').split(':')[0]}:</strong>{t('legalBasis.consent').split(':').slice(1).join(':')}</li>
            <li><strong>{t('legalBasis.obligation').split(':')[0]}:</strong>{t('legalBasis.obligation').split(':').slice(1).join(':')}</li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('cookies.title')}</h2>
          <p>{t('cookies.intro')}</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.types.title')}</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">{t('cookies.types.essential.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('cookies.types.essential.description')}</p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                {(t.raw('cookies.types.essential.items') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">{t('cookies.types.analytics.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('cookies.types.analytics.description')}</p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                {(t.raw('cookies.types.analytics.items') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold">{t('cookies.types.advertising.title')}</h4>
              <p className="text-sm text-muted-foreground">{t('cookies.types.advertising.description')}</p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                {(t.raw('cookies.types.advertising.items') as string[]).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.consent.title')}</h3>
          <p>{t('cookies.consent.intro')}</p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>{t('cookies.consent.accept').split(':')[0]}:</strong>{t('cookies.consent.accept').split(':').slice(1).join(':')}</li>
            <li><strong>{t('cookies.consent.decline').split(':')[0]}:</strong>{t('cookies.consent.decline').split(':').slice(1).join(':')}</li>
          </ul>
          <p className="mt-4">{t('cookies.consent.preference')}</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">{t('cookies.management.title')}</h3>
          <p>{t('cookies.management.content')}</p>
        </section>

        {/* Third Party */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('thirdParty.title')}</h2>
          <p>{t('thirdParty.intro')}</p>

          <div className="space-y-4 mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold">{t('thirdParty.vercel.name')}</h4>
              <p className="text-sm">{t('thirdParty.vercel.purpose')}</p>
              <p className="text-sm">{t('thirdParty.vercel.data')}</p>
              <p className="text-sm">
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t('thirdParty.vercel.privacy')}
                </a>
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold">{t('thirdParty.adsense.name')}</h4>
              <p className="text-sm">{t('thirdParty.adsense.purpose')}</p>
              <p className="text-sm">{t('thirdParty.adsense.data')}</p>
              <p className="text-sm">
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {t('thirdParty.adsense.privacy')}
                </a>
              </p>
              <p className="text-sm mt-2">
                {t('thirdParty.adsense.optOut').split('google.com/settings/ads')[0]}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  google.com/settings/ads
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('retention.title')}</h2>
          <p>{t('retention.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('retention.analytics').split(':')[0]}:</strong>{t('retention.analytics').split(':').slice(1).join(':')}</li>
            <li><strong>{t('retention.logs').split(':')[0]}:</strong>{t('retention.logs').split(':').slice(1).join(':')}</li>
            <li><strong>{t('retention.cookies').split(':')[0]}:</strong>{t('retention.cookies').split(':').slice(1).join(':')}</li>
          </ul>
          <p className="mt-4">{t('retention.calculator')}</p>
        </section>

        {/* Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('rights.title')}</h2>
          <p>{t('rights.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>{t('rights.access').split(':')[0]}:</strong>{t('rights.access').split(':').slice(1).join(':')}</li>
            <li><strong>{t('rights.rectification').split(':')[0]}:</strong>{t('rights.rectification').split(':').slice(1).join(':')}</li>
            <li><strong>{t('rights.erasure').split(':')[0]}:</strong>{t('rights.erasure').split(':').slice(1).join(':')}</li>
            <li><strong>{t('rights.restriction').split(':')[0]}:</strong>{t('rights.restriction').split(':').slice(1).join(':')}</li>
            <li><strong>{t('rights.portability').split(':')[0]}:</strong>{t('rights.portability').split(':').slice(1).join(':')}</li>
            <li><strong>{t('rights.object').split(':')[0]}:</strong>{t('rights.object').split(':').slice(1).join(':')}</li>
            <li><strong>{t('rights.withdraw').split(':')[0]}:</strong>{t('rights.withdraw').split(':').slice(1).join(':')}</li>
          </ul>
          <p className="mt-4">{t('rights.exercise')}</p>
          <p className="mt-4">{t('rights.complaint')}</p>
        </section>

        {/* Transfers */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('transfers.title')}</h2>
          <p>{t('transfers.intro')}</p>
          <p>{t('transfers.safeguards')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('transfers.clauses')}</li>
            <li>{t('transfers.adequacy')}</li>
          </ul>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('security.title')}</h2>
          <p>{t('security.intro')}</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('security.https')}</li>
            <li>{t('security.hosting')}</li>
            <li>{t('security.access')}</li>
            <li>{t('security.audits')}</li>
          </ul>
          <p className="mt-4">{t('security.disclaimer')}</p>
        </section>

        {/* Children */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('children.title')}</h2>
          <p>{t('children.content')}</p>
        </section>

        {/* Changes */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('changes.title')}</h2>
          <p>{t('changes.content1')}</p>
          <p className="mt-4">{t('changes.content2')}</p>
        </section>

        {/* Privacy Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('privacyContact.title')}</h2>
          <p>{t('privacyContact.intro')}</p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p><strong>{t('privacyContact.officer')}</strong></p>
            <p>{t('privacyContact.company')}</p>
            <p>{t('privacyContact.address')}</p>
            <p><a href="mailto:legal@invoo.es" className="text-primary hover:underline">{t('privacyContact.email')}</a></p>
          </div>
        </section>

        {/* Terms of Service Divider */}
        <div className="border-t-4 border-primary my-12 pt-8">
          <h1 className="text-4xl font-bold mb-8">{t('termsTitle')}</h1>
        </div>

        {/* Acceptance */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('acceptance.title')}</h2>
          <p>{t('acceptance.content')}</p>
        </section>

        {/* Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('description.title')}</h2>
          <p>{t('description.content')}</p>
        </section>

        {/* Acceptable Use */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('acceptable.title')}</h2>
          <p>{t('acceptable.intro')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>{t('acceptable.violate')}</li>
            <li>{t('acceptable.interfere')}</li>
            <li>{t('acceptable.extract')}</li>
            <li>{t('acceptable.impersonate')}</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('disclaimer.title')}</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              {t('disclaimer.notice')}
            </p>
            <p className="text-yellow-800 dark:text-yellow-200">
              {t('disclaimer.highlight')}
            </p>
          </div>
          <p className="mt-4">{t('disclaimer.accuracy')}</p>
        </section>

        {/* Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('liability.title')}</h2>
          <p>{t('liability.intro')}</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>{t('liability.use')}</li>
            <li>{t('liability.errors')}</li>
            <li>{t('liability.access')}</li>
            <li>{t('liability.conduct')}</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('intellectual.title')}</h2>
          <p>{t('intellectual.content')}</p>
        </section>

        {/* Modifications */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('modifications.title')}</h2>
          <p>{t('modifications.content')}</p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('governing.title')}</h2>
          <p>{t('governing.content')}</p>
        </section>

        {/* Terms Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('termsContact.title')}</h2>
          <p>{t('termsContact.content')}</p>
        </section>
      </div>
    </div>
  )
}
