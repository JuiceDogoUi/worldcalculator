interface ProbabilitySEOContentProps {
  translations: {
    whatIsTitle: string
    whatIsContent: string
    howToCalculateTitle: string
    howToCalculateContent: string
    typesTitle: string
    typesContent: string
    formulasTitle: string
    formulasContent: string
    examplesTitle: string
    examplesContent: string
    tipsTitle: string
    tipsContent: string
    faqTitle: string
    faqs: Array<{ question: string; answer: string }>
  }
}

export function ProbabilitySEOContent({ translations: t }: ProbabilitySEOContentProps) {
  return (
    <div className="space-y-10">
      {/* What is Probability */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.whatIsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.whatIsContent}
        </p>
      </section>

      {/* How to Calculate */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.howToCalculateTitle}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.howToCalculateContent}
        </p>
      </section>

      {/* Types of Probability */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.typesTitle}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.typesContent}
        </p>
      </section>

      {/* Probability Formulas */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.formulasTitle}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.formulasContent}
        </p>
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.examplesTitle}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.examplesContent}
        </p>
      </section>

      {/* Tips */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t.tipsTitle}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {t.tipsContent}
        </p>
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t.faqTitle}</h2>
        <div className="space-y-6">
          {t.faqs.map((faq, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-2 text-lg">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
