import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FlooringSEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    formulasTitle: string
    formula1Name: string
    formula1: string
    formula1Desc: string
    formula2Name: string
    formula2: string
    formula2Desc: string
    formula3Name: string
    formula3: string
    formula3Desc: string
    typesTitle: string
    type1Name: string
    type1Desc: string
    type2Name: string
    type2Desc: string
    type3Name: string
    type3Desc: string
    type4Name: string
    type4Desc: string
    howToTitle: string
    howToStep1: string
    howToStep2: string
    howToStep3: string
    howToStep4: string
    howToStep5: string
    tipsTitle: string
    tip1: string
    tip2: string
    tip3: string
    tip4: string
    tip5: string
    faqTitle: string
    faq1Question: string
    faq1Answer: string
    faq2Question: string
    faq2Answer: string
    faq3Question: string
    faq3Answer: string
    faq4Question: string
    faq4Answer: string
    faq5Question: string
    faq5Answer: string
    faq6Question: string
    faq6Answer: string
    faq7Question: string
    faq7Answer: string
    faq8Question: string
    faq8Answer: string
  }
}

export function FlooringSEOContent({
  translations: t,
}: FlooringSEOContentProps) {
  const formulas = [
    { name: t.formula1Name, formula: t.formula1, description: t.formula1Desc },
    { name: t.formula2Name, formula: t.formula2, description: t.formula2Desc },
    { name: t.formula3Name, formula: t.formula3, description: t.formula3Desc },
  ]

  const types = [
    { name: t.type1Name, description: t.type1Desc },
    { name: t.type2Name, description: t.type2Desc },
    { name: t.type3Name, description: t.type3Desc },
    { name: t.type4Name, description: t.type4Desc },
  ]

  const howToSteps = [
    t.howToStep1,
    t.howToStep2,
    t.howToStep3,
    t.howToStep4,
    t.howToStep5,
  ]

  const tips = [
    t.tip1,
    t.tip2,
    t.tip3,
    t.tip4,
    t.tip5,
  ]

  const faqs = [
    { question: t.faq1Question, answer: t.faq1Answer },
    { question: t.faq2Question, answer: t.faq2Answer },
    { question: t.faq3Question, answer: t.faq3Answer },
    { question: t.faq4Question, answer: t.faq4Answer },
    { question: t.faq5Question, answer: t.faq5Answer },
    { question: t.faq6Question, answer: t.faq6Answer },
    { question: t.faq7Question, answer: t.faq7Answer },
    { question: t.faq8Question, answer: t.faq8Answer },
  ]

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {formulas.map((formula, index) => (
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

      {/* Flooring Types Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.typesTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {types.map((type, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{type.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How To Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToTitle}</h2>
        <ol className="space-y-3">
          {howToSteps.map((step, index) => (
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
          {tips.map((tip, index) => (
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
          {faqs.map((faq, index) => (
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
