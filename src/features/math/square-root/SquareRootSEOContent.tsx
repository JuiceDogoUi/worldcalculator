import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SEOTranslations {
  whatIsTitle: string
  whatIsContent: string
  howItWorksTitle: string
  howItWorksIntro: string
  features: string[]
  benefitsTitle: string
  benefits: string[]
  howToUseTitle: string
  howToUseSteps: string[]
  formulasTitle: string
  formulas: {
    name: string
    formula: string
    example: string
  }[]
  tipsTitle: string
  tips: string[]
  faqTitle: string
  faqs: {
    question: string
    answer: string
  }[]
}

interface SquareRootSEOContentProps {
  translations: SEOTranslations
}

export function SquareRootSEOContent({ translations: t }: SquareRootSEOContentProps) {
  return (
    <div className="space-y-8">
      {/* What Is Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howItWorksTitle}</h2>
        <p className="text-muted-foreground mb-4">{t.howItWorksIntro}</p>
        <ul className="space-y-2">
          {t.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
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
                <code className="block bg-muted p-3 rounded-lg font-mono text-sm mb-2">
                  {formula.formula}
                </code>
                <p className="text-sm text-muted-foreground">{formula.example}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.benefitsTitle}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How to Use Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToUseTitle}</h2>
        <ol className="space-y-4">
          {t.howToUseSteps.map((step, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                {index + 1}
              </span>
              <div className="flex-1 pt-1">
                <p className="text-muted-foreground">{step}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <div className="bg-muted/50 rounded-lg p-4">
          <ul className="space-y-2">
            {t.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold">💡</span>
                <span className="text-muted-foreground text-sm">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          {t.faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
