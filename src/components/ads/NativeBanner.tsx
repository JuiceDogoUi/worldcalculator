'use client'

import { cn } from '@/lib/utils'

interface NativeBannerProps {
  className?: string
}

/**
 * Native Banner Component for Adsterra
 * Blends with content, placed below calculator widget
 *
 * Uses exact Adsterra pattern: script followed by container div
 */
export function NativeBanner({ className }: NativeBannerProps) {
  // Exact HTML pattern from Adsterra:
  // <script async="async" data-cfasync="false" src="...invoke.js"></script>
  // <div id="container-..."></div>
  const adHtml = `
    <script async="async" data-cfasync="false" src="https://pl28366707.effectivegatecpm.com/b0b83e0ee95fbb7315903c71b5201f66/invoke.js"></script>
    <div id="container-b0b83e0ee95fbb7315903c71b5201f66"></div>
  `

  return (
    <div
      className={cn('w-full', className)}
      dangerouslySetInnerHTML={{ __html: adHtml }}
    />
  )
}
