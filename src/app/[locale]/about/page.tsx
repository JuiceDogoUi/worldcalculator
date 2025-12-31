import type { Metadata } from 'next'
import { unstable_setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { Calculator, Code, Brain, Sparkles } from 'lucide-react'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us | World Calculator',
    description:
      'World Calculator is built by coders and mathematicians passionate about making calculations fast, accurate, and accessible to everyone.',
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
  unstable_setRequestLocale(locale)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About World Calculator</h1>

      <div className="prose prose-slate max-w-none">
        {/* Mission */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Calculator className="h-7 w-7 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed">
              We believe everyone deserves access to fast, accurate, and easy-to-use calculators.
              Whether you&apos;re planning a mortgage, tracking your fitness goals, or solving
              a math problem, we&apos;ve got you covered.
            </p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
            <Code className="h-7 w-7 text-green-600" />
            Who We Are
          </h2>
          <p className="text-lg leading-relaxed mb-4">
            World Calculator is built by a small team of <strong>software engineers</strong> and{' '}
            <strong>mathematicians</strong> who share a simple passion: making calculations faster
            and more accessible for everyone.
          </p>
          <p className="leading-relaxed">
            We&apos;ve spent countless hours perfecting formulas, optimizing performance, and
            designing interfaces that just work. No sign-ups required, no data collection
            on your calculations. Just pure, reliable tools.
          </p>
        </section>

        {/* What Makes Us Different */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">What Makes Us Different</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground">
                All calculators are completely free to use, forever. No premium tiers or hidden features.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Privacy First</h3>
              <p className="text-sm text-muted-foreground">
                Your calculations stay in your browser. We never see, store, or sell your data.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Precision Matters</h3>
              <p className="text-sm text-muted-foreground">
                Built by mathematicians who obsess over accuracy. Every formula is verified and tested.
              </p>
            </div>
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-semibold mb-2">Works Everywhere</h3>
              <p className="text-sm text-muted-foreground">
                Available in 6 languages with locale-specific formatting. Use it on any device.
              </p>
            </div>
          </div>
        </section>

        {/* The Future */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
              <Brain className="h-7 w-7 text-purple-600" />
              What&apos;s Next: AI-Powered Calculations
            </h2>
            <p className="leading-relaxed mb-4">
              We&apos;re working on the next evolution of World Calculator: <strong>AI-enhanced tools</strong> that
              understand your questions in plain language and guide you to the right answer.
            </p>
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-medium">Coming soon</span>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <p className="text-muted-foreground mb-4">
            Have questions, suggestions, or just want to say hi?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </div>
  )
}
