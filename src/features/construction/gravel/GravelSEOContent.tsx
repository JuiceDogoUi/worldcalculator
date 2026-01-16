import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface GravelSEOContentProps {
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
    type5Name: string
    type5Desc: string
    type6Name: string
    type6Desc: string
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

export function GravelSEOContent({ translations: t }: GravelSEOContentProps) {
  return (
    <div className="space-y-8">
      {/* What Is Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed">{t.whatIsContent}</p>
      </section>

      {/* Formulas Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulasTitle}</h2>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">{t.formula1Name}</h3>
            <code className="block bg-background p-2 rounded text-sm mb-2">
              {t.formula1}
            </code>
            <p className="text-sm text-muted-foreground">{t.formula1Desc}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">{t.formula2Name}</h3>
            <code className="block bg-background p-2 rounded text-sm mb-2">
              {t.formula2}
            </code>
            <p className="text-sm text-muted-foreground">{t.formula2Desc}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">{t.formula3Name}</h3>
            <code className="block bg-background p-2 rounded text-sm mb-2">
              {t.formula3}
            </code>
            <p className="text-sm text-muted-foreground">{t.formula3Desc}</p>
          </div>
        </div>
      </section>

      {/* Gravel Types Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.typesTitle}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{t.type1Name}</h3>
            <p className="text-sm text-muted-foreground">{t.type1Desc}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{t.type2Name}</h3>
            <p className="text-sm text-muted-foreground">{t.type2Desc}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{t.type3Name}</h3>
            <p className="text-sm text-muted-foreground">{t.type3Desc}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{t.type4Name}</h3>
            <p className="text-sm text-muted-foreground">{t.type4Desc}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{t.type5Name}</h3>
            <p className="text-sm text-muted-foreground">{t.type5Desc}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">{t.type6Name}</h3>
            <p className="text-sm text-muted-foreground">{t.type6Desc}</p>
          </div>
        </div>
      </section>

      {/* How To Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToTitle}</h2>
        <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
          <li>{t.howToStep1}</li>
          <li>{t.howToStep2}</li>
          <li>{t.howToStep3}</li>
          <li>{t.howToStep4}</li>
          <li>{t.howToStep5}</li>
        </ol>
      </section>

      {/* Tips Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>{t.tip1}</li>
          <li>{t.tip2}</li>
          <li>{t.tip3}</li>
          <li>{t.tip4}</li>
          <li>{t.tip5}</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.faqTitle}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="faq-1">
            <AccordionTrigger>{t.faq1Question}</AccordionTrigger>
            <AccordionContent>{t.faq1Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-2">
            <AccordionTrigger>{t.faq2Question}</AccordionTrigger>
            <AccordionContent>{t.faq2Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-3">
            <AccordionTrigger>{t.faq3Question}</AccordionTrigger>
            <AccordionContent>{t.faq3Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-4">
            <AccordionTrigger>{t.faq4Question}</AccordionTrigger>
            <AccordionContent>{t.faq4Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-5">
            <AccordionTrigger>{t.faq5Question}</AccordionTrigger>
            <AccordionContent>{t.faq5Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-6">
            <AccordionTrigger>{t.faq6Question}</AccordionTrigger>
            <AccordionContent>{t.faq6Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-7">
            <AccordionTrigger>{t.faq7Question}</AccordionTrigger>
            <AccordionContent>{t.faq7Answer}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="faq-8">
            <AccordionTrigger>{t.faq8Question}</AccordionTrigger>
            <AccordionContent>{t.faq8Answer}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
