import { Calculator, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Calculator section loading state
 * Displayed while calculator pages are loading
 */
export default function CalculatorLoading() {
  return (
    <div className="container py-8">
      {/* Skeleton breadcrumbs */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      </div>

      {/* Skeleton title */}
      <div className="mb-6 space-y-2">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-6 w-96 animate-pulse rounded bg-muted" />
      </div>

      {/* Main calculator card skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="flex min-h-[400px] items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Calculator className="h-8 w-8 text-primary" />
                </div>
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">
                  Loading calculator...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar skeleton */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
