interface CompoundInterestSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    howItWorksTitle: string
    howItWorksIntro: string
    howItWorksSteps: string[]
    formulaTitle: string
    formulaBasic: string
    formulaBasicDesc: string
    formulaWithContributions: string
    formulaWithContributionsDesc: string
    variablesTitle: string
    variables: Array<{ symbol: string; meaning: string }>
    compoundingTitle: string
    compoundingIntro: string
    compoundingOptions: Array<{ frequency: string; description: string }>
    benefitsTitle: string
    benefits: string[]
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function CompoundInterestSEOContent({
  translations: t,
}: CompoundInterestSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Compound Interest */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t.whatIsContent}
        </p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howItWorksTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howItWorksIntro}</p>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          {t.howItWorksSteps.map((step, index) => (
            <li key={index} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Formulas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulaTitle}</h2>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{t.formulaBasic}</h3>
            <div className="bg-muted p-3 rounded-md mb-2">
              <code className="text-lg font-mono">A = P(1 + r/n)^(nt)</code>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.formulaBasicDesc}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">{t.formulaWithContributions}</h3>
            <div className="bg-muted p-3 rounded-md mb-2">
              <code className="text-sm font-mono">
                A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]
              </code>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.formulaWithContributionsDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Variables */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.variablesTitle}</h2>
        <div className="grid gap-2">
          {t.variables.map((variable, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg"
            >
              <code className="font-mono font-bold text-lg w-12 text-center">
                {variable.symbol}
              </code>
              <span className="text-muted-foreground">{variable.meaning}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Compounding Frequencies */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.compoundingTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.compoundingIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.compoundingOptions.map((option, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-1">{option.frequency}</h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.benefitsTitle}</h2>
        <ul className="space-y-3">
          {t.benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.tips.map((tip, index) => (
            <li key={index} className="leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
        <div className="space-y-6">
          {t.faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
