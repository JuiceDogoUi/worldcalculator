import type { Metadata } from 'next'
import { unstable_setRequestLocale } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Privacy Policy & Terms of Service | World Calculator',
    description:
      'Privacy policy, terms of service, and data protection information for World Calculator users. Learn how we handle your data in compliance with GDPR and EU regulations.',
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
      <h1 className="text-4xl font-bold mb-8">Privacy Policy & Terms of Service</h1>

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

            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold">Advertising Cookies</h4>
              <p className="text-sm text-muted-foreground">
                Used to deliver relevant advertisements and measure ad performance.
              </p>
              <ul className="list-disc pl-6 mt-2 text-sm">
                <li>Google AdSense: Ad personalization and delivery</li>
                <li>Interest-based advertising</li>
                <li>Ad frequency capping and measurement</li>
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

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold">Google AdSense</h4>
              <p className="text-sm">
                <strong>Purpose:</strong> Advertising
              </p>
              <p className="text-sm">
                <strong>Data shared:</strong> Cookies, device identifiers, browsing behavior for personalized ads
              </p>
              <p className="text-sm">
                <strong>Privacy policy:</strong>{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  policies.google.com/privacy
                </a>
              </p>
              <p className="text-sm mt-2">
                Google uses cookies to serve ads based on your prior visits. You can opt out of personalized advertising at{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  google.com/settings/ads
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

        {/* Terms of Service Divider */}
        <div className="border-t-4 border-primary my-12 pt-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        </div>

        {/* Terms Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using World Calculator (&quot;the Service&quot;), you accept and agree to be bound
            by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>
        </section>

        {/* Service Description */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
          <p>
            World Calculator provides free online calculator tools for finance, health, math, and other
            purposes. The Service is provided &quot;as is&quot; and is intended for informational and educational
            purposes only.
          </p>
        </section>

        {/* Use of Service */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Acceptable Use</h2>
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Use the Service in any way that violates applicable laws or regulations</li>
            <li>Attempt to interfere with or disrupt the Service or its servers</li>
            <li>Use automated systems or software to extract data from the Service</li>
            <li>Impersonate or attempt to impersonate World Calculator or its representatives</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Disclaimer of Warranties</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <p className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Important Notice
            </p>
            <p className="text-yellow-800 dark:text-yellow-200">
              The calculations provided by World Calculator are for informational purposes only and should
              not be considered as professional financial, medical, legal, or other advice. Always consult
              with qualified professionals for important decisions.
            </p>
          </div>
          <p className="mt-4">
            We make no warranties or representations about the accuracy, reliability, or completeness of the
            calculations. While we strive for accuracy, errors may occur. Use the results at your own discretion.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, World Calculator and its operators shall not be liable
            for any indirect, incidental, special, consequential, or punitive damages, including but not
            limited to loss of profits, data, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Your use or inability to use the Service</li>
            <li>Any errors or inaccuracies in the calculations</li>
            <li>Unauthorized access to or alteration of your data</li>
            <li>Any third-party conduct on the Service</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by World Calculator
            and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        {/* Modifications */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of any material
            changes by updating the &quot;Last updated&quot; date at the top of this page. Your continued use of
            the Service after any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Estonia, without
            regard to its conflict of law provisions. Any disputes arising from these Terms or the Service
            shall be subject to the exclusive jurisdiction of the courts of Estonia.
          </p>
        </section>

        {/* Contact for Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{' '}
            <a href="mailto:legal@invoo.es" className="text-primary hover:underline">legal@invoo.es</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
