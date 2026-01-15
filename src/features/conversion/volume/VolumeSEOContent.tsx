interface VolumeSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    usVsUkTitle: string
    usVsUkContent: string
    usVsUkComparison: string[]
    commonUsesTitle: string
    commonUses: string[]
    howToUseTitle: string
    howToUseSteps: string[]
    conversionTipsTitle: string
    conversionTips: string[]
    formulaTitle: string
    formulaContent: string
    formulaExample: string
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function VolumeSEOContent({ translations: t }: VolumeSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Volume Conversion */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* US vs UK Measurements */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.usVsUkTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.usVsUkContent}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.usVsUkComparison.map((comparison, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground text-sm">{comparison}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Common Uses */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.commonUsesTitle}</h2>
        <ul className="space-y-3">
          {t.commonUses.map((use, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{use}</span>
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

      {/* Conversion Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.conversionTipsTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.conversionTips.map((tip, index) => (
            <li key={index} className="leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
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
