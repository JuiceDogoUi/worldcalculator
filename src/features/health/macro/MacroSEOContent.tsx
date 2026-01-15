interface MacroSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    howItWorksTitle: string
    howItWorksContent: string
    bmrFormula: string
    tdeeExplanation: string
    macroExplanation: string
    dietPresetsTitle: string
    dietPresets: Array<{
      name: string
      ratios: string
      description: string
    }>
    goalsTitle: string
    goals: Array<{
      name: string
      adjustment: string
      description: string
    }>
    activityLevelsTitle: string
    activityLevels: Array<{
      name: string
      multiplier: string
      description: string
    }>
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

export function MacroSEOContent({ translations: t }: MacroSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Macro Calculator */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howItWorksTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howItWorksContent}</p>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">BMR Formula (Mifflin-St Jeor):</p>
            <code className="text-sm font-mono">{t.bmrFormula}</code>
          </div>
          <p className="text-muted-foreground">{t.tdeeExplanation}</p>
          <p className="text-muted-foreground">{t.macroExplanation}</p>
        </div>
      </section>

      {/* Diet Presets */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.dietPresetsTitle}</h2>
        <div className="grid gap-4">
          {t.dietPresets.map((preset, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{preset.name}</span>
                <span className="text-sm bg-muted px-2 py-1 rounded font-mono">
                  {preset.ratios}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{preset.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Goals */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.goalsTitle}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {t.goals.map((goal, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="font-semibold mb-1">{goal.name}</div>
              <div className="text-sm text-primary font-mono mb-2">{goal.adjustment}</div>
              <p className="text-muted-foreground text-sm">{goal.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Levels */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.activityLevelsTitle}</h2>
        <div className="grid gap-3">
          {t.activityLevels.map((level, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{level.name}</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  x{level.multiplier}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{level.description}</p>
            </div>
          ))}
        </div>
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
