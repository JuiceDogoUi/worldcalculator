interface IdealWeightSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    formulasTitle: string
    formulas: Array<{
      name: string
      description: string
      formula: string
    }>
    howToUseTitle: string
    howToUseSteps: string[]
    bodyFrameTitle: string
    bodyFrameContent: string
    bodyFrames: Array<{
      name: string
      description: string
    }>
    limitationsTitle: string
    limitations: string[]
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function IdealWeightSEOContent({ translations: t }: IdealWeightSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Ideal Weight */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* Formulas Explained */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulasTitle}</h2>
        <div className="grid gap-4">
          {t.formulas.map((formula, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-semibold mb-2">{formula.name}</div>
              <p className="text-muted-foreground text-sm mb-2">{formula.description}</p>
              <div className="bg-muted p-3 rounded">
                <code className="text-sm font-mono">{formula.formula}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body Frame */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.bodyFrameTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.bodyFrameContent}</p>
        <div className="grid gap-3">
          {t.bodyFrames.map((frame, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <span className="font-semibold min-w-24">{frame.name}</span>
              <span className="text-muted-foreground">{frame.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToUseTitle}</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          {t.howToUseSteps.map((step, index) => (
            <li key={index} className="leading-relaxed">{step}</li>
          ))}
        </ol>
      </section>

      {/* Limitations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.limitationsTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.limitations.map((limitation, index) => (
            <li key={index} className="leading-relaxed">{limitation}</li>
          ))}
        </ul>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <ul className="space-y-3">
          {t.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{tip}</span>
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
