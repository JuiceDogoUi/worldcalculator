interface WeightSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    howToUseTitle: string
    howToUseSteps: string[]
    metricSystemTitle: string
    metricSystemContent: string
    metricUnits: string[]
    imperialSystemTitle: string
    imperialSystemContent: string
    imperialUnits: string[]
    conversionTipsTitle: string
    conversionTips: string[]
    commonUseCasesTitle: string
    commonUseCases: string[]
    formulaTitle: string
    formulaContent: string
    formulaExample: string
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function WeightSEOContent({ translations: t }: WeightSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is a Weight Converter */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
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

      {/* Metric System */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.metricSystemTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.metricSystemContent}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.metricUnits.map((unit, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">{unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Imperial System */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.imperialSystemTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.imperialSystemContent}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.imperialUnits.map((unit, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">{unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conversion Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.conversionTipsTitle}</h2>
        <ul className="space-y-3">
          {t.conversionTips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Common Use Cases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.commonUseCasesTitle}</h2>
        <div className="space-y-3">
          {t.commonUseCases.map((useCase, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <p className="text-muted-foreground">{useCase}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formula */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulaTitle}</h2>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <code className="text-sm font-mono">{t.formulaContent}</code>
        </div>
        <p className="text-muted-foreground text-sm">{t.formulaExample}</p>
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
