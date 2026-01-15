interface LengthSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    whenToUseTitle: string
    whenToUseIntro: string
    whenToUsePoints: string[]
    unitSystemsTitle: string
    metricSystemTitle: string
    metricSystemDesc: string
    imperialSystemTitle: string
    imperialSystemDesc: string
    benefitsTitle: string
    benefits: string[]
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

export function LengthSEOContent({ translations: t }: LengthSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is a Length Converter */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* When to Use */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whenToUseTitle}</h2>
        <p className="text-muted-foreground mb-3">{t.whenToUseIntro}</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.whenToUsePoints.map((point, index) => (
            <li key={index} className="leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      </section>

      {/* Unit Systems */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.unitSystemsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{t.metricSystemTitle}</h3>
            <p className="text-muted-foreground text-sm">{t.metricSystemDesc}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{t.imperialSystemTitle}</h3>
            <p className="text-muted-foreground text-sm">{t.imperialSystemDesc}</p>
          </div>
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

      {/* Conversion Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.conversionTipsTitle}</h2>
        <div className="space-y-3">
          {t.conversionTips.map((tip, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <p className="text-muted-foreground">{tip}</p>
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
