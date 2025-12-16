import { AlertTriangle } from 'lucide-react'

interface CalculatorDisclaimerProps {
  /**
   * Translated disclaimer text
   */
  disclaimer: string
  /**
   * Optional additional notes (e.g., regulatory info)
   */
  additionalNotes?: string
}

/**
 * Global disclaimer widget for all calculators
 * Displays legal/accuracy disclaimer at the bottom of calculator pages
 */
export function CalculatorDisclaimer({
  disclaimer,
  additionalNotes,
}: CalculatorDisclaimerProps) {
  return (
    <div
      className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted"
      role="note"
      aria-label="Disclaimer"
    >
      <div className="flex gap-3">
        <AlertTriangle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {disclaimer}
          </p>
          {additionalNotes && (
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              {additionalNotes}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
