interface SEOTranslations {
  whatIsTitle: string
  whatIsContent: string
  howItWorksTitle: string
  howItWorksIntro: string
  howItWorksSteps: string[]
  benefitsTitle: string
  benefits: string[]
  tipsTitle: string
  tips: string[]
  faqTitle: string
  faqs: Array<{ question: string; answer: string }>
}

interface SavingsGoalSEOContentProps {
  translations: SEOTranslations
}

export function SavingsGoalSEOContent({
  translations,
}: SavingsGoalSEOContentProps) {
  return (
    <div className="space-y-8">
      {/* What Is Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          {translations.whatIsTitle}
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          {translations.whatIsContent}
        </p>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          {translations.howItWorksTitle}
        </h2>
        <p className="mb-4 text-muted-foreground">
          {translations.howItWorksIntro}
        </p>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          {translations.howItWorksSteps.map((step, index) => (
            <li key={index} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Benefits Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          {translations.benefitsTitle}
        </h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          {translations.benefits.map((benefit, index) => (
            <li key={index} className="leading-relaxed">
              {benefit}
            </li>
          ))}
        </ul>
      </section>

      {/* Tips Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          {translations.tipsTitle}
        </h2>
        <ul className="list-inside list-disc space-y-2 text-muted-foreground">
          {translations.tips.map((tip, index) => (
            <li key={index} className="leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          {translations.faqTitle}
        </h2>
        <div className="space-y-6">
          {translations.faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="mb-2 font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
