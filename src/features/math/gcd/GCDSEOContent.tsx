interface GCDSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    methodsTitle: string
    methodsIntro: string
    methods: string[]
    benefitsTitle: string
    benefits: string[]
    howToUseTitle: string
    howToUseSteps: string[]
    formulasTitle: string
    formulas: Array<{ name: string; formula: string; example: string }>
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function GCDSEOContent({ translations: t }: GCDSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is GCD */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* Methods */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.methodsTitle}</h2>
        <p className="text-muted-foreground mb-3">{t.methodsIntro}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.methods.map((method, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">{method}</p>
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

      {/* How to Use */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToUseTitle}</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          {t.howToUseSteps.map((step, index) => (
            <li key={index} className="leading-relaxed">
              {step}
            </li>
          ))}
        </ol>
      </section>

      {/* Formulas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulasTitle}</h2>
        <div className="space-y-4">
          {t.formulas.map((formula, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">{formula.name}</h3>
              <div className="bg-muted p-3 rounded-md mb-2">
                <code className="text-sm font-mono">{formula.formula}</code>
              </div>
              <p className="text-sm text-muted-foreground">{formula.example}</p>
            </div>
          ))}
        </div>
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
