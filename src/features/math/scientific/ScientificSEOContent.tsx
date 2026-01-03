/**
 * Scientific Calculator SEO Content Component
 * Educational content for SEO and user guidance
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface ScientificSEOTranslations {
  whatIsTitle: string
  whatIsContent: string
  featuresTitle: string
  featuresIntro: string
  features: string[]
  operationsTitle: string
  operations: {
    category: string
    items: string[]
  }[]
  howToUseTitle: string
  howToUseSteps: string[]
  tipsTitle: string
  tips: string[]
  faqTitle: string
  faqs: { question: string; answer: string }[]
}

interface ScientificSEOContentProps {
  translations: ScientificSEOTranslations
}

export function ScientificSEOContent({
  translations: t,
}: ScientificSEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is a Scientific Calculator */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">
          {t.whatIsContent}
        </p>
      </section>

      {/* Key Features */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.featuresTitle}</h2>
        <p className="text-muted-foreground mb-3">{t.featuresIntro}</p>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {t.features.map((feature, index) => (
            <li key={index} className="leading-relaxed">
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Supported Operations */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.operationsTitle}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {t.operations.map((op, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{op.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {op.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="text-sm text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
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
