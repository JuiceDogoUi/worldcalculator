interface SpeedSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    unitsTitle: string
    units: string[]
    useCasesTitle: string
    useCases: string[]
    conversionTableTitle: string
    conversionTableHeaders: string[]
    conversionTableRows: string[][]
    howToUseTitle: string
    howToUseSteps: string[]
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function SpeedSEOContent({ translations: t }: SpeedSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is a Speed Converter */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* Speed Units */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.unitsTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.units.map((unit, index) => (
            <div key={index} className="p-4 bg-muted rounded-lg">
              <p className="text-muted-foreground">{unit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.useCasesTitle}</h2>
        <ul className="space-y-3">
          {t.useCases.map((useCase, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground">{useCase}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Conversion Table */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.conversionTableTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                {t.conversionTableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left font-medium border"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.conversionTableRows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/50">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3 border">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
