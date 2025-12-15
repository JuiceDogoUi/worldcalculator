'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/routing'
import { Calculator, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/**
 * Calculator section error boundary
 * Catches errors in calculator pages specifically
 */
export default function CalculatorError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Calculator error:', error)
    }
    // TODO: In production, send to error tracking service
  }, [error])

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-12">
      <Card className="max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-destructive/10 p-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">Calculator Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            We encountered an error while loading this calculator. This might be
            a temporary issue.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-mono text-muted-foreground">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset} variant="default" className="gap-2">
              <Calculator className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/calculators">
              <Button variant="outline" className="w-full">
                Browse Calculators
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
