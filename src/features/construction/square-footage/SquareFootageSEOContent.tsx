import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SquareFootageSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    formulasTitle: string
    formulas: {
      name: string
      formula: string
      description: string
    }[]
    useCasesTitle: string
    useCases: string[]
    howToTitle: string
    howToSteps: string[]
    tipsTitle: string
    tips: string[]
    faqTitle: string
    faqs: { question: string; answer: string }[]
  }
}

export function SquareFootageSEOContent({
  translations: t,
}: SquareFootageSEOContentProps) {
  return (
    <div className="space-y-8 mt-12">
      {/* What Is Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* Formulas Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulasTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {t.formulas.map((formula, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{formula.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <code className="block bg-muted p-3 rounded text-sm mb-2">
                  {formula.formula}
                </code>
                <p className="text-sm text-muted-foreground">{formula.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.useCasesTitle}</h2>
        <ul className="space-y-2">
          {t.useCases.map((useCase, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{useCase}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* How To Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToTitle}</h2>
        <ol className="space-y-3">
          {t.howToSteps.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <span className="text-muted-foreground pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <ul className="space-y-2">
          {t.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
