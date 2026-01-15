interface TemperatureSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    formulasTitle: string
    formulas: Array<{
      name: string
      formula: string
      description: string
    }>
    scalesTitle: string
    scales: Array<{
      name: string
      description: string
      usedIn: string
    }>
    howToUseTitle: string
    howToUseSteps: string[]
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function TemperatureSEOContent({
  translations: t,
}: TemperatureSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Temperature Conversion */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t.whatIsContent}
        </p>
      </section>

      {/* Conversion Formulas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulasTitle}</h2>
        <div className="grid gap-4">
          {t.formulas.map((formula, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-semibold mb-2">{formula.name}</div>
              <div className="bg-muted p-3 rounded mb-2">
                <code className="text-sm font-mono">{formula.formula}</code>
              </div>
              <p className="text-muted-foreground text-sm">
                {formula.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Temperature Scales */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.scalesTitle}</h2>
        <div className="grid gap-4">
          {t.scales.map((scale, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-semibold mb-2">{scale.name}</div>
              <p className="text-muted-foreground text-sm mb-2">
                {scale.description}
              </p>
              <p className="text-sm">
                <span className="font-medium">Common usage: </span>
                <span className="text-muted-foreground">{scale.usedIn}</span>
              </p>
            </div>
          ))}
        </div>
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
