'use client'

import { useMemo } from 'react'
import { formatCurrency, formatPercentage } from './calculations'
import type { LoanResult } from './types'

interface SummaryTranslations {
  title: string
  loanReceived: string
  loanReceivedNoFee: string
  periodicPayment: string
  totalPayment: string
  effectiveRate: string
  paidOffBy: string
}

interface ConversationalSummaryProps {
  result: LoanResult
  loanAmount: number
  locale: string
  currency: string
  translations: SummaryTranslations
  rateLabels: { nominal: string; effective: string }
  payoffDate: Date
  frequencyLabel: string
  isMounted?: boolean
}

/**
 * Renders a sentence with bold values
 * Replaces {placeholder} with <strong>value</strong>
 */
function renderSentence(
  template: string,
  values: Record<string, string>
): React.ReactNode {
  const parts: React.ReactNode[] = []
  let lastIndex = 0
  const regex = /\{(\w+)\}/g
  let match

  while ((match = regex.exec(template)) !== null) {
    // Add text before the placeholder
    if (match.index > lastIndex) {
      parts.push(template.slice(lastIndex, match.index))
    }

    // Add the bold value
    const key = match[1]
    const value = values[key] || match[0]
    parts.push(
      <strong key={match.index} className="font-semibold text-foreground">
        {value}
      </strong>
    )

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < template.length) {
    parts.push(template.slice(lastIndex))
  }

  return parts
}

/**
 * Conversational summary component that displays loan results
 * in human-readable sentences with bold key values
 */
export function ConversationalSummary({
  result,
  loanAmount,
  locale,
  currency,
  translations: t,
  rateLabels,
  payoffDate,
  frequencyLabel,
  isMounted = false,
}: ConversationalSummaryProps) {
  // Calculate net amount after origination fee
  const originationFeeAmount = useMemo(() => {
    if (!result.totalFees) return 0
    // Origination fee is calculated as percentage of loan amount
    // We approximate it from the total fees minus monthly fees accumulated
    return result.totalFees
  }, [result.totalFees])

  const netLoanAmount = loanAmount - originationFeeAmount

  // Format all values for display
  const formattedValues = useMemo(() => ({
    amount: formatCurrency(loanAmount, locale, currency),
    netAmount: formatCurrency(netLoanAmount, locale, currency),
    fee: formatCurrency(originationFeeAmount, locale, currency),
    rate: formatPercentage(result.nominalRate, 2),
    payment: formatCurrency(result.periodicPayment, locale, currency),
    total: formatCurrency(result.totalPayment, locale, currency),
    charge: formatCurrency(result.totalInterest + result.totalFees, locale, currency),
    effectiveRate: formatPercentage(result.effectiveRate, 2),
    frequency: frequencyLabel.toLowerCase(),
    rateLabel: rateLabels.effective,
    date: isMounted ? payoffDate.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
    }) : '...',
  }), [
    loanAmount,
    netLoanAmount,
    originationFeeAmount,
    result,
    locale,
    currency,
    frequencyLabel,
    rateLabels.effective,
    payoffDate,
    isMounted,
  ])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        {t.title}
      </h3>

      <div className="space-y-3 text-base text-muted-foreground leading-relaxed">
        {/* Loan received sentence - with or without fee */}
        <p>
          {originationFeeAmount > 0
            ? renderSentence(t.loanReceived, formattedValues)
            : renderSentence(t.loanReceivedNoFee, formattedValues)
          }
        </p>

        {/* Periodic payment sentence */}
        <p>
          {renderSentence(t.periodicPayment, formattedValues)}
        </p>

        {/* Total payment and finance charge sentence */}
        <p>
          {renderSentence(t.totalPayment, formattedValues)}
        </p>

        {/* Effective rate sentence */}
        <p>
          {renderSentence(t.effectiveRate, {
            ...formattedValues,
            rate: formattedValues.effectiveRate,
          })}
        </p>

        {/* Payoff date sentence */}
        <p>
          {renderSentence(t.paidOffBy, formattedValues)}
        </p>
      </div>
    </div>
  )
}
