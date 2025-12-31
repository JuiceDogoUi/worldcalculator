import type { Metadata } from 'next'
import { unstable_setRequestLocale } from 'next-intl/server'
import { Mail, MessageSquare, Bug, Lightbulb } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us | World Calculator',
    description:
      'Get in touch with the World Calculator team. We welcome your questions, feedback, and suggestions.',
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
  unstable_setRequestLocale(locale)

  const email = 'minted.78spots@icloud.com'
  const subject = encodeURIComponent('World Calculator - Contact')

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

      <div className="prose prose-slate max-w-none">
        {/* Intro */}
        <section className="mb-12">
          <p className="text-lg leading-relaxed">
            We&apos;d love to hear from you! Whether you have a question, found a bug, or want to
            suggest a new calculator, we&apos;re here to help.
          </p>
        </section>

        {/* Email CTA */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl text-center">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Send Us an Email</h2>
            <p className="text-muted-foreground mb-6">
              The fastest way to reach us is by email. We typically respond within 24-48 hours.
            </p>
            <a
              href={`mailto:${email}?subject=${subject}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-lg"
            >
              <Mail className="h-5 w-5" />
              Get in Touch
            </a>
          </div>
        </section>

        {/* What to Contact About */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">How Can We Help?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-muted p-6 rounded-xl text-center">
              <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">General Questions</h3>
              <p className="text-sm text-muted-foreground">
                Questions about how to use our calculators or interpret results.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl text-center">
              <Bug className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Bug Reports</h3>
              <p className="text-sm text-muted-foreground">
                Found something that doesn&apos;t work right? Let us know and we&apos;ll fix it.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl text-center">
              <Lightbulb className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Feature Requests</h3>
              <p className="text-sm text-muted-foreground">
                Have an idea for a new calculator? We&apos;re always looking to expand.
              </p>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="text-center text-muted-foreground">
          <p>
            We read every message and do our best to respond quickly.
            <br />
            Thank you for using World Calculator!
          </p>
        </section>
      </div>
    </div>
  )
}
