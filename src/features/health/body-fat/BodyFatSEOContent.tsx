interface BodyFatSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    howToCalculateTitle: string
    howToCalculateContent: string
    howToCalculateFormulaMen: string
    howToCalculateFormulaWomen: string
    categoriesTitle: string
    categoriesMenTitle: string
    categoriesWomenTitle: string
    categoriesMen: Array<{
      name: string
      range: string
      description: string
    }>
    categoriesWomen: Array<{
      name: string
      range: string
      description: string
    }>
    howToMeasureTitle: string
    howToMeasureSteps: string[]
    limitationsTitle: string
    limitations: string[]
    howToUseTitle: string
    howToUseSteps: string[]
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function BodyFatSEOContent({ translations: t }: BodyFatSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Body Fat Percentage */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* How to Calculate */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToCalculateTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howToCalculateContent}</p>
        <div className="space-y-3">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Men:</p>
            <code className="text-sm font-mono">{t.howToCalculateFormulaMen}</code>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Women:</p>
            <code className="text-sm font-mono">{t.howToCalculateFormulaWomen}</code>
          </div>
        </div>
      </section>

      {/* Body Fat Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.categoriesTitle}</h2>

        {/* Men's Categories */}
        <h3 className="text-xl font-semibold mb-3 mt-6">{t.categoriesMenTitle}</h3>
        <div className="grid gap-4 mb-6">
          {t.categoriesMen.map((category, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{category.name}</span>
                <span className="text-sm bg-muted px-2 py-1 rounded">
                  {category.range}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </div>
          ))}
        </div>

        {/* Women's Categories */}
        <h3 className="text-xl font-semibold mb-3">{t.categoriesWomenTitle}</h3>
        <div className="grid gap-4">
          {t.categoriesWomen.map((category, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{category.name}</span>
                <span className="text-sm bg-muted px-2 py-1 rounded">
                  {category.range}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{category.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How to Measure */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToMeasureTitle}</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          {t.howToMeasureSteps.map((step, index) => (
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

      {/* How to Use */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToUseTitle}</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          {t.howToUseSteps.map((step, index) => (
            <li key={index} className="leading-relaxed">{step}</li>
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
