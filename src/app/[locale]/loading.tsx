import { Loader2 } from 'lucide-react'

/**
 * Root loading state
 * Displayed during page transitions and data loading
 */
export default function Loading() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
