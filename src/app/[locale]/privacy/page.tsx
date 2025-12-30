import type { Metadata } from 'next'
import { unstable_setRequestLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy | World Calculator',
    description:
      'Privacy policy and data protection information for World Calculator users. Learn how we handle your data in compliance with GDPR and EU regulations.',
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
  unstable_setRequestLocale(locale)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          Last updated: December 30, 2025
        </p>

        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            World Calculator (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy and personal data.
            This privacy policy explains how we collect, use, and protect your information when you use our
            free online calculator platform at worldcalculator.org (the &quot;Service&quot;).
          </p>
          <p>
            We comply with the General Data Protection Regulation (GDPR) (EU) 2016/679 and other applicable
            data protection laws.
          </p>
        </section>

        {/* Data Controller */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data Controller</h2>
          <p>The data controller responsible for your personal data is:</p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p><strong>Roques OÜ</strong></p>
            <p>Ahtri tn 12</p>
            <p>15551 Tallinn, Estonia</p>
            <p>Email: <a href="mailto:legal@invoo.es" className="text-primary hover:underline">legal@invoo.es</a></p>
          </div>
        </section>

        {/* Important Notice */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Calculator Data Privacy</h2>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <p className="font-semibold text-blue-900 dark:text-blue-100">
              We do not store, collect, or sell the data you enter into our calculators.
            </p>
            <p className="mt-2 text-blue-800 dark:text-blue-200">
              All calculator inputs and results are processed entirely in your browser. Your calculations
              never leave your device and are not transmitted to our servers. We have no access to the
              numbers, amounts, or any other information you enter into our calculators.
            </p>
          </div>
        </section>

        {/* Data We Collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data We Collect</h2>
          <p>We collect the following categories of information:</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Technical Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type and operating system</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referral source</li>
            <li>General geographic location (country/city level)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Cookie Data</h3>
          <p>
            We use cookies and similar tracking technologies to improve your experience.
            See Section 7 for detailed information about cookies.
          </p>
        </section>

        {/* Purpose of Processing */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Purpose of Processing</h2>
          <p>We process your data for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Provision:</strong> To deliver our free calculator tools and ensure they function correctly</li>
            <li><strong>Analytics:</strong> To understand how visitors use our Service and improve user experience</li>
            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </section>

        {/* Legal Basis */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Legal Basis for Processing</h2>
          <p>Under GDPR, we process your personal data based on:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Legitimate Interest (Article 6(1)(f)):</strong> To operate and improve our Service,
              perform analytics, and ensure security
            </li>
            <li>
              <strong>Consent (Article 6(1)(a)):</strong> For non-essential cookies
              (you can withdraw consent at any time)
            </li>
            <li>
              <strong>Legal Obligation (Article 6(1)(c)):</strong> To comply with applicable laws
            </li>
          </ul>
        </section>

        {/* Cookies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies to enhance your experience. Cookies are small text files
            stored on your device that help us recognize you and remember your preferences.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Types of Cookies We Use</h3>

          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold">Essential Cookies (Required)</h4>
              <p className="text-sm text-muted-foreground">
                These cookies are necessary for the website to function and cannot be disabled.
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                <li>Session management</li>
                <li>Security and fraud prevention</li>
                <li>Privacy consent preferences</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold">Analytics Cookies</h4>
              <p className="text-sm text-muted-foreground">
                Help us understand how visitors interact with our website.
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                <li>Vercel Analytics: Performance monitoring</li>
                <li>Page views and navigation patterns</li>
                <li>Geographic and demographic insights (anonymized)</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Managing Cookies</h3>
          <p>
            You can control and delete cookies through your browser settings. However, disabling cookies
            may affect the functionality of our Service.
          </p>
        </section>

        {/* Third-Party Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
          <p>We share data with the following third-party service providers:</p>

          <div className="space-y-4 mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold">Vercel Inc.</h4>
              <p className="text-sm">
                <strong>Purpose:</strong> Hosting and analytics
              </p>
              <p className="text-sm">
                <strong>Data shared:</strong> Technical data, page views, performance metrics
              </p>
              <p className="text-sm">
                <strong>Privacy policy:</strong>{' '}
                <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  vercel.com/legal/privacy-policy
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Data Retention</h2>
          <p>We retain your data for the following periods:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Analytics data:</strong> Up to 24 months</li>
            <li><strong>Server logs:</strong> Up to 90 days</li>
            <li><strong>Cookie data:</strong> Varies by cookie type (see cookie settings for specifics)</li>
          </ul>
          <p className="mt-4">
            Calculator input data is <strong>not retained</strong> as it never leaves your browser.
          </p>
        </section>

        {/* Your Rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Your Rights Under GDPR</h2>
          <p>You have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Right to Access:</strong> Request a copy of the personal data we hold about you
            </li>
            <li>
              <strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data
            </li>
            <li>
              <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request deletion of your personal data
            </li>
            <li>
              <strong>Right to Restriction:</strong> Request limitation of processing your data
            </li>
            <li>
              <strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format
            </li>
            <li>
              <strong>Right to Object:</strong> Object to processing based on legitimate interests
            </li>
            <li>
              <strong>Right to Withdraw Consent:</strong> Withdraw your consent for cookie-based processing at any time
            </li>
          </ul>

          <p className="mt-4">
            To exercise any of these rights, please contact us at{' '}
            <a href="mailto:legal@invoo.es" className="text-primary hover:underline">legal@invoo.es</a>.
            We will respond within one month.
          </p>

          <p className="mt-4">
            If you are not satisfied with our response, you have the right to lodge a complaint with your
            local data protection authority.
          </p>
        </section>

        {/* International Data Transfers */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. International Data Transfers</h2>
          <p>
            Our Service is hosted within the European Union. However, some of our third-party service
            providers (such as Vercel) may process data outside the EU/EEA.
          </p>
          <p>
            When data is transferred outside the EU/EEA, we ensure appropriate safeguards are in place,
            including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard Contractual Clauses approved by the European Commission</li>
            <li>Adequacy decisions by the European Commission</li>
          </ul>
        </section>

        {/* Data Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against
            unauthorized access, alteration, disclosure, or destruction, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure hosting infrastructure with regular security updates</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Regular security audits and monitoring</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the internet is 100% secure. While we strive to protect
            your data, we cannot guarantee absolute security.
          </p>
        </section>

        {/* Children's Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Children&apos;s Privacy</h2>
          <p>
            Our Service is not directed to children under the age of 16. We do not knowingly collect personal
            data from children under 16. If you believe we have collected data from a child under 16, please
            contact us immediately.
          </p>
        </section>

        {/* Changes to Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time to reflect changes in our practices or for
            legal, operational, or regulatory reasons. We will notify you of any material changes by posting
            the updated policy on this page with a new &quot;Last updated&quot; date.
          </p>
          <p className="mt-4">
            We encourage you to review this privacy policy periodically to stay informed about how we protect
            your data.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">15. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this privacy policy or our data
            practices, please contact us:
          </p>
          <div className="bg-muted p-4 rounded-lg my-4">
            <p><strong>Data Protection Officer</strong></p>
            <p>Roques OÜ</p>
            <p>Ahtri tn 12, 15551 Tallinn, Estonia</p>
            <p>Email: <a href="mailto:legal@invoo.es" className="text-primary hover:underline">legal@invoo.es</a></p>
          </div>
        </section>
      </div>
    </div>
  )
}
