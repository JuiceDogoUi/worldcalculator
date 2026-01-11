interface TDEESEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    howItWorksTitle: string
    howItWorksContent: string
    bmrFormulasTitle: string
    bmrFormulas: Array<{
      name: string
      formula: string
      description: string
    }>
    activityLevelsTitle: string
    activityLevels: Array<{
      level: string
      multiplier: string
      description: string
    }>
    tableHeaders: {
      level: string
      multiplier: string
      description: string
    }
    howToUseTitle: string
    howToUseSteps: string[]
    tipsTitle: string
    tips: string[]
    limitationsTitle: string
    limitations: string[]
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function TDEESEOContent({ translations: t }: TDEESEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is TDEE */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* How it Works */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howItWorksTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.howItWorksContent}</p>
      </section>

      {/* BMR Formulas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.bmrFormulasTitle}</h2>
        <div className="grid gap-4">
          {t.bmrFormulas.map((formula, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{formula.name}</h3>
              <div className="bg-muted p-3 rounded mb-3">
                <code className="text-sm font-mono whitespace-pre-wrap">{formula.formula}</code>
              </div>
              <p className="text-muted-foreground text-sm">{formula.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Levels */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.activityLevelsTitle}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold">{t.tableHeaders.level}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.tableHeaders.multiplier}</th>
                <th className="text-left py-3 px-4 font-semibold">{t.tableHeaders.description}</th>
              </tr>
            </thead>
            <tbody>
              {t.activityLevels.map((level, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3 px-4 font-medium">{level.level}</td>
                  <td className="py-3 px-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded font-mono text-xs">
                      {level.multiplier}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{level.description}</td>
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

      {/* Limitations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.limitationsTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.limitations.map((limitation, index) => (
            <li key={index} className="leading-relaxed">{limitation}</li>
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
