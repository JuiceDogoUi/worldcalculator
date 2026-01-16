import { Card, CardContent } from '@/components/ui/card'

interface AgeSEOTranslations {
  whatIsTitle: string
  whatIsContent: string
  howItWorksTitle: string
  howItWorksContent: string
  featuresTitle: string
  features: string[]
  useCasesTitle: string
  useCases: string[]
  tipsTitle: string
  tips: string[]
  faqTitle: string
  faqs: { question: string; answer: string }[]
}

interface AgeSEOContentProps {
  translations: AgeSEOTranslations
}

export function AgeSEOContent({ translations: t }: AgeSEOContentProps) {
  return (
    <div className="space-y-8">
      {/* What Is Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howItWorksTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.howItWorksContent}</p>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.featuresTitle}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {t.features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p className="text-sm">{feature}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.useCasesTitle}</h2>
        <ul className="space-y-2">
          {t.useCases.map((useCase, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary font-bold">•</span>
              <span className="text-muted-foreground">{useCase}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <div className="space-y-3">
          {t.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <span className="text-primary font-bold">{index + 1}.</span>
              <p className="text-sm text-muted-foreground">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
        <div className="space-y-4">
          {t.faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
